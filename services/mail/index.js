const nodemailer = require('nodemailer');
const { PRODUCTION } = require('../../config/env');

async function main(email, subject, text) {
  const mailOptions = {
    from: '"MESSAGES.GG" <messages.gg@gmail.com>',
    to: email,
    subject,
    text,
  };
  console.log(mailOptions);
  if (PRODUCTION) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const result = await transporter.sendMail(mailOptions);
    return result;
  } else {
    const testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
    console.log('Preview Info: %s', info);

    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  }
}

module.exports = main;
