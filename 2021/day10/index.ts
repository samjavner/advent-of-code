import fs from "fs";
import _ from "lodash";

const lines = fs
  .readFileSync("day10/input.txt", "utf8")
  .split("\n")
  .filter((n) => n)
  .map((n) => n.split(""));

const pairs = [
  ["(", ")", 3, 1],
  ["[", "]", 57, 2],
  ["{", "}", 1197, 3],
  ["<", ">", 25137, 4],
] as const;

const openingChars: string[] = pairs.map((p) => p[0]);

const openingCharByClosingChar = _(pairs)
  .keyBy((p) => p[1])
  .mapValues((p) => p[0])
  .value();

const closingCharsByOpeningChar = _(pairs)
  .keyBy((p) => p[0])
  .mapValues((p) => p[1])
  .value();

const corruptionScores = _(pairs)
  .keyBy((p) => p[1])
  .mapValues((p) => p[2])
  .value();

const autocompleteScores = _(pairs)
  .keyBy((p) => p[1])
  .mapValues((p) => p[3])
  .value();

type Valid = { type: "valid" };
type Incomplete = { type: "incomplete"; completion: string[] };
type Corrupted = { type: "corrupted"; char: string };

type Result = Valid | Incomplete | Corrupted;

const parse = (line: string[]): Result => {
  const unclosed: string[] = [];

  for (const char of line) {
    if (openingChars.includes(char)) {
      unclosed.push(char);
    } else {
      if (_.last(unclosed) === openingCharByClosingChar[char]) {
        unclosed.splice(unclosed.length - 1);
      } else {
        return {
          type: "corrupted",
          char,
        };
      }
    }
  }

  return unclosed.length === 0
    ? {
        type: "valid",
      }
    : {
        type: "incomplete",
        completion: _(unclosed)
          .reverse()
          .map((c) => closingCharsByOpeningChar[c])
          .value(),
      };
};

const corruptionScore = _(lines)
  .map(parse)
  .filter((r): r is Corrupted => r.type === "corrupted")
  .map((r) => corruptionScores[r.char])
  .sum();

console.log("part 1: %d", corruptionScore);

const completionScores = _(lines)
  .map(parse)
  .filter((r): r is Incomplete => r.type === "incomplete")
  .map((r) =>
    _(r.completion).reduce(
      (score, char) => score * 5 + autocompleteScores[char],
      0
    )
  )
  .sortBy()
  .value();

const medianCompletionScore =
  completionScores[Math.floor(completionScores.length / 2)];

console.log("part 2: %d", medianCompletionScore);
