import fs from "fs";
import _ from "lodash";

const initial = fs
  .readFileSync("day11/input.txt", "utf8")
  .split("\n")
  .filter((n) => n)
  .map((n) => n.split("").map((c) => Number.parseInt(c)));

const size = 10;

type Position = [row: number, col: number];

const getNeighbors = ([row, col]: Position): Position[] => {
  const candidates: Position[] = [
    [row - 1, col - 1],
    [row - 1, col],
    [row - 1, col + 1],
    [row, col - 1],
    [row, col + 1],
    [row + 1, col - 1],
    [row + 1, col],
    [row + 1, col + 1],
  ];

  return candidates.filter(
    ([row, col]) => row >= 0 && row < size && col >= 0 && col < size
  );
};

type Result = [levels: number[][], flashCount: number];

const step = (levels: number[][]): Result => {
  levels = _.cloneDeep(levels);

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      levels[row][col] += 1;
    }
  }

  let flashCount = 0;
  let flashed = true;
  while (flashed) {
    flashed = false;
    const updated = _.cloneDeep(levels);
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        if (levels[row][col] > 9) {
          flashed = true;
          flashCount += 1;
          updated[row][col] = 0;
          for (const [nrow, ncol] of getNeighbors([row, col])) {
            if (updated[nrow][ncol] > 0) {
              updated[nrow][ncol] += 1;
            }
          }
        }
      }
    }
    levels = updated;
  }

  return [levels, flashCount];
};

const result = _.range(0, 100).reduce<Result>(
  ([prevLevels, prevFlashCount]) => {
    const [levels, flashCount] = step(prevLevels);
    return [levels, flashCount + prevFlashCount];
  },
  [initial, 0]
);

console.log("part 1: %d", result[1]);

const isSimultaneousFlash = (levels: number[][]) =>
  _(levels)
    .map((row) => _(row).sum())
    .sum() === 0;

const getFirstSimultaneousFlash = (levels: number[][]) => {
  for (let r = 1; ; r++) {
    [levels] = step(levels);
    if (isSimultaneousFlash(levels)) {
      return r;
    }
  }
};

console.log("part 2: %d", getFirstSimultaneousFlash(initial));
