const { Router } = require('express');
const { Op } = require('sequelize');
const { sequelize, Display, Slide } = require('../model');
const withError = require('./with-error');

const notFound = res => res.json({ message: 'Display not found' });

const duplicate = res =>
  res.json({ message: 'A display with that name already exists' });

const create = async (req, res) => {
  const { name, loginName, slides } = req.body;
  const transaction = await sequelize.transaction();

  const existingDisplay = await Display.findOne({
    where: {
      [Op.or]: [{ name }, { loginName }],
    },
  });

  if (existingDisplay) {
    return duplicate(res);
  }

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
    include: {
      model: Slide,
      attributes: ['id', 'name', 'type'],
    },
  });

  res.json({
    id: display.id,
    name: display.name,
    loginName: display.loginName,
    slides: display.slides.map(slide => ({
      id: slide.id,
      name: slide.name,
      type: slide.type,
    })),
  });
};

const list = async (req, res) => {
  const displays = await Display.findAll({
    include: {
      model: Slide,
      attributes: ['id', 'name', 'type'],
    },
  });

  res.json({
    displays: displays.map(display => ({
      id: display.id,
      name: display.name,
      loginName: display.loginName,
      slides: display.slides.map(slide => ({
        id: slide.id,
        name: slide.name,
        type: slide.type,
      })),
    })),
  });
};

const get = async (req, res) => {
  const id = req.params.id;

  const display = await Display.findOne({
    where: { id },
    include: {
      model: Slide,
      attributes: ['id', 'name', 'type'],
    },
  });

  if (!display) {
    return notFound(res);
  }

  res.json({
    id: display.id,
    name: display.name,
    loginName: display.loginName,
    slides: display.slides.map(slide => ({
      id: slide.id,
      name: slide.name,
      type: slide.type,
    })),
  });
};

const update = async (req, res) => {
  const id = req.params.id;
  const { name, loginName, slides } = req.body;

  const display = await Display.findOne({
    where: { id },
    include: {
      model: Slide,
      attributes: ['id', 'name', 'type'],
    },
  });

  const transaction = await sequelize.transaction();

  if (!display) {
    return notFound(res);
  }

  if (name) {
    display.name = name;
  }

  if (loginName) {
    const existingDisplay = await Display.findOne({
      where: { loginName, id: { [Op.not]: id } },
    });

    if (existingDisplay) {
      return duplicate(res);
    }

    display.loginName = loginName;
  }

  if (slides) {
    await display.setSlides(slides, { transaction });
  }

  await display.save({ transaction });

  await transaction.commit();

  return get(req, res);
};

const deleteDisplay = async (req, res) => {
  const id = req.params.id;

  const display = await Display.findOne({
    where: { id },
    include: {
      model: Slide,
      attributes: ['id', 'name', 'type'],
    },
  });

  if (!display) {
    return notFound(res);
  }

  await display.destroy();

  res.json({ message: 'Deleted' });
};

const router = Router();

router.get('/', withError(list));
router.post('/new', withError(create));
router.get('/:id', withError(get));
router.post('/:id', withError(update));
router.delete('/:id', withError(deleteDisplay));

module.exports = router;
