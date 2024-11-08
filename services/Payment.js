const request = require("request")

const { paystack } = require("../libs/Payment/Paystack")
const { prisma } = require("../prisma")

const { initializePayment, verifyPayment } = paystack(request)

class PaymentServices {
    startPayment(data) {
        return new Promise(async (resolve, reject) => {
            try {
                const form = { ...data }

                form.amount *= 100
                initializePayment(form, (error, body) => {
                    if (error) {
                        reject(error?.message);
                        return
                    }


                    const response = JSON.parse(body);
                    return resolve(response)
                })

            } catch (error) {
                error.source = "Start Payment Service"
                return reject(error)
            }
        })
    }

    createPayment(req) {
        return new Promise((resolve, reject) => {
            const ref = req.reference;

            if (ref === undefined || ref === null) {
                return reject("no reference passed")
            }

            try {
                verifyPayment(ref, async (error, body) => {

                    if (error) {
                        reject(error?.message)
                        return
                    }

                    const response = JSON.parse(body)

                    const { status, metadata } = response?.data;

                    if (status) {
                        const orderToConfirm = metadata?.order;
                        const cartId = metadata?.cartId
                        const cartItems = metadata?.cart_items
                        const addOrder = await prisma.order.create({ data: orderToConfirm })

                        if (addOrder) {
                            if (await prisma.cart.delete({ where: { id: cartId } })) {
                                await createOrderItem(addOrder?.id, cartItems)
                            }

                        }

                    }
                })

            } catch (error) {
                error.source = "Verifying Payment"
                return reject(error)
            }
        })
    }


}



async function createOrderItem(order_id, orderItems) {
    if (orderItems.length > 0) {
        for (const item of orderItems) {
            await prisma.orderItems.create({
                data: {
                    discount: parseFloat(item?.discountPrice),
                    customisation: parseFloat(item?.cust_price),
                    price: parseFloat(item?.total),
                    productId: item?.id,
                    quantity: Number(item?.boughtQuantity),
                    order_id: order_id
                }
            })
        }
    }
}

module.exports = { PaymentServices }