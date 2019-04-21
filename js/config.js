/** Global config. */

import GetRandomSolutionGrid from './utils/get_random_solution_grid';

const Config = {
  width: 100,
  height: 75,
  player: {
    startPosition: new THREE.Vector3(4, 18, -8),
  },
  world: {
    cloudComplexity: 0,
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
  puzzle: {
    grid: {
      library: GetRandomSolutionGrid(16, 4),
      basement: GetRandomSolutionGrid(16, 4),
      observatory: GetRandomSolutionGrid(16, 4),
      garden: GetRandomSolutionGrid(16, 4),
    }
  },
};

export default Config;
