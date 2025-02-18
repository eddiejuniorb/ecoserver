const { sendEmail } = require("../services/mail")

async function orderCancellation({ data, reason }) {

    const client_url = process.env.client_url;

    const htmlBody = `
    <div class="email-container">
            <div class="header">
                Your Order ${data?.orderNumber} Has Been Cancelled
            </div>
            <div class="content">
                <p>Dear ${data?.User?.firstname},</p>
                <p>We regret to inform you that your recent order (<strong>${data?.orderNumber}</strong>) placed on <strong>${data?.iat}</strong> has been cancelled.</p>
                <p><strong>Reason for Cancellation:</strong><br> ${reason}</p>
                <p>If the order was cancelled due to an error or concern, please do not hesitate to contact our customer support team so we can assist you further.</p>
                <p><strong>Refund Details (if applicable):</strong><br>
                If you have already been charged for this order, we have initiated a refund to your original payment method. Please allow 5 days for the amount to reflect in your account.</p>
                <p>We sincerely apologize for any inconvenience this may have caused. Your satisfaction is important to us, and we look forward to serving you better in the future.</p>
                <p>If you have any questions or need further assistance, feel free to reach out to our support team at <a href="mailto:leatheroncallgh@gmail.com">leatheroncallgh@gmail.com</a> or call us at  +233 50 283 5422.</p>
                <p>Thank you for your understanding.</p>
            </div>
            <div class="footer">
                <p><strong>Ecoshoppe Ghana</strong></p>
                <p>Dzorwulu, Kpemtembli Road</p>
                <p> <a href="mailto:leatheroncallgh@gmail.com">leatheroncallgh@gmail.com</a></p>
            </div>
        </div>
    `
    return sendEmail({
        from: "Ecoshoppe Ghana <no-reply@ecoshoppegh.wiki>",
        to: data?.User?.email,
        subject: `Your Order ${data?.orderNumber} Has Been Cancelled`,
        html: htmlBody
    }, (err, res) => {
        if (err) {
            console.log("Error while sending mail", err);
        } else {
            console.log("Mail sent");
        }
    })
}

module.exports = orderCancellation