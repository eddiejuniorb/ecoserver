const request = require('request')

const paystack = (request) => {
    const paystack_secret = process.env.paystack_secret_code

    const initializePayment = (form, myCallback) => {
        const options = {
            url: "https://api.paystack.co/transaction/initialize",
            headers: {
                "Authorization": paystack_secret,
                "Content-Type": "application/json",
                "cache-control": 'no-cache'
            },
            form
        }

        const callback = (error, response, body) => {
            return myCallback(error, body)
        }

        request.post(options, callback);
    }

    const verifyPayment = (ref, myCallback) => {
        const options = {
            url: "https://api.paystack.co/transaction/verify/" + encodeURIComponent(ref),
            headers: {
                "Authorization": paystack_secret,
                "Content-Type": "application/json",
                "cache-control": 'no-cache'
            },
        }

        const callback = (error, response, body) => {
            return myCallback(error, body)
        }

        request(options, callback)
    }


    return { initializePayment, verifyPayment }
}

module.exports = { paystack }