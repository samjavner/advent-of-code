import fs from "fs";
import _ from "lodash";

type Pair = ("[" | "]" | "," | number)[];
type PairTree = number | [PairTree, PairTree];

const parse = (pair: string): Pair =>
  pair
    .split("")
    .map((c) => (["[", "]", ","].includes(c) ? c : Number.parseInt(c))) as any;

const pairs: Pair[] = fs
  .readFileSync("day18/input.txt", "utf8")
  .split("\n")
  .filter((n) => n)
  .map(parse);

const reduce = (pair: Pair): Pair => {
  let depth = 0;
  let leftIndex = -1;

  for (let index = 0; index <= pair.length; index++) {
    const c = pair[index];
    if (c === "[") {
      depth += 1;
    } else if (c === "]") {
      depth -= 1;
    } else if (c === ",") {
      // ignore
    } else {
      if (depth > 4) {
        const leftValue = pair[index] as number;
        const rightValue = pair[index + 2] as number;

        let rightIndex = index + 3;
        while (
          typeof pair[rightIndex] !== "number" &&
          rightIndex < pair.length
        ) {
          rightIndex++;
        }

        const leftSide =
          leftIndex === -1
            ? pair.slice(0, index - 1)
            : [
                ...pair.slice(0, leftIndex),
                (pair[leftIndex] as number) + leftValue,
                ...pair.slice(leftIndex + 1, index - 1),
              ];

        const rightSide =
          rightIndex === pair.length
            ? pair.slice(index + 4)
            : [
                ...pair.slice(index + 4, rightIndex),
                (pair[rightIndex] as number) + rightValue,
                ...pair.slice(rightIndex + 1),
              ];

        return [...leftSide, 0, ...rightSide];
      } else {
        leftIndex = index;
      }
    }
  }

  for (let index = 0; index <= pair.length; index++) {
    const c = pair[index];
    if (typeof c === "number" && c >= 10) {
      return [
        ...pair.slice(0, index),
        "[",
        Math.floor(c / 2),
        ",",
        Math.ceil(c / 2),
        "]",
        ...pair.slice(index + 1),
      ];
    }
  }

  return pair;
};

const completelyReduce = (pair: Pair): Pair => {
  let next = reduce(pair);
  while (next !== pair) {
    pair = next;
    next = reduce(pair);
  }
  return next;
};

const add = (pair1: Pair, pair2: Pair): Pair =>
  pair1.length === 0
    ? pair2
    : pair2.length === 0
    ? pair1
    : completelyReduce(["[", ...pair1, ",", ...pair2, "]"]);

const makeTree = (pair: Pair): PairTree => JSON.parse(pair.join(""));

const getMagnitude = (pair: PairTree): number =>
  typeof pair === "number"
    ? pair
    : 3 * getMagnitude(pair[0]) + 2 * getMagnitude(pair[1]);

const sum = pairs.reduce(add, []);
const tree = makeTree(sum);
const magnitude = getMagnitude(tree);

console.log("part 1: %d", magnitude);

const candidates: Pair[][] = [];
for (const p1 of pairs) {
  for (const p2 of pairs) {
    if (p1 !== p2) {
      candidates.push([p1, p2]);
    }
  }
}

const maxMagnitude = _(candidates)
  .filter(([p1, p2]) => p1 !== p2)
  .map((p) => p.reduce(add, []))
  .map(makeTree)
  .map(getMagnitude)
  .max();

console.log("part 2: %d", maxMagnitude);
