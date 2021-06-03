const { login: LoginRepo } = require('../repositories');
const Code = require('../../auth/repositories/code');

const sendMail = require('../../mail/services');
const Hash = require('../../../helpers/hash');
const generateCode = require('../../../helpers/random');

const sendCode = async email => {
  const user = new LoginRepo(email);
  const { id } = await user.getUser();
  const code = generateCode();
  const hash = await Hash.generate(code);
  await Code.addCode(id, hash);
  await sendMail(email, 'Ваш код для входа в LetsFly', code);
  return code;
};

module.exports = sendCode;
