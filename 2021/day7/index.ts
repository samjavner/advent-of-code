import fs from "fs";
import _ from "lodash";

const unsorted = fs
  .readFileSync("day7/input.txt", "utf8")
  .split("\n")[0]
  .split(",")
  .map((position) => Number.parseInt(position));

const positions = _.sortBy(unsorted);

const median = positions[Math.floor(positions.length / 2)];
const fuel = _(positions)
  .map((p) => Math.abs(p - median))
  .sum();

console.log("part 1: %d", fuel);

const fuelPart2 = _.chain(_.first(positions))
  .range(_.last(positions))
  .map((c) =>
    _(positions)
      .map((p) => {
        const d = Math.abs(p - c);
        return (d * (d + 1)) / 2;
      })
      .sum()
  )
  .min();

console.log("part 2: %d", fuelPart2);
