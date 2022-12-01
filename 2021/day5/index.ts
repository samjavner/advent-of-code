import fs from "fs";
import _ from "lodash";

type Point = [x: number, y: number];
type Line = [a: Point, b: Point];

const lines = fs
  .readFileSync("day5/input.txt", "utf8")
  .split("\n")
  .filter((n) => n)
  .map(
    (line) =>
      line
        .split(" -> ")
        .map(
          (p) => p.split(",").map((c) => Number.parseInt(c)) as Point
        ) as Line
  );

const getMultipleOverlapCount = (includeDiagonals: boolean) => {
  const overlaps = _.chain(0)
    .range(1000)
    .map(() => _.chain(0).range(1000).fill(0).value())
    .value();

  for (const line of lines) {
    const [[x1, y1], [x2, y2]] = line;
    const dx = x1 < x2 ? 1 : x1 > x2 ? -1 : 0;
    const dy = y1 < y2 ? 1 : y1 > y2 ? -1 : 0;

    if (dx !== 0 && dy !== 0 && !includeDiagonals) {
      continue;
    }

    let x = x1;
    let y = y1;
    while (true) {
      overlaps[x][y] += 1;

      if (x === x2 && y === y2) {
        break;
      }

      x += dx;
      y += dy;
    }
  }

  return _(overlaps)
    .map((column) => column.filter((row) => row > 1).length)
    .sum();
};

console.log("part 1: %d", getMultipleOverlapCount(false));
console.log("part 2: %d", getMultipleOverlapCount(true));
