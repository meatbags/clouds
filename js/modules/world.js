/** Set up and update world */

import '../lib/glsl/SkyShader.js';
import CloudMaterial from './material/cloud_material';
import Hotspot from '../ui/hotspot';
import PortalHandler from './portal_handler';
import Loader from '../utils/loader';
import LoadingScreen from '../overlay/loading_screen';

class World {
  constructor(root) {
    this.root = root;
    this.scene = root.scene;
    this.camera = root.camera.camera;
    this.player = root.player;
    this.domElement = document.querySelector('#canvas-target');

    // load
    this.loadSky();
    this.loadModels();

    // lighting
    const directional = new THREE.DirectionalLight(0xffffff, 1);
    const ambient = new THREE.AmbientLight(0xffffff, 0.5);
    directional.position.set(0, 0, 0);
    directional.target.position.set(0.125, -0.35, 1);
    this.scene.add(ambient, directional, directional.target);

    // interactive points
    this.hotspots = [];
    const hotspot = new Hotspot(this.scene, this.camera, {
      position: new THREE.Vector3(0, 0, 10),
      clickEvent: () => { console.log("click!"); },
    });
    this.hotspots.push(hotspot);

    // portals
    this.portals = new PortalHandler(this.root);
  }

  loadModels() {
    const staticAssets = ['floor', 'mobile'];
    this.loadingScreen = new LoadingScreen(staticAssets.length);
    this.loader = new Loader('./assets');

    // temp
    const addToColliderSystem = obj => {
      if (obj.type == 'Mesh') {
        this.root.colliderSystem.add(obj);
      } else if (obj.children && obj.children.length) {
        obj.children.forEach(child => {
          addToColliderSystem(child);
        });
      }
    };

    // load assets and add to scene
    staticAssets.forEach(asset => {
      this.loader.loadFBX(asset).then(obj => {
        this.scene.add(obj);
        this.loadingScreen.onAssetLoaded();

        // temp
        addToColliderSystem(obj);
      });
    });
  }

  loadSky() {
    // sky
    this.sky = new THREE.Sky();
    this.sky.scale.setScalar(450000);
    const d = 400000;
    const azimuth = 0.25;
    const inclination = 0.495; //0.4875;
    const theta = Math.PI * (inclination - 0.5);
    const phi = Math.PI * 2 * (azimuth - 0.5);
    const sunPos = new THREE.Vector3(d * Math.cos(phi), d * Math.sin(phi) * Math.sin(theta), d * Math.sin(phi) * Math.cos(theta));
    this.sky.material.uniforms.sunPosition.value.copy(sunPos);
    this.scene.add(this.sky);

    // clouds
    this.cloudMat = CloudMaterial;
    this.cloudMat.transparent = true;
    this.cloudMat.uniforms.uTime.value = Math.random() * 60;
    this.cloudPlane = new THREE.Mesh(new THREE.PlaneBufferGeometry(1500, 2000), this.cloudMat);
    this.cloudPlane.rotation.x = -Math.PI / 2;
    this.scene.add(this.cloudPlane);
  }

  onMouseMove(x, y) {
    let res = false;
    for (let i=0, lim=this.hotspots.length; i<lim; ++i) {
      this.hotspots[i].onMouseMove(x, y);
      res = res || this.hotspots[i].hover;
    }

    if (res) {
      this.domElement.classList.add('clickable');
    } else {
      this.domElement.classList.remove('clickable');
    }
  }

  onClick(x, y) {
    for (let i=0, lim=this.hotspots.length; i<lim; ++i) {
      this.hotspots[i].onClick(x, y);
    }
  }

  update(delta) {
    // interaction
    this.portals.update();
    for (let i=0, lim=this.hotspots.length; i<lim; ++i) {
      this.hotspots[i].update();
    }

    // clouds
    this.cloudMat.uniforms.uTime.value += delta;
    this.cloudPlane.position.copy(this.player.position);
    this.cloudPlane.position.y -= 50;
  }

  draw(ctx) {
    for (let i=0, lim=this.hotspots.length; i<lim; ++i) {
      this.hotspots[i].draw(ctx);
    }
  }
}

export default World;
