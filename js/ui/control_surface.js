/** Control surface/ user interface. */

import Mouse from './mouse';
import Keyboard from './keyboard';
import { Clamp } from '../utils/maths';

class ControlSurface {
  constructor(root) {
    this.logic = root.logic;
    this.player = root.logic.player;
    this.domElement = document.querySelector('#canvas-target');
    this.rect = null;
    this.centre = {x:0, y:0};
    this.rotation = new THREE.Vector2();
    this.timestamp = null;
    this.threshold = {click: 225, pan: 200, mouseDelta: 0.25};
    this.scaleRotation = {x: 1, y: 1};

    // events
    this.resize();
    window.addEventListener('resize', () => { this.resize(); });
    this.keyboard = new Keyboard((key) => { this.onKeyboard(key); });
    this.mouse = new Mouse(
      this.domElement,
      (e) => { this.onMouseDown(e); },
      (e) => { this.onMouseMove(e); },
      (e) => { this.onMouseUp(e); },
      this.isMobile
    );
  }

  processTouch(e) {
    let x = 0, y = 0;
    if (e.targetTouches && e.targetTouches.length) {
      const rect = this.domElement.getBoundingClientRect();
      const touch = e.targetTouches[0];
      x = touch.pageX - rect.left;
      y = touch.pageY - rect.top;
    }
    return {offsetX: x, offsetY: y};
  }

  onMouseDown(e) {
    // record player rotation
    this.rotation.y = this.player.rotation.y;
    this.rotation.x = this.player.rotation.x;
    this.timestamp = performance.now();
    this.mouse.start(e);

    // set cursor position
    this.onMouseMove(e);
  }

  onMouseMove(e) {
    this.mouse.move(e);

    if (this.mouse.active) {
      // update player rotation
      if (!(this.player.keys.left || this.player.keys.right)) {
        const yaw = this.rotation.x + (this.mouse.delta.x / this.centre.x) * this.scaleRotation.x;
        const pitch = Clamp(this.rotation.y + (this.mouse.delta.y / this.centre.y) * this.scaleRotation.y, this.player.minPitch, this.player.maxPitch);
        if (pitch == this.player.minPitch || pitch == this.player.maxPitch) {
          this.mouse.origin.y = e.offsetY;
          this.rotation.y = pitch;
        }
        this.player.setRotation(pitch, yaw);
      }
    } else {
      this.logic.world.puzzleHandler.onMouseMove(e.clientX - this.rect.left, e.clientY - this.rect.top);
    }
  }

  onMouseUp(e) {
    this.mouse.stop();

    // check for click
    const now = performance.now();
    if ((now - this.timestamp < this.threshold.click) && Math.hypot(this.mouse.delta.x, this.mouse.delta.y) < window.innerWidth * this.threshold.mouseDelta) {
      this.logic.world.puzzleHandler.onClick(e.clientX - this.rect.left, e.clientY - this.rect.top);
      this.timestamp = performance.now();
    }
  }

  onKeyboard(key) {
    switch (key) {
      case 'a': case 'A': case 'ArrowLeft':
        this.player.keys.left = this.keyboard.keys[key];
        break;
      case 'd': case 'D': case 'ArrowRight':
        this.player.keys.right = this.keyboard.keys[key];
        break;
      case 'w': case 'W': case 'ArrowUp':
        this.player.keys.up = this.keyboard.keys[key];
        break;
      case 's': case 'S': case 'ArrowDown':
        this.player.keys.down = this.keyboard.keys[key];
        break;
      case 'x': case 'X':
        if (this.keyboard.isControl()) {
          this.player.noclip = this.player.noclip == false;
          this.keyboard.release(key);
        }
        break;
      case ' ':
        this.player.keys.jump = this.keyboard.keys[key];
        break;
      default:
        break;
    }
  }

  resize() {
    this.rect = this.domElement.getBoundingClientRect();
    this.centre.x = this.rect.width / 2;
    this.centre.y = this.rect.height / 2;
  }
}

export default ControlSurface;
