const Code = require('../../repositories/auth/code');
const Tokens = require('../../helpers/tokens');

module.exports = async (id, clientRefreshToken, fingerprint) => {
  const { access, refresh, expirationAccess } = Tokens.generate(id);
  await Code.replaceToken(id, clientRefreshToken, access, refresh, fingerprint);
  return { access, refresh, expirationAccess };
};
