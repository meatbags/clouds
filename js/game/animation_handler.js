/** Animation handler */

import Animation from './animation';

class AnimationHandler {
  constructor() {
    this.animations = [];
  }

  add(params) {
    this.animations.push(new Animation(params));
  }

  update(delta) {
    for (let i=this.animations.length-1; i>=0; i--) {
      const a = this.animations[i];
      a.update(delta);
      if (a.isComplete()) {
        this.animations.splice(i, 1);
      }
    }
  }
}

export default AnimationHandler;
