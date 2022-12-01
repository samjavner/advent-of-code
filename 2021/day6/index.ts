import _ from "lodash";
import fs from "fs";

type Lanternfish = { [daysLeft: number]: number };

const initial = fs
  .readFileSync("day6/input.txt", "utf8")
  .split("\n")[0]
  .split(",")
  .map((daysLeft) => Number.parseInt(daysLeft))
  .reduce<Lanternfish>(
    (previous, current) => ({ ...previous, [current]: previous[current] + 1 }),
    _.chain(0)
      .range(9)
      .keyBy()
      .mapValues((_) => 0)
      .value()
  );

const grow = (fish: Lanternfish): Lanternfish => ({
  ..._.mapKeys(fish, (_, age) => (age === "0" ? 6 : Number.parseInt(age) - 1)),
  [6]: fish[7] + fish[0],
  [8]: fish[0],
});

const growN = (fish: Lanternfish, n: number): Lanternfish =>
  _.range(0, n).reduce(grow, fish);

console.log("part 1: %d", _(growN(initial, 80)).values().sum());
console.log("part 2: %d", _(growN(initial, 256)).values().sum());
