const searchRoute = require("express").Router();
const { asyncError } = require("../../libs/errors/asyncError");
const { prisma } = require('../../prisma');

searchRoute.get('/live', asyncError(async (req, res) => {
    const { searchInput } = req.query

    const products = await prisma.product.findMany({
        where: {
            name: {
                contains: searchInput
            }
        },
        select: {
            name: true, id: true, customable: true, discount: true, slug: true, base_price: true, images: true, stock: true, variants: {
                select: {
                    id: true,
                    price: true,
                    stock: true,
                },
            }
        },
        take: 6,
        orderBy: { name: 'asc' }
    })
    return res.status(200).send(products)
}))

searchRoute.get('/search', asyncError(async (req, res) => {
    const { query, page } = req.query;
    const pageNumber = page ? page : 1
    const take = 12;
    const skip = (pageNumber - 1) * take;


    const products = await prisma.product.findMany({
        where: {
            name: {
                contains: query
            }
        },
        select: {
            name: true, id: true, customable: true, discount: true, slug: true, base_price: true, images: true, stock: true, variants: {
                select: {
                    id: true,
                    price: true,
                    stock: true,
                },
            }
        },
        take: take,
        skip: skip,
        orderBy: { name: 'asc' }
    })

    const total = await prisma.product.count({ where: { name: { contains: query } } })
    const totalPages = Math.ceil(total / take)

    return res.status(200).send({ data: products, totalPages })

}))

module.exports = { searchRoute }