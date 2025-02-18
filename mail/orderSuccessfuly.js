const formatCurrency = require("../libs/formatCurrency");
const { sendEmail } = require("../services/mail")

async function orderSuccessMail({ order }) {

  const client_url = process.env.client_url;

  const orderItems = order?.order_items?.map(
    (item) => `
  <tr>
    <td>
      <p class="product-name">${item?.Product?.name} × ${item?.quantity}</p>
      <p class="variants">${item?.variant?.color || ""} ${item?.variant?.size || ""} ${item?.variant?.material || ""} ${item?.variant?.type || ""}</p>
      </td>
    <td style="text-align: right">${formatCurrency(item?.price)}</td>
  </tr>
  `
  )?.join('');



  const htmlBody = `
    <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      * {
        box-sizing: border-box;
        padding: 0;
        margin: 0;
      }
      body,
      html {
        background-color: #fff;
        font-family: Arial, Helvetica, sans-serif;
      }

      .button {
        color: white;
        padding: 20px;
        border-radius: 3px;
        background-color: #1a90c7;
        display: block;
        width: fit-content;
        text-decoration: none;
      }

      .text-heading {
        color: #212121;
        font-size: 20px;
        font-weight: normal;
      }

      table {
        width: 100%;
      }

      table tr td {
        padding-top: 10px;
        padding-bottom: 10px;
      }

      .product-img {
        width: 65px;
        height: 65px;
        object-fit: cover;
        border-radius: 5px;
      }

      .product-name {
        color: #363535;
        font-weight: 500;
      }

      .price {
        font-weight: 800;
      }

      .variants {
        font-size: 15px;
        color: gray;
      }

      .heading {
        font-weight: 500;
        font-size: 16px;
        color: #464646;
        margin: 0 0 5px;
      }

      .subtotal_title {
        color: #777;
      }

      .subtotal_value {
        text-align: right;
      }

      .subtotal_table tbody tr td {
        padding-top: 5px !important;
        padding-bottom: 5px !important;
      }
    </style>
  </head>
  <body style="max-width: 600px; margin: 40px auto">
    <!-- Logo Place -->
    <div>
      <h2>ECOSHOPPE GH.</h2>
    </div>

    <!-- Order Number -->
    <div style="text-align: right; text-transform: uppercase; color: gray">
      Order #${order?.orderNumber}
    </div>

    <!-- Thank you Message and Others -->

    <div style="margin: 50px 0">
      <h3 class="text-heading">Thank you for your purchase!</h3>
      <p style="color: gray; line-height: 28px; padding-top: 15px">
        We're getting your order ready to be shipped. We will notify you when it
        has been sent.
      </p>

      <div style="margin-top: 15px">
        <a class="button" href="${client_url}/order-tracking/${order?.orderNumber}">Track your order</a>
      </div>
    </div>

    <!-- Thank you Message and Others -->

    <!-- Order Summary -->
    <div style="margin-top: 60px">
      <h3 class="text-heading">Order Summary</h3>

      <!-- Order Table -->
      <table style="margin-top: 25px; width: 100%">
    <tbody>
    ${orderItems}
    </tbody>
      </table>
      <!-- Order Table -->
    </div>

    <!-- Subtotal and others -->
    <table style="border-top: 1px solid #e5e5e5; width: 100%">
      <tbody>
        <tr>
          <td style="width: 40%"></td>
          <td style="width: 60%">
            <table class="subtotal_table">
              <tbody>
                <tr>
                  <td class="subtotal_title">Subtotal</td>
                  <td class="subtotal_value">${formatCurrency(order?.total)}</td>
                </tr>
                <tr>
                  <td class="subtotal_title">Discount</td>
                  <td class="subtotal_value">${formatCurrency(order?.discount)}</td>
                </tr>
                <tr>
                  <td class="subtotal_title">Shipping</td>
                  <td class="subtotal_value">${formatCurrency(order?.shipping)}</td>
                </tr>
                <!-- total table -->
                <tr>
                  <td colspan="2">
                    <table
                      style="
                        border-top: 1px solid #e5e5e5;
                        border-bottom: 1px solid #e5e5e5;
                        padding: 10px 0;
                        width: 100%;
                        margin-top: 5px;
                      "
                    >
                      <tbody>
                        <tr>
                          <td class="subtotal_title">Total</td>
                          <td class="subtotal_value">${formatCurrency(order?.total - order?.discount + order?.shipping)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- Order Summary -->
  </body>
</html>
    `
  return sendEmail({
    from: "Ecoshoppe Ghana <no-reply@ecoshoppegh.wiki>",
    to: order?.User?.email,
    subject: `Thank You for Your Order! 🛒 Order #${order?.orderNumber} Confirmed`,
    html: htmlBody
  }, (err, res) => {
    if (err) {
      console.log("Error while sending mail", err);
    } else {
      console.log("Mail sent");
    }
  })
}

module.exports = orderSuccessMail