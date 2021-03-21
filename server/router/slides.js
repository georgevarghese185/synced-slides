const { Slide } = require('../model');
const { createHash } = require('crypto');
const { Router } = require('express');
const withError = require('./with-error');
const { serverUrl } = require('../config');
const { Op } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

const notFound = res => res.status(400).send({ message: 'Slide not found' });

const duplicate = res =>
  res.status(409).json({ message: 'A slide with that name already exists' });

const slideExists = async (name, id) => {
  const where = { name };

  if (id) {
    where.id = { [Op.not]: id };
  }

  const count = await Slide.count({ where });
  return count !== 0;
};

const slideUrl = slide => {
  return `${serverUrl}/api/slides/image/${slide.uuid}`;
};

const decodeData = data => {
  const buffer = Buffer.from(data, 'base64');
  const etag = createHash('md5')
    .update(buffer)
    .digest()
    .toString('hex')
    .toUpperCase();

  return { buffer, etag };
};

const upload = async (req, res) => {
  const { name, data, type } = req.body;
  const { buffer, etag } = decodeData(data);

  if (await slideExists(name)) {
    return duplicate(res);
  }

  const slide = await Slide.create({
    uuid: uuidv4(),
    name,
    type,
    data: buffer,
    etag,
  });

  return res.status(200).json({
    id: slide.id,
    type: slide.type,
    name: slide.name,
    etag: slide.etag,
    url: slideUrl(slide),
  });
};

const update = async (req, res) => {
  const id = parseInt(req.params.id);
  const { name, data, type } = req.body;

  const slide = await Slide.findOne({ where: { id } });

  if (!slide) {
    return notFound(res);
  }

  if (name) {
    if (await slideExists(name, id)) {
      return duplicate(res);
    }

    slide.name = name;
  }

  if (data) {
    const { buffer, etag } = decodeData(data);
    slide.data = buffer;
    slide.etag = etag;
    slide.uuid = uuidv4();
  }

  if (type) {
    slide.type = type;
  }

  await slide.save();

  return res.json({
    id: slide.id,
    type: slide.type,
    name: slide.name,
    etag: slide.etag,
    url: slideUrl(slide),
  });
};

const list = async (req, res) => {
  const slides = await Slide.findAll({
    order: [['name']],
    attributes: ['id', 'uuid', 'name', 'type', 'etag'],
  });
  res.json({
    slides: slides.map(slide => ({
      id: slide.id,
      name: slide.name,
      type: slide.type,
      etag: slide.etag,
      url: slideUrl(slide),
    })),
  });
};

const get = async (req, res) => {
  const id = parseInt(req.params.id);

  const slide = await Slide.findOne({
    where: { id },
    attributes: ['id', 'uuid', 'name', 'type', 'etag'],
  });

  if (!slide) {
    return notFound(res);
  }

  return res.json({
    id: slide.id,
    name: slide.name,
    type: slide.type,
    etag: slide.etag,
    url: slideUrl(slide),
  });
};

const image = async (req, res) => {
  const uuid = req.params.uuid;

  const attributes = ['etag', 'type'];

  if (req.method === 'GET') {
    attributes.push('data');
  }

  const slide = await Slide.findOne({
    where: { uuid },
    attributes,
  });

  if (!slide) {
    return notFound(res);
  }

  res.set('Content-Type', slide.type);
  res.set('ETag', `W/"${slide.etag}"`);
  res.set('Cache-Control', 'must-revalidate');
  res.send(slide.data);
};

const deleteSlide = async (req, res) => {
  const id = parseInt(req.params.id);
  const count = await Slide.count({ where: { id } });

  if (!count) {
    return notFound(res);
  }

  await Slide.destroy({ where: { id } });
  res.json({ message: 'Deleted' });
};

const router = Router();
router.get('/', withError(list));
router.post('/new', withError(upload));
router.get('/:id', withError(get));
router.get('/image/:uuid', withError(image));
router.patch('/:id', withError(update));
router.delete('/:id', withError(deleteSlide));

module.exports = router;
