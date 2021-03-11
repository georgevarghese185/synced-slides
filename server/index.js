const app = require('./app');
const logger = require('./util/logger');
const config = require('./config');

app.listen(config.port, () => {
  logger.info(`Server running on port ${config.port}`);
});
