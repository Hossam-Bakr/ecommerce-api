const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // define the transporter like gmail , mailgun , mailtrap , mailgrid
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // define email options like from , to , subject , message

  const mailOptions = {
    from: `E-shop app <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    message: options.message,
    html: options.message,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
