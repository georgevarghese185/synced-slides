const staticFiles = require('./middleware/static-files');
const bodyParser = require('body-parser');
const slidesRouter = require('./router/slides');
const app = require('express')();

app.use(bodyParser.json());
app.use('/api/slides', slidesRouter);

app.use(staticFiles);

module.exports = app;
