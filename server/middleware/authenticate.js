const config = require('../config');
const { Display } = require('../model');
const logger = require('../util/logger');

const unauthorized = res => {
  res.status(401).set('WWW-Authenticate', 'Basic').send('Please login');
};

const authenticate = async (req, res, next) => {
  logger.info('Authenticating request');
  const authorization = req.headers.authorization;

  if (!authorization) {
    logger.info('No authorization header. Rejecting');
    return unauthorized(res);
  }

  try {
    const credentialsBase64 = authorization.replace('Basic ', '');
    const credentials = Buffer.from(credentialsBase64, 'base64').toString();

    const [username, password] = credentials.split(':');

    if (password !== config.password) {
      logger.info('Invalid password. Rejecting');
      return unauthorized(res);
    }

    if (username === 'admin') {
      logger.info('Request from Admin');
      req.auth = { isAdmin: true };
    } else {
      logger.info('Request from display');
      const display = await Display.findOne({ where: { loginName: username } });

      if (!display) {
        logger.info('Unknown display name. Rejecting');
        return unauthorized(res);
      }

      logger.info(`Request from dispay ${display.name}`);
      req.auth = { isAdmin: false, display };
    }

    return next();
  } catch (e) {
    logger.error(e);
    logger.info('Error in authentication. Rejecting');
    return unauthorized(res);
  }
};

module.exports = authenticate;
