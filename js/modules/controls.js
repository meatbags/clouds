/** Camera controls */

import * as THREE from 'three';
import Config from './config';
import ColliderObject from '../collider/collider_object';
import Blend from '../util/blend';
import Clamp from '../util/clamp';
import MinAngleBetween from '../util/min_angle_between';
import CreateElement from '../util/create_element';
import Mouse from '../ui/mouse';
import Keyboard from '../ui/keyboard';

class Controls {
  constructor() {
    this.active = true;

    // settings
    this.blendPosition = 0.25;
    this.blendRotation = 0.2;
    this.maxPitch = Config.Controls.maxPitch;
    this.minPitch = Config.Controls.minPitch;
    this.height = Config.Controls.height;
    this.speed = Config.Controls.speed;
    this.speedShift = Config.Controls.speedShift;
    this.speedNoclip = Config.Controls.speedNoclip;
    this.keys = {up: false, down: false, left: false, right: false, jump: false, noclip: false};
    this.domTarget = document.querySelector('#canvas-target');

    // position containers
    this.position = new THREE.Vector3();
    this.positionTarget = new THREE.Vector3();
    this.motion = new THREE.Vector3();
  }

  bind(root) {
    this.ref = {};
    this.ref.camera = root.modules.camera.getCamera();
    this.ref.scene = root.modules.scene;

    // copy camera position
    this.position.x = this.ref.camera.position.x;
    this.position.y = this.ref.camera.position.y;
    this.position.z = this.ref.camera.position.z;
    this.positionTarget.copy(this.ref.camera.position);

    // collider
    this.collider = new ColliderObject({
      position: this.positionTarget,
      motion: this.motion,
      system: this.ref.scene.getColliderSystem(),
    });

    // rotation
    const pitch = this.ref.camera.rotation.x;
    const yaw = this.ref.camera.rotation.y;
    this.rotation = {
      pitch: pitch,
      yaw: yaw,
      modifier: 1.125,
      origin: {pitch: pitch, yaw: yaw},
      target: {pitch: pitch, yaw: yaw},
      cache: {pitch: 0, yaw: 0},
      size: {pitch: 0, yaw: 0},
    };

    // init mouse/ keyboard
    this.mouse = new Mouse({
      domTarget: this.domTarget,
      onMouseDown: evt => { this.onMouseDown(evt); },
      onMouseMove: evt => { this.onMouseMove(evt); },
      onMouseUp: evt => { this.onMouseUp(evt); },
      onMouseLeave: evt => { this.onMouseLeave(evt); },
    });
    this.keyboard = new Keyboard((key, evt) => {
      this.onKeyboard(key, evt);
    });
  }

  onMouseDown(evt) {
    if (!this.active) {
      return;
    }

    // calculate working area
    const rect = this.domTarget.getBoundingClientRect();
    this.centre = {x: rect.width / 2, y: rect.height / 2,};

    // cache rotation
    this.rotation.origin.yaw = this.rotation.yaw;
    this.rotation.origin.pitch = this.rotation.pitch;

    // calculate rotation size basis
    this.rotation.size.pitch = (this.ref.camera.fov / 2) * (Math.PI / 180);
    this.rotation.size.yaw = this.rotation.size.pitch * (rect.width / rect.height);

    // set touchmove timeout
    this.touchMoveTimeout = false;
    setTimeout(() => {
      if (this.mouse.active) {
        this.touchMoveTimeout = true;
      }
    }, 100);
  }

  onMouseMove(evt) {
    if (this.active && this.mouse.active) {
      // update player rotation
      const dyaw = (this.mouse.delta.x / this.centre.x) * this.rotation.size.yaw;
      const dpitch = (this.mouse.delta.y / this.centre.y) * this.rotation.size.pitch;
      const yaw = this.rotation.origin.yaw + dyaw * this.rotation.modifier;
      const pitch = Clamp(this.rotation.origin.pitch + dpitch, this.minPitch, this.maxPitch);

      // reset mouse.y origin is clamped
      if (pitch === this.minPitch || pitch === this.maxPitch) {
        this.mouse.origin.y = evt.clientY - this.mouse.top;
        this.rotation.origin.pitch = pitch;
      }

      // set target
      this.rotation.target.pitch = pitch;
      this.rotation.target.yaw = yaw;
    }
  }

