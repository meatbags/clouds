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
    const group = new THREE.Group();
    const size = 0.4;
    const s = size * 0.75;
    const left = -(size * 8 / 2);
    const top = -left;
    for (var i=0, lim=this.grid.solution.length; i<lim; ++i) {
      const mat = new THREE.MeshStandardMaterial({color: 0x0});
      const mesh = new THREE.Mesh(new THREE.BoxBufferGeometry(s, s, s/2), mat);
      const hotspot = new Hotspot(this.camera, {mesh: mesh, clickEvent: e => { this.onGridItemClicked(e); }});
      const x = i % 8;
      const y = (i - x) / 8;
      mesh.position.set(left + x * size, top - y * size, 0);
      this.hotspots.push(hotspot);
      group.add(mesh);
    }

    // solution button
    const mesh = new THREE.Mesh(new THREE.BoxBufferGeometry(1, s, s/2), new THREE.MeshStandardMaterial({color: 0x0}));
    const hotspot = new Hotspot(this.camera, {mesh: mesh, clickEvent: () => { this.checkSolution(); }});
    this.hotspots.push(hotspot);
    mesh.position.y = top + 0.5;
    group.add(mesh);

    group.position.y += top;
    this.scene.add(group);
  }

  onGridItemClicked(e) {
    e.disable();
    const p1 = e.mesh.position.clone();
    const p2 = p1.clone();
    e.toggled = e.toggled === undefined ? true : e.toggled == false;
    e.mesh.material.color.setHex(e.toggled ? 0xffffff : 0x0);
    e.enable();
  }

  checkSolution() {
    let correct = 0;
    for (let i=0, lim=64; i<lim; ++i) {
      const a = this.grid.solution[i] == 1;
      const b = this.hotspots[i].toggled === undefined ? false : this.hotspots[i].toggled;
      if (a == b) {
        correct += 1;
      }
    }
    console.log(correct);
  }

  printSolution() {
    PrintGrid(this.grid.library, 4);
    PrintGrid(this.grid.basement, 4);
    PrintGrid(this.grid.observatory, 4);
    PrintGrid(this.grid.garden, 4);
    PrintGrid(this.grid.chess, 8);
    PrintGrid(this.grid.solution, 8);

    // check length = 20
    /*
    let count = 0;
    for (let i=0, lim=this.grid.solution.length; i<lim; ++i) {
      count += this.grid.solution[i];
    }
    console.log(count);
    */
  }

  update(delta) {
    this.updateHotspots();
    this.updateTweens(delta);
  }
}

export default PuzzleMainRoom;
