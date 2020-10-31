/** Perlin Noise */

class PerlinNoise {
  constructor() {
    const p = [
      151,160,137,91,90,15,131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,
      142,8,99,37,240,21,10,23,190, 6,148,247,120,234,75,0,26,197,62,94,252,219,
      203,117,35,11,32,57,177,33,88,237,149,56,87,174,20,125,136,171,168,68,175,
      74,165,71,134,139,48,27,166,77,146,158,231,83,111,229,122,60,211,133,230,
      220,105,92,41,55,46,245,40,244,102,143,54, 65,25,63,161, 1,216,80,73,209,
      76,132,187,208, 89,18,169,200,196,135,130,116,188,159,86,164,100,109,198,
      173,186,3,64,52,217,226,250,124,123,5,202,38,147,118,126,255,82,85,212,
      207,206,59,227,47,16,58,17,182,189,28,42,223,183,170,213,119,248,152,2,44,
      154,163,70,221,153,101,155,167,43,172,9,129,22,39,253,19,98,108,110,79,
      113,224,232,178,185, 112,104,218,246,97,228,251,34,242,193,238,210,144,12,
      191,179,162,241, 81,51,145,235,249,14,239,107,49,192,214, 31,181,199,106,
      157,184, 84,204,176,115,121,50,45,127, 4,150,254,138,236,205,93,222,114,
      67,29,24,72,243,141,128,195,78,66,215,61,156,180
    ];
    const grad3 = [
      [1,1,0], [-1,1,0], [1,-1,0], [-1,-1,0],
      [1,0,1], [-1,0,1], [1,0,-1], [-1,0,-1],
      [0,1,1], [0,-1,1], [0,1,-1], [0,-1,-1]
    ];
    this.perm = new Array(512);
    this.gradP = new Array(512);

    // seed arrays
    let seed = 0;
    if (seed > 0 && seed < 1) {
      seed *= 65536;
    }
    seed = Math.floor(seed);
    if (seed < 256) {
      seed |= seed << 8;
    }

    for (var i=0; i<256; i++) {
      const v = i & 1 ? p[i] ^ (seed & 255) : p[i] ^ ((seed>>8) & 255);
      this.perm[i] = this.perm[i + 256] = v;
      this.gradP[i] = this.gradP[i + 256] = grad3[v % 12];
    }
  }

  dot2(a, b) {
    return a[0]*b[0] + a[1]*b[1];
  }

  dot3(a, b) {
    return a[0]*b[0] + a[1]*b[1] + a[2]*b[2];
  }

  fade(t) {
    return t*t*t*(t*(t*6-15)+10);
  }

  lerp(a, b, t) {
    return (1-t)*a + t*b;
  }

  get2D(x, y) {
    // Find unit grid cell containing point
    var X = Math.floor(x);
    var Y = Math.floor(y);

    // Get relative xy coordinates of point within that cell
    // Wrap the integer cells at 255 (smaller integer period can be introduced here)
    x = x - X;
    y = y - Y;
    X = X & 255;
    Y = Y & 255;

    // get arrays
    const gradP = this.gradP;
    const perm = this.perm;

    // Calculate noise contributions from each of the four corners
    var n00 = this.dot2(gradP[X + perm[Y]], [x, y]);
    var n01 = this.dot2(gradP[X + perm[Y + 1]], [x, y-1]);
    var n10 = this.dot2(gradP[X + 1 + perm[Y]], [x-1, y]);
    var n11 = this.dot2(gradP[X + 1 + perm[Y + 1]], [x-1, y-1]);

    // Compute the fade curve value for x
    var u = this.fade(x);

    // Interpolate the four results
    return this.lerp(this.lerp(n00, n10, u), this.lerp(n01, n11, u), this.fade(y));
  }

  get3D(x, y, z) {
    // Find unit grid cell containing point
    var X = Math.floor(x);
    var Y = Math.floor(y);
    var Z = Math.floor(z);

    // Get relative xyz coordinates of point within that cell
    // Wrap the integer cells at 255 (smaller integer period can be introduced here)
    x = x - X;
    y = y - Y;
    z = z - Z;
    X = X & 255;
    Y = Y & 255;
    Z = Z & 255;

    // get arrays
    const gradP = this.gradP;
    const perm = this.perm;

    // Calculate noise contributions from each of the eight corners
    var n000 = this.dot3(gradP[X+  perm[Y+  perm[Z  ]]], [x,   y,     z]);
    var n001 = this.dot3(gradP[X+  perm[Y+  perm[Z+1]]], [x,   y,   z-1]);
    var n010 = this.dot3(gradP[X+  perm[Y+1+perm[Z  ]]], [x,   y-1,   z]);
    var n011 = this.dot3(gradP[X+  perm[Y+1+perm[Z+1]]], [x,   y-1, z-1]);
    var n100 = this.dot3(gradP[X+1+perm[Y+  perm[Z  ]]], [x-1,   y,   z]);
    var n101 = this.dot3(gradP[X+1+perm[Y+  perm[Z+1]]], [x-1,   y, z-1]);
    var n110 = this.dot3(gradP[X+1+perm[Y+1+perm[Z  ]]], [x-1, y-1,   z]);
    var n111 = this.dot3(gradP[X+1+perm[Y+1+perm[Z+1]]], [x-1, y-1, z-1]);

    // Compute the fade curve value for x, y, z
    var u = fade(x);
    var v = fade(y);
    var w = fade(z);

    // Interpolate
    return lerp(
      lerp(
        lerp(n000, n100, u),
        lerp(n001, n101, u), w),
      lerp(
        lerp(n010, n110, u),
        lerp(n011, n111, u), w),
      v
    );
  }
}

export default PerlinNoise;
