import fs from "fs";
import { list, sum } from "radash";

function transpose(columns: string[]): string[] {
  return list(0, columns[0].length - 1).map((c) =>
    list(0, columns.length - 1)
      .map((r) => columns[r][c])
      .join("")
  );
}

function rotate(columns: string[]): string[] {
  return list(0, columns[0].length - 1).map((c) =>
    list(0, columns.length - 1)
      .map((r) => columns[r][columns.length - 1 - c])
      .join("")
  );
}

function tilt(column: string): string {
  return column
    .split("#")
    .map((section) => section.split("").toSorted().toReversed().join(""))
    .join("#");
}

function getLoad(column: string): number {
  return sum(
    column
      .split("")
      .map((item, pos) => (item === "O" ? column.length - pos : 0))
  );
}

const input = fs
  .readFileSync("day14/input.txt", "utf8")
  .split("\n")
  .filter((x) => x);

const start = transpose(input);

const part1 = sum(start.map(tilt).map(getLoad));

console.log("part 1: %d", part1);

const cycleCount = 1000000000;

function findCycle() {
  let current = start;
  let found = { [start.join()]: 0 };
  let columns = [start];

  for (let i = 1; i <= cycleCount; i += 1) {
    for (let d = 0; d < 4; d += 1) {
      current = current.map(tilt);
      current = rotate(current);
    }

    const joined = current.join("");
    if (found[joined] !== undefined) {
      const start = found[joined];
      const length = i - found[joined];

      return {
        start,
        length,
        columns: columns.slice(start, start + length),
      };
    }
    found[joined] = i;
    columns.push(current);
  }

  return {
    start: 0,
    length: 1,
    columns: [],
  };
}

function part2() {
  const { start, length, columns } = findCycle();

  const index = (cycleCount - start) % length;

  return sum(columns[index].map(getLoad));
}

console.log("part 2: %d", part2());
