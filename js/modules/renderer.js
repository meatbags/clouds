/** Three.js/ webgl renderer. */

import '../lib/glsl';
import Config from '../config';

class Renderer {
  constructor(root) {
    this.root = root;

    // three.js setup
    this.renderer = new THREE.WebGLRenderer({});
    this.renderer.setClearColor(0x0, 1);
    this.renderer.gammaInput = true;
    this.renderer.gammaOutput = true;
    this.renderer.gammaFactor = 2.5;
    this.width = Math.floor(Config.width / 100 * window.innerWidth);
    this.height = Math.floor(Config.height / 100 * window.innerHeight);
    this.size = new THREE.Vector2(this.width, this.height);

    // render passes
    const strength = 0.5;
    const radius = 0.125;
    const threshold = 0.96;
    this.passRender = new THREE.RenderPass(root.logic.scene, root.logic.camera.camera);
    //this.passPoster = new THREE.PosterPass(this.size);
    this.passBloom = new THREE.UnrealBloomPass(this.size, strength, radius, threshold);
    this.passBloom.renderToScreen = true;

    // composer
    this.composer = new THREE.EffectComposer(this.renderer);
    this.composer.addPass(this.passRender);
    //this.composer.addPass(this.passPoster);
    this.composer.addPass(this.passBloom);

    // add to dom
    this.resize();
    window.addEventListener('resize', () => { this.resize(); });
    document.querySelector('#canvas-target').appendChild(this.renderer.domElement);
  }

  resize() {
    this.width = Math.floor(Config.width / 100 * window.innerWidth);
    this.height = Math.floor(Config.height / 100 * window.innerHeight);
    this.size.x = this.width;
    this.size.y = this.height;
    this.renderer.setSize(this.width, this.height);
    this.composer.setSize(this.width, this.height);
    this.passBloom.setSize(this.width, this.height);
  }

  render(delta) {
    this.composer.render(delta);
  }
}

export default Renderer;
