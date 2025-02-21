const productAdminRoute = require('express').Router();
const { asyncError } = require('../../libs/errors/asyncError');
const { verifyJwtTokenAdmins } = require('../../middlewares/verifyToken');
const { apiBadRequestError, apiNotFoundError } = require('../../libs/errors/appError');
const { slugify } = require('../../libs/helpers');
const { prisma } = require('../../prismaClient');


// get product

productAdminRoute.get('/get/:slug', verifyJwtTokenAdmins.adminCashier(), asyncError(async (req, res) => {
    const slug = req.params?.slug;
    if (!slug) throw new apiBadRequestError("product slug required");

    const result = await prisma.product.findFirst({
        where: { id: slug }, include: { variants: true, subcategory: { include: { category: { include: { Subcategory: true } } } } }
    })

    if (!result) throw new apiNotFoundError('no product fount');

    let product = [result]

    const filtedProduct = product.map(pro => {

        const productHasVariant = pro.variants.length ? true : false

        return {
            id: pro?.id,
            name: pro?.name,
            images: JSON.parse(pro.images),
            discount: pro?.discount,
            description: pro?.description,
            variants: pro?.variants,
            base_price: pro?.base_price,
            productHasVariant: productHasVariant,
            customable: pro?.customable,
            in_stock: pro?.in_stock,
            stock: pro?.stock,
            subcategories: pro?.subcategory.category.Subcategory,
            sub_category: pro?.subcategoryId,
            customise_price: pro?.customise_price,
            isBundleProduct: pro?.isBundleProduct,
            dealPrice: pro?.dealPrice,
            dealEnd: pro?.dealEnd,
            dealStart: pro?.dealStart
        }
    })

    res.status(200).send(filtedProduct[0])

}))


// Get All Product
productAdminRoute.get('/all', verifyJwtTokenAdmins.adminCashier(), asyncError(async (req, res) => {

    const { page, limit, name } = req.query;

    const skip = (page - 1) * limit;
    const take = parseInt(limit);

    let products = await prisma.product.findMany({
        orderBy: { 'iat': 'desc' },
        include: { subcategory: { select: { name: true, id: true } } },
        take,
        skip,
        where: {
            ...(name && {
                OR: [
                    { name: { contains: name } },
                ]
            })
        }
    })

    const total = await prisma.product.count();
    const totalPages = Math.ceil(total / take)

    const filteredProducts = products?.map(product => {

        const instock = product?.stock < 1 ? false : true;

        return {
            id: product?.id,
            name: product?.name,
            description: product?.description,
            stock: product?.stock,
            discount: product?.discount,
            image: JSON.parse(product?.images)[0],
            customised: product?.customable,
            in_stock: product?.in_stock,
            instock: instock,
            category: product?.category,
            base_price: product?.base_price,
            slug: product?.slug,
            customise_price: product?.customise_price
        }
    })

    res.status(200).send({ products: filteredProducts, totalPages })
}))








// Add product

productAdminRoute.post('/add', verifyJwtTokenAdmins.adminCashier(), asyncError(async (req, res) => {

    const { name, dealPrice, isBundleProduct, moq,
        dealStart, isPromo, dealEnd, description, base_price, stock, discount,
        customable, category, sub_category, images, variants, customise_price
    } = req.body;

    if (!JSON.parse(images)?.length) {
        throw new apiBadRequestError('images required');
    }

    const productNameExist = await prisma.product.findFirst({ where: { name: name } });

    if (productNameExist) throw new apiBadRequestError('product name already exists');

    if (!name || !description || !base_price || !stock || !category || !customable || !customise_price || !sub_category) {
        throw new apiBadRequestError("fill the empty spaces")
    }
    if (JSON.parse(isPromo)) {
        if (!dealEnd || !dealPrice) {
            throw new apiBadRequestError("empty deal price or date end")
        }
    }


    if (parseFloat(discount) && parseFloat(discount) > 100) {
        throw new apiBadRequestError("Discount cannot be greater than 100")
    }

    const isCustomable = JSON.parse(customable)

    let product;

    const promoDealStarts = !dealStart ? new Date() : new Date(dealStart);

    if (JSON.parse(variants)?.length) {
        const v = JSON.parse(variants)?.map((variant) => {
            return {
                image: variant?.image?.trim(),
                size: variant?.size?.trim(),
                color: variant?.color?.trim(),
                material: variant?.material?.trim(),
                type: variant?.type?.trim(),
                stock: parseInt(variant?.stock),
                price: parseFloat(variant?.price),
            }
        })

        product = await prisma.product.create({
            data: {
                name: name,
                description: description,
                stock: parseInt(stock),
                images: images,
                base_price: parseFloat(base_price),
                discount: parseInt(discount),
                customable: isCustomable,
                dealEnd: dealEnd ? new Date(dealEnd) : null,
                dealPrice: parseFloat(dealPrice),
                dealStart: dealStart ? promoDealStarts : null,
                subcategoryId: sub_category,
                isBundleProduct: JSON.parse(isBundleProduct),
                moq: parseInt(moq) || 0,
                customise_price: parseFloat(customise_price),
                slug: slugify(name),
                variants: {
                    create: v
                }
            }
        })


    } else {
        product = await prisma.product.create({
            data: {
                name: name,
                description: description,
                stock: parseInt(stock),
                images: images,
                base_price: parseFloat(base_price),
                discount: parseInt(discount),
                customable: isCustomable,
                subcategoryId: sub_category,
                dealEnd: dealEnd ? new Date(dealEnd) : null,
                dealPrice: parseFloat(dealPrice),
                isBundleProduct: JSON.parse(isBundleProduct),
                dealStart: dealStart ? promoDealStarts : null,
                moq: parseInt(moq) || 0,
                customise_price: parseFloat(customise_price),
                slug: slugify(name),
            }
        })
    }


    if (product) {
        res.status(200).send({ message: "product added" });
        return;
    }

    throw new apiBadRequestError('something occured');

}));







