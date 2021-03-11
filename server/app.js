const bodyParser = require('body-parser');
const staticFiles = require('./middleware/static-files');
const requestLogger = require('./middleware/request-logger');
const slidesRouter = require('./router/slides');
const app = require('express')();

app.use(bodyParser.json());
app.use(requestLogger());

app.use('/api/slides', slidesRouter);

app.use(staticFiles);

module.exports = app;
