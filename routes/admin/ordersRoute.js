const ordersRoute = require('express').Router()
const { verifyToken, verifyJwtTokenAdmins } = require('../../middlewares/verifyToken');
const { asyncError } = require('../../libs/errors/asyncError');
const { prisma } = require('../../prismaClient');
const { apiBadRequestError, apiNotFoundError } = require('../../libs/errors/appError');
const { AdminOrdersControllers } = require('../../controllers/AdminOrders');



// get order
ordersRoute.get('/:id/one', verifyJwtTokenAdmins.adminCashier(), asyncError(async (req, res) => {
    const { id } = req.params

    if (!id) throw new apiBadRequestError()

    const order = await prisma.order.findFirst({
        where: { id: id },
        include: {
            order_items: { include: { variant: true, Product: true } },
            User: true,
            pickup_location: { select: { name: true } },
        }
    })

    if (!order) throw new apiNotFoundError()

    return res.status(200).send(order)

}))


// get all orders

ordersRoute.get('/all', verifyJwtTokenAdmins.adminCashier(), asyncError(async (req, res) => {
    const orders = await prisma.order.findMany({
        orderBy: { iat: 'desc' },
        include: {
            User: { select: { firstname: true, lastname: true } },
            order_items: { include: { variant: true } },
        },
    })
    res.status(200).send(orders)
    return
}))


// change 
ordersRoute.post('/status', verifyJwtTokenAdmins.adminCashier(), AdminOrdersControllers.changeStatus())

module.exports = { ordersRoute }