const { login: LoginRepo } = require('../../repositories');
const Code = require('../../repositories/auth/code');

const Hash = require('../../helpers/hash');
const Tokens = require('../../helpers/tokens');
const { CustomError } = require('../../helpers/errors');

const login = async (email, code, fingerprint) => {

  // check code
  const User = new LoginRepo(email);
  const { id } = await User.getUser();

  const codeData  = await Code.getCode(id);
  if (!codeData) {
    throw new CustomError('Number of attempts exhausted', 401);
  }
  const [{ code: codeHashFromDB, expires, attempts }] = codeData;

  if (attempts >= 3) {
    await Code.removeCodes(id);
    throw new CustomError('Number of attempts exhausted', 401);
  }
  if (expires < new Date()) {
    await Code.removeCodes(id);
    throw new CustomError('Timeout exceeded', 401);
  }
  // if (!hash) throw new CustomError('Code does not exist', 403);
  const result = await Hash.compare(code, codeHashFromDB);
  if (!result) {
    await Code.incrementAttemps(id);
    throw new CustomError('Wrong code', 403);
  }
  const { access, refresh, expirationAccess } = Tokens.generate(id);
  await Code.addToken(id, access, refresh, fingerprint);
  await Code.removeCodes(id);

  return { access, refresh, expirationAccess };
};

module.exports = login;
