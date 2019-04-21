/** Main puzzle. */

import Config from '../config';
import Puzzle from './puzzle';
import Hotspot from '../ui/hotspot';
import Tween from '../utils/tween';

class PuzzleMainRoom extends Puzzle {
  constructor(root) {
    super(root);
    this.solution = {};
    this.solution.grid = Config.puzzle.grid;
    this.solution.composite = new Array(64);

    // map solution grids to composite
    const mapGrid = (grid, x, y, size) => {
      for (let i=0, lim=grid.length; i<lim; ++i) {
        const mx = x + i % size;
        const my = y + (i - (i % size)) / size;
        const index = my * 8 + mx;
        this.solution.composite[index] = grid[i];
      }
    };
    mapGrid(Config.puzzle.grid.library, 0, 0, 4);
    mapGrid(Config.puzzle.grid.basement, 4, 0, 4);
    mapGrid(Config.puzzle.grid.observatory, 0, 4, 4);
    mapGrid(Config.puzzle.grid.garden, 4, 4, 4);

    // create final solution grid
    this.solution.grid.chess = new Array(64);
    const rand = () => { return Math.floor(Math.random() * 64); };
    const indices = [rand(), rand(), rand(), rand()];
    while (indices.length > 0) {
      for (let i=indices.length-1, lim=-1; i>lim; --i) {
        const index = indices[i];
        if (!this.solution.grid.chess[index] && !this.solution.composite[index]) {
          this.solution.grid.chess[index] = 1;
          this.solution.composite[index] = 1;
          indices.splice(i, 1);
        } else {
          indices[i] = rand();
        }
      }
    }
    this.printSolution();

    // temp puzzle
    this.puzzle = {};
    this.puzzle.mesh = new THREE.Mesh(new THREE.BoxBufferGeometry(1, 1, 1), new THREE.MeshStandardMaterial({color: 0x888888}));
    this.puzzle.onClick = () => {
      if (!this.puzzle.active) {
        this.puzzle.active = true;
        this.puzzle.collision.disable();
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
    this.puzzle.mesh.position.copy(Config.player.startPosition);
    this.puzzle.mesh.position.z -= 5;
    this.puzzle.mesh.position.y += 1;
    this.puzzle.mesh.position.x += 1;
    const mesh = new THREE.Mesh(new THREE.BoxBufferGeometry(1, 5, 1));
    mesh.position.copy(this.puzzle.mesh.position);
    this.puzzle.collision = new Collider.Mesh(mesh);
    this.colliderSystem.add(this.puzzle.collision);

    this.hotspots.push(this.puzzle.hotspot);
  }

  printSolution() {
    let printout = '';
    for (let y=0, lim=8; y<lim; ++y) {
      const row = this.solution.composite.slice(y * 8, y * 8 + 8);
      printout += row.join(' ') + '\n';
    }
    console.log(printout);

    // check length = 20
    let count = 0;
    for (let i=0, lim=this.solution.composite.length; i<lim; ++i) {
      count += this.solution.composite[i];
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
