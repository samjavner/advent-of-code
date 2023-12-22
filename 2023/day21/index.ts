import fs from "fs";
import { sum } from "radash";

type Position = [row: number, col: number];

const garden = fs
  .readFileSync("day21/input.txt", "utf8")
  .split("\n")
  .filter((x) => x)
  .map((x) => x.split(""));

const height = garden.length;
const width = garden[0].length;

const neighbors: Record<number, Record<number, Position[]>> = {};
for (let row = 0; row < height; row += 1) {
  neighbors[row] = {};
  for (let col = 0; col < width; col += 1) {
    const candidates: Position[] = [
      [row - 1, col],
      [row + 1, col],
      [row, col - 1],
      [row, col + 1],
    ];

    neighbors[row][col] = candidates.filter(([r, c]) =>
      [".", "S"].includes(garden[r]?.[c])
    );
  }
}

function countReachable(
  [startRow, startCol]: Position,
  target: number
): number {
  const reachableIn: Set<number>[][] = garden.map((row) =>
    row.map(() => new Set())
  );
  reachableIn[startRow][startCol].add(0);

  for (let step = 1; step <= target; step += 1) {
    for (let row = 0; row < height; row += 1) {
      for (let col = 0; col < height; col += 1) {
        if (reachableIn[row][col].has(1 - (step % 2))) {
          for (const [nrow, ncol] of neighbors[row][col]) {
            reachableIn[nrow][ncol].add(step % 2);
          }
        }
      }
    }
  }

  return reachableIn.flatMap((row) => row.filter((col) => col.has(target % 2)))
    .length;
}

const part1 = countReachable([65, 65], 64);

console.log("part 1: %d", part1);

// Each 131x131 tile looks roughly like this, forming a system of garden highways:
//
// +--+--+
// | /|\ |
// |/ | \|
// +--+--+
// |\ | /|
// | \|/ |
// +--+--+
//
// We get to each repeating tile as soon as possible, either at the middle
// of a side for the tiles in cardinal directions of the starting tile or
// at the corner for other tiles.
//
// Thus, we expand in a pattern like this, where we have fully explored tiles
// where we should count either the even or odd garden plots, surrounded by
// partially explored tiles.
//
//       /^\
//      //O\\
//     //OEO\\
//    //OEOEO\\
//   //OEOEOEO\\
//  //OEOEOEOEO\\
//  <EOEEOEOEEOE>
//  \\OEOEOEOEO//
//   \\OEOEOEO//
//    \\OEOEO//
//     \\OEO//
//      \\O//
//       \v/

function getTileCounts(steps: number) {
  const n = Math.floor(steps / height);
  const evenCount = (Math.floor((n - 1) / 2) * 2 + 1) ** 2;
  const oddCount = (Math.floor(n / 2) * 2) ** 2;

  const diagonalCount = n;

  return {
    evenCount,
    oddCount,
    diagonalCount,
  };
}

function part2() {
  const steps = 26501365;
  const { evenCount, oddCount, diagonalCount } = getTileCounts(steps);

  const remainder = steps % height; // 65
  const oddNumberOfStepsSufficientToFullyExplore = 1000 + remainder;

  // start from even garden plot, ending on an odd number of steps
  const evenReachable = countReachable(
    [0, 0],
    oddNumberOfStepsSufficientToFullyExplore
  );

  // start from odd garden plot, ending on an odd number of steps
  const oddReachable = countReachable(
    [0, 1],
    oddNumberOfStepsSufficientToFullyExplore
  );

  const totals = [
    // fully explored tiles
    evenCount * evenReachable,
    oddCount * oddReachable,

    // as far as we can go in cardinal directions, 130 steps to explore starting from middle of side
    countReachable([0, 65], height - 1),
    countReachable([130, 65], height - 1),
    countReachable([65, 0], height - 1),
    countReachable([65, 130], height - 1),

    // mostly explored diagonal tiles, 195 steps to explore starting from corner
    countReachable([0, 0], height + 64) * (diagonalCount - 1),
    countReachable([0, 130], height + 64) * (diagonalCount - 1),
    countReachable([130, 0], height + 64) * (diagonalCount - 1),
    countReachable([130, 130], height + 64) * (diagonalCount - 1),

    // less explored diagonal tiles, 64 steps to explore starting from corner
    countReachable([0, 0], 64) * diagonalCount,
    countReachable([0, 130], 64) * diagonalCount,
    countReachable([130, 0], 64) * diagonalCount,
    countReachable([130, 130], 64) * diagonalCount,
  ];

  return sum(totals);
}

console.log("part 2: %d", part2());
