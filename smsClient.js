const SMS = require("./services/SMS");

const accountSid = process.env.twilio_account_sid
const authToken = process.env.twilio_auth_token

const sms = new SMS(accountSid, authToken)

module.exports = sms;