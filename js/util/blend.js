/** Blend */

const Blend = (a, b, f) => {
  return a + (b - a) * f;
};

export default Blend;
