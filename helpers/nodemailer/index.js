const nodemailer = require('nodemailer');

async function main(email, subject, text) {
  const mailOptions = {
    from: '"MESSAGES.GG" <messages.gg@gmail.com>',
    to: email,
    subject,
    text,
  };

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const result = await transporter.sendMail(mailOptions);
  return result;
}

module.exports = main
