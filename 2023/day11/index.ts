import fs from "fs";
import { list, objectify, select, sum, zip } from "radash";

const universe = fs
  .readFileSync("day11/input.txt", "utf8")
  .split("\n")
  .filter((x) => x)
  .map((x) => x.split(""));

const emptyCols = objectify(
  list(0, universe[0].length - 1).filter((col) =>
    universe.every((row) => row[col] === ".")
  ),
  (col) => col,
  () => true
);

const emptyRows = objectify(
  select(
    universe,
    (_, row) => row,
    (row) => row.every((col) => col === ".")
  ),
  (row) => row,
  () => true
);

function getDistance(expandedDistance: number) {
  return function ([[r1, c1], [r2, c2]]: [
    [number, number],
    [number, number]
  ]): number {
    if (r2 < r1) {
      [r1, r2] = [r2, r1];
    }

    if (c2 < c1) {
      [c1, c2] = [c2, c1];
    }

    return (
      (r1 === r2
        ? 0
        : sum(
            list(r1, r2 - 1).map((r) => (emptyRows[r] ? expandedDistance : 1))
          )) +
      (c1 === c2
        ? 0
        : sum(
            list(c1, c2 - 1).map((c) => (emptyCols[c] ? expandedDistance : 1))
          ))
    );
  };
}

const galaxies = universe.flatMap((row, i) =>
  select(
    row,
    (_, j) => [i, j] as [number, number],
    (col) => col === "#"
  )
);

const pairs = list(0, galaxies.length - 1).flatMap((n) =>
  galaxies
    .slice(n + 1)
    .map((p) => [galaxies[n], p] as [[number, number], [number, number]])
);

const part1 = sum(pairs.map(getDistance(2)));

console.log("part 1: %d", part1);

const part2 = sum(pairs.map(getDistance(1000000)));

console.log("part 2: %d", part2);
