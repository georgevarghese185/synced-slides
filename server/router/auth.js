const { Router } = require('express');
const withError = require('./with-error');

const get = async (req, res) => {
  return res.json(req.auth);
};

const router = Router();
router.get('/', withError(get));

module.exports = router;
