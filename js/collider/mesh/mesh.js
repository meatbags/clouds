/** Collision mesh */

import * as THREE from 'three';
import Config from '../config';
import Plane from './plane';
import Box from './box';
import Transformer from './transformer';
import { subtractVector, dotProduct, normalise, distanceBetween } from '../maths';

class Mesh {
  constructor(object) {
    if (!object.geometry.isBufferGeometry) {
      throw('Error: THREE.BufferGeometry not found');
    }
    
    this.id = object.uuid;
    this.isColliderMesh = true;
    this.enabled = true;
    this.object = object;
    this.geometry = object.geometry;
    this.box = new Box(object);
    this.planes = [];
    this.transform = new Transformer(object);
    this.generatePlanes();
    this.conformPlanes();
  }

  disable() {
    this.enabled = false;
  }

  enable() {
    this.enabled = true;
  }

  generatePlanes() {
    // create planes from buffer geometry attribute
    const verts = this.geometry.attributes.position.array;
    const norms = this.geometry.attributes.normal.array;

    if (this.geometry.index) {
      // handle indexed geometry
      const indices = this.geometry.index.array;
      const size = this.geometry.attributes.position.itemSize;
      const step = 3;

      for (let i=0; i<indices.length; i+=step) {
        const j = indices[i] * size;
        const k = indices[i+1] * size;
        const l = indices[i+2] * size;

        this.planes.push(new Plane(
          new THREE.Vector3(verts[j], verts[j+1], verts[j+2]),
          new THREE.Vector3(verts[k], verts[k+1], verts[k+2]),
          new THREE.Vector3(verts[l], verts[l+1], verts[l+2]),
          new THREE.Vector3(norms[j], norms[j+1], norms[j+2]),
          new THREE.Vector3(norms[k], norms[k+1], norms[k+2]),
          new THREE.Vector3(norms[l], norms[l+1], norms[l+2])
        ));
      }
    } else {
      const step = 9;

      for (let i=0; i<verts.length; i+=step) {
        this.planes.push(new Plane(
            new THREE.Vector3(verts[i+0], verts[i+1], verts[i+2]),
            new THREE.Vector3(verts[i+3], verts[i+4], verts[i+5]),
            new THREE.Vector3(verts[i+6], verts[i+7], verts[i+8]),
            new THREE.Vector3(norms[i+0], norms[i+1], norms[i+2]),
            new THREE.Vector3(norms[i+3], norms[i+4], norms[i+5]),
            new THREE.Vector3(norms[i+6], norms[i+7], norms[i+8])
          )
        );
      }
    }
  }

  conformPlanes() {
    // NOTE: translation is handled during collision check
    // TODO: bake all translations
    var conformed = false;

    // conform scale
    if (!this.transform.default.scale) {
      for (let i=0; i<this.planes.length; i+=1) {
        this.transform.bakeScale(this.planes[i]);
      }
      conformed = true;
    }

    // conform rotation
    if (!this.transform.default.rotation) {
      for (let i=0; i<this.planes.length; i+=1) {
        this.transform.bakeRotation(this.planes[i]);
      }
      conformed = true;
    }

    if (conformed) {
      // regenerate plane attributes
      for (let i=0; i<this.planes.length; i+=1) {
        this.planes[i].generatePlane();
      }
    }

    // reset collision box
    this.setBoxFromPlanes();
  }

  setBoxFromPlanes() {
    const array = [];

    for (var i=0, len=this.planes.length; i<len; ++i) {
      const p = this.planes[i];
      array.push(p.p1);
      array.push(p.p2);
      array.push(p.p3);
    }

    this.box.setFromPoints(array);
    this.updateBoxPosition();
  }

  updateBoxPosition() {
    this.box.setPosition(this.transform.getPosition());
  }

