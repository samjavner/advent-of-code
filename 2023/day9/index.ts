import fs from "fs";
import { list, sum } from "radash";

function getDifferences(values: number[]): number[][] {
  let differences = [values];

  while (differences[0].some((v) => v !== 0)) {
    const current = differences[0];
    const next = list(0, current.length - 2).map(
      (i) => current[i + 1] - current[i]
    );
    differences = [next, ...differences];
  }

  return differences;
}

const history = fs
  .readFileSync("day9/input.txt", "utf8")
  .split("\n")
  .filter((x) => x)
  .map((x) => x.split(" ").map((v) => Number(v)));

const differences = history.map(getDifferences);

function predict(differences: number[][]) {
  return differences.reduce(
    (previous, current) => previous + current[current.length - 1],
    0
  );
}

const part1 = sum(differences.map(predict));

console.log("part 1: %d", part1);

function postdict(differences: number[][]) {
  return differences.reduce((previous, current) => current[0] - previous, 0);
}

const part2 = sum(differences.map(postdict));

console.log("part 2: %d", part2);
