import fs from "fs";
import { sum } from "radash";

const numbers = [
  ["0", "zero"],
  ["1", "one"],
  ["2", "two"],
  ["3", "three"],
  ["4", "four"],
  ["5", "five"],
  ["6", "six"],
  ["7", "seven"],
  ["8", "eight"],
  ["9", "nine"],
];

function getCalibrationValue(shouldIncludeSpelled: boolean) {
  return function (calibration: string): number {
    let first = "";
    let firstIndex = calibration.length;
    let last = "";
    let lastIndex = -1;

    for (const [n, spelled] of numbers) {
      const currentFirstIndex = calibration.indexOf(n);
      if (currentFirstIndex !== -1 && currentFirstIndex < firstIndex) {
        first = n;
        firstIndex = currentFirstIndex;
      }

      const currentLastIndex = calibration.lastIndexOf(n);
      if (currentLastIndex > lastIndex) {
        last = n;
        lastIndex = currentLastIndex;
      }

      if (shouldIncludeSpelled) {
        const currentFirstIndex = calibration.indexOf(spelled);
        if (currentFirstIndex !== -1 && currentFirstIndex < firstIndex) {
          first = n;
          firstIndex = currentFirstIndex;
        }

        const currentLastIndex = calibration.lastIndexOf(spelled);
        if (currentLastIndex > lastIndex) {
          last = n;
          lastIndex = currentLastIndex;
        }
      }
    }

    return Number(first + last);
  };
}

const calibrations = fs
  .readFileSync("day1/input.txt", "utf8")
  .split("\n")
  .filter((x) => x);

const part1 = sum(calibrations.map(getCalibrationValue(false)));

console.log("part 1: %d", part1);

const part2 = sum(calibrations.map(getCalibrationValue(true)));

console.log("part 2: %d", part2);
