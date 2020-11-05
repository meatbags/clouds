/** Load and maintain portals */

import * as THREE from 'three';
import Config from '../modules/config';
import Portal from './portal';

class PortalHandler {
  constructor() {
    this.portals = [];
  }

  bind(root) {
    this.ref = {};
    this.ref.scene = root.modules.scene;
    this.ref.camera = root.modules.camera.getCamera();
    this.ref.controls = root.modules.controls;

    // init portals
    this.createPortals();
  }

  createPortals() {
    const size = new THREE.Vector3(4, 8, 4);
    const offset = Config.Scene.offset;

    // chapel <-> basement
    const from1 = new THREE.Box3();
    const to1 = new THREE.Box3();
    from1.setFromCenterAndSize(new THREE.Vector3(8, -2, 12).add(offset.chapel), size.clone());
    to1.setFromCenterAndSize(new THREE.Vector3(8, 10, 12).add(offset.basement), size.clone());
    const from2 = new THREE.Box3();
    const to2 = new THREE.Box3();
    from2.setFromCenterAndSize(new THREE.Vector3(4, 11, 12).add(offset.basement), size.clone());
    to2.setFromCenterAndSize(new THREE.Vector3(4, -1, 12).add(offset.chapel), size.clone());

    // library (chapel) <-> basement
    const from3 = new THREE.Box3();
    const to3 = new THREE.Box3();
    from3.setFromCenterAndSize(new THREE.Vector3(-40, 2, -12).add(offset.chapel), size.clone());
    to3.setFromCenterAndSize(new THREE.Vector3(-40, 14, -12).add(offset.basement), size.clone());
    const from4 = new THREE.Box3();
    const to4 = new THREE.Box3();
    from4.setFromCenterAndSize(new THREE.Vector3(-44, 14, -12).add(offset.basement), size.clone());
    to4.setFromCenterAndSize(new THREE.Vector3(-44, 2, -12).add(offset.chapel), size.clone());

    // chapel <-> observatory
    const from5 = new THREE.Box3();
    const to5 = new THREE.Box3();
    from5.setFromCenterAndSize(new THREE.Vector3(-8, 7, 12).add(offset.chapel), size.clone());
    to5.setFromCenterAndSize(new THREE.Vector3(-28, 7, 12).add(offset.observatory), size.clone());
    const from6 = new THREE.Box3();
    const to6 = new THREE.Box3();
    from6.setFromCenterAndSize(new THREE.Vector3(-24, 4, 12).add(offset.observatory), size.clone());
    to6.setFromCenterAndSize(new THREE.Vector3(-4, 4, 12).add(offset.chapel), size.clone());

    // observatory <-> garden
    const from7 = new THREE.Box3();
    const to7 = new THREE.Box3();
    from7.setFromCenterAndSize(new THREE.Vector3(20, 4, -8).add(offset.observatory), size.clone());
    to7.setFromCenterAndSize(new THREE.Vector3(24, 10, 4).add(offset.garden), size.clone());
    const from8 = new THREE.Box3();
    const to8 = new THREE.Box3();
    from8.setFromCenterAndSize(new THREE.Vector3(24, 13, 8).add(offset.garden), size.clone());
    to8.setFromCenterAndSize(new THREE.Vector3(20, 7, -4).add(offset.observatory), size.clone());

    // garden -> library
    const from9 = new THREE.Box3();
    const to9 = new THREE.Box3();
    from9.setFromCenterAndSize(new THREE.Vector3(-10, -6, 15).add(offset.garden), size.clone());
    to9.setFromCenterAndSize(new THREE.Vector3(-34, 9, 0).add(offset.chapel), size.clone());

    // Sculptor's Loft -> Fulcrum Chamber
    const from10 = new THREE.Box3();
    const to10 = new THREE.Box3();
    from10.setFromCenterAndSize(new THREE.Vector3(8, -6.5, -2).add(offset.sculptors_loft), size.clone());
    to10.setFromCenterAndSize(new THREE.Vector3(16, 14.5, -6).add(offset.chapel), size.clone());
    const from11 = new THREE.Box3();
    const to11 = new THREE.Box3();
    from11.setFromCenterAndSize(new THREE.Vector3(16, 17.5, -2).add(offset.chapel), size.clone());
    to11.setFromCenterAndSize(new THREE.Vector3(8, -3.5, 2).add(offset.sculptors_loft), size.clone());
    const portal10 = new Portal(from10, to10, { callback: () => { this.ref.scene.showRoom('fulcrum_chamber'); } });
    const portal11 = new Portal(from11, to11, { callback: () => { this.ref.scene.showRoom('sculptors_loft'); } });
    portal10.addHelpers(this.ref.scene.getScene());
    portal11.addHelpers(this.ref.scene.getScene());
    this.portals.push(portal10);
    this.portals.push(portal11);

    // create portals
    const portalList = [[from1, to1], [from2, to2], [from3, to3], [from4, to4], [from5, to5], [from6, to6], [from7, to7], [from8, to8], [from9, to9]];
    portalList.forEach(e => {
      const portal = new Portal(e[0], e[1], { callback: null });
      portal.addHelpers(this.ref.scene.getScene());
      this.portals.push(portal);
    });
  }

  update() {
    for (let i=0, lim=this.portals.length; i<lim; ++i) {
      this.portals[i].update(this.ref.camera, this.ref.controls);
    }
  }
}

export default PortalHandler;
