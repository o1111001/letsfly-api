const { adminLogin: AdminLoginRepo } = require('../../repositories');
const Hash = require('../../helpers/hash');
const Tokens = require('../../helpers/tokens');

const login = async (id, password) => {
  const Admin = new AdminLoginRepo(id);
  const admin = await Admin.check();
  const { hash } = admin;
  if (!hash) throw 'Wrong password';
  await Hash.compare(password, hash);

  const token = Tokens.generate(id);
  await Admin.addToken(token);
  return token;
};

module.exports = login;
