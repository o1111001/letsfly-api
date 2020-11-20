const Payments = require('../../repositories/payments');
const {
  MERCHANT_ACCOUNT,
  MERCHANT_SECRET_KEY,
  MERCHANT_DOMAIN_NAME,
} = require('../../config/env');
const crypto = require('crypto');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const UserRepo = require('../../repositories/user/bio');

// const MERCHANT_ACCOUNT = 'test_merch_n1';
// const MERCHANT_SECRET_KEY = 'flk3409refn54t54t*FNJRET';
// const MERCHANT_DOMAIN_NAME = 'messages.social';

const getUser = async id => {
  const User = new UserRepo();
  const user = await User.getUser({ id, me: id });
  const { email, phone } = user;
  return { email, phone };
};

const getSignature = amount => {
  const orderReference = uuidv4();
  // const orderDate = Date.now();
  const orderDate = 1415379863;
  const stringUTF8 = `${MERCHANT_ACCOUNT};${MERCHANT_DOMAIN_NAME};${orderReference};${orderDate};${amount};USD;Внутресистемная валюта;1;${amount}`;
  const signature = crypto.createHmac('md5', MERCHANT_SECRET_KEY).update(stringUTF8).digest('hex').toString();
  return [signature, orderReference, orderDate];
};

const getSignatureOnPayment = ({ merchantAccount, orderReference, amount, currency, authCode, cardPan, transactionStatus, reasonCode }) => {
  const stringUTF8 = `${merchantAccount};${orderReference};${amount};${currency};${authCode};${cardPan};${transactionStatus};${reasonCode}`;
  const signature = crypto.createHmac('md5', MERCHANT_SECRET_KEY).update(stringUTF8).digest('hex').toString();
  return signature;
};

const createPayment = data => Payments.create(data);


const getPaymentURL = async (amount, { merchantSignature, orderReference, orderDate }, { email, phone }) => {
  const data = {
    merchantAccount: MERCHANT_ACCOUNT,
    merchantDomainName: MERCHANT_DOMAIN_NAME,
    merchantSignature,
    orderReference,
    orderDate,
    amount,
    currency: 'USD',
    productName: ['Внутресистемная валюта'],
    productPrice: [amount],
    productCount: [1],
    clientEmail: email,
    clientPhone: phone || undefined,
    language: 'RU',
    serviceUrl: `https://3ec445e86500.ngrok.io/api/v1/payment_services_provider/way_for_pay/callback`,
  };
  const response = await axios.post('https://secure.wayforpay.com/pay?behavior=offline', data);
  return response.data;
};

const callback = async body => {
  const { orderReference, transactionStatus, merchantSignature } = body;
  await Payments.updateStatus({
    order: orderReference,
    status: transactionStatus.toLowerCase(),
    signature: merchantSignature,
  });
  const time = new Date();
  const stringUTF8 = `${orderReference};${transactionStatus};${+time}`;
  const signature = crypto.createHmac('md5', MERCHANT_SECRET_KEY).update(stringUTF8).digest('hex').toString();

  const response = {
    orderReference,
    status: 'accept',
    time: +time,
    signature,
  };
  return response;
};

module.exports = {
  getUser,
  callback,
  getSignature,
  getPaymentURL,
  createPayment,
  getSignatureOnPayment,
};
