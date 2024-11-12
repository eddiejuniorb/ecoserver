const cron = require('node-cron')
const { prisma } = require('../prismaClient')

cron.schedule('0 0 * * 0', () => {

})



async function clearCart() {
    const deleted = await prisma.cartItems.delete({
        where: {
            iat: { lte: new Date() - 3 * 7 * 24 * 60 * 60 * 1000 }
        }
    })
}