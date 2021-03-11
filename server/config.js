const dotenv = require('dotenv');

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

module.exports = {
  env: process.env.NODE_ENV || 'production',
  port: process.env.PORT || 8080,
};
