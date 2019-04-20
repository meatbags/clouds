/** Tween value */

class Tween {
  constructor(target, key, from, to, settings) {
    this.target = target;
    this.key = key;
    this.from = from;
    this.to = to;
    this.age = 0;
    this.duration = settings.duration || 1;
    this.easing = settings.easing || null;
    this.onComplete = settings.onComplete || null;

    // flag vector3
    const v = target[key];
    if (v.isVector3 || v.isEuler) {
      this.vector3 = v;
      this.isVector3 = true;
    }
  }

  update(delta) {
    this.age += delta;
    const t = Math.min(1, this.age / this.duration);
    const res = t == 1;

    // apply tween
    if (this.isVector3) {
      this.vector3.x = this.from.x + (this.to.x - this.from.x) * t;
      this.vector3.y = this.from.y + (this.to.y - this.from.y) * t;
      this.vector3.z = this.from.z + (this.to.z - this.from.z) * t;
    } else {
      this.target[this.key] = this.from + (this.to - this.from) * t;
    }

    // complete
    if (res && this.onComplete) {
      this.onComplete();
    }

    return res;
  }
}

export default Tween;
