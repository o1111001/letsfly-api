const { login: LoginRepo } = require('../../repositories');
const Hash = require('../../helpers/hash');
const Tokens = require('../../helpers/tokens');
const { CustomError } = require('../../helpers/errors');

const login = async (email, code) => {
  const User = new LoginRepo(email);
  const user = await User.getUser();
  const { id, hash } = user;
  if (!hash) throw new CustomError('Code does not exist', 403);
  await Hash.compare(code, hash);

  const token = Tokens.generate(id);
  await User.addToken(id, token);
  await User.removeCode(id, token);
  return token;
};

module.exports = login;
