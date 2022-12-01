import fs from "fs";

type Command = [direction: Direction, amount: number];
type Direction = "forward" | "down" | "up";

const commands = fs
  .readFileSync("day2/input.txt", "utf8")
  .split("\n")
  .filter((command) => command)
  .map((c) => c.split(" "))
  .map<Command>(([direction, amount]) => [
    direction as Direction,
    Number.parseInt(amount),
  ]);

const getPosition = (): [horizontal: number, depth: number] =>
  commands.reduce(
    ([horizontal, depth], [direction, amount]) => {
      switch (direction) {
        case "forward":
          return [horizontal + amount, depth];
        case "down":
          return [horizontal, depth + amount];
        case "up":
          return [horizontal, depth - amount];
      }
    },
    [0, 0]
  );

const getPosition2 = (): [horizontal: number, depth: number, aim: number] =>
  commands.reduce(
    ([horizontal, depth, aim], [direction, amount]) => {
      switch (direction) {
        case "forward":
          return [horizontal + amount, depth + aim * amount, aim];
        case "down":
          return [horizontal, depth, aim + amount];
        case "up":
          return [horizontal, depth, aim - amount];
      }
    },
    [0, 0, 0]
  );

const part1 = getPosition();
console.log("part 1: %d", part1[0] * part1[1]);

const part2 = getPosition2();
console.log("part 2: %d", part2[0] * part2[1]);
