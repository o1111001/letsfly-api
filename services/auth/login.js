const { login: LoginRepo } = require('../../repositories');
const Hash = require('../../helpers/hash');
const Tokens = require('../../helpers/tokens');

const login = async (email, code) => {
  const User = new LoginRepo(email);
  const user = await User.getUser();
  const { id, hash } = user;
  if (!hash) throw 'Code does not exist';
  await Hash.compare(code, hash);

  const token = Tokens.generate(id);
  await User.addToken(id, token);
  await User.removeCode(id, token);
  return token;
};

module.exports = login;
