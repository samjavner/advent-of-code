import fs from "fs";
import _ from "lodash";

type Position = [number, number];
type FoldInstruction = { type: "x" | "y"; position: number };

const [positionInput, instructionInput] = fs
  .readFileSync("day13/input.txt", "utf8")
  .split("\n\n");

const positions = positionInput
  .split("\n")
  .map((n) => n.split(",").map((p) => Number.parseInt(p)) as Position);

const instructions = instructionInput
  .split("\n")
  .filter((n) => n)
  .map((n) => n.split("="))
  .map<FoldInstruction>(([i, p]) => ({
    type: i.includes("x") ? "x" : "y",
    position: Number.parseInt(p),
  }));

const fold = (
  { type, position }: FoldInstruction,
  positions: Position[]
): Position[] =>
  _(positions)
    .map(
      ([x, y]) =>
        [
          x < position || type === "y" ? x : position + position - x,
          y < position || type === "x" ? y : position + position - y,
        ] as Position
    )
    .uniqBy((p) => p.join(","))
    .value();

const dotCount = fold(instructions[0], positions).length;

console.log("part 1: %d", dotCount);

console.log("part 2:");

const dots = instructions.reduce(
  (previous, current) => fold(current, previous),
  positions
);

const maxX = _(dots)
  .map(([x]) => x)
  .max()!;

const maxY = _(dots)
  .map(([, y]) => y)
  .max()!;

for (let y = 0; y <= maxY; y++) {
  console.log(
    _.chain(0)
      .range(maxX + 1)
      .map((x) => dots.some(([dx, dy]) => dx === x && dy === y))
      .map((d) => (d ? "#" : "."))
      .join("")
      .value()
  );
}
