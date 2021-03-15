const socketio = require('socket.io');
const { SLIDE_CHANGE, DISPLAY_UPDATE } = require('./events');
const { Display, Slide } = require('./model');
const logger = require('./util/logger');

const QUERY_DISPLAY = 'query_display';
const EVENT_SLIDE = 'event_slide';
const EVENT_DISPLAY_UPDATE = 'event_display_update';

const subscribe = (events, socket, event, handler) => {
  events.on(event, handler);

  socket.on('disconnect', () => {
    events.off(event, handler);
  });
};

const queryDisplay = socket =>
  new Promise(resolve => {
    socket.emit(QUERY_DISPLAY, async displayId => {
      const display = await Display.findOne({ where: { id: displayId } });
      resolve(display);
    });
  });

const onSlideChange = socket => slideNumber => {
  socket.emit(EVENT_SLIDE, slideNumber);
};

const onDisplayUpdate = (socket, display) => async displayId => {
  if (displayId !== display.id) {
    return;
  }

  const updatedDisplay = await Display.findOne({
    where: { id: displayId },
    include: {
      model: Slide,
      attributes: ['id', 'name', 'type'],
    },
  });

  socket.emit(EVENT_DISPLAY_UPDATE, {
    id: updatedDisplay.id,
    name: updatedDisplay.name,
    loginName: updatedDisplay.loginName,
    slides: updatedDisplay.slides.map(slide => ({
      id: slide.id,
      name: slide.name,
      type: slide.type,
    })),
  });
};

const onConnection = events => async socket => {
  logger.info('New socket connection');

  const display = await queryDisplay(socket);

  if (!display) {
    logger.warn('Unkown display. Ignoring');
    return;
  }

  logger.info(`Display connected: ${display.id}, ${display.name}`);

  subscribe(events, socket, SLIDE_CHANGE, onSlideChange(socket));
  subscribe(events, socket, DISPLAY_UPDATE, onDisplayUpdate(socket, display));
};

const createSocket = (httpServer, events) => {
  const io = socketio(httpServer);

  io.on('connection', onConnection);
};

module.exports = createSocket;
