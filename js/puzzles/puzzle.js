/** Base puzzle class. */

class Puzzle {
  constructor(root) {
    this.root = root;
    this.scene = this.root.scene;
    this.camera = this.root.camera;
    this.colliderSystem = this.root.colliderSystem;
    this.hotspots = [];
    this.tweens = [];
  }

  onClick(x, y) {
    for (let i=0, lim=this.hotspots.length; i<lim; ++i) {
      this.hotspots[i].onClick(x, y);
    }
  }

  onMouseMove(x, y) {
    let res = false;
    for (let i=0, lim=this.hotspots.length; i<lim; ++i) {
      this.hotspots[i].onMouseMove(x, y);
      res = res || this.hotspots[i].hover;
    }
    return res;
  }

  updateTweens(delta) {
    for (let i=this.tweens.length-1, lim=-1; i>lim; --i) {
      if (this.tweens[i].update(delta)) {
        this.tweens.splice(i, 1);
      }
    }
  }

  updateHotspots() {
    for (let i=0, lim=this.hotspots.length; i<lim; ++i) {
      this.hotspots[i].update();
    }
  }

  getSelectedMeshes() {
    const res = [];
    for (let i=0, lim=this.hotspots.length; i<lim; ++i) {
      if (this.hotspots[i].hover && this.hotspots[i].mesh.material.visible) {
        res.push(this.hotspots[i].mesh);
      }
    }
    return res;
  }
}

export default Puzzle;
