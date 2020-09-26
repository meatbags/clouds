/** ColliderPoint */

import * as THREE from 'three';
import * as Maths from './maths';
import Config from './config';

class ColliderPoint {
  constructor(settings) {
    this.settings = Config.settings;
    this.position = new THREE.Vector3();
    this.motion = new THREE.Vector3();
    this.system = null;
    this.set(settings || {});
  }

  set(settings) {
    // replace default settings
    Object.keys(settings).forEach(key => {
      if (this.settings[key] !== undefined && typeof(this.settings[key]) === typeof(settings[key])) {
        this.settings[key] = settings[key];
      }
    });

    // targets
    this.position = settings.position || this.position;
    this.motion = settings.motion || this.motion;
    this.system = settings.system || this.system;
  }

  collide(delta) {
    if (!this.system) { return; }

    // get next position & apply physics
    const p = Maths.addVector(this.position, Maths.scaleVector(this.motion, delta));
    this.falling = (this.motion.y < 0);
    this.motion.y = Math.max(this.motion.y - this.settings.gravity * delta, -this.settings.maxVelocity);

    // collide
    let collisions = this.system.getCollisions(p);

    // slopes/ walls
    if (collisions.length > 0) {
      if (this.stepUpSlopes(p, collisions)) {
        collisions = this.system.getCollisions(p);
      }
      if (this.extrudeFrom(p, collisions)) {
        this.stepUpSlopes(p, this.system.getCollisions(p));
      }
    } else if (this.motion.y < 0 && !this.falling) {
      this.stepDownSlope(p, this.system.getCeilingPlane(new THREE.Vector3(p.x, p.y - this.settings.snapDown, p.z)));
    }

    // floor limit
    if (p.y < this.settings.floor) {
      this.motion.y = 0;
      p.y = this.settings.floor;
    }

    this.position.copy(p);
  }

  getValidCollisions(p, meshes) {
    // get n collisions with meshes that can't be climbed
    var hits = 0;

    for (var i=0, len=meshes.length; i<len; ++i) {
      const ceiling = meshes[i].getCeilingPlane(p);
      if (ceiling != null && (ceiling.plane.normal.y < this.settings.minSlope || (ceiling.y - this.position.y) > this.settings.snapUp)) {
        hits++;
      }
    }

    return hits;
  }

  extrudeFrom(p, meshes) {
    // extrude position from obstructions
    var isExtruded = false;
    var mesh = false;

    for (let i=0, len=meshes.length; i<len; ++i) {
      const ceiling = meshes[i].getCeilingPlane(p);
      if (ceiling != null && (ceiling.plane.normal.y < this.settings.minSlope || (ceiling.y - this.position.y) > this.settings.snapUp)){
        mesh = meshes[i];
        break;
      }
    }

    // extrude from mesh
    if (mesh) {
      const intersectPlane = mesh.getIntersectPlane2D(this.position, p);

      if (intersectPlane != null) {
        const intersect = intersectPlane.intersect;
        const plane = intersectPlane.plane;

        if (plane.normal.y < -0.5) {
          // project in 3D, if other mesh collisions, try 2D
          // NOTE: needs refinement
          const proj = mesh.getProjected(p, plane);
          const hits = this.getValidCollisions(proj, this.system.getCollisions(proj));

          // stop motion if cornered
          if (hits > 1) {
            p.x = this.position.x;
            p.z = this.position.z;
          } else {
            p.x = proj.x;
            p.y = proj.y;
            p.z = proj.z;
            // reduce jump motion
            this.motion.y = (this.motion.y > 0) ? this.motion.y * 0.75 : this.motion.y;
            //this.motion.y = Math.min(-0.01, this.motion.y);
            isExtruded = true;
          }
        } else {
          p.x = intersect.x;
          p.z = intersect.z;
          const hits = this.getValidCollisions(p, this.system.getCollisions(p));

          // stop motion if cornered
          if (hits > 1) {
            p.x = this.position.x;
            p.z = this.position.z;
          } else {
            isExtruded = true;
          }
        }
      } else {
        p.x = this.position.x;
        p.z = this.position.z;
      }
    }

    return isExtruded;
  }

  stepUpSlopes(position, meshes) {
    let steppedUp = false;
    for (let i=0, len=meshes.length; i<len; ++i) {
      const ceiling = meshes[i].getCeilingPlane(position);
      // climb up slopes
      if (ceiling != null &&
        ceiling.plane.normal.y >= this.settings.minSlope &&
        (ceiling.y - this.position.y) <= this.settings.snapUp) {
        if (ceiling.y >= position.y) {
          steppedUp = true;
          position.y = ceiling.y;
          this.motion.y = 0;
        }
      }
    }
    return steppedUp;
  }

  stepDownSlope(position, ceilingPlane) {
    let steppedDown = false;
    if (ceilingPlane != null && ceilingPlane.plane.normal.y >= this.settings.minSlope) {
      position.y = ceilingPlane.y;
      this.motion.y = 0;
      steppedDown = true;
    }
    return steppedDown;
  }
}

export default ColliderPoint;
