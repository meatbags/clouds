/** Geometry modifier */

import * as THREE from 'three';
import { BufferGeometryUtils } from 'three/examples/jsm/utils/BufferGeometryUtils';
import PerlinNoise from '../util/perlin_noise';

class Geometry {
  constructor() {
    this.perlinNoise = new PerlinNoise();
  }

  processObject(obj) {
    if (obj.type == 'Mesh') {
      this.processGeometry(obj);
    } else if (obj.children) {
      obj.children.forEach(child => {
        this.processObject(child);
      });
    }
  }

  processGeometry(obj) {
    if (obj.name !== 'perlin_test') {
      return;
    }

    const geo = obj.geometry;
    const arr = geo.attributes.position.array;
    const len = arr.length;

    for (let i=0; i<len; i+=3) {
      const n = this.perlinNoise.get2D(arr[i+1], arr[i+2]);
      arr[i] += n * 0.2;
    }

    const mergedGeometry = BufferGeometryUtils.mergeVertices(geo);
    obj.geometry = mergedGeometry;
    obj.geometry.computeVertexNormals();
  }
}

export default Geometry;
