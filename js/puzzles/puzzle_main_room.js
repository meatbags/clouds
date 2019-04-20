/** Main puzzle. */

import Config from '../config';
import Puzzle from './puzzle';
import Hotspot from '../ui/hotspot';
import Tween from '../utils/tween';

class PuzzleMainRoom extends Puzzle {
  constructor(root) {
    super(root);

    // temp puzzle
    this.puzzle = {};
    this.puzzle.mesh = new THREE.Mesh(new THREE.BoxBufferGeometry(1, 1, 1), new THREE.MeshStandardMaterial({color: 0x888888}));
    this.puzzle.onClick = () => {
      if (!this.puzzle.active) {
        this.puzzle.active = true;
        this.puzzle.collision.disable();
        const from = this.puzzle.mesh.rotation.clone();
        const to = from.clone();
        to.y += Math.PI / 2;
        this.tweens.push(new Tween(
          this.puzzle.mesh, "rotation", from, to, {duration: 0.5, onComplete: () => { this.puzzle.active = false; }}
        ));
      }
    };
    this.puzzle.hotspot = new Hotspot(this.scene, this.camera, {
      mesh: this.puzzle.mesh,
      clickEvent: this.puzzle.onClick,
    });
    this.puzzle.mesh.position.copy(Config.player.startPosition);
    this.puzzle.mesh.position.z -= 5;
    this.puzzle.mesh.position.y += 1;
    this.puzzle.mesh.position.x += 1;
    const mesh = new THREE.Mesh(new THREE.BoxBufferGeometry(1, 5, 1));
    mesh.position.copy(this.puzzle.mesh.position);
    this.puzzle.collision = new Collider.Mesh(mesh);
    this.colliderSystem.add(this.puzzle.collision);

    this.hotspots.push(this.puzzle.hotspot);
  }

  update(delta) {
    this.updateHotspots();
    this.updateTweens(delta);
  }
}

export default PuzzleMainRoom;
