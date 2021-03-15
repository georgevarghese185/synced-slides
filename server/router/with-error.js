const logger = require('../util/logger');

const withError = middleware => async (req, res, next) => {
  try {
    await middleware(req, res, next);
  } catch (e) {
    logger.error(e);

    let errorMessage;
    if (e.errors) {
      e.errors.forEach(e => logger.error(e));
      errorMessage = e.errors.map(e => e.message).join(', ');
    } else {
      errorMessage = e.message;
    }

    res.status(500).json({ message: errorMessage });
  }
};

module.exports = withError;
