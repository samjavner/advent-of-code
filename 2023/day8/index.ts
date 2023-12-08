import fs from "fs";
import { list, objectify } from "radash";

const input = fs
  .readFileSync("day8/input.txt", "utf8")
  .split("\n")
  .filter((x) => x);

const instructions = input[0]
  .split("")
  .map((value) => (value === "L" ? "left" : "right"));
const mappings = input.slice(1).map((mapping) => {
  const [, node, left, right] = [
    .../^(\w{3}) = \((\w{3}), (\w{3})\)$/.exec(mapping)!,
  ];

  return {
    node,
    left,
    right,
  };
});

const network = objectify(mappings, (mapping) => mapping.node);
const nodes = mappings.map((mappings) => mappings.node);

let part1 = 0;
let current = "AAA";
while (true) {
  current = network[current][instructions[part1 % instructions.length]];
  part1 += 1;

  if (current === "ZZZ") {
    break;
  }
}

console.log("part 1: %d", part1);

interface Cycles {
  length: number;
  offsets: number[];
}

let i = 0;
let currentNodes = nodes
  .filter((node) => node.endsWith("A"))
  .map((node) => [node]);
const cycles: Cycles[] = [];

// I don't think this code is truly general. It returns the correct value for the input,
// but it seems like the input was was deliberately constructed in a way that cycles would
// line up on neat boundaries, making the problem easier to solve.

while (true) {
  const nextNodes = [];
  for (const nodes of currentNodes) {
    const node = nodes[nodes.length - 1];
    const next = network[node][instructions[i % instructions.length]];

    let start = nodes.length - instructions.length;
    let foundCycle = false;
    while (start >= 0) {
      if (nodes[start] === next) {
        foundCycle = true;
        break;
      }
      start -= instructions.length;
    }

    if (foundCycle) {
      const length = nodes.length - start;
      const offsets = list(start, start + length - 1).filter((j) =>
        nodes[j].endsWith("Z")
      );

      cycles.push({
        length,
        offsets,
      });
    } else {
      nextNodes.push([...nodes, next]);
    }
  }

  currentNodes = nextNodes;
  i += 1;

  if (currentNodes.length === 0) {
    break;
  }
}

const part2 =
  instructions.length *
  cycles.reduce(
    (previous, { length }) => (previous * length) / instructions.length,
    1
  );

console.log("part 2: %d", part2);
