/** Portal */

import * as THREE from 'three';

class Portal {
  constructor(from, to, settings) {
    // settings
    this.from = from;
    this.to = to;
    this.callback = settings.callback || null;

    // get portal delta
    this.delta = new THREE.Vector3();
    const a = new THREE.Vector3();
    const b = new THREE.Vector3();
    this.from.getCenter(a);
    this.to.getCenter(b);
    b.sub(a);
    this.delta.copy(b);
  }

  addHelpers(scene) {
    const helper1 = new THREE.Box3Helper(this.from, 0xffffff);
    const helper2 = new THREE.Box3Helper(this.to, 0xffffff);
    scene.add(helper1, helper2);
  }

  update(camera, controls) {
    if (this.from.containsPoint(camera.position)) {
      camera.position.add(this.delta);
      controls.position.add(this.delta);
      controls.positionTarget.add(this.delta);

      if (this.callback) {
        this.callback(this);
      }
    }
  }
}

export default Portal;
