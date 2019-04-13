/** Game logic. */

import Config from '../config';
import Player from './player';
import Camera from './camera';

class Logic {
  constructor() {
    this.width = Config.width;
    this.height = Config.height;
    this.scene = new THREE.Scene();
    this.colliderSystem = new Collider.System();
    this.player = new Player(this);
    this.camera = new Camera(this);

    // temp
    for (var i=0; i<100; i++) {
      const w = Math.random() * 3 + 3;
      const block = new THREE.Mesh(new THREE.BoxBufferGeometry(w, 2, w), new THREE.MeshPhysicalMaterial({color: 0x888888}));
      block.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      block.position.set(Math.random() * -50 + 25, Math.random() * 2 - 1, Math.random() * -50 + 25);
      this.scene.add(block);
      this.colliderSystem.add(block);
    }
    const floor = new THREE.Mesh(new THREE.BoxBufferGeometry(50, 2, 50), new THREE.MeshPhysicalMaterial({color: 0x888888}));
    const ambient = new THREE.AmbientLight(0xffffff, 0.05);
    const point = new THREE.PointLight(0xffffff, 1, 50, 2);
    point.position.y = 10;
    this.scene.add(floor, ambient, point);

    // collisions
    this.colliderSystem.add(floor);
  }

  update(delta) {
    this.player.update(delta);
    this.camera.update(delta);
  }
}

export default Logic;
