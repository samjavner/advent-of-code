import fs from "fs";
import _, { initial } from "lodash";

type Rule = [pair: string, insertion: string];

const [template, rulesInput] = fs
  .readFileSync("day14/input.txt", "utf8")
  .split("\n\n");

const rules = rulesInput
  .split("\n")
  .filter((n) => n)
  .map((n) => n.split(" -> ") as Rule);

const ruleInsertions = _(rules)
  .keyBy((r) => r[0])
  .mapValues((r) => r[1])
  .value();

const step = (polymer: string): string => {
  let result = "";
  for (let i = 0; i < polymer.length - 1; i++) {
    result += polymer[i];

    const insertion = ruleInsertions[polymer[i] + polymer[i + 1]];
    if (insertion) {
      result += insertion;
    }
  }
  result += polymer[polymer.length - 1];
  return result;
};

const stepN = (n: number): string => _.range(0, n).reduce(step, template);

const part1 = _(stepN(10)).split("").sortBy().countBy().values().value();

console.log("part 1: %d", _.max(part1)! - _.min(part1)!);

const initialPairCounts = _.chain(0)
  .range(template.length - 1)
  .map((i) => template[i] + template[i + 1])
  .groupBy()
  .mapValues((p) => p.length)
  .value();

const stepV2 = (counts: Record<string, number>): Record<string, number> => {
  let result: Record<string, number> = {};
  for (const [pair, count] of Object.entries(counts)) {
    const insertion = ruleInsertions[pair];
    if (insertion) {
      const pair1 = pair[0] + insertion;
      result[pair1] = (result[pair1] ?? 0) + count;

      const pair2 = insertion + pair[1];
      result[pair2] = (result[pair2] ?? 0) + count;
    } else {
      result[pair] = (result[pair] ?? 0) + count;
    }
  }
  return result;
};

const stepNV2 = (n: number): Record<string, number> =>
  _.range(0, n).reduce(stepV2, initialPairCounts);

const part2 = _(stepNV2(40))
  .toPairs()
  .map(([pair, count]) => [pair[0], count] as const)
  .groupBy(([x]) => x)
  .mapValues(
    (counts, letter) =>
      _(counts)
        .map(([, count]) => count)
        .sum() + (letter === _.last(template) ? 1 : 0)
  )
  .values()
  .value();

console.log("part 2: %d", _.max(part2)! - _.min(part2)!);
