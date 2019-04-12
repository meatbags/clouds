/** Control surface and player interface. Handles user input. */

import Mouse from '../ui/mouse';
import Keyboard from '../ui/keyboard';
import { Clamp } from '../utils/maths';

class ControlSurface {
  constructor(root) {
    this.player = root.logic.player;
    this.domElement = document.querySelector('#canvas-target');
    this.centre = {x:0, y:0};
    this.resize();
    this.rotation = new THREE.Vector2();
    this.timestamp = null;
    this.threshold = {click: 225, pan: 200, mouseDelta: 0.25};
    this.scaleRotation = {x: 1, y: 1};

    // events
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
    var x = 0;
    var y = 0;
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
    this.timestamp = Date.now();
    this.mouse.start(e);

    // set cursor position mobile
    if (this.isMobile) {
      this.onMouseMove(e);
    }
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
      // mouse move
    }
  }

  onMouseUp(e) {
    this.mouse.stop();
    if (Date.now() - this.timestamp < this.threshold.click && Math.hypot(this.mouse.delta.x, this.mouse.delta.y) < window.innerWidth * this.threshold.mouseDelta) {
       // click !
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
      case ' ':
        this.player.keys.jump = this.keyboard.keys[key];
        break;
      default:
        break;
    }
  }

  resize() {
    const rect = this.domElement.getBoundingClientRect();
    this.centre.x = rect.width / 2;
    this.centre.y = rect.height / 2;
  }
}

export default ControlSurface;
