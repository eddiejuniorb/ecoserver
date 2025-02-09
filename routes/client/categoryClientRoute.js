const categoryClientRoute = require('express').Router()
const { prisma } = require('../../prismaClient');
const { asyncError } = require('../../libs/errors/asyncError');


categoryClientRoute.get('/all', asyncError(async (req, res) => {

    const categories = await prisma.category.findMany({
        select: {
            name: true, image: true, id: true,
        },
        orderBy: { iat: 'desc' },
    });


    return res.status(200).send(categories);
}))

module.exports = { categoryClientRoute }