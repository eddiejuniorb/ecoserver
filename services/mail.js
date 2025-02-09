const nodemailer = require('nodemailer')

async function sendEmail({ from, to, subject, text, html }, callback) {

    const smtmpOptions = {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: true,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    }

    const transporter = nodemailer.createTransport(smtmpOptions)

    transporter.sendMail({ from, to, subject, text, html }).then((res) => {
        callback(null, res)
    }).catch((err) => {
        callback(err, null)
    })
}

module.exports = { sendEmail }