/** Chess Puzzle */

import * as THREE from 'three';
import Config from '../modules/config';
import Raycaster from '../ui/raycaster';

class ChessPuzzle {
  constructor(root) {
    this.ref = {};
    this.ref.scene = root.ref.scene;
    this.ref.colliderSystem = root.ref.scene.getColliderSystem();
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
    this.hover = false;
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

    // add door blocker
    const wireMat = new THREE.MeshBasicMaterial({color: 0xffffff, wireframe: true});
    this.block = new THREE.Mesh(new THREE.BoxBufferGeometry(3, 4, 1), wireMat);
    this.block.position.set(off.x, off.y, off.z + 5.5);
    this.ref.scene.getScene().add(this.block);
    this.ref.colliderSystem.add(this.block);
  }

  checkSolution(indices) {
    // check
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
          this.grid.children[index].material.color.setHex(0xffffff);
        });
        setTimeout(() => {
          indices.forEach(index => {
            this.grid.children[index].material.color.setHex(0x808080);
          });
          this.active = true;
        }, 125);
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
        indices.forEach(index => {
          this.grid.children[index].material.color.setHex(0xffffff);
        });
        setTimeout(() => {
          indices.forEach(index => {
            this.grid.children[index].material.color.setHex(0x808080);
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

            // remove block
            this.ref.scene.getScene().remove(this.block);
            this.ref.colliderSystem.remove(this.block);
          }, 500);
        }, 125);
      }, 1000);
    }
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
      this.checkSolution(indices);
    }
  }

  onHover(button) {
    this.hover = true;
    if (!button.userData.hover) {
      this.grid.children.forEach(child => {
        if (child.userData.hover) {
          child.userData.hover = false;
          if (!child.userData.active) {
            child.material.color.setHex(0x808080);
          }
        }
      });
      button.userData.hover = true;
      if (!button.userData.active) {
        button.material.color.setHex(0xa0a0a0);
      }
    }
  }

  onMouseLeave() {
    this.grid.children.forEach(child => {
      if (child.userData.hover) {
        child.userData.hover = false;
        if (!child.userData.active) {
          child.material.color.setHex(0x808080);
        }
      }
    });
  }

  onMouseMove(x, y) {
    let res = false;
    if (this.needsUpdate()) {
      const intersects = this.raycaster.intersectObjects(x, y, this.grid.children);
      if (intersects.length) {
        if (this.ref.cameraCamera.position.distanceTo(this.grid.position) >= this.inspectThreshold) {
          this.ref.domTarget.dataset.cursor = 'zoom-in';
          this.onMouseLeave();
        } else {
          this.ref.domTarget.dataset.cursor = 'pointer';
          this.onHover(intersects[0].object);
        }
        res = true;
      }
      if (!res && this.hover) {
        this.onMouseLeave();
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
      isAngle: true,
    });
    this.ref.animationHandler.add({
      duration: dur,
      object: this.ref.controls.rotation.target,
      var: 'yaw',
      to: Math.PI,
      easing: 'ease-in-and-out',
      isAngle: true,
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
