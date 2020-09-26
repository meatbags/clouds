/** Defaults */

const Config = {
  system: {
    maxPlanesPerMesh: 200,
    useCache: false,
    cacheRadius: 20,
  },
  settings: {
    gravity: 10,
    floor: 0,
    maxVelocity: 50,
    friction: 0.5,
    snapUp: 0.75,
    snapDown: 0.5,
    minSlope: Math.PI / 5,
    noclip: false,
    maxExtrusions: 5,
  },
  plane: {
    dotThreshold: 0.001,
    collisionThreshold: 0.5
  }
};

export default Config;
