/** Raycaster for 3d mouse interaction. */

import * as THREE from 'three';

class Raycaster {
  constructor(camera) {
    this.domElement = document.querySelector('.canvas--3d');
    this.camera = camera;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    // dom
    window.addEventListener('resize', () => { this.resize(); });
    this.resize();
  }

  resize() {
    this.rect = this.domElement.getBoundingClientRect();
  }

  intersectObjects(x, y, objects) {
    this.mouse.x = (x / this.rect.width) * 2 - 1;
    this.mouse.y = -((y / this.rect.height) * 2 - 1);
    this.raycaster.setFromCamera(this.mouse, this.camera);
    return this.raycaster.intersectObjects(objects);
  }

  intersectsObject(x, y, object) {
    this.mouse.x = (x / this.rect.width) * 2 - 1;
    this.mouse.y = -((y / this.rect.height) * 2 - 1);
    this.raycaster.setFromCamera(this.mouse, this.camera);
    return (this.raycaster.intersectObject(object).length > 0);
  }
}

export default Raycaster;
