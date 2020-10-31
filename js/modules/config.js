/** Global config. */

import * as THREE from 'three';
import { GetRandomSolutionGrid, GetExclusiveSolutionGrid, MapGrid } from '../util/solution_grid';

const Config = {
  Camera: {
    fov: 78,
  },
  Controls: {
    height: 2,
    speed: 3,
    speedShift: 6,
    speedNoclip: 30,
    maxPitch: Math.PI / 8,
    minPitch: -Math.PI / 8,
  },
  Scene: {
    cloudComplexity: 2,
    sunlightDirection: new THREE.Vector3(0.25, -1, 0.5),
    offset: {
      chapel: new THREE.Vector3(0, 0, 0),
      turret: new THREE.Vector3(100, 0, 0),
      observatory: new THREE.Vector3(0, 0, 100),
      basement: new THREE.Vector3(-100, 0, 0),
      garden: new THREE.Vector3(0, 0, -100),
    }
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
