/** Game logic. */

import Player from './player';
import Camera from './camera';
import World from './world';
import Canvas2D from './canvas_2d';

class Logic {
  constructor() {
    this.scene = new THREE.Scene();
    this.colliderSystem = new Collider.System();
    this.player = new Player(this);
    this.camera = new Camera(this);
    this.world = new World(this);
    this.canvas2D = new Canvas2D();

    // settings
    // sky 0x111823 prussian blue 0x003153
    this.scene.fog = new THREE.FogExp2(0x111823, 0.004);
  }

  update(delta) {
    this.world.update(delta);
    this.player.update(delta);
    this.camera.update(delta);
  }

  draw(delta) {
    this.canvas2D.clear();
    this.canvas2D.setStyle();
    this.world.draw(this.canvas2D.ctx);
    if (this.player.noclip) {
      this.canvas2D.ctx.fillText('[noclip]', 20, this.canvas2D.cvs.height - 20);
    }
  }
}

export default Logic;
