const { Sequelize } = require('sequelize');
const config = require('../config');
const Display = require('./display');
const Slide = require('./slide');

const sequelize = new Sequelize({
  ...config.db,
});

const slide = Slide(sequelize);
const display = Display(sequelize);

module.exports = {
  slide,
  display,
};
