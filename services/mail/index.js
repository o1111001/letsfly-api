const nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');
const login = require('./login');
const { production, SENDGRID_API_KEY } = require('../../config/env');
sgMail.setApiKey(SENDGRID_API_KEY);

async function main(email, subject, text) {
  const msg = {
    to: email,
    from: 'LetsFly <no-reply@letsfly.app>',
    subject,
    html: login(text),
  };
  if (production) {
    sgMail.send(msg);

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

    const info = await transporter.sendMail(msg);
    console.log('Message sent: %s', info.messageId);
    console.log('Preview Info: %s', info);

    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  }
}

module.exports = main;
