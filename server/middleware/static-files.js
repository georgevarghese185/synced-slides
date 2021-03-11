const express = require('express');

const staticMiddleware = express.static('./dist');

module.exports = (req, res, next) => {
  staticMiddleware(req, res, () => {
    req.url = '/';
    staticMiddleware(req, res, next);
  });
};
