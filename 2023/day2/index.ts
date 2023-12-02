import fs from "fs";
import { sum } from "radash";

function parseGame(game: string) {
  const [n, sets] = game.split(": ");

  return {
    number: Number(n.split(" ")[1]),
    sets: parseSets(sets),
  };
}

function parseSets(sets: string) {
  return sets.split("; ").map(parseSet);
}

function parseSet(set: string) {
  return set
    .split(", ")
    .map(parseCubes)
    .reduce((previous, current) => ({ ...previous, ...current }), {
      red: 0,
      green: 0,
      blue: 0,
    });
}

function parseCubes(cubes: string) {
  const [n, color] = cubes.split(" ");
  return { [color]: Number(n) };
}

const games = fs
  .readFileSync("day2/input.txt", "utf8")
  .split("\n")
  .filter((x) => x)
  .map(parseGame);

const part1 = sum(
  games
    .filter((game) =>
      game.sets.every(
        (set) => set.red <= 12 && set.green <= 13 && set.blue <= 14
      )
    )
    .map((game) => game.number)
);

console.log("part 1: %d", part1);

const part2 = sum(
  games
    .map((game) =>
      game.sets.reduce(
        (previous, current) => ({
          red: Math.max(previous.red, current.red),
          green: Math.max(previous.green, current.green),
          blue: Math.max(previous.blue, current.blue),
        }),
        { red: 0, green: 0, blue: 0 }
      )
    )
    .map((set) => set.red * set.green * set.blue)
);

console.log("part 2: %d", part2);
