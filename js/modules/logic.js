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

    // temp
    const box = new THREE.BoxBufferGeometry(10, 50, 10);
    const mat = new THREE.MeshPhysicalMaterial({color: 0x888888, metalness: 0, roughness: 0.05});
    const floor = new THREE.Mesh(box, mat);
    floor.position.set(0, -24, 0);
    this.scene.add(floor);
    this.colliderSystem.add(floor);
  }

  update(delta) {
    this.world.update(delta);
    this.player.update(delta);
    this.camera.update(delta);
  }

  draw(delta) {
    this.canvas2D.clear();
    this.world.draw(this.canvas2D.ctx);
  }
}

export default Logic;
