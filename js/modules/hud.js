/** 2D Canvas overlays */

import Config from './config';

class HUD {
  constructor() {
    this.cvs = document.createElement('canvas');
    this.ctx = this.cvs.getContext('2d');
    this.cvs.classList.add('canvas--overlay');
    document.querySelector('#canvas-target').appendChild(this.cvs);

    // settings
    this.fps = [];
  }

  bind(root) {
    this.ref = {};
    this.ref.controls = root.modules.controls;
    this.ref.camera = root.modules.camera.getCamera();

    // events
    window.addEventListener('resize', () => { this.resize(); });
    this.resize();
  }

  clear() {
    this.ctx.clearRect(0, 0, this.cvs.width, this.cvs.height);
    this.ctx.fillStyle = '#fff';
    this.ctx.strokeStyle = '#fff';
    this.ctx.lineWidth = 1;
  }

  resize() {
    this.cvs.width = window.innerWidth;
    this.cvs.height = window.innerHeight;
  }

  render(delta) {
    this.clear();
    this.fps.unshift(1 / delta);
    this.fps.splice(20, 1);
    const sum = this.fps.reduce((s, a) => s + a) / this.fps.length;
    const text = Math.round(sum) + (this.ref.controls.keys.noclip ? ' [noclip]' : '');
    this.ctx.fillText(text, 20, this.cvs.height - 20);
    const x = Math.round(this.ref.camera.position.x);
    const y = Math.round(this.ref.camera.position.y) - Config.Controls.height;
    const z = Math.round(this.ref.camera.position.z);
    this.ctx.fillText(`${x} ${y} ${z}`, 20, this.cvs.height - 40);
  }
}

export default HUD;
