/** ColliderSystem */

import * as THREE from 'three';
import Mesh from './mesh/mesh';
import Config from './config';

class ColliderSystem {
  constructor(params) {
    this.meshes = [];
    this.cache = [];
    this.settings = Config.system;
    this.isColliderSystem = true;
    this.set(params || {});
  }

  set(params) {
    this.maxPlanes = params.maxPlanes || Config.system.maxPlanesPerMesh;
  }

  add() {
    // add objects to collider system
    let res = null;

    for (let i=0, len=arguments.length; i<len; ++i) {
      let obj = arguments[i];

      // recursively add grouped objects
      if (obj.type && obj.type === 'Group') {
        obj.children.forEach(child => {
          this.add(child);
        });

      // create new mesh
      } else {
        if (!obj.isColliderMesh && obj.geometry && obj.geometry.isBufferGeometry) {
          obj = new Mesh(obj);
        }

        // check if mesh ok
        if (obj.isColliderMesh) {
          if (obj.planes.length < this.maxPlanes) {
            this.meshes.push(obj);
            res = obj;
          } else {
            console.warn(`[ColliderSystem] Too many planes. Maximum=${this.maxPlanes}`);
          }
        }
      }
    }

    return res;
  }

  clear() {
    this.meshes = [];
    this.cache = [];
  }

  getCollisions(point) {
    // get system collision with point
    const res = [];
    const meshes = this.settings.useCache ? this.cache : this.meshes;
    for (let i=0, len=meshes.length; i<len; ++i) {
      if (meshes[i].getCollision(point)) {
        res.push(meshes[i]);
      }
    }
    return res;
  }

  getCeilingPlane(point) {
    // get ceiling above point
    let ceiling = null;
    const meshes = this.getCollisions(point);
    for (let i=0, len=meshes.length; i<len; ++i) {
      const res = meshes[i].getCeilingPlane(point);
      if (res && (!ceiling || res.y > ceiling.y)) {
        ceiling = {y: res.y, plane: res.plane};
      }
    }
    return ceiling;
  }

  cache(point) {
    // add nearby meshes to cache
    this.cache = [];
    for (let i=0, len=this.meshes.length; i<len; ++i) {
      if (this.meshes[i].distanceTo(point) < this.settings.cacheRadius) {
        this.cache.push(this.meshes[i]);
      }
    }
  }
}

export default ColliderSystem;
