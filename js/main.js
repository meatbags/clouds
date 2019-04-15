/** App init and main loop. */

import Logic from './modules/logic';
import Renderer from './modules/renderer';
import ControlSurface from './modules/control_surface';
import Menu from './overlay/menu';

class App {
  constructor() {
    // init
    this.logic = new Logic();
    this.renderer = new Renderer(this);
    this.controlSurface = new ControlSurface(this);
    this.menu = new Menu();

    // timing
    this.time = {
      now: performance.now(),
      maxDelta: 0.1
    };

    // run
    window.dispatchEvent(new Event('resize'));
    this.active = true;
    this.loop();
  }

  loop() {
    requestAnimationFrame(() => { this.loop(); });
    if (this.active) {
      const t = performance.now();
      const delta = Math.min(this.time.maxDelta, (t - this.time.now) / 1000);
      this.time.now = t;
      this.logic.update(delta);
      this.renderer.render(delta);
      this.logic.draw(delta);
    }
  }
}

window.onload = () => {
  const app = new App();
};
