const { Sequelize } = require('sequelize');
const config = require('../config');
const Display = require('./display');
const Slide = require('./slide');
const DisplaySlide = require('./display-slide');

const sequelize = new Sequelize({
  ...config.db,
});

const slide = Slide(sequelize);
const display = Display(sequelize);
const displaySlide = DisplaySlide(sequelize);

slide.belongsToMany(display, { through: displaySlide });
display.belongsToMany(slide, { through: displaySlide });

module.exports = {
  Slide: slide,
  Display: display,
  DisplaySlide: displaySlide,
  sequelize,
};
