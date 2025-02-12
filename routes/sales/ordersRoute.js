const { AdminOrdersControllers } = require('../../controllers/AdminOrders');
const { apiNotFoundError, apiBadRequestError } = require('../../libs/errors/appError');
const { asyncError } = require('../../libs/errors/asyncError');
const orderCancellation = require('../../mail/orderCancellation');
const { verifyJwtTokenAdmins } = require('../../middlewares/verifyToken');
const { prisma } = require('../../prismaClient');
const myEmitter = require('../../services/eventEmitter');
const { orderClients } = require('../../services/order');

const orderRoute = require('express').Router();


orderRoute.get('/live', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const client = {
        id: Date.now(), res
    }

    orderClients.push(client)
    res.write("type: welcomemessage\n\n")
    res.write("data: livedatajoined\n\n")
})


// Get 5 latest orders
orderRoute.get('/recent-orders', verifyJwtTokenAdmins.allAudience(), asyncError(async (req, res) => {
    const top_5_orders = await prisma.order.findMany({
        include: { User: true },
        take: 5,
        orderBy: { iat: 'desc' }
    })

    return res.status(200).send(top_5_orders)
}))


// Get Recent Payment
orderRoute.get('/online-cash-payments', verifyJwtTokenAdmins.allAudience(), asyncError(async (req, res) => {
    const onlinePayments = await prisma.order.findMany({
        select: { total: true, User: { select: { firstname: true, email: true } } },
        where: { payment_mode: 'paystack' }
    })

    const cashPayments = await prisma.order.findMany({
        select: { total: true, User: { select: { firstname: true, email: true } } },
        where: { payment_mode: "cod" }
    })

    return res.status(200).send({ online: onlinePayments, cash: cashPayments })
}))

// Sales Segment

orderRoute.get('/segments', verifyJwtTokenAdmins.allAudience(), asyncError(async (req, res) => {
    const salesSegment = await getSalesSegment()
    return res.status(200).send(salesSegment)
}))

// Change Order Status
orderRoute.post('/change-status', verifyJwtTokenAdmins.allAudience(), AdminOrdersControllers.changeStatus())

// Delete Order
orderRoute.delete('/delete-order', verifyJwtTokenAdmins.adminOnly(), AdminOrdersControllers.deleteOrder())


// Cancel Order

orderRoute.post('/cancel-order', verifyJwtTokenAdmins.adminOnly(), AdminOrdersControllers.cancelOrder())

// Live Orders
orderRoute.get('/live-orders', verifyJwtTokenAdmins.allAudience(), asyncError(async (req, res) => {
    const { customer, startDate, endDate, payment_status, orderNumber, status, page } = req.query;

    const pageNumber = page ? page : 1
    const take = 50;
    const skip = (pageNumber - 1) * take;

    const filters = {}

    if (customer) {
        filters.User = { firstname: { contains: customer } }
    }

    if (payment_status) {
        filters.payment_status = payment_status
    }

    if (status) {
        filters.status = status
    }

    if (orderNumber) {
        filters.orderNumber = Number(orderNumber)
    }

    if (startDate && endDate) {
        filters.iat = {
            gte: new Date(startDate),
            lte: new Date(endDate)
        }
    }

    const orders = await prisma.order.findMany({
        where: filters,
        take,
        skip,
        include: { User: { select: { firstname: true } } },
        orderBy: { iat: 'desc' }
    })


    const total = await prisma.order.count({ where: filters })
    const totalPages = Math.ceil(total / take)

    return res.status(200).send({ data: orders, totalPages })

}))


// Get Order count

orderRoute.get('/order-count', verifyJwtTokenAdmins.allAudience(), asyncError(async (req, res) => {
    const { orders } = await getLast5dayOfSalesandOrders();

    const formattedResult = orders.map((row) => ({
        date: row?.date?.toISOString().split("T")[0],
        orders: Number(row.orders), // Convert BigInt to string
    }));

    return res.status(200).send(formattedResult || {})
}))


orderRoute.post('/send', (req, res) => {
    myEmitter.emit('newOrderNotification', "addOrderByCod")
    res.sendStatus(200)
})


// Get Order

orderRoute.get('/order/:id', verifyJwtTokenAdmins.allAudience(), asyncError(async (req, res) => {
    const id = req.params?.id;

    const order = await prisma.order.findFirst({
        where: { id: id },
        include: {
            User: true,
            order_items: { include: { variant: true, Product: true } },
            pickup_location: { select: { name: true } }
        }
    })

    if (!order) throw new apiNotFoundError("no order found")

    return res.status(200).send(order || {})

}))


const getSalesSegment = async () => {
    const pending = await prisma.order.count({ where: { status: 'placed' } })
    const processing = await prisma.order.count({ where: { status: 'processing' } })
    const delivering = await prisma.order.count({ where: { status: 'en_route' } })
    const completed = await prisma.order.count({ where: { status: 'delivered' } })

    return { pending, processing, delivering, completed }
}


async function getLast5dayOfSalesandOrders() {

    const orders = await prisma.order.findMany({
        select: { total: true, payment_status: true },
        take: 5,
    })

    return { orders }
}




module.exports = { orderRoute }