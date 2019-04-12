/** Game logic. */
import Player from './player';
import Camera from './camera';

class Logic {
  constructor() {
    this.width = 800;
    this.height = 600;
    this.scene = new THREE.Scene();
    this.collider = new Collider.System();
    this.player = new Player(this);
    this.camera = new Camera(this);

    // temp
    const floor = new THREE.Mesh(new THREE.BoxBufferGeometry(50, 2, 50), new THREE.MeshPhysicalMaterial({color: 0x888888}));
    const block = new THREE.Mesh(new THREE.BoxBufferGeometry(4, 2, 4), new THREE.MeshPhysicalMaterial({color: 0x888888}));
    const ambient = new THREE.AmbientLight(0xffffff, 0.05);
    const point = new THREE.PointLight(0xffffff, 1, 20, 2);
    point.position.y = 10;
    block.position.set(5, 2, 5);
    this.scene.add(floor, block, ambient, point);

    // collisions
    this.collider.add(floor, block);
  }

  update(delta) {
    this.player.update(delta);
    this.camera.update(delta);
  }
}

export default Logic;
