const { EventEmitter } = require('events');

const EVENT_SLIDE_CHANGE = 'slideChange';
const EVENT_DISPLAY_UPDATE = 'displayUpdate';

class EventManager extends EventEmitter {
  constructor() {
    super();
    this._slide = 0;
  }

  get currentSlide() {
    return this._slide;
  }

  onSlideChange(callback) {
    this.on(EVENT_SLIDE_CHANGE, callback);
  }

  onDisplayUpdate(callback) {
    this.on(EVENT_DISPLAY_UPDATE, callback);
  }

  changeSlide(direction) {
    if (direction === 'next') {
      this._nextSlide();
    } else if (direction === 'previous') {
      this._previousSlide();
    }
  }

  displayUpdate(displayId) {
    this.emit(EVENT_DISPLAY_UPDATE, displayId);
  }

  _nextSlide() {
    this._slide++;
    this._emitSlide();
  }

  _previousSlide() {
    this._slide = Math.max(this._slide - 1, 0);
    this._emitSlide();
  }

  _emitSlide() {
    this.emit(EVENT_SLIDE_CHANGE, this._slide);
  }
}

module.exports = new EventManager();
