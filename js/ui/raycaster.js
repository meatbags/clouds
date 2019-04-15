/** Raycaster for 3d mouse interaction. */

class Raycaster {
  constructor(camera) {
    this.domElement = document.querySelector('#canvas-target');
    this.camera = camera;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    // dom
    this.resize();
    window.addEventListener('resize', () => { this.resize(); });
  }

  resize() {
    this.rect = this.domElement.getBoundingClientRect();
  }

  intersects(x, y, object) {
    this.mouse.x = (x / this.rect.width) * 2 - 1;
    this.mouse.y = -((y / this.rect.height) * 2 - 1);
    this.raycaster.setFromCamera(this.mouse, this.camera);
    return (this.raycaster.intersectObject(object).length > 0);
  }
}

export default Raycaster;
