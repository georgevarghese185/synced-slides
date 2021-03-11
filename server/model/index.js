const { Sequelize } = require('sequelize');
const config = require('../config');
const Slide = require('./slide');

const sequelize = new Sequelize({
  ...config.db,
});

const slide = Slide(sequelize);

module.exports = {
  slide,
  display,
};
