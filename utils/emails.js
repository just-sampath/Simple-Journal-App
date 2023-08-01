// Required Imports
const nodemailer = require("nodemailer");

const sendMail = (op) => {
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_NAME,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: "Y Sampath <sampath@gmail.com>",
    to: op.email,
    subject: op.subject,
    text: op.message,
  };

  transport.send(mailOptions);
};

module.exports = sendMail;
