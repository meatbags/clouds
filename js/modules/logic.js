/** Game logic. */

import Player from './player';
import Camera from './camera';
import World from './world';
import Canvas2D from './canvas_2d';
import PortalHandler from '../ui/portal_handler';
import PuzzleHandler from '../puzzles/puzzle_handler';

class Logic {
  constructor() {
    this.scene = new THREE.Scene();
    this.colliderSystem = new Collider.System();
    this.player = new Player(this);
    this.camera = new Camera(this);
    this.canvas2D = new Canvas2D();

    // game logic
    this.world = new World(this.scene, this.player, this.colliderSystem);
    this.portalHandler = new PortalHandler(this.scene, this.player);
    this.puzzleHandler = new PuzzleHandler(this.scene, this.camera.camera, this.colliderSystem);

    // settings -- sky 0x111823 prussian blue 0x003153
    this.fps = [];
    this.scene.fog = new THREE.FogExp2(0x111823, 0.004);
  }

  bind(root) {
    this.puzzleHandler.setOutlinePassTarget(root.renderer.passOutline);
  }

  update(delta) {
    this.portalHandler.update(delta);
    this.puzzleHandler.update(delta);
    this.world.update(delta);
    this.player.update(delta);
    this.camera.update(delta);
  }

  draw(delta) {
    this.canvas2D.clear();
    this.canvas2D.setStyle();
    this.puzzleHandler.draw(this.canvas2D.ctx);

    // dev
    this.fps.unshift(1 / delta);
    this.fps.splice(20, 1);
    const sum = this.fps.reduce((s, a) => s + a) / this.fps.length;
    const text = Math.round(sum) + (this.player.noclip ? ' [noclip]' : '');
    this.canvas2D.ctx.fillText(text, 20, this.canvas2D.cvs.height - 20);
  }
}

export default Logic;
