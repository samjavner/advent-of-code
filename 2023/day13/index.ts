import fs from "fs";
import { sum } from "radash";

type Ash = ".";
type Rock = "#";
type Pattern = (Ash | Rock)[][];

const input = fs.readFileSync("day13/input.txt", "utf8").split("\n");

const patterns: Pattern[] = [];
let pattern: Pattern = [];
for (let i = 0; i < input.length; i += 1) {
  const line = input[i];

  if (line) {
    pattern.push(line.split("") as (Ash | Rock)[]);
  } else {
    patterns.push(pattern);
    pattern = [];
  }
}

function findHorizontalLine(
  pattern: Pattern,
  expectedDifferences: number = 0
): number | undefined {
  for (let rowsAbove = 1; rowsAbove < pattern.length; rowsAbove += 1) {
    const rowsBelow = pattern.length - rowsAbove;
    const size = Math.min(rowsAbove, rowsBelow);

    let differences = 0;
    for (let row = 0; row < size; row += 1) {
      for (let col = 0; col < pattern[0].length; col += 1) {
        if (
          pattern[rowsAbove - 1 - row][col] !== pattern[rowsAbove + row][col]
        ) {
          differences += 1;
        }
      }
    }

    if (differences === expectedDifferences) {
      return rowsAbove;
    }
  }
}

function findVerticalLine(
  pattern: Pattern,
  expectedDifferences: number = 0
): number | undefined {
  for (let colsLeft = 1; colsLeft < pattern[0].length; colsLeft += 1) {
    const colsRight = pattern[0].length - colsLeft;
    const size = Math.min(colsLeft, colsRight);

    let differences = 0;
    for (let col = 0; col < size; col += 1) {
      for (let row = 0; row < pattern.length; row += 1) {
        if (pattern[row][colsLeft - 1 - col] !== pattern[row][colsLeft + col]) {
          differences += 1;
        }
      }
    }

    if (differences === expectedDifferences) {
      return colsLeft;
    }
  }
}

function summarize(expectedDifferences: number = 0) {
  return (
    sum(
      patterns
        .map((pattern) => findHorizontalLine(pattern, expectedDifferences))
        .map((x) => x ?? 0)
    ) *
      100 +
    sum(
      patterns
        .map((pattern) => findVerticalLine(pattern, expectedDifferences))
        .map((x) => x ?? 0)
    )
  );
}

const part1 = summarize();

console.log("part 1: %d", part1);

const part2 = summarize(1);

console.log("part 2: %d", part2);
