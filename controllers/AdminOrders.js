const { apiBadRequestError, apiNotFoundError } = require("../libs/errors/appError");
const { asyncError } = require("../libs/errors/asyncError");
const orderCancellation = require("../mail/orderCancellation");
const { prisma } = require("../prismaClient");

class AdminOrdersControllers {
    static changeStatus() {
        return asyncError(async (req, res) => {
            const { status, order_id } = req.body;

            if (status === 'cancelled') {
                return res.sendStatus(200)
            }

            const order = await prisma.order.findFirst({ where: { id: String(order_id) } })

            if (!order) throw new apiNotFoundError("no order found");

            // check if order is already delivered 
            if (order.status === 'delivered') throw new apiBadRequestError("order has been delivered");

            if (order.status === 'cancelled') throw new apiBadRequestError("order has been cancelled");

            if (await prisma.order.update({ where: { id: order_id }, data: { status: status } })) {
                return res.sendStatus(200)
            }
        })
    }


    static deleteOrder() {
        return asyncError(async (req, res) => {
            const { order_id } = req.query
            if (!order_id) throw new apiBadRequestError()
            const order = await prisma.order.findFirst({ where: { id: order_id } })
            if (!order) throw new apiBadRequestError("no order found")
            if (order.payment_status === 'paid') throw new apiBadRequestError("you can't delete paid order")
            await prisma.order.delete({ where: { id: order_id } })
        })
    }

    static cancelOrder() {
        return asyncError(async (req, res) => {
            const { order_id, reason } = req.body;

            if (!order_id, !reason) throw new apiBadRequestError("Fill the empty spaces");

            const order = await prisma.order.findFirst({ where: { id: order_id }, include: { User: true } });

            if (!order) throw new apiNotFoundError("No order found");

            if (order.status === "delivered") throw new apiBadRequestError("order has been delivered");

            if (order.status === "cancelled") throw new apiBadRequestError("order has been cancelled already");

            if (await prisma.order.update({ where: { id: order_id }, data: { status: 'cancelled' } })) {
                await orderCancellation({ data: order, reason: reason })
            }
            return res.sendStatus(200)
        })
    }
}


module.exports = { AdminOrdersControllers }