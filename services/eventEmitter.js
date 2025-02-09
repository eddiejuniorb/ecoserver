const EventEmitter = require('events');
const { prisma } = require('../prismaClient');
const { notifyClients } = require('./order');
const mailSuccesfulRegistration = require('../mail/mailRegistration');
const orderSuccessMail = require('../mail/orderSuccessfuly');
const sms = require('../smsClient');
class MyEmitter extends EventEmitter { }
const myEmitter = new MyEmitter();


// send mail when user successfully registered 
myEmitter.on('userRegistered', async (userEmail, firstName) => {
    await mailSuccesfulRegistration({ name: firstName, to: userEmail })
})


// Alert Admin Users for new order
myEmitter.on('newOrderNotification', async (order) => {
    notifyClients(order)
})

const users = ["+233248168831", "+233244475173"]

// Send Order Mail confirmation to 
myEmitter.on('neworder', async (id) => {
    const order = await prisma.order.findFirst({
        where: { id: id },
        include: {
            User: true,
            order_items: {
                include: {
                    Product: true, variant: true
                }
            }
        }
    })

    users.forEach(async (user) => {
        await sms.sendSms(user, `New Order received with the number ${order?.orderNumber}`)
    })

    await orderSuccessMail({ order: order })
})

module.exports = myEmitter;

