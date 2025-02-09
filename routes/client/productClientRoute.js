const productClientRoute = require('express').Router();
const { asyncError } = require('../../libs/errors/asyncError');
const { prisma } = require('../../prismaClient');
const { apiBadRequestError } = require('../../libs/errors/appError');


// get bundles products
productClientRoute.get('/bundles', asyncError(async (req, res) => {

    const { page } = req.query;

    // Algorigthm for pagination
    const pageNumber = page ? page : 1
    const take = 12;
    const skip = (pageNumber - 1) * take;


    const products = await prisma.product.findMany({
        where: {
            isBundleProduct: true
        },
        take,
        skip
    })



    const total = await prisma.product.count({ where: { isBundleProduct: true } })
    const totalPages = Math.ceil(total / take)

    return res.status(200).send({ products, totalPages })
}))



// Get Single Product
productClientRoute.get('/:slug/single', asyncError(async (req, res) => {
    const slug = req.params?.slug;

    const product = await prisma.product.findFirst({
        where: { slug: slug },
        include: { variants: true, subcategory: { include: { category: true } } }
    })

    if (!product) throw new apiBadRequestError("no product found");

    product.images = JSON.parse(product.images);

    const uniqueColors = [...new Set(product.variants.map(v => v.color).filter(s => s !== ""))]
    const uniqueSizes = [...new Set(product.variants.map(v => v.size).filter(s => s !== ""))]
    const uniqueMaterials = [...new Set(product.variants.map(v => v.material).filter(s => s !== ""))]
    const uniqueTypes = [...new Set(product.variants.map(v => v.type).filter(s => s !== ""))]

    const discount = product.discount || 0;
    const discount_amount = (discount / 100 * product.base_price);
    const final_price = product.base_price - discount_amount

    await prisma.product.update({
        data: {
            views: product.views + 1
        },
        where: { id: product.id }
    })

    res.status(200).send({ data: { ...product, discount_amount, final_price, uniqueColors, uniqueSizes, uniqueMaterials, uniqueTypes } })
    return
}))

// new arrival Products
productClientRoute.get('/new', asyncError(async (req, res) => {
    const products = await prisma.product.findMany({
        take: 8, orderBy: { iat: "desc" },
        include: { variants: true },
        where: { isBundleProduct: false }
    })

    return res.status(200).send({ data: products })
}))

// top selling product
productClientRoute.get('/popular', asyncError(async (req, res) => {

    const products = await prisma.product.findMany({
        orderBy: {
            views: 'desc'
        },
        take: 8,
        include: { variants: true },
        where: { isBundleProduct: false }
    })

    return res.status(200).send({ data: products })

}))

// top recomended products
productClientRoute.get('/recommended-products', asyncError(async (req, res) => {
    const { id } = req.query

    if (!id) throw new apiBadRequestError()

    const product = await prisma.product.findUnique({
        where: { id: id, isBundleProduct: false }
    })

    let products = await prisma.product.findMany({
        where: {
            category_id: product?.category_id,
            id: { not: product?.id },
            isBundleProduct: false
        },
        take: 4
    })

    if (products?.length === 0) {
        products = await prisma.product.findMany({
            where: { id: { not: product?.id }, isBundleProduct: false },
            orderBy: { iat: 'desc' },
            take: 4
        })
    }

    return res.status(200).send({ data: products })

}))


module.exports = { productClientRoute }