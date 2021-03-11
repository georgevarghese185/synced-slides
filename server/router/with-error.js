const logger = require('../util/logger');

const withError = middleware => async (req, res, next) => {
  try {
    await middleware(req, res, next);
  } catch (e) {
    logger.error(e);
    res.status(500).json({ message: e.message });
  }
};

module.exports = withError;
