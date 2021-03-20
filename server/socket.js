const socketio = require('socket.io');
const { Display } = require('./model');
const logger = require('./util/logger');
const eventManager = require('./event-manager');
const config = require('./config');

const SOCKET_EVENT_QUERY_SLIDE = 'querySlide';
const SOCKET_EVENT_SLIDE_CHANGE = 'slideChange';
const SOCKET_EVENT_CHANGE_SLIDE = 'changeSlide';
const SOCKET_EVENT_DISPLAY_UPDATE = 'displayUpdate';
const SOCKET_EVENT_READY = 'ready';

let adminSockets = [];
const displaySockets = {};

const addAdminSocket = socket => {
  adminSockets.push(socket);
  socket.on('disconnect', () => {
    logger.info(`Admin connection disconnected`);
    adminSockets = adminSockets.filter(s => s !== socket);
  });
};

const addDisplaySocket = (displayId, socket) => {
  displaySockets[displayId] = (displaySockets[displayId] || []).concat(socket);
  socket.on('disconnect', () => {
    logger.info(`Display ${displayId} disconnected`);
    displaySockets[displayId] = displaySockets[displayId].filter(
      s => s !== socket
    );
  });
};

const authenticate = async socket => {
  logger.info(`Authenticating connection`);
  const auth = socket.handshake.auth || {};
  const username = auth.username;
  const password = auth.password;

  if (password !== config.password) {
    logger.info(`Invalid password`);
    return null;
  }

  if (username === 'admin') {
    return { isAdmin: true };
  }

  const display = await Display.findOne({ where: { loginName: username } });

  if (!display) {
    logger.info(`Display not found`);
    return null;
  }

  return { isAdmin: false, display };
};

const onQuerySlide = callback => {
  logger.info(
    `Received query for current slide. Responding with ${eventManager.currentSlide}`
  );
  callback(eventManager.currentSlide);
};

const onChangeSlide = direction => {
  logger.info(`Received command to change presentation to ${direction} slide`);
  eventManager.changeSlide(direction);
};

const onSlideChange = io => slideNumber => {
  logger.info(
    `Slide changed to slide number ${slideNumber}. Broadcasting to all connections`
  );
  io.emit(SOCKET_EVENT_SLIDE_CHANGE, slideNumber);
};

const onDisplayUpdate = displayId => {
  logger.info(`Display ${displayId} updated. Informing any connected displays`);
  const sockets = displaySockets[displayId] || [];
  sockets.forEach(socket => socket.emit(SOCKET_EVENT_DISPLAY_UPDATE));
};

const onConnection = async socket => {
  logger.info('New connection');
  const auth = await authenticate(socket);

  if (!auth) {
    logger.info('Could not authenticate connection. Rejecting');
    socket.disconnect(true);
    return;
  }

  socket.on(SOCKET_EVENT_QUERY_SLIDE, onQuerySlide);

  if (auth.isAdmin) {
    logger.info('Admin user connected');
    addAdminSocket(socket);
    socket.on(SOCKET_EVENT_CHANGE_SLIDE, onChangeSlide);
  } else {
    logger.info(`Display ${auth.display.name} connected`);
    addDisplaySocket(auth.display.id, socket);
  }

  socket.emit(SOCKET_EVENT_READY);
};

const createSocket = httpServer => {
  const io = socketio(httpServer);
  io.on('connection', onConnection);

  eventManager.onSlideChange(onSlideChange(io));
  eventManager.onDisplayUpdate(onDisplayUpdate);
};

module.exports = createSocket;
