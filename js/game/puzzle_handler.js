/** Puzzle Handler */

import * as THREE from 'three';
import ChessPuzzle from './chess_puzzle';
import Mouse from '../ui/mouse';

class PuzzleHandler {
  constructor() {
    this.clickThreshold = 20;
    this.puzzles = [];
  }

  bind(root) {
    this.ref = {};
    this.ref.scene = root.modules.scene;
    this.ref.camera = root.modules.camera;
    this.ref.domTarget = document.querySelector('.canvas--3d');
    this.ref.domTarget.addEventListener('mousemove', evt => { this.onMouseMove(evt); });
    this.mouse = new Mouse({
      domTarget: this.ref.domTarget,
      onMouseDown: evt => { this.onMouseDown(evt); },
      onMouseMove: evt => { this.onMouseMove(evt); },
      onMouseUp: evt => { this.onMouseUp(evt); },
    });
  }

  onMouseDown(evt) {}

  onMouseMove(evt) {
    if (!this.mouse.isDown()) {
      this.puzzles.forEach(puzzle => {
        const x = evt.clientX;
        const y = evt.clientY;
        puzzle.onMouseMove(x, y);
      });
    }
  }

  onMouseUp(evt) {
    if (this.mouse.getDeltaMagnitude() <= this.clickThreshold) {
      this.puzzles.forEach(puzzle => {
        const x = evt.clientX;
        const y = evt.clientY;
        puzzle.onMouseDown(x, y);
      });
    }
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
