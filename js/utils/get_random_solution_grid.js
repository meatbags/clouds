/** Generate a random true/ false grid */

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

export default GetRandomSolutionGrid;
