export const randomNumberBetweenXandY = (x = 0, y = 10): number =>
  Math.floor(Math.random() * (y - x + 1)) + x;
