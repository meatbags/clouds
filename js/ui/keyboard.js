/** Keyboard interface.  */

class Keyboard {
  constructor(onEvent) {
    this.keys = {};
    this.onEvent = onEvent;
    document.addEventListener('keydown', evt => { this.onKeyDown(evt); });
    document.addEventListener('keyup', evt => { this.onKeyUp(evt); });
  }

  onKeyDown(evt) {
    this.keys[evt.key] = true;
    this.onEvent(evt.key, evt);
  }

  onKeyUp(evt) {
    this.keys[evt.key] = false;
    this.onEvent(evt.key, evt);
  }

  release(key) {
    this.keys[key] = false;
  }

  isSpecial() {
    return (this.keys['Shift'] || this.keys['Control'] || this.keys['Alt']);
  }

  isControl() {
    return (this.keys['Control']);
  }

  isShift() {
    return (this.keys['Shift']);
  }

  isAlt() {
    return (this.keys['Alt']);
  }
}

export default Keyboard;
