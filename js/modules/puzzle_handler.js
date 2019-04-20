/** Load and handle puzzles and interaction */

import Hotspot from '../ui/hotspot';
import Tween from '../utils/tween';

class PuzzleHandler {
  constructor(scene, camera) {
    this.scene = scene;
    this.camera = camera;
    this.tweens = [];
    this.hotspots = [];
    this.domElement = document.querySelector('#canvas-target');

    // temp
    this.puzzle = {};
    this.puzzle.mesh = new THREE.Mesh(new THREE.BoxBufferGeometry, new THREE.MeshStandardMaterial({color: 0x888888}));
    this.puzzle.onClick = () => {
      if (!this.puzzle.active) {
        this.puzzle.active = true;
        const from = this.puzzle.mesh.rotation.clone();
        const to = from.clone();
        to.y += Math.PI / 2;
        this.tweens.push(new Tween(
          this.puzzle.mesh, "rotation", from, to, {duration: 0.5, onComplete: () => { this.puzzle.active = false; }}
        ));
      }
    };
    this.puzzle.hotspot = new Hotspot(this.scene, this.camera, {
      mesh: this.puzzle.mesh,
      clickEvent: this.puzzle.onClick,
    });
    this.puzzle.mesh.position.set(0, 2, 5);
    this.hotspots.push(this.puzzle.hotspot);
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
    for (let i=0, lim=this.hotspots.length; i<lim; ++i) {
      this.hotspots[i].update();
    }

    // animation
    for (let i=this.tweens.length-1, lim=-1; i>lim; --i) {
      if (this.tweens[i].update(delta)) {
        this.tweens.splice(i, 1);
      }
    }
  }

  draw(ctx) {
    for (let i=0, lim=this.hotspots.length; i<lim; ++i) {
      this.hotspots[i].draw(ctx);
    }
  }
}

export default PuzzleHandler;
