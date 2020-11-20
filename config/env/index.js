const production = require('./production');
const development = require('./development');
require('dotenv').config();

if (process.env.NODE_ENV === 'production') {
  module.exports = production;
} else {
  module.exports = development;
}
