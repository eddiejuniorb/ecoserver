const cron = require('node-cron')
const { prisma } = require('../prismaClient')

cron.schedule('0 0 * * *', () => {
    clearCart()
})

cron.schedule("0 0 */3 * *", () => {
    deleteOnlineUnpaidOrders()
    deleteCodUnpaidOrders()
})

async function clearCart() {

    const threeWeeksAgo = new Date();
    threeWeeksAgo.setDate(threeWeeksAgo.getDate() - 21); // 21 days = 3 weeks

    await prisma.cartItems.deleteMany({
        where: {
            iat: { lt: threeWeeksAgo }
        }
    })
}

async function deleteOnlineUnpaidOrders() {
    await prisma.order.deleteMany({
        where: { payment_mode: 'paystack', payment_status: 'unpaid' }
    })
}

async function deleteCodUnpaidOrders() {
    await prisma.order.deleteMany({
        where: { payment_mode: 'cod', payment_status: 'unpaid', status: { not: 'delivered' } }
    })
}