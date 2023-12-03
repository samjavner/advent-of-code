import fs from "fs";
import { range, sum } from "radash";

const schematic = fs
  .readFileSync("day3/input.txt", "utf8")
  .split("\n")
  .filter((x) => x)
  .map((x) => x.split(""));

const height = schematic.length;
const width = schematic[0].length;

function isNumberAt(row: number, col: number) {
  return (
    schematic[row]?.[col] !== undefined &&
    schematic[row][col] >= "0" &&
    schematic[row][col] <= "9"
  );
}

function isSymbolAt(row: number, col: number) {
  return (
    schematic[row]?.[col] !== undefined &&
    schematic[row][col] !== "." &&
    !isNumberAt(row, col)
  );
}

function getNeighbors(row: number, col: number) {
  return [
    [row - 1, col - 1],
    [row - 1, col],
    [row - 1, col + 1],
    [row, col - 1],
    [row, col + 1],
    [row + 1, col - 1],
    [row + 1, col],
    [row + 1, col + 1],
  ];
}

function isSymbolAdjacentTo(row: number, col: number) {
  return getNeighbors(row, col).some(([r, c]) => isSymbolAt(r, c));
}

const partNumbers: number[] = [];
const partNumberMap: (number | undefined)[][] = schematic.map(() => []);

for (let row = 0; row < height; row += 1) {
  let candidate = "";
  let isPart = false;

  for (let col = 0; col < width; col += 1) {
    if (isNumberAt(row, col)) {
      candidate += schematic[row][col];
      isPart = isPart || isSymbolAdjacentTo(row, col);
    } else if (candidate) {
      const partNumber = Number(candidate);
      if (isPart) {
        partNumbers.push(partNumber);
      }
      partNumberMap[row].push(
        ...range(0, candidate.length - 1, isPart ? partNumber : undefined)
      );
      partNumberMap[row].push(undefined);
      candidate = "";
      isPart = false;
    } else {
      partNumberMap[row].push(undefined);
    }
  }

  if (candidate) {
    const partNumber = Number(candidate);
    if (isPart) {
      partNumbers.push(partNumber);
    }
    partNumberMap[row].push(
      ...range(0, candidate.length - 1, isPart ? partNumber : undefined)
    );
  }
}

if (partNumberMap.some((row) => row.length !== width)) {
  console.log(partNumberMap);
  throw new Error("Invalid part number map");
}

const part1 = sum(partNumbers);

console.log("part 1: %d", part1);

function getPartNumberAt(row: number, col: number) {
  return partNumberMap[row]?.[col];
}

let gears: [number, number][] = [];

for (let row = 0; row < height; row += 1) {
  for (let col = 0; col < width; col += 1) {
    if (schematic[row][col] === "*") {
      // 0 1 2
      // 3   4
      // 5 6 7
      const adjacent = getNeighbors(row, col).map(([r, c]) =>
        getPartNumberAt(r, c)
      );

      let actual: number[] = [];

      if (adjacent[3]) {
        actual.push(adjacent[3]);
      }

      if (adjacent[4]) {
        actual.push(adjacent[4]);
      }

      // either 1 has a part number or 0 and 2 could have two different part numbers
      if (adjacent[1]) {
        actual.push(adjacent[1]);
      } else {
        if (adjacent[0]) {
          actual.push(adjacent[0]);
        }
        if (adjacent[2]) {
          actual.push(adjacent[2]);
        }
      }

      // either 6 has a part number or 5 and 7 could have two different part numbers
      if (adjacent[6]) {
        actual.push(adjacent[6]);
      } else {
        if (adjacent[5]) {
          actual.push(adjacent[5]);
        }
        if (adjacent[7]) {
          actual.push(adjacent[7]);
        }
      }

      if (actual.length === 2) {
        gears.push([actual[0], actual[1]]);
      }
    }
  }
}

let part2 = sum(gears.map(([p1, p2]) => p1 * p2));

console.log("part 2: %d", part2);
