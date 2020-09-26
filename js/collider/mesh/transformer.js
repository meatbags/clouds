/** Transform vertex data */

import * as THREE from 'three';
import * as Maths from '../maths';

class Transformer {
  constructor(object) {
    // bake initial transformations into vertex data
    this.point = new THREE.Vector3();
    this.position = object.position;
    this.rotation = object.rotation;
    this.scale = object.scale;
    this.rotationOrder = object.rotation.order.split('');
    this.axis = {
      x: new THREE.Vector3(1, 0, 0),
      y: new THREE.Vector3(0, 1, 0),
      z: new THREE.Vector3(0, 0, 1)
    };
    this.checkDefault();
  }

  set(point) {
    // transform point
    this.point.x = point.x - this.position.x;
    this.point.y = point.y - this.position.y;
    this.point.z = point.z - this.position.z;
  }

  getTransformedPoint(point) {
    const transformed = {
      x: point.x - this.position.x,
      y: point.y - this.position.y,
      z: point.z - this.position.z
    };

    return transformed;
  }

  getReverseTransformedPoint(point) {
    const transformed = {
      x: point.x + this.position.x,
      y: point.y + this.position.y,
      z: point.z + this.position.z
    };

    return transformed;
  }

  getReverseTransformedY(y) {
    return y + this.position.y;
  }

  getPosition() {
    return this.position;
  }

  bakeRotation(plane) {
    for (let i=this.rotationOrder.length-1, end=-1; i>end; --i) {
      if (this.rotationOrder[i] == 'X') {
        plane.p1.applyAxisAngle(this.axis.x, this.rotation.x);
        plane.p2.applyAxisAngle(this.axis.x, this.rotation.x);
        plane.p3.applyAxisAngle(this.axis.x, this.rotation.x);
        plane.n1.applyAxisAngle(this.axis.x, this.rotation.x);
        plane.n2.applyAxisAngle(this.axis.x, this.rotation.x);
        plane.n3.applyAxisAngle(this.axis.x, this.rotation.x);
      }
      else if (this.rotationOrder[i] == 'Y') {
        plane.p1.applyAxisAngle(this.axis.y, this.rotation.y);
        plane.p2.applyAxisAngle(this.axis.y, this.rotation.y);
        plane.p3.applyAxisAngle(this.axis.y, this.rotation.y);
        plane.n1.applyAxisAngle(this.axis.y, this.rotation.y);
        plane.n2.applyAxisAngle(this.axis.y, this.rotation.y);
        plane.n3.applyAxisAngle(this.axis.y, this.rotation.y);
      }
      else if (this.rotationOrder[i] == 'Z') {
        plane.p1.applyAxisAngle(this.axis.z, this.rotation.z);
        plane.p2.applyAxisAngle(this.axis.z, this.rotation.z);
        plane.p3.applyAxisAngle(this.axis.z, this.rotation.z);
        plane.n1.applyAxisAngle(this.axis.z, this.rotation.z);
        plane.n2.applyAxisAngle(this.axis.z, this.rotation.z);
        plane.n3.applyAxisAngle(this.axis.z, this.rotation.z);
      }
    }
  }

  bakeScale(plane) {
    plane.p1 = Maths.scaleByVector(plane.p1, this.scale);
    plane.p2 = Maths.scaleByVector(plane.p2, this.scale);
    plane.p3 = Maths.scaleByVector(plane.p3, this.scale);
  }

  checkDefault() {
    // check if transforms are set to default
    this.default = {
      position: (this.position.x == 0 && this.position.y == 0 && this.position.z == 0),
      rotation: (this.rotation.x == 0 && this.rotation.y == 0 && this.rotation.z == 0),
      scale: (this.scale.x == 1 && this.scale.y == 1 && this.scale.z == 1)
    };
  }
}

export default Transformer;
