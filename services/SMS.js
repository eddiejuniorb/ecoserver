const twilio = require('twilio');

class SMS {

    constructor(accountSid, authToken, from) {
        this.accountSid = accountSid;
        this.authToken = authToken;
        this.client = twilio(accountSid, authToken)
        this.from = "Ecoshoppegh"
    }

    async sendSms(to, message) {
        await this.client.messages.create({
            from: this.from,
            to: to,
            body: message,
        })
    }
}

module.exports = SMS