const wishlistRoute = require('express').Router();
const { asyncError } = require('../../libs/errors/asyncError');
const { prisma } = require('../../prisma');
const { apiBadRequestError } = require('../../libs/errors/appError');



wishlistRoute.get('/wishlists', asyncError(async (req, res) => {

    const items = req?.query?.products;

    const slugs = items || []

    const products = await prisma.product.findMany({
        where: { slug: { in: slugs } }
    })

    return res.status(200).send(products)

}))


module.exports = { wishlistRoute }