/** Game logic. */

import Config from '../config';
import Player from './player';
import Camera from './camera';
import World from './world';

class Logic {
  constructor() {
    this.width = Config.width;
    this.height = Config.height;
    this.scene = new THREE.Scene();
    this.colliderSystem = new Collider.System();
    this.player = new Player(this);
    this.camera = new Camera(this);
    this.world = new World(this);

    // temp
    const floor = new THREE.Mesh(new THREE.BoxBufferGeometry(10, 2, 10), new THREE.MeshPhysicalMaterial({color: 0x888888}));
    this.scene.add(floor);
    this.colliderSystem.add(floor);
  }

  update(delta) {
    this.world.update(delta);
    this.player.update(delta);
    this.camera.update(delta);
  }
}

export default Logic;
