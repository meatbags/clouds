/** Global config. */

const Config = {
  width: 100,
  height: 75,
  player: {
    startPosition: new THREE.Vector3(4, 18, -8),
  },
  world: {
    cloudComplexity: 1,
    offset: {
      turret: new THREE.Vector3(4, 17, -8),
      library: new THREE.Vector3(0, 0, 0),
      main: new THREE.Vector3(0, 0, 0),
      observatory: new THREE.Vector3(0, 0, 0),
      basement: new THREE.Vector3(0, 0, 0),
      garden: new THREE.Vector3(0, 0, 0),
    }
  },
  lighting: {
    sunlightDirection: new THREE.Vector3(0, -0.35, 1),
  },
};

export default Config;
