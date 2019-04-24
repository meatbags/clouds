/** Global config. */

import { GetRandomSolutionGrid, GetExclusiveSolutionGrid, MapGrid } from './utils/solution_grid';

const Config = {
  width: 100,
  height: 75,
  player: {
    startPosition: new THREE.Vector3(0, 1, 0),
  },
  world: {
    cloudComplexity: 2,
    offset: {
      chapel: new THREE.Vector3(0, 0, 0),
      turret: new THREE.Vector3(100, 0, 0),
      observatory: new THREE.Vector3(0, 0, 100),
      basement: new THREE.Vector3(-100, 0, 0),
      garden: new THREE.Vector3(0, 0, -100),
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

// create solution grid
Config.puzzle.grid.solution = new Array(64);
MapGrid(Config.puzzle.grid.library, Config.puzzle.grid.solution, 0, 0, 4, 8);
MapGrid(Config.puzzle.grid.basement, Config.puzzle.grid.solution, 4, 0, 4, 8);
MapGrid(Config.puzzle.grid.observatory, Config.puzzle.grid.solution, 0, 4, 4, 8);
MapGrid(Config.puzzle.grid.garden, Config.puzzle.grid.solution, 4, 4, 4, 8);
Config.puzzle.grid.chess = GetExclusiveSolutionGrid(64, 4, Config.puzzle.grid.solution);
MapGrid(Config.puzzle.grid.chess, Config.puzzle.grid.solution, 0, 0, 8, 8, true);

export default Config;
