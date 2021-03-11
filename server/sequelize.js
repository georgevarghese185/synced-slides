const { Sequelize } = require('sequelize');
const config = require('./config');
const Slide = require('./model/slide');

const sequelize = new Sequelize({
  ...config.db,
});

const slides = Slide(sequelize);

module.exports = {
  slides,
};
