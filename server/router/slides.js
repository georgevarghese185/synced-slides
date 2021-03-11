const models = require('../model');
const { createHash } = require('crypto');
const { Router } = require('express');
const withError = require('./with-error');
const { serverUrl } = require('../config');

const notFound = res => res.status(400).send({ message: 'Slide not found' });

const upload = async (req, res) => {
  const { name, data, type } = req.body;
  const dataBuffer = Buffer.from(data, 'base64');
  const etag = createHash('md5').update(dataBuffer).digest();

  const slide = await models.slide.create({
    name,
    type,
    data: dataBuffer,
    etag: etag.toString('hex').toUpperCase(),
  });

  return res.status(200).json({
    id: slide.id,
    name: slide.name,
    etag: slide.etag,
  });
};

const list = async (req, res) => {
  const slides = await models.slide.findAll();
  res.json({
    slides: slides.map(slide => ({
      id: slide.id,
      name: slide.name,
      etag: slide.etag,
      url: `${serverUrl}/api/slides/${slide.id}`,
    })),
  });
};

const get = async (req, res) => {
  const id = req.params.id;

  const attributes = ['etag', 'type'];

  if (req.method === 'GET') {
    attributes.push('data');
  }

  const slide = await models.slide.findOne({
    where: { id },
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
  const count = await models.slide.count({ where: { id } });

  if (!count) {
    return notFound(res);
  }

  await models.slide.destroy({ where: { id } });
  res.json({ message: 'Deleted' });
};

const router = Router();
router.get('/', withError(list));
router.post('/new', withError(upload));
router.get('/:id', withError(get));
router.delete('/:id', withError(deleteSlide));

module.exports = router;