  getCollision(point) {
    if (!this.enabled || !this.box.containsPoint(point)) {
      return false;
    } else {
      // transform point to put inside baked position
      this.transform.set(point)

      // reset
      for (var i=0, len=this.planes.length; i<len; ++i) {
        this.planes[i].culled = false;
      }

      // first pass - cull faces
      for (var i=0, len=this.planes.length; i<len; ++i) {
        if (!this.planes[i].culled && this.planes[i].isPointBelowOrEqual(this.transform.point)) {
          // cull planes above plane
          for (var j=0, jlen=this.planes.length; j<jlen; ++j) {
            if (!this.planes[j].culled && j != i && this.planes[i].isPlaneAbove(this.planes[j])) {
              this.planes[j].culled = true;
            }
          }
        }
      }

      // second pass - get result
      for (var i=0, len=this.planes.length; i<len; ++i) {
        if (!this.planes[i].culled && !this.planes[i].isPointBelowOrEqual(this.transform.point)) {
          return false;
        }
      }

      return true;
    }
  }

  getCeilingPlane(point) {
    // get ceiling, plane above a given point
    this.transform.set(point);
    var ceiling = null;

    for (let i=0, len=this.planes.length; i<len; i+=1) {
      // check general box, then precise, then for ceiling
      if (this.planes[i].containsPoint2D(this.transform.point)) {
        if (this.planes[i].projectedTriangleContainsPoint2D(this.transform.point) &&
          this.planes[i].isPointBelowOrEqual(this.transform.point)){
          var planeCeiling = this.planes[i].getY(this.transform.point.x, this.transform.point.z);

          if (planeCeiling != null && planeCeiling >= this.transform.point.y && (ceiling == null || planeCeiling > ceiling.y)) {
            ceiling = {y: planeCeiling, plane: this.planes[i]};
          }
        }
      }
    }

    return ((ceiling == null) ? null : {
      y: this.transform.getReverseTransformedY(ceiling.y),
      plane: ceiling.plane
    });
  }

  getIntersectPlane(p1, p2) {
    const tp1 = this.transform.getTransformedPoint(p1);
    const tp2 = this.transform.getTransformedPoint(p2);
    const box = new THREE.Box3().setFromPoints([tp1, tp2]);
    let intersectPlane = null;

    for (let i=0; i<this.planes.length; i+=1) {
      if (this.planes[i].intersectsBox(box) || this.planes[i].containsBox(box)) {
        const intersect = this.planes[i].getIntersect(tp1, tp2);

        if (intersect != null) {
          const distance = distanceBetween(tp1, intersect);

          if (intersectPlane === null || distance < intersectPlane.distance) {
            intersectPlane = {
              intersect: intersect,
              plane: this.planes[i],
              distance: distance
            }
          }
        }
      }
    }

    return ((intersectPlane == null) ? null : {
      intersect: this.transform.getReverseTransformedPoint(intersectPlane.intersect),
      plane: intersectPlane.plane,
      distance: intersectPlane.distance
    });
  }

  getIntersectPlane2D(p1, p2) {
    // find 2D intersect *nearest* to p2
    const tp1 = this.transform.getTransformedPoint(p1);
    const tp2 = this.transform.getTransformedPoint(p2);
    const box = new THREE.Box3().setFromPoints([tp1, tp2]);
    box.expandByScalar(0.05);
    let intersectPlane = null;

    for (let i=0; i<this.planes.length; i+=1) {
      if (this.planes[i].intersectsBox(box) || this.planes[i].containsBox(box)) {
        const intersect2D = this.planes[i].getNormalIntersect2D(tp2);

        if (intersect2D != null) {
          const distance = distanceBetween(tp2, intersect2D);

          if (intersectPlane === null || distance < intersectPlane.distance) {
            intersectPlane = {
              plane: this.planes[i],
              intersect: intersect2D,
              distance: distance
            };
          }
        }
      }
    }

    return ((intersectPlane == null) ? null : {
      intersect: this.transform.getReverseTransformedPoint(intersectPlane.intersect),
      plane: intersectPlane.plane,
      distance: intersectPlane.distance
    });
  }

  getProjected(point, plane) {
    // get point projected onto plane
    const p = this.transform.getTransformedPoint(point);
    const proj = plane.getProjected(p);
    return this.transform.getReverseTransformedPoint(proj);
  }

  distanceTo(point) {
    return this.box.distanceTo(point);
  }
}

export default Mesh;
