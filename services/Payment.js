const request = require("request")

const { paystack } = require("../libs/Payment/Paystack")
const { prisma } = require("../prismaClient")

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
                        const orderID = metadata?.order_id;
                        await prisma.order.update({
                            where: { id: orderID },
                            data: { payment_status: 'paid' }
                        })
                        return resolve(response)
                    }
                })

            } catch (error) {
                error.source = "Verifying Payment"
                return reject(error)
            }
        })
    }


}


module.exports = { PaymentServices }