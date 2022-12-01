import _ from "lodash";
import fs from "fs";

type Point = [x: number, y: number];

const heightmap = fs
  .readFileSync("day9/input.txt", "utf8")
  .split("\n")
  .filter((n) => n)
  .map((n) => n.split("").map((h) => Number.parseInt(h)));

const getNeighbors = ([x, y]: Point): Point[] => {
  const neighbors: Point[] = [
    [x, y - 1],
    [x, y + 1],
    [x - 1, y],
    [x + 1, y],
  ];
  return neighbors.filter(
    (p) => p[0] >= 0 && p[0] < width && p[1] >= 0 && p[1] < height
  );
};

const isLowPoint = ([x, y]: Point): boolean => {
  const neighbors = getNeighbors([x, y]);
  return neighbors.every(([nx, ny]) => heightmap[ny][nx] > heightmap[y][x]);
};

const height = heightmap.length;
const width = heightmap[0].length;

const lowPoints: Point[] = [];
for (let x = 0; x < width; x++) {
  for (let y = 0; y < height; y++) {
    if (isLowPoint([x, y])) {
      lowPoints.push([x, y]);
    }
  }
}

const totalRiskLevel = _(lowPoints)
  .map(([x, y]) => heightmap[y][x] + 1)
  .sum();

console.log("part 1: %d", totalRiskLevel);

const getBasinSize = (initial: Point): number => {
  let basin: Point[] = [initial];
  let pointer = 0;

  while (pointer < basin.length) {
    const current = basin[pointer];
    const neighbors = getNeighbors(current);
    basin.push(
      ...neighbors
        .filter(([x, y]) => !basin.some(([bx, by]) => bx === x && by === y))
        .filter(([x, y]) => heightmap[y][x] < 9)
    );
    pointer += 1;
  }

  return basin.length;
};

const basinSizes = _(lowPoints)
  .map((p) => getBasinSize(p))
  .sortBy()
  .reverse()
  .value();

console.log("part 2: %d", basinSizes[0] * basinSizes[1] * basinSizes[2]);
