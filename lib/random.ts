/**
 * Small seeded PRNG (mulberry32). The sample workspace must render the same numbers on the server
 * and in the browser, so nothing in the data layer may call Math.random().
 */
export interface Rng {
  next(): number;
  uniform(min: number, max: number): number;
}

export function createRng(seed: number): Rng {
  let state = seed >>> 0;
  const next = () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return {
    next,
    uniform: (min, max) => min + (max - min) * next(),
  };
}
