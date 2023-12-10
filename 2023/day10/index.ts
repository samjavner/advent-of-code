import fs from "fs";
import { sum } from "radash";

interface Position {
  row: number;
  col: number;
}

function getNeighbors({ row, col }: Position) {
  const north = { row: row - 1, col };
  const south = { row: row + 1, col };
  const west = { row, col: col - 1 };
  const east = { row, col: col + 1 };

  return { north, south, east, west };
}

const input = fs
  .readFileSync("day10/input.txt", "utf8")
  .split("\n")
  .filter((x) => x)
  .map((x) => x.split(""));

const northPipes = ["S", "|", "L", "J"];
const southPipes = ["S", "|", "7", "F"];
const westPipes = ["S", "-", "J", "7"];
const eastPipes = ["S", "-", "L", "F"];

let edges = input.map((row) => row.map(() => [] as Position[]));
let start: Position = { row: 0, col: 0 };
for (let row = 0; row < input.length; row += 1) {
  for (let col = 0; col < input[row].length; col += 1) {
    const pipe = input[row][col];

    const { north, south, east, west } = getNeighbors({ row, col });

    const pipeToNorth = input[north.row]?.[north.col];
    const pipeToSouth = input[south.row]?.[south.col];
    const pipeToWest = input[west.row]?.[west.col];
    const pipeToEast = input[east.row]?.[east.col];

    let connectedNorth = false;
    if (northPipes.includes(pipe) && southPipes.includes(pipeToNorth)) {
      edges[row][col].push(north);
      connectedNorth = true;
    }

    let connectedSouth = false;
    if (southPipes.includes(pipe) && northPipes.includes(pipeToSouth)) {
      edges[row][col].push(south);
      connectedSouth = true;
    }

    let connectedWest = false;
    if (westPipes.includes(pipe) && eastPipes.includes(pipeToWest)) {
      edges[row][col].push(west);
      connectedWest = true;
    }

    let connectedEast = false;
    if (eastPipes.includes(pipe) && westPipes.includes(pipeToEast)) {
      edges[row][col].push(east);
      connectedEast = true;
    }

    if (pipe === "S") {
      start = { row, col };

      let actual = "-";

      if (connectedNorth) {
        if (connectedSouth) {
          actual = "|";
        } else if (connectedWest) {
          actual = "J";
        } else if (connectedEast) {
          actual = "L";
        }
      } else if (connectedSouth) {
        if (connectedWest) {
          actual = "7";
        } else {
          actual = "F";
        }
      }

      input[row][col] = actual;
    }
  }
}

const visited = input.map((row) => row.map(() => false));

function part1() {
  let steps = -1;
  let next = [start];

  while (next.length > 0) {
    const current = next;
    next = [];
    steps += 1;

    for (const { row, col } of current) {
      visited[row][col] = true;
      for (const to of edges[row][col]) {
        if (!visited[to.row][to.col]) {
          next.push({ row: to.row, col: to.col });
        }
      }
    }
  }

  return steps;
}

console.log("part 1: %d", part1());

function part2() {
  // Flood fill the outside!

  // Replace pipes not in main loop with ground
  let mainLoop = input.map((inputRow, row) =>
    inputRow.map((pipe, col) => (visited[row][col] ? pipe : "."))
  );

  // Add ground on each side so that all outside areas are connected
  const rowOfGround = mainLoop[0].map(() => ".");
  mainLoop = [rowOfGround, ...mainLoop, rowOfGround];
  mainLoop = mainLoop.map((row) => [".", ...row, "."]);

  // Give some breathing room to squeeze between pipes
  const replacements = {
    ["."]: [
      [".", ".", "."],
      [".", ".", "."],
      [".", ".", "."],
    ],
    ["|"]: [
      [".", "|", "."],
      [".", "|", "."],
      [".", "|", "."],
    ],
    ["-"]: [
      [".", ".", "."],
      ["-", "-", "-"],
      [".", ".", "."],
    ],
    ["J"]: [
      [".", "|", "."],
      ["-", "J", "."],
      [".", ".", "."],
    ],
    ["L"]: [
      [".", "|", "."],
      [".", "L", "-"],
      [".", ".", "."],
    ],
    ["7"]: [
      [".", ".", "."],
      ["-", "7", "."],
      [".", "|", "."],
    ],
    ["F"]: [
      [".", ".", "."],
      [".", "F", "-"],
      [".", "|", "."],
    ],
  };

  const expanded = mainLoop
    .map((row) =>
      row
        .map((v) => replacements[v as keyof typeof replacements])
        .reduce(
          (previous, current) => [
            [...previous[0], ...current[0]],
            [...previous[1], ...current[1]],
            [...previous[2], ...current[2]],
          ],
          [[], [], []]
        )
    )
    .reduce((previous, current) => [...previous, ...current], []);

  // Flood fill outside
  let next: Position[] = [{ row: 0, col: 0 }];

  while (next.length > 0) {
    const current = next;
    next = [];

    for (const { row, col } of current) {
      const { north, south, east, west } = getNeighbors({ row, col });

      if (expanded[north.row]?.[north.col] === ".") {
        next.push(north);
        expanded[north.row][north.col] = "O";
      }

      if (expanded[south.row]?.[south.col] === ".") {
        next.push(south);
        expanded[south.row][south.col] = "O";
      }

      if (expanded[west.row]?.[west.col] === ".") {
        next.push(west);
        expanded[west.row][west.col] = "O";
      }

      if (expanded[east.row]?.[east.col] === ".") {
        next.push(east);
        expanded[east.row][east.col] = "O";
      }
    }
  }

  // Count remaining ground (all on inside)
  return sum(
    mainLoop.map(
      (values, row) =>
        values.filter((_, col) => expanded[row * 3 + 1][col * 3 + 1] === ".")
          .length
    )
  );
}

console.log("part 2: %d", part2());
