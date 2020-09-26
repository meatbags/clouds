/** Simplified bounding box */

import * as THREE from 'three';
import { subtractVector, isVectorEqual } from '../maths';

class Box extends THREE.Box3 {
  constructor(object) {
    // THREE.Box3 + functions
    super();
    this.setFromBufferAttribute(object.geometry.attributes.position);
    this.position = new THREE.Vector3();
  }

  setPosition(p) {
    // update position if not set
    if (!isVectorEqual(this.position, p)) {
      this.translate(subtractVector(p, this.position));
      this.position = p.clone();
    }
  }

  distanceTo(p) {
    return this.position.distanceTo(p);
  }
}

export default Box;
