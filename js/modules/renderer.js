/** WebGL Renderer */
import '../lib/glsl';

class Renderer {
  constructor(scene, camera) {
    this.renderer = new THREE.WebGLRenderer({});
    this.renderer.setClearColor(0x0, 1);
    this.renderer.gammaInput = true;
    this.renderer.gammaOutput = true;
    this.renderer.gammaFactor = 2; // default

    // render passes
    const strength = 0.5;
    const radius = 0.125;
    const threshold = 0.96;
    this.passRender = new THREE.RenderPass(scene, camera);
    this.passPoster = new THREE.PosterPass(this.size);
    this.passBloom = new THREE.UnrealBloomPass(this.size, strength, radius, threshold);
    this.passBloom.renderToScreen = true;

    // composer
    this.composer = new THREE.EffectComposer(this.renderer);
    this.composer.addPass(this.passRender);
    this.composer.addPass(this.passPoster);
    this.composer.addPass(this.passBloom);
    
    // add to dom
    this.resize();
    document.querySelector('#canvas-target').appendChild(this.renderer.domElement);
  }

  resize() {
    this.width = 800;
    this.height = 600;
    this.renderer.setSize(this.width, this.height);
    this.composer.setSize(this.width, this.height);
    this.passBloom.setSize(this.width, this.height);
  }

  render(delta) {
    this.composer.render(delta);
  }
}
