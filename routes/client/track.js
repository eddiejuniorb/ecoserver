const { apiBadRequestError } = require('../../libs/errors/appError');
const { asyncError } = require('../../libs/errors/asyncError');
const { prisma } = require('../../prismaClient');

const trackRoute = require('express').Router()


trackRoute.post('/', asyncError(async (req, res) => {
    const { order_number } = req.body;

    const numberRegex = /^\d+$/;

    if (!order_number) {
        throw new apiBadRequestError("Provide order number")
    }

    // find order

    if (!numberRegex.test(order_number)) {
        throw new apiBadRequestError("invalid order number")
    }

    const order = await prisma.order.findFirst({ where: { orderNumber: Number(order_number) } })

    if (!order) throw new apiBadRequestError("invalid order number")


    return res.status(200).send(order)

}))

trackRoute.get('/:order_number', asyncError(async (req, res) => {

    const { order_number } = req.params;

    let order_status = 1

    const order = await prisma.order.findFirst({
        where: { orderNumber: Number(order_number) },
        include: {
            pickup_location: true,
            User: { select: { firstname: true, lastname: true } },
            order_items: { include: { Product: true, variant: true } }
        }
    });

    if (order?.status === 'placed') {
        order_status = 1
    } else if (order?.status === 'processing') {
        order_status = 2
    } else if (order?.status === 'ready') {
        order_status = 3
    } else if (order?.status === 'en_route') {
        order_status = 4
    } else if (order?.status === 'delivered') {
        order_status = 5
    }

    return res.status(200).send({ status: order_status, order })

}))

trackRoute.post('/send', asyncError(async (req, res) => {

}))


module.exports = { trackRoute }