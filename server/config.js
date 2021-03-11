const dotenv = require('dotenv');

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

module.exports = {
  env: process.env.NODE_ENV || 'production',
  port: process.env.PORT || 8080,
  serverUrl: process.env.SERVER_URL,
  db: {
    dialect: 'postgres',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    logging: process.env.DB_LOGS === 'true' && console.log,
  },
};
