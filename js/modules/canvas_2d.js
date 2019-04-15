/** 2D Canvas overlays */

import Config from '../config';

class Canvas2D {
  constructor() {
    this.domElement = document.querySelector('#canvas-target-2d');
    this.cvs = this.domElement;
    this.ctx = this.cvs.getContext('2d');

    // dom
    this.resize();
    window.addEventListener('resize', () => { this.resize(); });
  }

  clear() {
    this.ctx.clearRect(0, 0, this.cvs.width, this.cvs.height);
  }

  resize() {
    this.cvs.width = Math.floor(Config.width / 100 * window.innerWidth);
    this.cvs.height = Math.floor(Config.height / 100 * window.innerHeight);
  }
}

export default Canvas2D;
