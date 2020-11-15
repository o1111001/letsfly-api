const { login: LoginRepo } = require('../../repositories');
const Code = require('../../repositories/auth/code');

const sendMail = require('../mail');
const Hash = require('../../helpers/hash');
const generateCode = require('../../helpers/random');

const sendCode = async email => {
  const user = new LoginRepo(email);
  const { id } = await user.getUser();
  const code = generateCode();
  const hash = await Hash.generate(code);
  await Code.addCode(id, hash);
  await sendMail(email, 'Login code', code);
  return code;
};

module.exports = sendCode;
