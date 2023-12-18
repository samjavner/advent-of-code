import fs from "fs";
import { sort, unique } from "radash";

type Plan = Step[];

type Step = {
  direction: Direction;
  distance: number;
};

type Direction = "up" | "down" | "left" | "right";

interface HorizontalTrench {
  row: number;
  col1: number;
  col2: number;
}

interface DownTrench {
  row1: number;
  row2: number;
  col: number;
}

function dig(plan: Plan): [HorizontalTrench[], DownTrench[]] {
  const horizontalTrenches: HorizontalTrench[] = [];
  const downTrenches: DownTrench[] = [];

  let row = 0;
  let col = 0;

  for (const step of plan) {
    switch (step.direction) {
      case "up":
        row -= step.distance;
        break;
      case "down":
        downTrenches.push({ row1: row, row2: row + step.distance, col });
        row += step.distance;
        break;
      case "left":
        horizontalTrenches.push({ row, col1: col - step.distance, col2: col });
        col -= step.distance;
        break;
      case "right":
        horizontalTrenches.push({ row, col1: col, col2: col + step.distance });
        col += step.distance;
    }
  }

  return [horizontalTrenches, downTrenches];
}

function calculateLagoonVolume([trenches, downTrenches]: [
  HorizontalTrench[],
  DownTrench[]
]): number {
  let volume = 0;

  const cols = sort(
    unique([
      ...trenches.map((trench) => trench.col1),
      ...trenches.map((trench) => trench.col2),
    ]),
    (col) => col
  );

  for (let i = 1; i < cols.length; i += 1) {
    const col1 = cols[i - 1];
    const col2 = cols[i];
    const width = col2 - col1;
    const col = col1 + 0.5;

    sort(
      trenches
        .filter((trench) => col >= trench.col1 && col <= trench.col2)
        .map((trench) => trench.row),
      (row) => row
    ).forEach((_, index, rows) => {
      if (index % 2 === 0) {
        volume += (rows[index + 1] - rows[index] + 1) * width;
      }
    });
  }

  for (const trench of downTrenches) {
    volume += trench.row2 - trench.row1;
  }

  return volume + 1;
}

const input = fs
  .readFileSync("day18/input.txt", "utf8")
  .split("\n")
  .filter((x) => x);

const parser = /^(.) (.+) \(#(.{5})(.)\)$/;

const plan1: Plan = input.map((x) => {
  const [, direction, distance] = parser.exec(x)!;

  return {
    direction:
      direction === "U"
        ? "up"
        : direction === "D"
        ? "down"
        : direction === "L"
        ? "left"
        : "right",
    distance: Number(distance),
  };
});

const part1 = calculateLagoonVolume(dig(plan1));

console.log("part 1: %d", part1);

const plan2: Plan = input.map((x) => {
  const [, , , distance, direction] = parser.exec(x)!;

  return {
    direction:
      direction === "0"
        ? "right"
        : direction === "1"
        ? "down"
        : direction === "2"
        ? "left"
        : "up",
    distance: Number("0x" + distance),
  };
});

const part2 = calculateLagoonVolume(dig(plan2));

console.log("part 2: %d", part2);
