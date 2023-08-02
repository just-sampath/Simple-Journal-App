// Required Imports
const nodemailer = require("nodemailer");

// Sending the email
const sendMail = (op) => {
  // Creating the transport
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_NAME,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Defining the mail options
  const mailOptions = {
    from: "Y Sampath <sampath@gmail.com>",
    to: op.email,
    subject: op.subject,
    text: op.message,
  };

  // Sending the email
  transport.send(mailOptions);
};

module.exports = sendMail;
