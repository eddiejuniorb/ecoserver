const contactRoute = require('express').Router()
const { asyncError } = require('../../libs/errors/asyncError');
const { prisma } = require('../../prismaClient');
const { apiBadRequestError } = require('../../libs/errors/appError');
const { sendEmail } = require('../../services/mail');
const { emailRegex } = require('../../libs/helpers');


contactRoute.post('/', asyncError(async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        throw new apiBadRequestError("fill the empty spaces")
    }

    if (!emailRegex.test(email)) {
        throw new apiBadRequestError("invalid email")
    }

    sendEmail({
        from: "Ecoshoppe Ghana <no-reply@ecoshoppegh.wiki>",
        to: process.env.contact_email,
        subject: "New Contact Form Submission",
        text: `You have a new message from ${name}.\n\nEmail: ${email}\nMessage: ${message}`,
        html: `<p><strong>Name:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Message:</strong> ${message}</p>`,

    }, (err, data) => {
        if (err) {
            console.log(err);
            return res.status(400).send("Error while sending message")
        }
        res.status(200).send("Message sent")
        return;
    })
}))


// Adding clients to subscribers 
contactRoute.post('/subscribe', asyncError(async (req, res) => {
    const { email } = req.body

    if (!email) {
        throw new apiBadRequestError("provide your email")
    }

    if (!emailRegex.test(email)) {
        throw new apiBadRequestError("invalid email")
    }

    const checkEmail = await prisma.subscribers.findFirst({ where: { email: email } });

    if (checkEmail) {
        throw new apiBadRequestError("You have already subscribe to our newsletter")
    }

    const add = await prisma.subscribers.create({
        data: { email: email }
    })

    if (add) {
        return res.status(200).send("Congratulations")
    }

}))

module.exports = { contactRoute }