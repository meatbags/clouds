/** Plane */

import * as THREE from 'three';
import * as Maths from '../maths/general';
import Config from '../config';

class Plane {
  constructor(p1, p2, p3, n1, n2, n3) {
    this.p1 = p1;
    this.p2 = p2;
    this.p3 = p3;
    this.n1 = n1;
    this.n2 = n2;
    this.n3 = n3;
    this.culled = false;

    // set first state
    this.generatePlane();
  }

  generatePlane() {
    // generate plane data
    this.e1 = {};
    this.e2 = {};
    this.e3 = {};
    this.e1.centre = Maths.scaleVector(Maths.addVector(this.p1, this.p2), 0.5);
    this.e2.centre = Maths.scaleVector(Maths.addVector(this.p2, this.p3), 0.5);
    this.e3.centre = Maths.scaleVector(Maths.addVector(this.p3, this.p1), 0.5);
    this.e1.vec = Maths.subtractVector(this.p2, this.p1);
    this.e2.vec = Maths.subtractVector(this.p3, this.p2);
    this.e3.vec = Maths.subtractVector(this.p1, this.p3);

    // 2D component & 2D normal
    this.e1.vec2 = new THREE.Vector2(this.e1.vec.x, this.e1.vec.z);
    this.e2.vec2 = new THREE.Vector2(this.e2.vec.x, this.e2.vec.z);
    this.e3.vec2 = new THREE.Vector2(this.e3.vec.x, this.e3.vec.z);
    this.e1.norm2 = new THREE.Vector2(-this.e1.vec.z, this.e1.vec.x);
    this.e2.norm2 = new THREE.Vector2(-this.e2.vec.z, this.e2.vec.x);
    this.e3.norm2 = new THREE.Vector2(-this.e3.vec.z, this.e3.vec.x);

    // normal
    this.normal = Maths.normalise(Maths.crossProduct(this.e3.vec, this.e1.vec));
    this.normalXZ = new THREE.Vector3(this.normal.x, 0, this.normal.z);

    // reverse naughty normals
    if (
      Maths.dotProduct(this.normal, this.n1) < 0 &&
      Maths.dotProduct(this.normal, this.n2) < 0 &&
      Maths.dotProduct(this.normal, this.n3) < 0
    ) {
      this.normal = Maths.reverseVector(this.normal);
    }

    // position
    this.position = new THREE.Vector3(
      (this.p1.x + this.p2.x + this.p3.x) / 3,
      (this.p1.y + this.p2.y + this.p3.y) / 3,
      (this.p1.z + this.p2.z + this.p3.z) / 3
    );

    // cache D for solving plane
    this.D = -(this.normal.x * this.position.x) - (this.normal.y * this.position.y) - (this.normal.z * this.position.z);

    // bounding box
    this.box = new THREE.Box3().setFromPoints([this.p1, this.p2, this.p3]);
  }

  getY(x, z) {
    // solve plane
    if (this.normal.y != 0) {
      return (this.normal.x * x + this.normal.z * z + this.D) / -this.normal.y;
    } else {
      return null;
    }
  }

  isPlaneAbove(plane) {
    return (
      this.isPointAboveOrEqual(plane.p1) &&
      this.isPointAboveOrEqual(plane.p2) &&
      this.isPointAboveOrEqual(plane.p3)
    );
  }

  isPointAboveOrEqual(point) {
    // is point above or on surface
    return (Maths.dotProduct(Maths.subtractVector(point, this.position), this.normal) >= -Config.plane.dotThreshold);
  }

  isPointBelowOrEqual(point) {
    // is point below or on surface
    return (Maths.dotProduct(Maths.subtractVector(point, this.position), this.normal) <= Config.plane.dotThreshold);
  }

  containsBox(box) {
    return this.box.containsBox(box);
  }

  intersectsBox(box) {
    return this.box.intersectsBox(box);
  }

