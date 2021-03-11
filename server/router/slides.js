const { slides } = require('../sequelize');
const { createHash } = require('crypto');
const { Router } = require('express');
const withError = require('./with-error');

const upload = async (req, res) => {
  const { name, data } = req.body;
  const dataBuffer = Buffer.from(data, 'base64');
  const etag = createHash('md5').update(dataBuffer).digest();

  const createdSlide = await slides.create({
    name,
    data: dataBuffer,
    etag: etag.toString('hex').toUpperCase(),
  });

  return res.status(200).json({
    id: createdSlide.id,
    name: createdSlide.name,
    etag: createdSlide.etag,
  });
};

const router = Router();
router.post('/new', withError(upload));

module.exports = router;
