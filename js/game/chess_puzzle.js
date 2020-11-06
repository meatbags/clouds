/** Chess Puzzle */

import * as THREE from 'three';
import Config from '../modules/config';
import Raycaster from '../ui/raycaster';

class ChessPuzzle {
  constructor(scene, camera) {
    this.ref = {};
    this.ref.scene = scene;
    this.ref.camera = camera;
    this.ref.cameraCamera = camera.getCamera();
    this.ref.domTarget = document.querySelector('.canvas--3d');

    // raycaster
    this.raycaster = new Raycaster(this.ref.cameraCamera);

    // settings
    this.inspectThreshold = 5;
    this.maxDistance = 8;
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
    const p = new THREE.Vector3(0.4375, 2.4375, 0);
    const off = Config.Scene.offset.sculptors_loft;

    // create button grid
    for (let x=0; x<8; x++) {
      for (let y=0; y<8; y++) {
        const mesh = button.clone();
        mesh.material = mesh.material.clone();
        mesh.position.x = p.x - x * 0.125;
        mesh.position.y = p.y - y * 0.125;
        mesh.position.z = p.z;
        this.grid.add(mesh);
      }
    }

    // set grid position
    this.grid.position.set(off.x, off.y, off.z + 5.3125);
    scene.add(this.grid);

    // get door mesh
    this.door = scene.getObjectByName('sculptors_door');
  }

  onButton(button) {
    button.material.color.setHex(0xffffff);
  }

  onMouseMove(x, y) {
    if (this.needsUpdate()) {
      const intersects = this.raycaster.intersectObjects(x, y, this.grid.children);
      if (intersects.length) {
        if (this.ref.cameraCamera.position.distanceTo(this.grid.position) > this.inspectThreshold) {
          this.ref.domTarget.dataset.cursor = 'zoom-in';
        } else {
          this.ref.domTarget.dataset.cursor = 'pointer';
        }
      } else {
        this.ref.domTarget.dataset.cursor = '';
      }
    }
  }

  onMouseDown(x, y) {
    if (this.needsUpdate()) {
      const intersects = this.raycaster.intersectObjects(x, y, this.grid.children);
      if (intersects.length) {
        this.onButton(intersects[0].object);
      }
    }
  }

  needsUpdate() {
    return this.active && !this.solved &&
      this.ref.cameraCamera.position.z < this.grid.position.z &&
      this.ref.cameraCamera.position.y >= 0 &&
      this.ref.cameraCamera.position.distanceTo(this.grid.position) <= this.maxDistance;
  }

  update(delta) {
    // if (this.needsUpdate()) {}
  }
}

export default ChessPuzzle;
