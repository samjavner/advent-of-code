import _ from "lodash";
import fs from "fs";

const measurements = fs
  .readFileSync("day1/input.txt", "utf8")
  .split("\n")
  .filter((n) => n)
  .map((n) => Number.parseInt(n));

const getIncreaseCount = (windowSize = 1) =>
  _.chain(0)
    .range(measurements.length - windowSize)
    .filter(
      (i) =>
        _.sum(measurements.slice(i, i + windowSize)) <
        _.sum(measurements.slice(i + 1, i + 1 + windowSize))
    )
    .size();

console.log("part 1: %d", getIncreaseCount());
console.log("part 2: %d", getIncreaseCount(3));
