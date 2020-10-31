/** Set up and update world */

import * as THREE from 'three';
import Config from './config';
import Loader from '../loader/loader';
import ColliderSystem from '../collider/collider_system';
import Sky from '../loader/sky';

class Scene {
  constructor() {
    this.scene = new THREE.Scene();
    this.loader = new Loader('./assets/');
    this.colliderSystem = new ColliderSystem();
  }

  bind(root) {
    this.ref = {};
    this.ref.camera = root.modules.camera;
    this.ref.materials = root.modules.materials;
    this.ref.geometry = root.modules.geometry;

    // load scene
    this.initMap()
      .then(() => {
        // add sky
        this.sky = new Sky(this.scene, this.ref.camera.getCamera());
      });
    this.initLighting();
  }

  initLighting() {
    this.lights = {
      d1: new THREE.DirectionalLight(0xffffff, 0.5),
      a1: new THREE.AmbientLight(0xffffff, 0.5),
      h1: new THREE.HemisphereLight(0xffffbb, 0x080820, 0.5),
      // p1: new THREE.PointLight(0xffffff, 1, 20, 2),
    };

    this.lights.d1.position.set(0, 0, 0);
    this.lights.d1.target.position.copy(Config.Scene.sunlightDirection);
    // this.lights.p1.position.set(0, 6, 0);
    // this.lights.p1.position.add(Config.Scene.offset.turret);

    for (const key in this.lights) {
      this.scene.add(this.lights[key]);

      // add directional target
      if (this.lights[key].target) {
        this.scene.add(this.lights[key].target);
      }
    }
  }

  initMap() {
    return new Promise((resolve, reject) => {
      const maps = ['turret'];
      const collisionMaps = ['turret_map', 'chapel_map', 'basement_map', 'observatory_map', 'garden_map'];
      let toLoad = maps.length + collisionMaps.length;

      // onload callback
      const onLoad = () => {
        toLoad -= 1;
        if (toLoad == 0) {
          resolve();
        }
      };

      // apply callback to nested meshes
      const applyToMeshes = (obj, callback) => {
        if (obj.type === 'Mesh') {
          callback(obj);
        } else if (obj.children) {
          obj.children.forEach(child => {
            applyToMeshes(child, callback);
          });
        }
      };

      // load maps
      maps.forEach(name => {
        this.loader.loadFBX(name).then(obj => {
          // apply position offsets
          Object.keys(Config.Scene.offset).forEach(key => {
            if (name.indexOf(key) != -1) {
              const offset = Config.Scene.offset[key];
              applyToMeshes(obj, mesh => { mesh.position.add(offset); });
            }
          });

          // update object
          this.ref.materials.processObject(obj);
          this.ref.geometry.processObject(obj);

          // add to scene
          this.scene.add(obj);
          onLoad();
        });
      });

      // load collision maps
      collisionMaps.forEach(name => {
        this.loader.loadFBX(name).then(obj => {
          // apply position offsets
          Object.keys(Config.Scene.offset).forEach(key => {
            if (name.indexOf(key) != -1) {
              const offset = Config.Scene.offset[key];
              applyToMeshes(obj, mesh => { mesh.position.add(offset); });
            }
          });

          // add collision maps
          this.colliderSystem.add(obj);
          const wireMat = new THREE.MeshBasicMaterial({color: 0xffffff, wireframe: true});
          applyToMeshes(obj, mesh => { mesh.material = wireMat; });

          // add to scene
          this.scene.add(obj);
          onLoad();
        });
      });
    });
  }

  getScene() {
    return this.scene;
  }

  getColliderSystem() {
    return this.colliderSystem;
  }

  update(delta) {
    if (this.sky) {
      this.sky.update(delta);
    }
  }
}

export default Scene;
