const cartRoute = require('express').Router()
const { asyncError } = require('../../libs/errors/asyncError');
const { apiBadRequestError, apiNotFoundError } = require('../../libs/errors/appError');
const { prisma } = require('../../prismaClient');



// Adding Cart Item


cartRoute.post('/add', asyncError(async (req, res) => {

    const { product, variant, quantity, customise, moq } = req.body;

    // Check if product is provided
    if (!product) throw new apiBadRequestError();

    // check For product if found
    const foundProduct = await prisma.product.findFirst({ where: { id: product } });

    if (!foundProduct) throw new apiBadRequestError("no product found")

    // check if product has moq and the quantity is less than the moq requirement
    if (foundProduct?.moq && quantity < moq) {
        throw new apiBadRequestError("Quantity is below the minimum order requirement.")
    }

    // price , total_discount & customisation price
    let price = 0.00, total_discount = 0.00, customisation = 0.00;


    // Check if product variant is provided let the price be the variant price or let the price be the base price 

    // check for if the active deal is running
    const now = new Date()
    if (
        foundProduct?.dealPrice &&
        now <= foundProduct?.dealEnd
    ) {
        price = parseFloat(foundProduct?.dealPrice)
    } else if (variant) {
        const vP = await prisma.variants.findFirst({ where: { id: variant } });
        if (!vP) throw new apiBadRequestError("invalid variant")
        price = parseFloat(vP?.price);
    } else {
        // Fallback to base price if no variant or deal is active
        if (!foundProduct?.base_price) throw new apiBadRequestError("Base price not found");
        price = parseFloat(foundProduct.base_price);

    }

    // if the customer wants customisation add the price

    if (customise) {
        customisation = parseFloat(foundProduct?.customise_price) * Number(quantity)
    }

    // check if product has discount
    total_discount = (Number(foundProduct?.discount) / 100) * parseFloat(price);


    // Cart ID
    const cartId = String(req?.cookies?.cartId)

    // Get the cart items of the user
    let cart = await prisma.cart.findFirst({
        where: { user: cartId },
        include: { items: true }
    })

    // if the user doesnt have a cart create a new one
    if (!cart) {
        cart = await prisma.cart.create({
            data: { user: cartId }
        })
    }

    // check if there is existing item of the found cart items
    const existingCartItem = cart?.items?.find((item) =>
        item?.customise === customise &&
        item?.productId === product &&
        item?.variant_id === variant
    )

    // if there is cart item just update the quantity to one
    if (existingCartItem) {
        const updatedItem = await prisma.cartItems.update({
            where: { id: existingCartItem.id },
            data: {
                customisation_price: customisation,
                quantity: Number(quantity + existingCartItem.quantity),
                customise: customise,
                discount: total_discount,
            }
        })

        // send to the user if updating cart item is successfull
        if (updatedItem) return res.status(200).send(updatedItem);
        throw new apiBadRequestError("error, while updating cart item")
    } else {
        const newItem = await prisma.cartItems.create({
            data: {
                cartId: cart?.id,
                quantity: Number(quantity),
                customise: JSON.parse(customise),
                customisation_price: parseFloat(customisation),
                productId: product,
                variant_id: variant,
                discount: total_discount,
                price: price
            }
        })
        // send to the user if adding cart item is successfull
        if (newItem) return res.status(200).send(newItem);
        throw new apiBadRequestError("error, while adding cart item")
    }

}))



// Get all cart items

cartRoute.get('/', asyncError(async (req, res) => {
    const cartId = req?.cookies.cartId

    const cart = await prisma.cart.findFirst({
        where: {
            user: String(cartId)
        },
        include: { items: { include: { product: true, variant: true }, orderBy: { iat: 'desc' } } },
        orderBy: { iat: 'desc' }
    })

    const cartItems = cart?.items?.map(cartItem => {
        const customisation_price = cartItem.customisation_price * cartItem.quantity;
        const total_discount = cartItem?.discount * cartItem?.quantity;
        const total = cartItem?.price * cartItem?.quantity;
        const line_total = (total + customisation_price) - total_discount;
        return { ...cartItem, line_total }
    }) || [];

    const grandTotal = cartItems?.reduce((accumulator, product) => {
        return accumulator + product?.line_total;
    }, 0.00) || 0.00;

    const total_quantities = cartItems?.reduce((accumulator, product) => {
        return accumulator + product?.quantity
    }, 0.00) || 0.00;


    res.status(200).send({ items: cartItems, grand_total: grandTotal, total_quantities })
}))



// Change Cart item quantity

cartRoute.post('/change', asyncError(async (req, res) => {
    const { id, target } = req.body;
    if (!id || !target) throw new apiBadRequestError();

    const item = await prisma.cartItems.findFirst({ where: { id: id }, include: { product: true, variant: true } })
    if (!item) throw new apiNotFoundError("no item found");

    let updated;

    if (target === "plus") {

        if (item.quantity + 1 > item.product.stock || item.quantity + 1 > item.variant?.stock) {
            throw new apiBadRequestError(`You can only add ${item.quantity} of this item to your cart.`)
        }

        updated = await prisma.cartItems.update({
            where: { id: id }, data: {
                quantity: item.quantity + 1
            }
        })

    } else if (target === "minus") {
        updated = await prisma.cartItems.update({
            where: { id: id }, data: {
                ...(item.quantity <= 1 ? { quantity: 1 } : { quantity: item.quantity - 1 })
            }
        })
    }

    if (updated) {
        return res.status(200).send(updated)
    }
    throw new apiBadRequestError("something occured");

}))


// Delete Cart

cartRoute.delete('/delete', asyncError(async (req, res) => {
    const { id } = req.query;
    if (!id) throw new apiBadRequestError();

    const item = await prisma.cartItems.findFirst({ where: { id: id } })
    if (!item) throw new apiNotFoundError("no item found");

    const deleted = await prisma.cartItems.delete({ where: { id: id } })

    if (deleted) {
        return res.status(200).send(deleted);
    }
    throw new apiBadRequestError("something occured");

}))


module.exports = { cartRoute }