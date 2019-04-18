/** Global config. */

const Config = {
  width: 100,
  height: 75,
  player: {
    startPosition: new THREE.Vector3(4, 18, -8),
  },
  world: {
    offset: {
      turret: new THREE.Vector3(4, 17, -8),
      library: new THREE.Vector3(0, 0, 0),
      main: new THREE.Vector3(0, 0, 0),
      observatory: new THREE.Vector3(0, 0, 0),
      basement: new THREE.Vector3(0, 0, 0),
      garden: new THREE.Vector3(0, 0, 0),
    }
  }
};

export default Config;
