const ordersRoute = require('express').Router()
const { verifyToken } = require('../../middlewares/verifyToken');
const { asyncError } = require('../../libs/errors/asyncError');
const { prisma } = require('../../prismaClient');
const { apiBadRequestError, apiNotFoundError } = require('../../libs/errors/appError');



// get order
ordersRoute.get('/:id/one', verifyToken(['admin', 'cashier'], 'admin'), asyncError(async (req, res) => {
    const { id } = req.params

    if (!id) throw new apiBadRequestError()

    const order = await prisma.order.findFirst({
        where: { id: id },
        include: {
            order_items: { include: { Product: { select: { name: true, images: true } } } },
            User: true,
        }
    })

    if (!order) throw new apiNotFoundError()

    return res.status(200).send(order)

}))


// get all orders

ordersRoute.get('/all', verifyToken(['admin', 'cashier'], 'admin'), asyncError(async (req, res) => {
    const orders = await prisma.order.findMany({
        orderBy: { iat: 'desc' },
        include: {
            User: { select: { firstname: true, lastname: true } },
            order_items: true,
        },
    })
    res.status(200).send(orders)
    return
}))


// change 
ordersRoute.post('/status', verifyToken(['admin', 'cashier'], 'admin'), asyncError(async (req, res) => {
    const { id, type } = req.body;

    if (!id || !type) {
        throw new apiBadRequestError()
    }

    const foundOrder = await prisma.order.findFirst({ where: { id: id } })

    if (!foundOrder) throw new apiNotFoundError();

    if (await prisma.order.update({ where: { id: id }, data: { status: type } }))
        return res.status(200).send("order status updated")

    throw new apiBadRequestError("something happend")

}))

module.exports = { ordersRoute }