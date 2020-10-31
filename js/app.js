/** App init and main loop. */

import Camera from './modules/camera';
import Controls from './modules/controls';
import HUD from './modules/hud';
import Loop from './modules/loop';
import Renderer from './modules/renderer';
import Scene from './modules/scene';
import Materials from './modules/materials';
import Geometry from './modules/geometry';

class App {
  constructor() {
    this.modules = {
      camera: new Camera(),
      controls: new Controls(),
      hud: new HUD(),
      loop: new Loop(),
      renderer: new Renderer(),
      scene: new Scene(),
      materials: new Materials(),
      geometry: new Geometry(),
    };

    // bind modules
    Object.keys(this.modules).forEach(key => {
      if (typeof this.modules[key].bind === 'function') {
        this.modules[key].bind(this);
      }
    });

    // start
    this.modules.loop.resume();
  }
}

window.addEventListener('load', () => {
  const app = new App();
});
