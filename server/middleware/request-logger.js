const morgan = require('morgan');
const logger = require('../util/logger');

const requestLogger = () => {
  const streamWrite = async str => {
    logger.info(str.replace(/\n$/, ''));
  };

  return morgan('tiny', { stream: { write: streamWrite } });
};

module.exports = requestLogger;
