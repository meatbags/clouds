/** Clickable 3D hotspot. */

import ScreenSpace from '../utils/screen_space';
import Raycaster from './raycaster';

class Hotspot {
  constructor(camera, settings) {
    this.camera = camera;
    this.domElement = document.querySelector('#canvas-target');
    this.screenSpace = new ScreenSpace(this.camera);
    this.raycaster = new Raycaster(this.camera);
    this.hover = false;
    this.active = false;
    this.enabled = true;
    this.timestamp = null;

    // settings
    this.position = settings.position || (settings.mesh ? settings.mesh.position : new THREE.Vector3());
    this.radius = settings.radius || 5;
    this.clickEvent = settings.clickEvent || (() => {});
    this.timeout = settings.timeout || 150;
    this.mesh = settings.mesh || new THREE.Mesh(new THREE.BoxBufferGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0x000}));
    this.mesh.material.visible = settings.visible !== undefined ? settings.visible : true;

    // set positions
    this.mesh.position.copy(this.position);
    this.worldPosition = this.position.clone();

    // dom
    this.resize();
    window.addEventListener('resize', () => { this.resize(); });
  }

  resize() {
    setTimeout(() => {
      this.rect = this.domElement.getBoundingClientRect();
    }, 85);
  }

  onMouseMove(x, y) {
    if (this.active) {
      this.hover = this.raycaster.intersects(x, y, this.mesh);
    }
  }

  onClick(x, y) {
    if (this.enabled) {
      const now = performance.now();
      if (this.active && (this.timestamp == null || (now - this.timestamp) > this.timeout)) {
        if (this.raycaster.intersects(x, y, this.mesh)) {
          this.clickEvent(this);
          this.timestamp = now;
        }
      }
    }
  }

  disable() {
    this.enabled = false;
  }

  enable() {
    this.enabled = true;
  }

  update() {
    if (this.mesh.parent) {
      this.worldPosition.copy(this.position);
      this.mesh.parent.localToWorld(this.worldPosition);
    }
    this.active = this.camera.position.distanceTo(this.worldPosition) <= this.radius && this.screenSpace.isOnScreen(this.worldPosition);
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
