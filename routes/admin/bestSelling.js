const { asyncError } = require('../../libs/errors/asyncError');
const { verifyJwtTokenAdmins } = require('../../middlewares/verifyToken');
const { prisma } = require('../../prismaClient');

const bestSellingRoute = require('express').Router();


bestSellingRoute.get('/best-selling', asyncError(async (req, res) => {
    const bestSellingProducts = await prisma.$queryRaw`
            SELECT
                p.id,
                p.name,
                p.images,
                SUM(oi.quantity) as totalQuantity
            FROM
                orderitems oi
            JOIN 
                product p ON oi.productId = p.id
            GROUP BY 
                p.id, p.name
            ORDER BY
                totalQuantity DESC
            LIMIT 6
    `;
    return res.status(200).send(bestSellingProducts || [])

}))


module.exports = { bestSellingRoute }