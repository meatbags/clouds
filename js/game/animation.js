/** Animation */

import MinAngleBetween from '../util/min_angle_between';

class Animation {
  constructor(params) {
    this.duration = params.duration || 1;
    this.object = params.object;
    this.var = params.var;
    this.from = params.from || this.object[this.var];
    this.to = params.to;
    this.callback = params.callback || null;
    this.easing = params.easing || 'linear';
    this.isVector2 = this.object[this.var].isVector2 || false;
    this.isVector3 = this.object[this.var].isVector3 || false;
    this.isAngle = params.isAngle || false;
    this.age = 0;
    this.complete = false;
  }

  getEasing(t) {
    if (this.easing === 'ease-in') {
      return t * t;
    } else if (this.easing === 'ease-out') {
      return t + (t - t * t);
    } else if (this.easing === 'ease-in-and-out') {
      return t < 0.5 ? 2*t*t : -1+(4-2*t)*t;
    }
    return t;
  }

  isComplete() {
    return this.complete;
  }

  update(delta) {
    if (!this.complete) {
      // get t
      this.age = Math.min(this.duration, this.age + delta);
      const t = this.getEasing(this.age / this.duration);

      // animate Vector3
      if (this.isVector3) {
        const vec = this.object[this.var];
        vec.x = this.from.x + t * (this.to.x - this.from.x);
        vec.y = this.from.y + t * (this.to.y - this.from.y);
        vec.z = this.from.z + t * (this.to.z - this.from.z);

      // animate Vector2
      } else if (this.isVector2) {
        const vec = this.object[this.var];
        vec.x = this.from.x + t * (this.to.x - this.from.x);
        vec.y = this.from.y + t * (this.to.y - this.from.y);

      // animate single value
      } else {
        if (this.isAngle) {
          this.object[this.var] = this.from + t * MinAngleBetween(this.from, this.to);
        } else {
          this.object[this.var] = this.from + t * (this.to - this.from);
        }
      }

      // check complete
      this.complete = this.age >= this.duration;
      if (this.complete && this.callback) {
        this.callback();
      }
    }
  }
}

export default Animation;
