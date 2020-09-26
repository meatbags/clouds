/** Loop */

class Loop {
  constructor() {
    this.active = false;
    this.toUpdate = [];
    this.toRender = [];
    this.time = {now: 0, deltaMax: 0.1};
  }

  bind(root) {
    // get update / render targets
    Object.keys(root.modules).forEach(key => {
      if (typeof root.modules[key].update === 'function') {
        this.toUpdate.push(root.modules[key]);
      }
      if (typeof root.modules[key].render === 'function') {
        this.toRender.push(root.modules[key]);
      }
    });

    // run loop
    this.time.now = performance.now();
    this._loop();
  }

  resume() {
    this.time.now =performance.now();
    this.active = true;
  }

  pause() {
    this.active = false;
  }

  _loop() {
    requestAnimationFrame(() => {
      this._loop();
    });

    if (this.active) {
      const now = performance.now();
      const delta = Math.min(this.time.deltaMax, (now - this.time.now) / 1000);
      this.time.now = now;
      this.toUpdate.forEach(obj => { obj.update(delta); });
      this.toRender.forEach(obj => { obj.render(delta); });
    }
  }
}

export default Loop;
