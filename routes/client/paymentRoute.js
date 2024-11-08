const paymentRoute = require('express').Router()
const { asyncError } = require('../../libs/errors/asyncError')
const { PaymentServices } = require('../../services/Payment')

const paymentInstance = new PaymentServices()

paymentRoute.get('/verify', asyncError(async (req, res) => {
    const response = await paymentInstance.createPayment(req.query)
    res.status(201).send(response)
}))

module.exports = { paymentRoute }