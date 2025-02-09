const { sendEmail } = require("../services/mail")

async function sendPasswordReset({ to, url }) {

    const htmlBody = `
     <div class="email-container" style="margin: 50px auto; max-width: 700px">
      <h2>ECOSHOPPE</h2>
      <div style="margin-top: 20px">
        <h3>Reset your password</h3>
        <div style="margin-top: 15px">
          <p style="color: gray">
            Follow this link to reset your customer account password at
            <a href=${url}>ECOSHOPPE</a>. If you didn't request a new password, you
            can safely delete this email.
          </p>

          <a
            href=${url}
            style="
              margin-top: 5px;
              background-color: #1a90c7;
              color: white;
              text-decoration: none;
              padding: 15px 30px;
              display: inline-block;
              border-radius: 5px;
            "
            >Reset your password
          </a>
        </div>
      </div>
    </div>
    `
    return sendEmail({
        from: "Ecoshoppe Ghana <contact@ecoshoppegh.com>",
        to: to,
        subject: `Customer account password reset`,
        html: htmlBody
    }, (err, res) => {
        if (err) {
            console.log("Error while sending mail", err);
        } else {
            console.log("Mail sent");
        }
    })
}

module.exports = sendPasswordReset