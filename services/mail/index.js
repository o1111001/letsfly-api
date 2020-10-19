const nodemailer = require('nodemailer');
const { production, EMAIL_USER, EMAIL_PASS } = require('../../config/env');

async function main(email, subject, text) {
  const mailOptions = {
    from: `"MESSAGES.SOCIAL" <${process.env.EMAIL_USER}>`,
    to: email,
    subject,
    text,
  };
  if (production) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
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
