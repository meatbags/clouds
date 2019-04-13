/** World objects */

import '../lib/glsl/SkyShader.js';
import CloudMaterial from './material/cloud_material';

class World {
  constructor(root) {
    this.root = root;
    this.scene = root.scene;

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
  }

  update(delta) {
    this.cloudMat.uniforms.uTime.value += delta;
    this.cloudPlane.position.copy(this.root.camera.camera.position);
    this.cloudPlane.position.y -= 50;
  }
}

export default World;
