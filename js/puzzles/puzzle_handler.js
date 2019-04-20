/** Load and handle puzzles and interaction */

import Config from '../config';
import PuzzleMainRoom from './puzzle_main_room';

class PuzzleHandler {
  constructor(scene, camera, colliderSystem) {
    this.scene = scene;
    this.camera = camera;
    this.colliderSystem = colliderSystem;
    this.puzzles = [];
    this.domElement = document.querySelector('#canvas-target');

    // load puzzles
    this.puzzles.push(new PuzzleMainRoom(this));
  }

  onMouseMove(x, y) {
    let res = false;
    for (let i=0, lim=this.puzzles.length; i<lim; ++i) {
      res = res || this.puzzles[i].onMouseMove(x, y);
    }

    this.domElement.classList[res ? 'add' : 'remove']('clickable');
  }

  onClick(x, y) {
    for (let i=0, lim=this.puzzles.length; i<lim; ++i) {
      this.puzzles[i].onClick(x, y);
    }
  }

  update(delta) {
    // clear selected
    this.outlinePassTarget.selectedObjects = [];
    for (let i=0, lim=this.puzzles.length; i<lim; ++i) {
      this.puzzles[i].update(delta);
      this.outlinePassTarget.selectedObjects = this.outlinePassTarget.selectedObjects.concat(this.puzzles[i].getSelectedMeshes());
    }
  }

  draw(ctx) {}

  setOutlinePassTarget(target) {
    this.outlinePassTarget = target;
  }
}

export default PuzzleHandler;
