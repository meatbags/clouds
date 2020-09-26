/** Useful maths */

import * as THREE from 'three';

const twoPi = Math.PI * 2;

const copyVector = function(vec) {
  const copied = new THREE.Vector3(
    vec.x,
    vec.y,
    vec.z
  );

  return copied;
};

const addVector = function(a, b) {
  return new THREE.Vector3(
    a.x + b.x,
    a.y + b.y,
    a.z + b.z
  );
};

const averageVectors = function(a, b) {
  return new THREE.Vector3(
    (a.x + b.x) / 2,
    (a.y + b.y) / 2,
    (a.z + b.z) / 2
  );
};

const subtractVector = function(a, b) {
  const c = new THREE.Vector3(
    a.x - b.x,
    a.y - b.y,
    a.z - b.z
  );

  return c;
};

const mulVector = function(a, b) {
  const v = new THREE.Vector3(
    a.x * b.x,
    a.y * b.y,
    a.z * b.z
  );

  return v;
};

const normalise = function(a){
  const mag = Math.sqrt(a.x * a.x + a.y * a.y + a.z * a.z);

  if (mag == 0) {
    return new THREE.Vector3(0, 0, 0);
  } else {
    return new THREE.Vector3(
      a.x / mag,
      a.y / mag,
      a.z / mag
    );
  }
};

const normalise2 = function(a) {
  const mag = Math.sqrt(a.x * a.x + a.y * a.y);

  if (mag == 0) {
    return new THREE.Vector2(0, 0);
  } else {
    return new THREE.Vector2(
      a.x / mag,
      a.y / mag
    );
  }
}

const reverseVector = function(a) {
  a.x *= -1;
  a.y *= -1;
  a.z *= -1;

  return a;
};

const distanceBetween = function(a, b) {
  return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2) + Math.pow(b.z - a.z, 2));
};

const distanceBetween2D = function(a, b) {
  return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.z - a.z, 2));
}

const pitchBetween = function(a, b) {
  const xz = distanceBetween2D(a, b);
  const y = b.y - a.y;
  const pitch = Math.atan2(y, xz);

  return pitch;
}

const scaleVector = function(v, scale) {
  const vec = new THREE.Vector3(
    v.x * scale,
    v.y * scale,
    v.z * scale
  );

  return vec;
};

const scaleByVector = function(v, scale) {
  const vec = new THREE.Vector3(
    v.x * scale.x,
    v.y * scale.y,
    v.z * scale.z
  );

  return vec;
}

const isVectorEqual = function(a, b) {
  return (a.x === b.x && a.y === b.y & a.z === b.z);
}

const crossProduct = function(a, b) {
  const c = new THREE.Vector3(
    a.y * b.z - a.z * b.y,
    a.z * b.x - a.x * b.z,
    a.x * b.y - a.y * b.x
  );

  return c;
};

const minAngleDifference = function(a1, a2) {
  const angle = Math.atan2(Math.sin(a2 - a1), Math.cos(a2 - a1))

  return angle;
}

const dotProduct = function(a, b) {
  return a.x * b.x + a.y * b.y + a.z * b.z;
};

const dotProduct2 = function(a, b) {
  return a.x * b.x + a.y * b.y;
};

export {
  addVector,
  averageVectors,
  copyVector,
  crossProduct,
  distanceBetween,
  distanceBetween2D,
  dotProduct,
  dotProduct2,
  isVectorEqual,
  minAngleDifference,
  mulVector,
  normalise,
  normalise2,
  pitchBetween,
  reverseVector,
  subtractVector,
  scaleVector,
  scaleByVector,
  twoPi
};
