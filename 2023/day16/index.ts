import fs from "fs";
import { list, sum } from "radash";

type GridSpace = "." | "/" | "\\" | "-" | "|";

type Direction = "left" | "right" | "up" | "down";

type GridBeam = Record<Direction, boolean>;

const grid = fs
  .readFileSync("day16/input.txt", "utf8")
  .split("\n")
  .filter((x) => x)
  .map((x) => x.split("") as GridSpace[]);

function energize(
  initialRow: number,
  initialCol: number,
  initialMovingInDirection: Direction
): GridBeam[][] {
  const beams: GridBeam[][] = grid.map((row) =>
    row.map((col) => ({
      left: false,
      right: false,
      up: false,
      down: false,
    }))
  );

  function step(row: number, col: number, movingInDirection: Direction) {
    if (row < 0 || row >= grid.length || col < 0 || col >= grid[0].length) {
      return;
    }

    const space = grid[row][col];
    const beam = beams[row][col];

    if (beam[movingInDirection]) {
      return;
    }

    beam[movingInDirection] = true;

    switch (movingInDirection) {
      case "left":
        if ([".", "-"].includes(space)) {
          step(row, col - 1, "left");
        }

        if (["/", "|"].includes(space)) {
          step(row + 1, col, "down");
        }

        if (["\\", "|"].includes(space)) {
          step(row - 1, col, "up");
        }

        break;
      case "right":
        if ([".", "-"].includes(space)) {
          step(row, col + 1, "right");
        }

        if (["/", "|"].includes(space)) {
          step(row - 1, col, "up");
        }

        if (["\\", "|"].includes(space)) {
          step(row + 1, col, "down");
        }

        break;
      case "up":
        if ([".", "|"].includes(space)) {
          step(row - 1, col, "up");
        }

        if (["/", "-"].includes(space)) {
          step(row, col + 1, "right");
        }

        if (["\\", "-"].includes(space)) {
          step(row, col - 1, "left");
        }

        break;
      case "down":
        if ([".", "|"].includes(space)) {
          step(row + 1, col, "down");
        }

        if (["/", "-"].includes(space)) {
          step(row, col - 1, "left");
        }

        if (["\\", "-"].includes(space)) {
          step(row, col + 1, "right");
        }

        break;
    }
  }

  step(initialRow, initialCol, initialMovingInDirection);

  return beams;
}

function countEnergized(gridBeams: GridBeam[][]) {
  return sum(
    gridBeams.map(
      (rowBeams) =>
        rowBeams.filter(
          (beam) => beam.left || beam.right || beam.up || beam.down
        ).length
    )
  );
}

const part1 = countEnergized(energize(0, 0, "right"));

console.log("part 1: %d", part1);

const part2 = Math.max(
  ...list(0, grid.length - 1).map((row) =>
    countEnergized(energize(row, 0, "right"))
  ),
  ...list(0, grid.length - 1).map((row) =>
    countEnergized(energize(row, grid[0].length - 1, "left"))
  ),
  ...list(0, grid[0].length - 1).map((col) =>
    countEnergized(energize(0, col, "down"))
  ),
  ...list(0, grid[0].length - 1).map((col) =>
    countEnergized(energize(grid.length - 1, col, "up"))
  )
);

console.log("part 2: %d", part2);
