const { login: LoginRepo } = require('../../repositories');
const sendMail = require('../mail');
const Hash = require('../../helpers/hash');
const generateCode = require('../../helpers/random');

const sendCode = async email => {
  const user = new LoginRepo(email);
  await user.getUser();
  const code = generateCode();
  const hash = await Hash.generate(code);
  await user.addCode(hash);
  await sendMail(email, 'Login code', code);
  return code;
};

module.exports = sendCode;
