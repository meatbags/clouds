/** Main puzzle. */

import Config from '../config';
import Puzzle from './puzzle';
import Hotspot from '../ui/hotspot';
import Tween from '../utils/tween';
import { PrintGrid } from '../utils/solution_grid.js';

class PuzzleMainRoom extends Puzzle {
  constructor(root) {
    super(root);
    this.grid = Config.puzzle.grid;
    this.printSolution();

    // create floor grid
    const size = 0.4;
    const s = size * 0.75;
    const clickEvent = e => {
      if (!e.inTransit) {
        e.inTransit = true;
        const p1 = e.mesh.position.clone();
        const p2 = p1.clone();
        e.toggled = e.toggled === undefined ? true : e.toggled == false;
        p2.z += e.toggled ? size / 4 : -size / 4;
        e.mesh.material.color.setHex(e.toggled ? 0xffffff : 0x0);
        this.tweens.push(new Tween(e.mesh, 'position', p1, p2, {duration: 0.2, onComplete: () => { e.inTransit = false; }}));
      }
    };
    for (var i=0, lim=this.grid.solution.length; i<lim; ++i) {
      const mat = new THREE.MeshStandardMaterial({color: 0x0});
      const mesh = new THREE.Mesh(new THREE.BoxBufferGeometry(s, s, s/2), mat);
      const hotspot = new Hotspot(this.scene, this.camera, { mesh: mesh, clickEvent: clickEvent });
      const x = i % 8;
      const y = (i - x) / 8;
      mesh.position.set(-2 + x * size, 3 - y * size, -4);
      this.hotspots.push(hotspot);
    }
  }

  printSolution() {
    PrintGrid(this.grid.library, 4);
    PrintGrid(this.grid.basement, 4);
    PrintGrid(this.grid.observatory, 4);
    PrintGrid(this.grid.garden, 4);
    PrintGrid(this.grid.chess, 8);
    PrintGrid(this.grid.solution, 8);

    // check length = 20
    let count = 0;
    for (let i=0, lim=this.grid.solution.length; i<lim; ++i) {
      count += this.grid.solution[i];
    }
    console.log(count);
  }

  checkSolution() {
    // ?
  }

  update(delta) {
    this.updateHotspots();
    this.updateTweens(delta);
  }
}

export default PuzzleMainRoom;
