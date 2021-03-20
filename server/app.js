const bodyParser = require('body-parser');
const staticFiles = require('./middleware/static-files');
const requestLogger = require('./middleware/request-logger');
const slidesRouter = require('./router/slides');
const displaysRouter = require('./router/displays');
const app = require('express')();
const createSocket = require('./socket');
const httpServer = require('http').createServer(app);

app.use(bodyParser.json());
app.use(requestLogger());

app.use('/api/slides', slidesRouter);
app.use('/api/displays', displaysRouter);

app.use(staticFiles);

createSocket(httpServer);

module.exports = httpServer;
