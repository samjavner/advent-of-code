import _ from "lodash";
import fs from "fs";

const input = fs
  .readFileSync("day8/input.txt", "utf8")
  .split("\n")
  .filter((n) => n)
  .map((n) => n.split(" | "))
  .map(([p, o]) => ({
    patterns: p.split(" "),
    output: o.split(" "),
  }));

const is1478 = (d: string) => [2, 3, 4, 7].includes(d.length);

const count1478 = _(input)
  .map(({ output }) => output.filter(is1478).length)
  .sum();

console.log("part 1: %d", count1478);

const numberMap: Record<string, number> = {
  abcefg: 0,
  cf: 1,
  acdeg: 2,
  acdfg: 3,
  bcdf: 4,
  abdfg: 5,
  abdefg: 6,
  acf: 7,
  abcdefg: 8,
  abcdfg: 9,
};

const getMapping = (patterns: string[]): Record<string, string> => {
  const counts = _(patterns.join("").split("")).countBy().toPairs();

  const findCountEqual = (x: number) => counts.find(([_, c]) => c === x)![0];

  const b = findCountEqual(6); // segment b uniquely appears in 6 numbers
  const e = findCountEqual(4); // segment e uniquely appears in 4 numbers
  const f = findCountEqual(9); // segment f uniquely appears in 9 numbers

  const findRemainingSegment = (length: number, known: string[]) =>
    patterns
      .find((p) => p.length === length)!
      .split("")
      .find((x) => !known.includes(x))!;

  const c = findRemainingSegment(2, [f]); // segment c is the remaining segment from 1 (which uniquely has 2 segments)
  const a = findRemainingSegment(3, [c, f]); // segment a is the remaining segment from 7 (which uniquely has 3 segments)
  const d = findRemainingSegment(4, [b, c, f]); // segment d is the remaining segment from 4 (which uniquely has 4 segments)
  const g = findRemainingSegment(7, [a, b, c, d, e, f]); // segment g is the remaining segment from 8 (which uniquely has 7 segments);

  return _.invert({
    a,
    b,
    c,
    d,
    e,
    f,
    g,
  });
};

const getOutput = ({
  patterns,
  output,
}: {
  patterns: string[];
  output: string[];
}): number => {
  const mapping = getMapping(patterns);
  const digits = output.map(
    (o) =>
      numberMap[
        o
          .split("")
          .map((x) => mapping[x])
          .sort()
          .join("")
      ]
  );
  return digits[0] * 1000 + digits[1] * 100 + digits[2] * 10 + digits[3];
};

const sum = _(input).map(getOutput).sum();

console.log("part 2: %d", sum);