  onMouseUp(evt) {
    if (!this.active) {
      return;
    }

    const dt = performance.now() - this.timestamp;
    const dx = Math.hypot(this.mouse.delta.x, this.mouse.delta.y);
    if (dt < this.clickThreshold && dx < window.innerWidth * this.threshold.mouseDelta) {
      if (this.isMobile) {
        console.log('[Controls] Stopped click event');
        evt.preventDefault();
        evt.stopPropagation();
      }
    }
  }

  onMouseLeave() {}

  onKeyboard(key, evt) {
    switch (key) {
      case 'a': case 'A': case 'ArrowLeft':
        if (key === 'ArrowLeft') {
          evt.preventDefault();
        }
        this.keys.left = this.keyboard.keys[key];
        break;
      case 'd': case 'D': case 'ArrowRight':
        if (key === 'ArrowRight') {
          evt.preventDefault();
        }
        this.keys.right = this.keyboard.keys[key];
        break;
      case 'w': case 'W': case 'ArrowUp':
        if (key === 'ArrowUp') {
          evt.preventDefault();
        }
        this.keys.up = this.keyboard.keys[key];
        break;
      case 's': case 'S': case 'ArrowDown':
        if (key === 'ArrowDown') {
          evt.preventDefault();
        }
        this.keys.down = this.keyboard.keys[key];
        break;
      case ' ':
        evt.preventDefault();
        this.keys.jump = this.keyboard.keys[key];
        break;
      case 'x': case 'X':
        // toggle noclip on ctrl+x
        if (this.keyboard.keys['x'] || this.keyboard.keys['X']) {
          if (this.keyboard.isControl()) {
            this.keys.noclip = this.keys.noclip === false;
            console.log('[Controls] noclip:', this.keys.noclip);
            console.log('[Controls] camera:', this.ref.camera);
          }
          this.keyboard.release('x');
          this.keyboard.release('X');
        }
        break;
      default:
        break;
    }
  }

  disable() {
    this.active = false;
  }

  enable() {
    this.active = true;
  }

  update(delta) {
    if (this.active) {
      // handle direction keys
      if (this.keys.up || this.keys.down || this.keys.left || this.keys.right) {
        let speed = this.keyboard.isShift() ? this.speedShift : this.speed;
        if (this.keys.noclip) {
          speed = this.speedNoclip * (1 - Math.abs(Math.sin(this.rotation.pitch)));
        }
        const ws = ((this.keys.up) ? 1 : 0) + ((this.keys.down) ? -1 : 0);
        const ad = ((this.keys.left) ? 1 : 0) + ((this.keys.right) ? -1 : 0);
        const scale = ws != 0 && ad != 0 ? 0.7071 : 1;
        this.motion.x = (Math.sin(this.rotation.yaw) * speed * ws + Math.sin(this.rotation.yaw + Math.PI / 2) * speed * ad) * scale * -1;
        this.motion.z = (Math.cos(this.rotation.yaw) * speed * ws + Math.cos(this.rotation.yaw + Math.PI / 2) * speed * ad) * scale * -1;
      } else {
        this.motion.x = 0;
        this.motion.z = 0;
      }

      // noclip
      if (this.keys.noclip) {
        if (this.keys.up || this.keys.down) {
          const d = ((this.keys.up) ? 1 : 0) + ((this.keys.down) ? -1 : 0);
          this.motion.y = Math.sin(this.rotation.target.pitch) * d * this.speedNoclip;
        } else {
          this.motion.y = 0;
        }
      }

      // apply motion to collider
      if (!this.keys.noclip) {
        this.collider.collide(delta);
      } else {
        this.positionTarget.x += this.motion.x * delta;
        this.positionTarget.y += this.motion.y * delta;
        this.positionTarget.z += this.motion.z * delta;
      }
    }

    // update position
    this.position.x = Blend(this.position.x, this.positionTarget.x, this.blendPosition);
    this.position.y = Blend(this.position.y, this.positionTarget.y, this.blendPosition);
    this.position.z = Blend(this.position.z, this.positionTarget.z, this.blendPosition);

    // set position
    this.ref.camera.position.x = this.position.x;
    this.ref.camera.position.y = this.position.y + this.height;
    this.ref.camera.position.z = this.position.z;

    // set rotation
    this.rotation.yaw += MinAngleBetween(this.rotation.yaw, this.rotation.target.yaw) * this.blendRotation;
    this.rotation.pitch = Blend(this.rotation.pitch, this.rotation.target.pitch, this.blendRotation);
    this.ref.camera.rotation.x = this.rotation.pitch;
    this.ref.camera.rotation.y = this.rotation.yaw;
  }
}

export default Controls;
