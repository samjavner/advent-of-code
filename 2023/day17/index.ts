import fs from "fs";
import { list, objectify } from "radash";

const heatLossByBlock = fs
  .readFileSync("day17/input.txt", "utf8")
  .split("\n")
  .filter((x) => x)
  .map((x) => x.split("").map((h) => Number(h)));

const height = heatLossByBlock.length;
const width = heatLossByBlock[0].length;

type Direction = "north" | "south" | "east" | "west";

type Candidate = [
  row: number,
  col: number,
  moving: Direction,
  forBlocks: number
];

function getNextCandidates(
  row: number,
  col: number,
  moving: Direction,
  forBlocks: number,
  isUltra: boolean = false
): Candidate[] {
  const candidates: Candidate[] = [
    [row - 1, col, "north", moving === "north" ? forBlocks + 1 : 1],
    [row, col - 1, "west", moving === "west" ? forBlocks + 1 : 1],
    [row + 1, col, "south", moving === "south" ? forBlocks + 1 : 1],
    [row, col + 1, "east", moving === "east" ? forBlocks + 1 : 1],
  ];

  return candidates.filter(([r, c, m, b]) => {
    if (r < 0 || r >= height || c < 0 || c >= width) {
      return false;
    }

    if (
      (moving === "north" && m === "south") ||
      (moving === "south" && m === "north") ||
      (moving === "west" && m === "east") ||
      (moving === "east" && m === "west")
    ) {
      return false;
    }

    if (!isUltra && b > 3) {
      return false;
    }

    if (isUltra && b > 10) {
      return false;
    }

    if (isUltra && forBlocks < 4 && moving !== m) {
      return false;
    }

    return true;
  });
}

function search(isUltra: boolean) {
  let bestSoFar = Number.MAX_SAFE_INTEGER;

  const visited = heatLossByBlock.map((row, i) =>
    row.map((_, j) =>
      objectify(
        ["north", "south", "east", "west"] as Direction[],
        (dir) => dir,
        () =>
          list(1, 10).map(() =>
            i === 0 && j === 0 ? 0 : Number.MAX_SAFE_INTEGER
          )
      )
    )
  );

  const next = getNextCandidates(0, 0, "east", 0).map(
    (candidate) => [candidate, 0] as [Candidate, heatLoss: number]
  );

  while (next.length > 0) {
    const [[row, col, moving, forBlocks], heatLoss] = next.pop()!;

    const bestHeatLoss = visited[row][col][moving][forBlocks - 1];
    const candidateHeatLoss = heatLoss + heatLossByBlock[row][col];

    if (candidateHeatLoss >= bestHeatLoss || candidateHeatLoss >= bestSoFar) {
      continue;
    }

    if (row === height - 1 && col === width - 1) {
      if (isUltra && forBlocks < 4) {
        continue;
      }

      bestSoFar = Math.min(bestSoFar, candidateHeatLoss);
    }

    visited[row][col][moving][forBlocks - 1] = candidateHeatLoss;

    const candidates = getNextCandidates(row, col, moving, forBlocks, isUltra);
    next.push(
      ...candidates.map(
        (candidate) =>
          [candidate, candidateHeatLoss] as [Candidate, heatLoss: number]
      )
    );
  }

  return bestSoFar;
}

const part1 = search(false);

console.log("part 1: %d", part1);

const part2 = search(true);

console.log("part 2: %d", part2);
