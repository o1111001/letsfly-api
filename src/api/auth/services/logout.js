const Code = require('../repositories/code');

module.exports = refresh =>  Code.removeRefreshToken(refresh);
