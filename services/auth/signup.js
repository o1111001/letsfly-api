const { signUp: SignUpRepo } = require('../../repositories');
const sendMail = require('../mail');
const Hash = require('../../helpers/hash');
const generateCode = require('../../helpers/random');

const signUp = async email => {
  const newUser = new SignUpRepo(email);
  await newUser.checkExists();
  await newUser.create();
  const code = generateCode();
  const hash = await Hash.generate(code);
  await newUser.addCode(hash);
  sendMail(email, 'Login code', code);
  return code;
};

module.exports = signUp;
