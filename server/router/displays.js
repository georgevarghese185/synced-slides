const { Router } = require('express');
const { sequelize, Display, Slide } = require('../model');
const withError = require('./with-error');

const create = async (req, res) => {
  const { name, loginName, slides } = req.body;
  const transaction = await sequelize.transaction();

  let display = await Display.create(
    {
      name,
      loginName,
    },
    { transaction }
  );

  await display.addSlides(slides, { transaction, timestamps: true });

  await transaction.commit();

  display = await Display.findOne({
    where: { id: display.id },
    include: Slide,
  });

  res.json({
    id: display.id,
    loginName: display.loginName,
    slides: display.slides.map(slide => ({
      id: slide.id,
      name: slide.name,
      type: slide.type,
    })),
  });
};

const router = Router();

router.post('/new', withError(create));

module.exports = router;
