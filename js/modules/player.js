/**
 ** Handle user input and move/ rotate player position.
 **/

import { Blend, MinAngleBetween } from '../utils/maths';

class Player {
  constructor(root) {
    this.root = root;

    // set position
    this.position = new THREE.Vector3(0, 1, 0);
    this.rotation = new THREE.Vector2(Math.PI, 0);
    this.motion = new THREE.Vector3();
    this.target = {
      position: this.position.clone(),
      rotation: this.rotation.clone(),
      motion: this.motion.clone(),
    };

    // bind collision system
    this.collider = new Collider.Point({
      system: this.root.colliderSystem,
      position: this.target.position,
      motion: this.motion,
      gravity: 18,
      floor: -25,
    });

    // physical attributes
    this.speed = 6;
    this.rotationSpeed = Math.PI * 0.5;
    this.jump = 8;
    this.jumpSpeedMultiplier = 0.25;
    this.height = 2;
    this.falling = false;
    this.fallTime = 0;
    this.fallTimeThreshold = 0.2;
    this.minPitch = Math.PI * -0.2;
    this.maxPitch = Math.PI * 0.25;
    this.adjust = {slow: 0.05, normal: 0.1, fast: 0.125, maximum: 0.3};
    this.noclip = false;
    this.noclipSpeed = 30;

    // input
    this.keys = {disabled: false};
  }

  move(delta) {
    // key input to motion
    if (this.keys.left || this.keys.right) {
      const rot = ((this.keys.left) ? 1 : 0) + ((this.keys.right) ? -1 : 0);
      this.target.rotation.x += rot * this.rotationSpeed * delta;
    }

    if (this.keys.up || this.keys.down) {
      const speed = (this.noclip) ? this.noclipSpeed * (1 - Math.abs(Math.sin(this.target.rotation.y))) : this.speed;
      const dir = ((this.keys.up) ? 1 : 0) + ((this.keys.down) ? -1 : 0);
      this.target.motion.x = Math.sin(this.rotation.x) * speed * dir;
      this.target.motion.z = Math.cos(this.rotation.x) * speed * dir;
    } else {
      this.target.motion.x = 0;
      this.target.motion.z = 0;
    }

    if (this.keys.jump) {
      if (this.motion.y == 0 || this.fallTime < this.fallTimeThreshold) {
        this.motion.y = this.jump;
        this.fallTime = this.fallTimeThreshold;
      }
    }

    // decide if falling
    this.falling = (this.motion.y != 0);
    this.fallTime = (this.falling) ? this.fallTime + delta : 0;

    // noclip
    if (this.noclip) {
      this.falling = false;
      if (this.keys.up || this.keys.down) {
        const d = ((this.keys.up) ? 1 : 0) + ((this.keys.down) ? -1 : 0);
        this.target.motion.y = Math.sin(this.target.rotation.y) * d * this.noclipSpeed;
      } else {
        this.target.motion.y = 0;
      }
      this.motion.y = this.target.motion.y;
    }

    // reduce speed if falling
    if (!this.falling) {
      this.motion.x = this.target.motion.x;
      this.motion.z = this.target.motion.z;
    } else {
      this.motion.x = Blend(this.motion.x, this.target.motion.x, this.jumpSpeedMultiplier);
      this.motion.z = Blend(this.motion.z, this.target.motion.z, this.jumpSpeedMultiplier);
    }
  }

  setRotation(pitch, yaw) {
    this.target.rotation.y = pitch;
    this.target.rotation.x = yaw;
  }

  update(delta) {
    // move
    if (!this.keys.disabled) {
      this.move(delta);
      if (!this.noclip) {
        this.collider.collide(delta);
      } else {
        this.target.position.x += this.motion.x * delta;
        this.target.position.y += this.motion.y * delta;
        this.target.position.z += this.motion.z * delta;
      }
      this.position.x = Blend(this.position.x, this.target.position.x, this.adjust.maximum);
      this.position.y = Blend(this.position.y, this.target.position.y, this.adjust.maximum);
      this.position.z = Blend(this.position.z, this.target.position.z, this.adjust.maximum);
    }

    // rotate
    this.rotation.x += MinAngleBetween(this.rotation.x, this.target.rotation.x) * this.adjust.normal;
    this.rotation.y = Blend(this.rotation.y, this.target.rotation.y, this.adjust.normal);
	}
};

export default Player;
