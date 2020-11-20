const Code = require('../../repositories/auth/code');

module.exports = refresh =>  Code.removeRefreshToken(refresh);
