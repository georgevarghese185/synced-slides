const db = require('../sequelize');
const { createHash } = require('crypto');
const { Router } = require('express');
const withError = require('./with-error');

const upload = async (req, res) => {
  const { name, data, type } = req.body;
  const dataBuffer = Buffer.from(data, 'base64');
  const etag = createHash('md5').update(dataBuffer).digest();

  const slide = await db.slides.create({
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

const router = Router();
router.post('/new', withError(upload));

module.exports = router;
