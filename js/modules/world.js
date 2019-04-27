/** Set up and update world */

import '../lib/glsl/SkyShader.js';
import Config from '../config';
import CloudMaterial from '../lib/materials/cloud_material';
import Loader from '../utils/loader';
import LoadingScreen from '../overlay/loading_screen';

class World {
  constructor(scene, player, colliderSystem) {
    this.scene = scene;
    this.player = player;
    this.colliderSystem = colliderSystem;

    // build world
    this.loadSky();
    this.loadModels();
    this.setLights();
  }

  setLights() {
    const directional = new THREE.DirectionalLight(0xffffff, 1);
    const ambient = new THREE.AmbientLight(0xffffff, 0.25);
    directional.position.set(0, 0, 0);
    directional.target.position.copy(Config.lighting.sunlightDirection);
    const point1 = new THREE.PointLight(0xffffff, 1, 20, 2);
    point1.position.set(0, 6, 0);
    point1.position.add(Config.world.offset.turret);
    this.scene.add(ambient, directional, directional.target, point1);
  }

  loadModels() {
    const staticAssets = ['turret', 'turret_map', 'chapel_map', 'basement_map', 'observatory_map', 'garden_map']
    this.loadingScreen = new LoadingScreen(staticAssets.length);
    this.loader = new Loader('./assets');

    // load assets and add to scene
    staticAssets.forEach(asset => {
      this.loader.loadFBX(asset).then(obj => {
        // apply position offsets
        Object.keys(Config.world.offset).forEach(key => {
          if (asset.indexOf(key) != -1) {
            const offset = Config.world.offset[key];
            obj.children.forEach(child => {
              child.position.add(offset);
            });
          }
        });

        // add collision maps
        if (asset.indexOf('map') != -1) {
          this.colliderSystem.add(obj);
          const wireMat = new THREE.MeshBasicMaterial({color: 0xffffff, wireframe: true});
          obj.children.forEach(child => { child.material = wireMat; });
        }

        // add
        this.scene.add(obj);

        // update loading screen
        this.loadingScreen.onAssetLoaded();
      });
    });
  }

  loadSky() {
    // sky
    this.sky = new THREE.Sky();
    this.sky.scale.setScalar(450000);
    const d = 400000;
    const azimuth = 0.25;
    const inclination = 0.45;
    const theta = Math.PI * (inclination - 0.5);
    const phi = Math.PI * 2 * (azimuth - 0.5);
    const sunPos = new THREE.Vector3(d * Math.cos(phi), d * Math.sin(phi) * Math.sin(theta), d * Math.sin(phi) * Math.cos(theta));
    this.sky.material.uniforms.sunPosition.value.copy(sunPos);
    this.scene.add(this.sky);

    // clouds
    if (Config.world.cloudComplexity) {
      this.cloudMat = CloudMaterial;
      this.cloudMat.transparent = true;
      this.cloudMat.uniforms.uTime.value = Math.random() * 60;
      this.cloudPlane = new THREE.Mesh(new THREE.PlaneBufferGeometry(1500, 2000), this.cloudMat);
      this.cloudPlane.rotation.x = -Math.PI / 2;
      this.scene.add(this.cloudPlane);
    }
  }

  update(delta) {
    // clouds
    if (this.cloudMat) {
      this.cloudMat.uniforms.uTime.value += delta;
      this.cloudPlane.position.copy(this.player.position);
      this.cloudPlane.position.y -= 50;
    }
  }
}

export default World;
