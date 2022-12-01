import fs from "fs";

type SeaCucumber = ">" | "v";
type Region = (SeaCucumber | undefined)[][];

const initial: Region = fs
  .readFileSync("day25/input.txt", "utf8")
  .split("\n")
  .filter((n) => n)
  .map((n) =>
    n.split("").map((c) => (c === "." ? undefined : (c as SeaCucumber)))
  );

const height = initial.length;
const width = initial[0].length;

const moveRight = (region: Region): Region =>
  region.map((row) =>
    row.map((occupant, colIndex) => {
      if (occupant === ">" && !row[(colIndex + 1) % width]) {
        return undefined;
      } else if (!occupant && row[(colIndex - 1 + width) % width] === ">") {
        return ">";
      } else {
        return occupant;
      }
    })
  );

const moveDown = (region: Region): Region =>
  region.map((row, rowIndex) =>
    row.map((occupant, colIndex) => {
      if (occupant === "v" && !region[(rowIndex + 1) % height][colIndex]) {
        return undefined;
      } else if (
        !occupant &&
        region[(rowIndex - 1 + height) % height][colIndex] === "v"
      ) {
        return "v";
      } else {
        return occupant;
      }
    })
  );

const step = (region: Region): Region => moveDown(moveRight(region));

const equals = (a: Region, b: Region): boolean => {
  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      if (a[row][col] !== b[row][col]) {
        return false;
      }
    }
  }
  return true;
};

const stabilize = (): number => {
  let region = initial;
  let steps = 0;
  while (true) {
    const next = step(region);
    steps += 1;
    if (equals(region, next)) {
      return steps;
    }
    region = next;
  }
};

console.log("part 1: %d", stabilize());