  containsPoint2D(point) {
    // is x, z inside bounding box
    return (
      this.box.min.x <= point.x &&
      this.box.max.x >= point.x &&
      this.box.min.z <= point.z &&
      this.box.max.z >= point.z
    );
  }

  projectedTriangleContainsPoint2D(point) {
    // is point inside projected triangle
    return (
      Maths.dotProduct2({x: point.x - this.e1.centre.x, y: point.z - this.e1.centre.z}, this.e1.norm2) < Config.plane.dotThreshold &&
      Maths.dotProduct2({x: point.x - this.e2.centre.x, y: point.z - this.e2.centre.z}, this.e2.norm2) < Config.plane.dotThreshold &&
      Maths.dotProduct2({x: point.x - this.e3.centre.x, y: point.z - this.e3.centre.z}, this.e3.norm2) < Config.plane.dotThreshold
    );
  }

  distanceToPlane(point) {
    return (
      Math.abs(
        this.normal.x * point.x + this.normal.y * point.y + this.normal.z * point.z + this.D
      )
    );
  }

  getProjected(point) {
    // project point onto plane
    const vec = Maths.subtractVector(point, this.p1);
    const dist = Maths.dotProduct(this.normal, vec);
    const proj = Maths.subtractVector(point, Maths.scaleVector(this.normal, dist));
    return proj;
  }

  getIntersect(p1, p2) {
    // get intersection of plane and line between p1, p2
    const vec = Maths.subtractVector(p2, p1);
    const dot = Maths.dotProduct(this.normal, Maths.normalise(vec));

    // check for parallel lines
    if (Math.abs(dot) <= Config.plane.dotThreshold) {
      return null;
    }

    const numPart = this.normal.x * p1.x + this.normal.y * p1.y + this.normal.z * p1.z + this.D;
    const denom = this.normal.x * vec.x + this.normal.y * vec.y + this.normal.z * vec.z;

    // invalid
    if (denom == 0) {
      return null;
    }

    const x = p1.x - ((vec.x * numPart) / denom);
    const y = p1.y - ((vec.y * numPart) / denom);
    const z = p1.z - ((vec.z * numPart) / denom);
    const point = new THREE.Vector3(x, y, z);

    // return intersect if point is inside verts & line
    if (this.box.containsPoint(point)) {
      const box = new THREE.Box3().setFromPoints([p2, p1]).expandByScalar(0.05);

      if (box.containsPoint(point)) {
        return point;
      }
    }

    return null;
  }

  getNormalIntersect(point) {
    // get intersect which extends normal vector (or inverse) to point
    const point2 =  Maths.addVector(point, this.normal);
    const vec = Maths.subtractVector(point2, point);
    const numPart = this.normal.x * point.x + this.normal.y * point.y + this.normal.z * point.z + this.D;
    const denom = this.normal.x * vec.x + this.normal.y * vec.y + this.normal.z * vec.z;
    const x = point.x - ((vec.x * numPart) / denom);
    const y = point.y - ((vec.y * numPart) / denom);
    const z = point.z - ((vec.z * numPart) / denom);
    const intersect = new THREE.Vector3(x, y, z);

    return intersect;
  }

  getNormalIntersect2D(point) {
    // get 2D (xz) intersect which extends from point to surface
    const numPart = this.normal.x * point.x + this.normal.y * point.y + this.normal.z * point.z + this.D;
    const denom = this.normal.x * this.normal.x + this.normal.z * this.normal.z;

    if (denom == 0) {
      return null;
    } else {
      return new THREE.Vector3(
        point.x - ((this.normal.x * numPart) / denom),
        point.y,
        point.z - ((this.normal.z * numPart) / denom)
      );
    }
  }

  getPerpendicularNormals() {
    return {
      right: new THREE.Vector3(-this.normal.z, 0, this.normal.x),
      left: new THREE.Vector3(this.normal.z, 0, -this.normal.x)
    };
  }
}

export default Plane;
