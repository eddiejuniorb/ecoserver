const { sendEmail } = require("../services/mail")

async function mailSuccesfulRegistration({ name, to }) {

  const client_url = process.env.client_url;

  const htmlBody = `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html
  xmlns="http://www.w3.org/1999/xhtml"
  xmlns:v="urn:schemas-microsoft-com:vml"
  xmlns:o="urn:schemas-microsoft-com:office:office"
>
  <head>
    <!--[if gte mso 9]>
      <xml>
        <o:OfficeDocumentSettings>
          <o:AllowPNG />
          <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
      </xml>
    <![endif]-->
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="x-apple-disable-message-reformatting" />
    <!--[if !mso]><!-->
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <!--<![endif]-->
    <title></title>

    <style type="text/css">
      @media only screen and (min-width: 620px) {
        .u-row {
          width: 600px !important;
        }

        .u-row .u-col {
          vertical-align: top;
        }

        .u-row .u-col-100 {
          width: 600px !important;
        }
      }

      @media only screen and (max-width: 620px) {
        .u-row-container {
          max-width: 100% !important;
          padding-left: 0px !important;
          padding-right: 0px !important;
        }

        .u-row {
          width: 100% !important;
        }

        .u-row .u-col {
          display: block !important;
          width: 100% !important;
          min-width: 320px !important;
          max-width: 100% !important;
        }

        .u-row .u-col > div {
          margin: 0 auto;
        }

        .u-row .u-col img {
          max-width: 100% !important;
        }
      }

      body {
        margin: 0;
        padding: 0;
      }
      table,
      td,
      tr {
        border-collapse: collapse;
        vertical-align: top;
      }
      p {
        margin: 0;
      }
      .ie-container table,
      .mso-container table {
        table-layout: fixed;
      }
      * {
        line-height: inherit;
      }
      a[x-apple-data-detectors="true"] {
        color: inherit !important;
        text-decoration: none !important;
      }

      table,
      td {
        color: #000000;
      }
      #u_body a {
        color: #0000ee;
        text-decoration: underline;
      }
      @media (max-width: 480px) {
        #u_content_image_1 .v-src-width {
          width: auto !important;
        }
        #u_content_image_1 .v-src-max-width {
          max-width: 31% !important;
        }
        #u_content_text_1 .v-container-padding-padding {
          padding: 20px 10px 10px !important;
        }
        #u_content_button_1 .v-size-width {
          width: 65% !important;
        }
        #u_content_button_1 .v-container-padding-padding {
          padding: 10px 10px 40px !important;
        }
      }
    </style>
  </head>

  <body
    class="clean-body u_body"
    style="
      margin: 0;
      padding: 0;
      -webkit-text-size-adjust: 100%;
      background-color: #ecf0f1;
      color: #000000;
    "
  >
    <!--[if IE]><div class="ie-container"><![endif]-->
    <!--[if mso]><div class="mso-container"><![endif]-->
    <table
      id="u_body"
      style="
        border-collapse: collapse;
        table-layout: fixed;
        border-spacing: 0;
        mso-table-lspace: 0pt;
        mso-table-rspace: 0pt;
        vertical-align: top;
        min-width: 320px;
        margin: 0 auto;
        background-color: #ecf0f1;
        width: 100%;
        margin: 20px 0px;
      "
      cellpadding="0"
      cellspacing="0"
    >
      <tbody>
        <tr style="vertical-align: top">
          <td
            style="
              word-break: break-word;
              border-collapse: collapse !important;
              vertical-align: top;
            "
          >
            <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color: #ecf0f1;"><![endif]-->

            <div
              class="u-row-container"
              style="padding: 0px; background-color: transparent"
            >
              <div
                class="u-row"
                style="
                  margin: 0 auto;
                  min-width: 320px;
                  max-width: 600px;
                  overflow-wrap: break-word;
                  word-wrap: break-word;
                  word-break: break-word;
                  background-color: transparent;
                "
              >
                <div
                  style="
                    border-collapse: collapse;
                    display: table;
                    width: 100%;
                    height: 100%;
                    background-color: transparent;
                  "
                >
                  <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: transparent;"><![endif]-->

                  <!--[if (mso)|(IE)]><td align="center" width="600" style="background-color: #ffffff;width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                  <div
                    class="u-col u-col-100"
                    style="
                      max-width: 320px;
                      min-width: 600px;
                      display: table-cell;
                      vertical-align: top;
                    "
                  >
                    <div
                      style="
                        background-color: #ffffff;
                        height: 100%;
                        width: 100% !important;
                        border-radius: 0px;
                        -webkit-border-radius: 0px;
                        -moz-border-radius: 0px;
                      "
                    >
                      <!--[if (!mso)&(!IE)]><!--><div
                        style="
                          box-sizing: border-box;
                          height: 100%;
                          padding: 0px;
                          border-top: 0px solid transparent;
                          border-left: 0px solid transparent;
                          border-right: 0px solid transparent;
                          border-bottom: 0px solid transparent;
                          border-radius: 0px;
                          -webkit-border-radius: 0px;
                          -moz-border-radius: 0px;
                        "
                      ><!--<![endif]-->
                        <table
                          id="u_content_image_1"
                          style="font-family: arial, helvetica, sans-serif"
                          role="presentation"
                          cellpadding="0"
                          cellspacing="0"
                          width="100%"
                          border="0"
                        >
                          <tbody>
                            <tr>
                              <td
                                class="v-container-padding-padding"
                                style="
                                  overflow-wrap: break-word;
                                  word-break: break-word;
                                  padding: 30px 10px 20px;
                                  font-family: arial, helvetica, sans-serif;
                                "
                                align="left"
                              >
                                <table
                                  width="100%"
                                  cellpadding="0"
                                  cellspacing="0"
                                  border="0"
                                >
                                  <tr>
                                    <td
                                      style="
                                        padding-right: 0px;
                                        padding-left: 0px;
                                      "
                                      align="center"
                                    >
                                      <img
                                        align="center"
                                        border="0"
                                        src="https://ecoshoppegh.netlify.app/static/media/logo.fb702ca9c6e56408d45d.png"
                                        alt="image"
                                        title="image"
                                        style="
                                          outline: none;
                                          text-decoration: none;
                                          -ms-interpolation-mode: bicubic;
                                          clear: both;
                                          display: inline-block !important;
                                          border: none;
                                          height: auto;
                                          float: none;
                                          width: 27%;
                                          max-width: 156.6px;
                                        "
                                        width="156.6"
                                        class="v-src-width v-src-max-width"
                                      />
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>

                        <!--[if (!mso)&(!IE)]><!-->
                      </div>
                      <!--<![endif]-->
                    </div>
                  </div>
                  <!--[if (mso)|(IE)]></td><![endif]-->
                  <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                </div>
              </div>
            </div>

            <div
              class="u-row-container"
              style="padding: 0px; background-color: transparent"
            >
              <div
                class="u-row"
                style="
                  margin: 0 auto;
                  min-width: 320px;
                  max-width: 600px;
                  overflow-wrap: break-word;
                  word-wrap: break-word;
                  word-break: break-word;
                  background-color: transparent;
                "
              >
                <div
                  style="
                    border-collapse: collapse;
                    display: table;
                    width: 100%;
                    height: 100%;
                    background-color: transparent;
                  "
                >
                  <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: transparent;"><![endif]-->

                  <!--[if (mso)|(IE)]><td align="center" width="600" style="background-color: #ffffff;width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                  <div
                    class="u-col u-col-100"
                    style="
                      max-width: 320px;
                      min-width: 600px;
                      display: table-cell;
                      vertical-align: top;
                    "
                  >
                    <div
                      style="
                        background-color: #ffffff;
                        height: 100%;
                        width: 100% !important;
                      "
                    >
                      <!--[if (!mso)&(!IE)]><!--><div
                        style="
                          box-sizing: border-box;
                          height: 100%;
                          padding: 0px;
                          border-top: 0px solid transparent;
                          border-left: 0px solid transparent;
                          border-right: 0px solid transparent;
                          border-bottom: 0px solid transparent;
                        "
                      ><!--<![endif]-->
                        <table
                          id="u_content_text_1"
                          style="font-family: arial, helvetica, sans-serif"
                          role="presentation"
                          cellpadding="0"
                          cellspacing="0"
                          width="100%"
                          border="0"
                        >
                          <tbody>
                            <tr>
                              <td
                                class="v-container-padding-padding"
                                style="
                                  overflow-wrap: break-word;
                                  word-break: break-word;
                                  padding: 20px 50px 10px;
                                  font-family: arial, helvetica, sans-serif;
                                "
                                align="left"
                              >
                                <div
                                  style="
                                    font-size: 14px;
                                    line-height: 140%;
                                    text-align: center;
                                    word-wrap: break-word;
                                  "
                                >
                                  <p
                                    style="line-height: 140%; text-align: left"
                                  >
                                    <span
                                      data-metadata="&lt;!--(figmeta)eyJmaWxlS2V5IjoibUZCRmxLY211T1ROUXVHU0ZSYWE0ZCIsInBhc3RlSUQiOjE3ODczMjU5MjYsImRhdGFUeXBlIjoic2NlbmUifQo=(/figmeta)--&gt;"
                                      style="line-height: 19.6px"
                                      >Hello ${name},
                                    </span>
                                  </p>
                                  <p
                                    style="line-height: 140%; text-align: left"
                                  >
                                     
                                  </p>
                                  <p
                                    style="line-height: 140%; text-align: left"
                                  >
                                    <span
                                      data-metadata="&lt;!--(figmeta)eyJmaWxlS2V5IjoibUZCRmxLY211T1ROUXVHU0ZSYWE0ZCIsInBhc3RlSUQiOjE3ODczMjU5MjYsImRhdGFUeXBlIjoic2NlbmUifQo=(/figmeta)--&gt;"
                                      style="line-height: 19.6px"
                                      >Welcome to Ecoshoppe Ghana! We’re
                                      excited to have you on board
                                    </span>
                                  </p>
                                  <p
                                    style="line-height: 140%; text-align: left"
                                  >
                                     
                                  </p>
                                  <p
                                    style="line-height: 140%; text-align: left"
                                  >
                                    <span
                                      data-metadata="&lt;!--(figmeta)eyJmaWxlS2V5IjoibUZCRmxLY211T1ROUXVHU0ZSYWE0ZCIsInBhc3RlSUQiOjE3ODczMjU5MjYsImRhdGFUeXBlIjoic2NlbmUifQo=(/figmeta)--&gt;"
                                      style="line-height: 19.6px"
                                    ></span
                                    ><strong
                                      >Your account has been successfully
                                      created,</strong
                                    > and you’re now part of a community that
                                    values Eco Life. 
                                  </p>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>

                        <table
                          id="u_content_button_1"
                          style="font-family: arial, helvetica, sans-serif"
                          role="presentation"
                          cellpadding="0"
                          cellspacing="0"
                          width="100%"
                          border="0"
                        >
                          <tbody>
                            <tr>
                              <td
                                class="v-container-padding-padding"
                                style="
                                  overflow-wrap: break-word;
                                  word-break: break-word;
                                  padding: 30px 10px 50px;
                                  font-family: arial, helvetica, sans-serif;
                                "
                                align="left"
                              >
                                <!--[if mso
                                  ]><style>
                                    .v-button {
                                      background: transparent !important;
                                    }
                                  </style><!
                                [endif]-->
                                <div align="center">
                                  <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="https://unlayer.com" style="height:37px; v-text-anchor:middle; width:174px;" arcsize="11%"  stroke="f" fillcolor="#000000"><w:anchorlock/><center style="color:#FFFFFF;"><![endif]-->
                                  <a
                                    href="${client_url}/account/login"
                                    target="_blank"
                                    class="v-button v-size-width"
                                    style="
                                      box-sizing: border-box;
                                      display: inline-block;
                                      text-decoration: none;
                                      -webkit-text-size-adjust: none;
                                      text-align: center;
                                      color: #ffffff;
                                      background-color: #000000;
                                      border-radius: 4px;
                                      -webkit-border-radius: 4px;
                                      -moz-border-radius: 4px;
                                      width: 30%;
                                      max-width: 100%;
                                      overflow-wrap: break-word;
                                      word-break: break-word;
                                      word-wrap: break-word;
                                      mso-border-alt: none;
                                      font-size: 14px;
                                    "
                                  >
                                    <span
                                      style="
                                        display: block;
                                        padding: 10px 20px;
                                        line-height: 120%;
                                      "
                                      ><span style="line-height: 16.8px"
                                        >LOGIN</span
                                      ></span
                                    >
                                  </a>
                                  <!--[if mso]></center></v:roundrect><![endif]-->
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>

                        <!--[if (!mso)&(!IE)]><!-->
                      </div>
                      <!--<![endif]-->
                    </div>
                  </div>
                  <!--[if (mso)|(IE)]></td><![endif]-->
                  <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                </div>
              </div>
            </div>

            <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
          </td>
        </tr>
      </tbody>
    </table>
    <!--[if mso]></div><![endif]-->
    <!--[if IE]></div><![endif]-->
  </body>
</html>

    
    `
  return sendEmail({
    from: "contact@ecoshoppegh.com", to: to,
    subject: "Welcome to Ecoshoppe Ghana! 🎉 Your Account is Ready!",
    html: htmlBody
  }, (err, res) => {
    if (err) {
      console.log("Error while sending mail", err);
    } else {
      console.log("Mail sent");
    }
  })
}

module.exports = mailSuccesfulRegistration