const { signUp: SignUpRepo } = require('../repositories');
const sendMail = require('../../mail/services');
const Hash = require('../../../helpers/hash');
const generateCode = require('../../../helpers/random');
const Code = require('../../auth/repositories/code');

const signUp = async email => {
  const newUser = new SignUpRepo(email);
  let user = await newUser.checkExists();
  if (!user || !user[0]) {
    user = await newUser.create();
  }

  const [{ id }] = user;
  const code = generateCode();
  const hash = await Hash.generate(code);
  await Code.addCode(id, hash);
  sendMail(email, 'Ваш код для входа в LetsFly', code);
  return code;
};

module.exports = signUp;
