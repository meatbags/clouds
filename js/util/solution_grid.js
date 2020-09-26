/** Generate a random true/ false grid */

const PrintGrid = (grid, size) => {
  let printout = '';
  for (let y=0, lim=size; y<lim; ++y) {
    printout += grid.slice(y * size, y * size + size).join(' ') + '\n';
  }
  console.log(printout);
};

const GetRandomSolutionGrid = (size, n) => {
  const res = new Array(size).fill(0);
  while (n > 0) {
    const index = Math.floor(Math.random() * size);
    if (!res[index]) {
      res[index] = 1;
      n -= 1;
    }
  }
  return res;
};

const MapGrid = (from, to, x, y, fromSize, toSize, ignoreNull) => {
  for (let i=0, lim=from.length; i<lim; ++i) {
    if (!ignoreNull || (ignoreNull && from[i])) {
      const tx = x + i % fromSize;
      const ty = y + (i - (i % fromSize)) / fromSize;
      const index = ty * toSize + tx;
      to[index] = from[i];
    }
  }
};

const GetExclusiveSolutionGrid = (size, n, exclude) => {
  const res = new Array(size).fill(0);
  const rand = () => { return Math.floor(Math.random() * size); };
  const indices = new Array(n).fill(0).map(e => { return rand(); });
  while (indices.length > 0) {
    for (let i=indices.length-1, lim=-1; i>lim; --i) {
      const index = indices[i];
      if (!res[index] && !exclude[index]) {
        res[index] = 1;
        indices.splice(i, 1);
      } else {
        indices[i] = rand();
      }
    }
  }
  return res;
};

export { GetRandomSolutionGrid, GetExclusiveSolutionGrid, MapGrid, PrintGrid };
