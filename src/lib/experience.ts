export function shouldShowRefusal(rng: () => number = Math.random) {
  return rng() < 0.01
}
