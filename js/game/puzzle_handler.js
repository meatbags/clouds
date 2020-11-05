/** Puzzle Handler */

import * as THREE from 'three';
import ChessPuzzle from './chess_puzzle';

class PuzzleHandler {
  constructor() {
    this.puzzles = [];
  }

  bind(root) {
    this.ref = {};
    this.ref.scene = root.modules.scene;
    this.ref.camera = root.modules.camera;
  }

  initPuzzles() {
    this.puzzles.push(new ChessPuzzle(this.ref.scene, this.ref.camera));
  }

  update(delta) {
    this.puzzles.forEach(puzzle => {
      puzzle.update(delta);
    });
  }
}

export default PuzzleHandler;
