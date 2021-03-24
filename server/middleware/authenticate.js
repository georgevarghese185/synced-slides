const config = require('../config');
const { Display } = require('../model');
const logger = require('../util/logger');

const unauthorized = (res, next) => {
  if (res) {
    return res
      .status(401)
      .set('WWW-Authenticate', 'Basic')
      .send('Please login');
  } else {
    next(new Error('Unauthorized'));
  }
};

const authenticate = async (req, res, next) => {
  logger.info('Authenticating request');
  const authorization = (req.headers || req.handshake.headers).authorization;

  if (!authorization) {
    logger.info('No authorization header. Rejecting');
    return unauthorized(res, next);
  }

  try {
    const credentialsBase64 = authorization.replace('Basic ', '');
    const credentials = Buffer.from(credentialsBase64, 'base64').toString();

    const [username, password] = credentials.split(':');

    if (password !== config.password) {
      logger.info('Invalid password. Rejecting');
      return unauthorized(res, next);
    }

    if (username === 'admin') {
      logger.info('Request from Admin');
      req.auth = { isAdmin: true };
    } else {
      logger.info('Request from display');
      const display = await Display.findOne({ where: { loginName: username } });

      if (!display) {
        logger.info('Unknown display name. Rejecting');
        return unauthorized(res, next);
      }

      logger.info(`Request from dispay ${display.name}`);
      req.auth = { isAdmin: false, display };
    }

    return next();
  } catch (e) {
    logger.error(e);
    logger.info('Error in authentication. Rejecting');
    return unauthorized(res, next);
  }
};

module.exports = authenticate;
