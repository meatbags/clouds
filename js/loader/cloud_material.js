/**
  * @author https://github.com/meatbags
  */

import Config from '../modules/config';
import * as THREE from 'three';

const CloudMaterial = new THREE.ShaderMaterial({
	uniforms: {
  	uTime: { value: 1.0 },
    uDetailLevel: { value: Config.Scene.cloudComplexity }, // 1, 2, 3
	},
	vertexShader: `
    varying vec2 vUV;
    void main() {
      vUV = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
	fragmentShader: `
    const float sqrt_half = 0.7071;
    const float sqrt2 = 1.41421;
    const float sqrt2_2 = 2.82842;
    const float const289 = 0.00346020761; //= 1.0 / 289.0
    varying vec2 vUV;
    uniform float uTime;
    uniform float uDetailLevel;

    // height normals
    vec3 computeNormal(vec3 a, vec3 b, vec3 c, float height) {
      vec3 ab = vec3(1.0, (b.y - a.y) * height, 0.0);
      vec3 ac = vec3(0.0, (c.y - a.y) * height, 1.0);
      return cross(normalize(ab), normalize(ac));
    }

    // smoothing
    vec3 mod289(vec3 x) { return x - floor(x * const289) * 289.0; }
    vec4 mod289(vec4 x) { return x - floor(x * const289) * 289.0; }
    vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
    vec3 fade(vec3 t) { return t * t * t * (t * (t * 6.0 - 15.0) + 10.0); }

    // perlin noise
    float noise(vec3 v) {
        vec3 i0 = mod289(floor(v)), i1 = mod289(i0 + vec3(1.0));
        vec3 f0 = fract(v), f1 = f0 - vec3(1.0), f = fade(f0);
        vec4 ix = vec4(i0.x, i1.x, i0.x, i1.x), iy = vec4(i0.yy, i1.yy);
        vec4 iz0 = i0.zzzz, iz1 = i1.zzzz;
        vec4 ixy = permute(permute(ix) + iy), ixy0 = permute(ixy + iz0), ixy1 = permute(ixy + iz1);
        vec4 gx0 = ixy0 * (1.0 / 7.0), gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
        vec4 gx1 = ixy1 * (1.0 / 7.0), gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
        gx0 = fract(gx0); gx1 = fract(gx1);
        vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0), sz0 = step(gz0, vec4(0.0));
        vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1), sz1 = step(gz1, vec4(0.0));
        gx0 -= sz0 * (step(0.0, gx0) - 0.5); gy0 -= sz0 * (step(0.0, gy0) - 0.5);
        gx1 -= sz1 * (step(0.0, gx1) - 0.5); gy1 -= sz1 * (step(0.0, gy1) - 0.5);
        vec3 g0 = vec3(gx0.x, gy0.x, gz0.x), g1 = vec3(gx0.y, gy0.y, gz0.y),
          g2 = vec3(gx0.z, gy0.z, gz0.z), g3 = vec3(gx0.w, gy0.w, gz0.w),
          g4 = vec3(gx1.x, gy1.x, gz1.x), g5 = vec3(gx1.y, gy1.y, gz1.y),
          g6 = vec3(gx1.z, gy1.z, gz1.z), g7 = vec3(gx1.w, gy1.w, gz1.w);
        vec4 norm0 = taylorInvSqrt(vec4(dot(g0, g0), dot(g2, g2), dot(g1, g1), dot(g3, g3)));
        vec4 norm1 = taylorInvSqrt(vec4(dot(g4, g4), dot(g6, g6), dot(g5, g5), dot(g7, g7)));
        g0 *= norm0.x; g2 *= norm0.y; g1 *= norm0.z; g3 *= norm0.w;
        g4 *= norm1.x; g6 *= norm1.y; g5 *= norm1.z; g7 *= norm1.w;
        vec4 nz = mix(vec4(dot(g0, vec3(f0.x, f0.y, f0.z)), dot(g1, vec3(f1.x, f0.y, f0.z)),
          dot(g2, vec3(f0.x, f1.y, f0.z)), dot(g3, vec3(f1.x, f1.y, f0.z))),
          vec4(dot(g4, vec3(f0.x, f0.y, f1.z)), dot(g5, vec3(f1.x, f0.y, f1.z)),
            dot(g6, vec3(f0.x, f1.y, f1.z)), dot(g7, vec3(f1.x, f1.y, f1.z))), f.z);
        return 2.4 * mix(mix(nz.x, nz.z, f.y), mix(nz.y, nz.w, f.y), f.x);
    }

    float turbulenceHigh(vec3 v) {
      float f = 0.0;
      float s = 1.0;
      for (int i=0; i<7; ++i) {
        f += abs(noise(s * v)) / s;
        s *= 2.0;
        v = vec3(0.866 * v.x + 0.5 * v.z, v.y + 100.0, 0.866 * v.z - 0.5 * v.x);
      }
      return f;
    }

    float turbulenceMid(vec3 v) {
      float f = 0.0;
      float s = 1.0;
      for (int i=0; i<5; ++i) {
        f += abs(noise(s * v)) / s;
        s *= 2.0;
        v = vec3(0.866 * v.x + 0.5 * v.z, v.y + 100.0, 0.866 * v.z - 0.5 * v.x);
      }
      return f;
    }

    float turbulenceLow(vec3 v) {
      float f = 0.0;
      float s = 1.0;
      for (int i=0; i<2; ++i) {
        f += abs(noise(v * s)) / s;
        s *= 2.0;
        v = vec3(0.866 * v.x + 0.5 * v.z, v.y + 100.0, 0.866 * v.z - 0.5 * v.x);
      }
      return f;
    }

    vec3 clouds(float x, float y, float t, float detail) {
      vec3 v = vec3(x, y, t);
      float f = detail == 3.0 ? turbulenceHigh(v) : detail == 2.0 ? turbulenceMid(v) : turbulenceLow(v);
      return vec3(noise(vec3(0.5, 0.5, f) * 0.7)) + vec3(1.0, 1.0, 1.0);
    }

    void main() {
      float speed = 0.015;
      float offset = uTime * speed * -0.5;
      float phase = uTime * speed;
      float x = vUV.x * 5.0 + offset;
      float y = vUV.y * 5.0;
      vec3 colour = clouds(x, y, phase, uDetailLevel);

      // calc normals
      float res = 0.1;
      float cloudHeight = 50.0;
      float detail = max(1.0, uDetailLevel - 1.0);
      vec3 p1 = clouds(x + res, y, phase, detail);
      vec3 p2 = clouds(x, y + res, phase, detail);
      vec3 norm = computeNormal(colour, p1, p2, cloudHeight);
      float light = dot(norm, vec3(0.0, 1.0, 0.0)) - 0.5;

      // result
			vec3 prussian = vec3(0.0, 0.192, 0.325);
      float alpha = 1.0 - min(1.0, sqrt(pow(0.5 - vUV.x, 2.0) + pow(0.5 - vUV.y, 2.0)) / 0.5);
      gl_FragColor = vec4(colour + prussian + light * 0.5, colour.x * alpha);
    }
  `,
});

export default CloudMaterial;