// Update product

productAdminRoute.post('/update/:id', verifyJwtTokenAdmins.adminCashier(), asyncError(async (req, res) => {

    const productId = req.params?.id

    if (!productId) throw new apiBadRequestError("provide product id");

    const productFound = await prisma.product.findFirst({ where: { id: productId } })

    if (!productFound) throw new apiNotFoundError("no product found");

    const { name, moq, description, base_price, isPromo, dealPrice, dealEnd, dealStart, stock, isBundleProduct, in_stock, discount, sub_category, customable, customise_price, images, } = req.body;

    if (!name || !description || !base_price || !stock || !images || !sub_category || !in_stock) {
        throw new apiBadRequestError("fill the empty spaces")
    } else if (JSON.parse(isPromo)) {
        if (!dealEnd || !dealPrice) {
            throw new apiBadRequestError("empty deal price or date end")
        }
    }


    let dealStartDate = null, dealPriceData = 0, dealEndDate = null;

    if (JSON.parse(isPromo)) {
        dealStartDate = dealStart ? new Date(dealStart) : new Date()
        dealEndDate = new Date(dealEnd)
        dealPriceData = parseFloat(dealPrice)
    }

    const updatedProduct = await prisma.product.update({
        where: { id: productFound?.id },
        data: {
            name: name,
            description: description,
            base_price: parseFloat(base_price),
            images: images,
            stock: parseInt(stock),
            discount: parseInt(discount),
            in_stock: JSON.parse(in_stock),
            subcategoryId: sub_category,
            customable: JSON.parse(customable),
            isBundleProduct: JSON.parse(isBundleProduct),
            slug: slugify(name),
            moq: parseInt(moq) || 0,
            customise_price: parseFloat(customise_price),
            ...(JSON.parse(isPromo) && { dealEnd: dealEndDate }),
            ...(JSON.parse(isPromo) && { dealPrice: dealPriceData }),
            ...(JSON.parse(isPromo) && { dealStart: dealStartDate }),
        }
    })

    if (updatedProduct) {
        res.status(200).send({ message: "product updated successfully" })
        return;
    }

    throw new apiBadRequestError("Something bad happen")
})
);

// Delete product
productAdminRoute.delete('/delete', verifyJwtTokenAdmins.adminOnly(), asyncError(async (req, res) => {
    const product_id = req.query?.product_id;
    const productFound = await prisma.product.findFirst({ where: { id: product_id } });

    if (!productFound) throw new apiNotFoundError("No product found");

    if (await prisma.product.delete({ where: { id: product_id } })) {
        res.sendStatus(200);
        return;
    }

    throw new apiBadRequestError("something occured");
})
);


// Change customised
productAdminRoute.post('/change', verifyJwtTokenAdmins.adminOnly(), asyncError(async (req, res) => {
    const { target, id } = req?.query
    if (!target) throw new apiBadRequestError();

    const product = await prisma.product.findFirst({ where: { id: id } })
    if (!product) throw new apiNotFoundError();

    if (target === 'customise') {
        await prisma.product.update({ where: { id: id }, data: { customable: !product.customable } })
        return res.sendStatus(200)
    } else if (target === 'in_stock') {
        await prisma.product.update({ where: { id: id }, data: { in_stock: !product.in_stock } })
        return res.sendStatus(200)
    } else {
        throw new apiBadRequestError()
    }

}))

module.exports = { productAdminRoute }