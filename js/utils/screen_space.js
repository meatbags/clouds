/** Screen space conversion util */

class ScreenSpace {
  constructor(camera) {
    this.camera = camera;
    this.helper = new THREE.Vector3();
    this.worldDirection = new THREE.Vector3();
    this.coords = new THREE.Vector2();

    // dom
    this.domElement = document.querySelector('#canvas-target');
    this.resize();
    window.addEventListener('resize', () => { this.resize(); });
  }

  isOnScreen(p) {
    this.camera.getWorldDirection(this.worldDirection);
    this.helper.copy(this.camera.position);
    this.helper.sub(p);
    return this.helper.dot(this.worldDirection) <= 0;
  }

  toScreenSpace(p) {
    this.helper.copy(p);
    this.helper.project(this.camera);
    this.coords.x = (this.helper.x + 1) * this.rect.width / 2;
    this.coords.y = (-this.helper.y + 1) * this.rect.height / 2;
    return this.coords;
  }

  resize() {
    this.rect = this.domElement.getBoundingClientRect();
  }
}

export default ScreenSpace;
