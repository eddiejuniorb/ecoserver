const productClientRoute = require('express').Router();
const { asyncError } = require('../../libs/errors/asyncError');
const { prisma } = require('../../prismaClient');
const { apiBadRequestError } = require('../../libs/errors/appError');

// Get Single Product
productClientRoute.get('/:slug/single', asyncError(async (req, res) => {
    const slug = req.params?.slug;

    const product = await prisma.product.findFirst({
        where: { slug: slug },
        include: { variants: true, category: { select: { name: true } } }
    })

    if (!product) throw new apiBadRequestError("no product found");

    product.images = JSON.parse(product.images);

    const in_stock = product?.stock < 1 ? false : true;

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

    res.status(200).send({ data: { ...product, in_stock, discount_amount, final_price, uniqueColors, uniqueSizes, uniqueMaterials, uniqueTypes } })
    return
}))

// new arrival Products
productClientRoute.get('/new', asyncError(async (req, res) => {
    const products = await prisma.product.findMany({
        take: 8, orderBy: { iat: "desc" },
        include: { variants: true }
    })


    const filteredproducts = products?.map((product) => {
        const in_stock = product.stock > 1 ? true : false;
        return { ...product, in_stock }
    })

    return res.status(200).send({ data: filteredproducts })
}))

// top selling product
productClientRoute.get('/popular', asyncError(async (req, res) => {

    const products = await prisma.product.findMany({
        orderBy: {
            views: 'desc'
        },
        take: 8,
        include: { variants: true }
    })


    const filteredproducts = products?.map((product) => {
        const in_stock = product.stock > 1 ? true : false;
        return { ...product, in_stock }
    })

    return res.status(200).send({ data: filteredproducts })

}))


module.exports = { productClientRoute }