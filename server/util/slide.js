const config = require('../config');

const slideUrl = slide => {
  return `${config.serverUrl}/api/slides/image/${slide.uuid}`;
};

module.exports = {
  slideUrl,
}