/** Load FBX */

import * as THREE from 'three';
import FBXLoader from './FBXLoader';

class Loader {
  constructor(path) {
    this.path = path;
    this.materials = {};
    this.images = {};
    this.loaderFBX = new FBXLoader();
  }

  loadFBX(filename) {
    return new Promise(
      (resolve, reject) => {
        try {
          filename += filename.indexOf('.fbx') === -1 ? '.fbx' : '';
          const src = this.path + filename;
          const onLoad = model => { resolve(model); };
          const onError = err => { console.log(err); };
          this.loaderFBX.load(src, onLoad, null, onError);
        } catch(error) {
          console.log(error);
          reject(error);
        }
      }
    );
  }
}

export default Loader;
