/** Chess Puzzle */

import * as THREE from 'three';
import Config from '../modules/config';
import Raycaster from '../ui/raycaster';

class ChessPuzzle {
  constructor(root) {
    this.ref = {};
    this.ref.scene = root.ref.scene;
    this.ref.camera = root.ref.camera;
    this.ref.cameraCamera = root.ref.camera.getCamera();
    this.ref.controls = root.ref.controls;
    this.ref.animationHandler = root.ref.animationHandler;
    this.ref.domTarget = document.querySelector('.canvas--3d');

    // raycaster
    this.raycaster = new Raycaster(this.ref.cameraCamera);

    // settings
    this.inspectThreshold = 5;
    this.maxDistance = 10;
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
    button.userData.active = true;

    const indices = [];
    this.grid.children.forEach((child, index) => {
      if (child.userData.active) {
        indices.push(index);
      }
    });

    // check solution
    if (indices.length >= 5) {
      let res = true;
      [6, 13, 22, 42, 52].forEach(index => {
        if (!indices.includes(index)) {
          res = false;
        }
      });

      // fail
      if (!res) {
        this.active = false;
        indices.forEach(index => {
          this.grid.children[index].userData.active = false;
          this.grid.children[index].material.color.setHex(0xff4040);
        });
        setTimeout(() => {
          indices.forEach(index => {
            this.grid.children[index].material.color.setHex(0x808080);
          });
          this.active = true;
        }, 1000);

      // success
      } else {
        this.active = false;
        this.solved = true;
        indices.forEach(index => {
          this.grid.children[index].userData.active = false;
          this.grid.children[index].material.color.setHex(0x40ff40);
        });

        setTimeout(() => {
          // move door
          const doorTo = this.door.position.clone();
          doorTo.x += -3.129;
          this.ref.animationHandler.add({
            duration: 2,
            object: this.door,
            var: 'position',
            from: this.door.position.clone(),
            to: doorTo,
          });

          // move grid
          const gridTo = this.grid.position.clone();
          gridTo.x += -3.129;
          this.ref.animationHandler.add({
            duration: 2,
            object: this.grid,
            var: 'position',
            from: this.grid.position.clone(),
            to: gridTo,
            callback: () => { console.log('[ChessPuzzle] Puzzle solved'); },
          });
        }, 1000);
      }
    }
  }

  onMouseMove(x, y) {
    let res = false;
    if (this.needsUpdate()) {
      const intersects = this.raycaster.intersectObjects(x, y, this.grid.children);
      if (intersects.length) {
        if (this.ref.cameraCamera.position.distanceTo(this.grid.position) >= this.inspectThreshold) {
          this.ref.domTarget.dataset.cursor = 'zoom-in';
        } else {
          this.ref.domTarget.dataset.cursor = 'pointer';
        }
        res = true;
      }
    }
    return res;
  }

  onClick(x, y) {
    if (this.needsUpdate()) {
      const intersects = this.raycaster.intersectObjects(x, y, this.grid.children);
      if (intersects.length) {
        if (this.ref.cameraCamera.position.distanceTo(this.grid.position) >= this.inspectThreshold) {
          this.inspect();
        } else {
          this.onButton(intersects[0].object);
        }
      }
    }
  }

  inspect() {
    this.ref.controls.disable();
    const d = this.ref.cameraCamera.position.distanceTo(this.grid.position);
    const dur = d / 4;
    this.ref.animationHandler.add({
      duration: dur,
      object: this.ref.controls,
      var: 'positionTarget',
      from: this.ref.controls.positionTarget.clone(),
      to: new THREE.Vector3(100, 0, 3),
      easing: 'ease-out',
      callback: () => { this.ref.controls.enable(); },
    });
    this.ref.animationHandler.add({
      duration: dur,
      object: this.ref.controls.rotation.target,
      var: 'pitch',
      to: 0,
      easing: 'ease-in-and-out',
    });
    this.ref.animationHandler.add({
      duration: dur,
      object: this.ref.controls.rotation.target,
      var: 'yaw',
      to: Math.PI,
      easing: 'ease-in-and-out',
    });
  }

  isActive() {
    return this.active && !this.solved && this.ref.scene.isRoomVisible('sculptors_loft');
  }

  needsUpdate() {
    return this.isActive() &&
      this.ref.cameraCamera.position.z < this.grid.position.z &&
      this.ref.cameraCamera.position.y >= 0 &&
      this.ref.cameraCamera.position.distanceTo(this.grid.position) <= this.maxDistance;
  }
}

export default ChessPuzzle;
