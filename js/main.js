/** App entry point. */


class App {
  constructor() {
    // init
    this.scene = new Scene();
    this.renderer = new Renderer(this.scene.scene, this.scene.camera);
    
    // run
    this.active = true;
    this.now = performance.now();
    this.loop();
  }

  loop() {
    requestAnimationFrame(() => { this.loop(); });
    if (this.active) {
      const t = performance.now();
      const delta = Math.min(this.maxTimeDelta, (t - this.now) / 1000);
      this.now = t;
      this.scene.update(delta);
      this.surface.update(delta);
      this.renderer.draw(delta);
      this.surface.draw();
    }
  }
}

window.onload = () => {
  const app = new App();
};
