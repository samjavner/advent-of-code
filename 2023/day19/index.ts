import fs from "fs";
import { sum } from "radash";

interface Workflow {
  name: Name;
  rules: Rule[];
}

type Name = string;

type Rule =
  | {
      type: "conditional_send";
      on: "x" | "m" | "a" | "s";
      operator: "<" | ">";
      value: number;
      sendTo: Name;
    }
  | {
      type: "send";
      sendTo: Name;
    };

interface Part {
  x: number;
  m: number;
  a: number;
  s: number;
}

const input = fs.readFileSync("day19/input.txt", "utf8").split("\n");

const workflows: Workflow[] = input
  .slice(0, input.indexOf(""))
  .map((workflow) => {
    const [, name, rules] = /^(.+){(.+)}$/.exec(workflow)!;

    return {
      name,
      rules: rules.split(",").map((rule) => {
        if (rule.includes(":")) {
          const [condition, sendTo] = rule.split(":");
          const [, on, operator, value] = /^([xmas])([<>])(\d+)$/.exec(
            condition
          )!;

          return {
            type: "conditional_send",
            on: on as "x" | "m" | "a" | "s",
            operator: operator as "<" | ">",
            value: Number(value),
            sendTo,
          };
        } else {
          return {
            type: "send",
            sendTo: rule,
          };
        }
      }),
    };
  });

const parts: Part[] = input
  .slice(input.indexOf("") + 1)
  .filter((x) => x)
  .map((part) => {
    const [, x, m, a, s] = /^{x=(.+),m=(.+),a=(.+),s=(.+)}$/.exec(part)!;

    return {
      x: Number(x),
      m: Number(m),
      a: Number(a),
      s: Number(s),
    };
  });

function part1() {
  function execute(workflowName: string, part: Part): boolean {
    if (["A", "R"].includes(workflowName)) {
      return workflowName === "A";
    }

    const workflow = workflows.find(
      (workflow) => workflow.name === workflowName
    )!;

    for (const rule of workflow.rules) {
      if (
        rule.type === "send" ||
        (rule.operator === "<" && part[rule.on] < rule.value) ||
        (rule.operator === ">" && part[rule.on] > rule.value)
      ) {
        return execute(rule.sendTo, part);
      }
    }

    throw new Error();
  }

  return sum(
    parts.map((part) =>
      execute("in", part) ? part.x + part.m + part.a + part.s : 0
    )
  );
}

console.log("part 1: %d", part1());

interface PartRange {
  from: Part;
  to: Part;
}

function part2() {
  function execute(workflowName: string, inputRange: PartRange): PartRange[] {
    if (["A", "R"].includes(workflowName)) {
      return workflowName === "A" ? [inputRange] : [];
    }

    const workflow = workflows.find(
      (workflow) => workflow.name === workflowName
    )!;

    let current = [inputRange];
    const result: PartRange[] = [];
    for (const rule of workflow.rules) {
      let next: PartRange[] = [];

      for (const range of current) {
        if (rule.type === "send") {
          result.push(...execute(rule.sendTo, range));
        } else if (rule.operator === "<") {
          if (range.from[rule.on] >= rule.value) {
            next.push(range);
          } else if (range.to[rule.on] < rule.value) {
            result.push(...execute(rule.sendTo, range));
          } else {
            next.push({
              from: {
                ...range.from,
                [rule.on]: rule.value,
              },
              to: range.to,
            });
            result.push(
              ...execute(rule.sendTo, {
                from: range.from,
                to: {
                  ...range.to,
                  [rule.on]: rule.value - 1,
                },
              })
            );
          }
        } else {
          if (range.to[rule.on] <= rule.value) {
            next.push(range);
          } else if (range.from[rule.on] > rule.value) {
            result.push(...execute(rule.sendTo, range));
          } else {
            next.push({
              from: range.from,
              to: {
                ...range.to,
                [rule.on]: rule.value,
              },
            });
            result.push(
              ...execute(rule.sendTo, {
                from: {
                  ...range.from,
                  [rule.on]: rule.value + 1,
                },
                to: range.to,
              })
            );
          }
        }
      }

      current = next;
    }

    if (current.length > 0) {
      throw new Error();
    }

    return result;
  }

  return sum(
    execute("in", {
      from: { x: 1, m: 1, a: 1, s: 1 },
      to: { x: 4000, m: 4000, a: 4000, s: 4000 },
    }).map(
      (range) =>
        (range.to.x - range.from.x + 1) *
        (range.to.m - range.from.m + 1) *
        (range.to.a - range.from.a + 1) *
        (range.to.s - range.from.s + 1)
    )
  );
}

console.log("part 2: %d", part2());
