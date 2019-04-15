/** Clickable 3D hotspot. */

import ScreenSpace from '../utils/screen_space';
import Raycaster from './raycaster';

class Hotspot {
  constructor(scene, camera, settings) {
    this.camera = camera;
    this.domElement = document.querySelector('#canvas-target');
    this.screenSpace = new ScreenSpace(this.camera);
    this.raycaster = new Raycaster(this.camera);
    this.hover = false;
    this.active = false;
    this.timestamp = null;

    // settings
    this.position = settings.position || new THREE.Vector3();
    this.radius = settings.radius || 20;
    this.clickEvent = settings.clickEvent || (() => {});
    this.timeout = settings.timeout || 150;
    this.mesh = settings.mesh || new THREE.Mesh(new THREE.BoxBufferGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0x000}));
    this.mesh.position.copy(this.position);
    this.mesh.material.visible = false;
    scene.add(this.mesh);

    // dom
    this.resize();
    window.addEventListener('resize', () => { this.resize(); });
  }

  resize() {
    this.rect = this.domElement.getBoundingClientRect();
  }

  onMouseMove(x, y) {
    if (this.active) {
      const res = this.raycaster.intersect(x, y, this.mesh);
      this.hover = res.length > 0;
    }
  }

  onClick(x, y) {
    const now = performance.now();
    if (this.active && (this.timestamp == null || (now - this.timestamp) > this.timeout)) {
      const res = this.raycaster.intersect(x, y, this.mesh);
      if (res.length > 0) {
        this.clickEvent();
        this.timestamp = performance.now();
      }
    }
  }

  update() {
    this.active = this.camera.position.distanceTo(this.position) <= this.radius;
    this.hover = this.hover && this.active;
  }

  draw(ctx) {
    if (this.active) {
      const coords = this.screenSpace.toScreenSpace(this.position);
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(coords.x, coords.y, this.hover ? 20 : 10, 0, Math.PI * 2, false);
      ctx.stroke();
    }
  }
}

export default Hotspot;
