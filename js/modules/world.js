/** World objects */

import '../lib/glsl/SkyShader.js';
import CloudMaterial from './material/cloud_material';
import Hotspot from '../ui/hotspot';

class World {
  constructor(root) {
    this.root = root;
    this.scene = root.scene;
    this.camera = root.camera.camera;
    this.domElement = document.querySelector('#canvas-target');

    // clouds
    this.cloudMat = CloudMaterial;
    this.cloudMat.transparent = true;
    this.cloudMat.uniforms.uTime.value = Math.random() * 60;
    this.cloudPlane = new THREE.Mesh(new THREE.PlaneBufferGeometry(1500, 2000), this.cloudMat);
    this.cloudPlane.rotation.x = -Math.PI / 2;
    this.scene.add(this.cloudPlane);

    const directional = new THREE.DirectionalLight(0xffffff, 0.5);
    const ambient = new THREE.AmbientLight(0xffffff, 0.1);
    directional.position.set(0, 0, 0);
    directional.target.position.set(0, -0.25, 1);
    this.scene.add(ambient, directional, directional.target);

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

    // interactive points
    this.hotspots = [];
    const hotspot = new Hotspot(this.camera, {
      position: new THREE.Vector3(0, 0, 10),
      onHover: () => { console.log("hover"); },
      onClick: () => {},
    });
    this.hotspots.push(hotspot);
    this.scene.add(hotspot.mesh);
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
    this.hotspots.forEach(e => {
      e.onClick(x, y);
    });
  }

  update(delta) {
    this.cloudMat.uniforms.uTime.value += delta;
    this.cloudPlane.position.copy(this.root.camera.camera.position);
    this.cloudPlane.position.y = -50;

    // interaction
    for (let i=0, lim=this.hotspots.length; i<lim; ++i) {
      this.hotspots[i].update();
    }
  }

  draw(ctx) {
    for (let i=0, lim=this.hotspots.length; i<lim; ++i) {
      this.hotspots[i].draw(ctx);
    }
  }
}

export default World;
