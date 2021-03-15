const { Router } = require('express');
const { Display } = require('../model');
const withError = require('./with-error');

const create = async (req, res) => {
  const { name, loginName } = req.body;
  const display = await Display.create({ name, loginName });
  res.json({
    id: display.id,
    loginName: display.loginName,
  });
};

const router = Router();

router.post('/new', withError(create));

module.exports = router;
