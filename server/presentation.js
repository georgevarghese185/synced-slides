const events = require('./events');

export class Presentation {
  constructor(eventEmitter) {
    this.slide = 0;
    this.events = eventEmitter;
  }

  nextSlide() {
    this.slide++;
    this.emit();
  }

  previousSlide() {
    this.slide = Math.max(this.slide - 1, 0);
    this.emit();
  }

  emit() {
    this.events.emit(events.SLIDE_CHANGE, this.slide);
  }
}
