/** Teleport player */

class Portal {
  constructor(from, to, settings) {
    // settings
    this.from = from;
    this.to = to;
    this.onTeleport = settings.onTeleport || null;
    if (settings.showBoxes && settings.scene) {
      const helper1 = new THREE.Box3Helper(this.from, 0xffffff);
      const helper2 = new THREE.Box3Helper(this.to, 0xffffff);
      settings.scene.add(helper1, helper2);
    }

    // set delta
    this.delta = new THREE.Vector3();
    const a = new THREE.Vector3();
    const b = new THREE.Vector3();
    this.from.getCenter(a);
    this.to.getCenter(b);
    b.sub(a);
    this.delta.copy(b);
  }

  teleport(player) {
    player.position.add(this.delta);
    player.target.position.add(this.delta);

    if (this.onTeleport) {
      this.onTeleport();
    }
  }

  update(player) {
    if (this.from.containsPoint(player.position)) {
      this.teleport(player);
    }
  }
}

export default Portal;
