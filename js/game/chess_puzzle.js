/** Chess Puzzle */

import * as THREE from 'three';
import Config from '../modules/config';

class ChessPuzzle {
  constructor(scene, camera) {
    this.ref = {};
    this.ref.scene = scene;
    this.ref.camera = camera;

    // settings
    this.active = true;
    this.solved = false;

    // init
    this.buildGrid();
  }

  buildGrid() {
    this.grid = new THREE.Group();

    // get button
    const scene = this.ref.scene.getScene();
    const button = scene.getObjectByName('chess_puzzle_button');
    button.parent.remove(button);
    const p = new THREE.Vector3(0.4375, 2.4375, 5.3125);
    const off = Config.Scene.offset.sculptors_loft;

    // create button grid
    for (let x=0; x<8; x++) {
      for (let y=0; y<8; y++) {
        const mesh = button.clone();
        mesh.material = mesh.material.clone();
        mesh.position.x = p.x - x * 0.125 + off.x;
        mesh.position.y = p.y - y * 0.125 + off.y;
        mesh.position.z = p.z + off.z;
        this.grid.add(mesh);
      }
    }

    scene.add(this.grid);
    this.door = scene.getObjectByName('sculptors_door');
  }

  update(delta) {

  }
}

export default ChessPuzzle;
