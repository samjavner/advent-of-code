import fs from "fs";
import { list, range } from "radash";

const input = fs.readFileSync("day6/input.txt", "utf8").split("\n");

const times = input[0]
  .split(/: */)[1]
  .split(/ +/)
  .map((x) => Number(x));

const distances = input[1]
  .split(/: */)[1]
  .split(/ +/)
  .map((x) => Number(x));

const part1 = list(0, times.length - 1)
  .map((n) => {
    const raceMs = times[n];
    const recordDistance = distances[n];
    return list(1, raceMs - 1)
      .map((heldMs) => heldMs * (raceMs - heldMs))
      .filter((distance) => distance > recordDistance).length;
  })
  .reduce((previous, current) => previous * current, 1);

console.log("part 1: %d", part1);

const raceMs = Number(input[0].split(/: */)[1].split(/ +/).join(""));
const recordDistance = Number(input[1].split(/: */)[1].split(/ +/).join(""));

function search(start: number, end: number): number {
  if (end - start === 1) {
    return start * (raceMs - start) > recordDistance ? start : end;
  }

  const heldMs = Math.floor((start + end) / 2);
  const distance = heldMs * (raceMs - heldMs);

  return distance > recordDistance
    ? search(start, heldMs)
    : search(heldMs, end);
}

const firstHeldMs = search(1, Math.floor(raceMs / 2));
const part2 = raceMs + 1 - 2 * firstHeldMs;

console.log("part 2: %d", part2);
