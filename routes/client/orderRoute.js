const orderRoute = require('express').Router()
const { asyncError } = require('../../libs/errors/asyncError');
const { apiBadRequestError, apiNotFoundError } = require('../../libs/errors/appError');
const { prisma } = require('../../prisma');
const { PaymentServices } = require('../../services/Payment');
const { verifyToken } = require('../../middlewares/verifyToken');

const paymentInstance = new PaymentServices()


// Applying Copoun Code
orderRoute.post('/apply-coupon', verifyToken(['user'], 'client'), asyncError(async (req, res) => {
    const { code } = req.body;
    if (!code) throw new apiBadRequestError("provide coupon code");

    const coupon = await prisma.coupon.findFirst({ where: { code: code } })

    if (!coupon) {
        throw new apiNotFoundError("invalid coupon code");
    }

    const currentDate = new Date()
    const endDate = new Date(coupon.end)

    if (currentDate > endDate) {
        throw new apiBadRequestError("coupon is expired");
    }

    if (!coupon.active) {
        throw new apiBadRequestError("coupon is not active");
    }

    return res.status(200).send(coupon)

}))


// Add Order

orderRoute.post('/confirm-order', verifyToken(['user'], 'client'), asyncError(async (req, res) => {
    const { sessionID } = req.cookies;
    const { delivery_type, payment_type, customer_email, shop_location_id, shipping_address, coupon_id, shipping_id } = req.body;
    const user = req?.user

    // Cet Cart Items 

    const cart = await prisma.cart.findFirst({
        where: {
            OR: [
                { userId: user?.user_id },
                { sessionId: sessionID }
            ],
        },
        include: { items: { include: { product: true, variant: true }, orderBy: { iat: 'desc' } } },
        orderBy: { iat: 'desc' }
    })


    const cartItems = cart?.items?.map(cartItem => {
        const customisation_price = cartItem?.customisation_price * cartItem?.quantity;
        const total_discount = cartItem?.discount * cartItem?.quantity;
        const total = cartItem?.price * cartItem?.quantity;
        const line_total = (total + customisation_price) - total_discount;
        return { ...cartItem, line_total }
    }) || [];

    // Total of the cart
    const grandTotal = cartItems?.reduce((accumulator, product) => {
        return accumulator + product?.line_total;
    }, 0.00)

    // customisation total
    const customisationTotal = cartItems?.reduce((acc, pro) => {
        return acc + pro?.customisation_price;
    }, 0.00)


    // Check if Cart items is empty
    if (cartItems?.length <= 0) {
        throw new apiBadRequestError("Add Product to your basket")
    }


    // Check The Person Mail
    if (!customer_email) {
        throw new apiBadRequestError("provide customer email")
    }

    // Check Delivery Type
    if (!delivery_type || !["ship", "pickup"].includes(delivery_type)) {
        throw new apiBadRequestError("invalid deliver option")
    }

    // Check Payment Type
    if (!payment_type || !["paystack", "cod"].includes(payment_type)) {
        throw new apiBadRequestError("invalid payment option")
    }

    let coupon, shipping

    // Get Shipping Data & Ship Data if provided
    if (delivery_type === 'ship') {

        if (!shipping_id) {
            throw new apiBadRequestError("Select shipping method")
        }

        const shippingCost = await prisma.shipping_cost.findFirst({ where: { id: shipping_id } })

        if (!shippingCost) {
            throw new apiNotFoundError("We are not able to find provided shipping method details ")
        }

        shipping = shippingCost;

    } else if (delivery_type === 'pickup') {

        if (!shop_location_id) {
            throw new apiBadRequestError("Select pickup location")
        }

        const shopLocation = await prisma.our_shop.findFirst({ where: { id: shop_location_id } })

        if (!shopLocation) {
            throw new apiNotFoundError("We are not able to find provided shop location details")
        }

    }

    // Check if Shiping type is yes but deliver info is empty
    if (delivery_type === "ship") {
        const { country, firstname, lastname, address, appartment, city, postal_code, phone } = JSON.parse(shipping_address);

        if (!country || !firstname || !lastname || !address || !city || !phone) {
            throw new apiBadRequestError("fill the forms for the shipping details")
        }

    }

    if (coupon_id) {
        const couponData = await prisma.coupon.findUnique({ where: { id: coupon_id } });
        if (!couponData) {
            throw new apiBadRequestError("invalid or expired coupon")
        }

        const currentDate = new Date()
        const endDate = new Date(couponData.end)

        if (currentDate > endDate) {
            throw new apiBadRequestError("coupon is expired");
        }

        if (!couponData.active) {
            throw new apiBadRequestError("coupon is not active");
        }
        coupon = couponData;
    }



    // Check if order has customisation 
    if (payment_type === "cod" && customisationTotal) {
        throw new apiBadRequestError("order with customisation should be pay before delivery")
    }


    // Coupon Discount 
    const couponDiscount = coupon?.discount || 0
    const couponDiscountPrice = (couponDiscount / 100) * grandTotal

    // Shipping Price
    const shippingPrice = shipping?.cost || 0.00

    // totalCharge
    const totalCharge = (grandTotal + shippingPrice) - couponDiscountPrice;



    // Parse Adress if exist

    let shippingAddress = null
    const couponId = coupon_id || null


    if (delivery_type === "ship") {
        shippingAddress = JSON.parse(shipping_address)
    }

    // Get info for orderItems

    const productInOrders = cartItems?.reduce((acc, product) => {
        if (product.product) {
            product.product.boughtQuantity = product.quantity;
            product.product.total = product.line_total
            product.product.discountPrice = product.discount
            product.product.cust_price = product?.customisation_price
            acc.push(product.product);
        }
        return acc
    }, [])

    // Charge the customer if the payment type is paystack
    const numOfOrders = await prisma.order.count()

    switch (payment_type) {

        case "paystack":

            const addOrderByPaystack = {
                userId: user?.user_id,
                total: totalCharge,
                coupon_id: couponId,
                orderNumber: 3000 + numOfOrders,
                note: "My note",
                delivery_type: delivery_type,
                payment_status: 'unpaid',
                our_shopId: shop_location_id || "",
                payment_mode: 'paystack',
                shippindAddress: shippingAddress,
                shipping: shippingPrice,
                discount: couponDiscountPrice,
                customise_total: customisationTotal
            }

            const metadata = { order: addOrderByPaystack, cartId: cart?.id, cart_items: productInOrders }


            if (addOrderByPaystack) {
                const response = await paymentInstance.startPayment({
                    amount: totalCharge, email: customer_email,
                    metadata: JSON.stringify(metadata), callback_url: `${process.env.client_url}/order-success`
                })

                if (response) {
                    return res.status(200).send({
                        type: "paystack",
                        data: response?.data
                    })
                } else {
                    throw new apiBadRequestError("Error while processing payment");

                }
            } else {
                throw new apiBadRequestError("Sorry, Error occured while placing your order");
            }

        case 'cod':

            const addOrderByCod = await prisma.order.create({
                data: {
                    userId: user?.user_id,
                    total: totalCharge,
                    coupon_id: couponId,
                    orderNumber: 3000 + numOfOrders,
                    note: "My note",
                    delivery_type: delivery_type,
                    payment_status: 'unpaid',
                    our_shopId: shop_location_id,
                    payment_mode: 'cod',
                    shippindAddress: shippingAddress,
                    shipping: shippingPrice,
                    discount: couponDiscountPrice,
                    customise_total: customisationTotal
                }
            })

            if (addOrderByCod) {
                if (await prisma.cart.delete({ where: { id: cart?.id } })) {
                    await createOrderItem(addOrderByCod?.id, productInOrders)
                }

                return res.status(200).send({
                    type: "cod",
                    data: "You have successfully placed your order"
                })
            }

            break

        default:

            throw new apiBadRequestError("unknown payment channel")

            break;
    }


    res.sendStatus(200)

}))


async function createOrderItem(order_id, orderItems) {
    if (orderItems.length > 0) {
        for (const item of orderItems) {
            await prisma.orderItems.create({
                data: {
                    discount: parseFloat(item?.discountPrice),
                    customisation: parseFloat(item?.cust_price),
                    price: parseFloat(item?.total),
                    productId: item?.id,
                    quantity: Number(item?.boughtQuantity),
                    order_id: order_id
                }
            })
        }
    }
}

module.exports = { orderRoute }