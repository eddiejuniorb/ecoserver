const { asyncError } = require('../../libs/errors/asyncError');
const { verifyJwtTokenAdmins } = require('../../middlewares/verifyToken');
const { prisma } = require('../../prismaClient');

const bestSellingRoute = require('express').Router();


bestSellingRoute.get('/best-selling', asyncError(async (req, res) => {

    const bestSellingProducts = await prisma.order.findMany({
        select: { total: true, payment_status: true },
        take: 5,
    })

    return res.status(200).send(bestSellingProducts || [])

}))


module.exports = { bestSellingRoute }