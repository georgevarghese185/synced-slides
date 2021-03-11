const { Router } = require('express');
const models = require('../model');
const withError = require('./with-error');

const create = async (req, res) => {
  const { name, loginName } = req.body;
  const display = await models.display.create({ name, loginName });
  res.json({
    id: display.id,
    loginName: display.loginName,
  });
};

const router = Router();

router.post('/new', withError(create));

module.exports = router;
