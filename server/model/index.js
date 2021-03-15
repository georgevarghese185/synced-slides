const { Sequelize } = require('sequelize');
const config = require('../config');
const Display = require('./display');
const Slide = require('./slide');
const DisplaySlides = require('./display-slides');

const sequelize = new Sequelize({
  ...config.db,
});

const slide = Slide(sequelize);
const display = Display(sequelize);
const displaySlides = DisplaySlides(sequelize);

slide.belongsToMany(display, { through: displaySlides });
display.belongsToMany(slide, { through: displaySlides });

module.exports = {
  Slide: slide,
  Display: display,
  sequelize,
};
