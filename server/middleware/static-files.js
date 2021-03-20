const express = require('express');

const staticMiddleware = express.static('./dist');

module.exports = (req, res, next) => {
  if (req.auth.isAdmin && !req.url.startsWith('/admin')) {
    return res.redirect('/admin');
  } else if (!req.auth.isAdmin && !req.url.startsWith('/display')) {
    return res.redirect('/display');
  }

  staticMiddleware(req, res, () => {
    req.url = '/';
    staticMiddleware(req, res, next);
  });
};
