import fs from "fs";

type Variable = "w" | "x" | "y" | "z";
type InstructionType = "inp" | "add" | "mul" | "div" | "mod" | "eql";

type State = Record<Variable, number>;

const init: State = {
  w: 0,
  x: 0,
  y: 0,
  z: 0,
};

interface Instruction {
  type: InstructionType;
  a: Variable;
  b?: Variable;
  n?: number;
}

const instructions = fs
  .readFileSync("day24/input.txt", "utf8")
  .split("\n")
  .filter((n) => n)
  .map<Instruction>((n) => {
    const [type, a, b] = n.split(" ");
    const isVariable = ["w", "x", "y", "z"].includes(b);
    const isNumber = !isVariable && !!b;

    return {
      type: type as InstructionType,
      a: a as Variable,
      b: isVariable ? (b as Variable) : undefined,
      n: isNumber ? Number.parseInt(b) : undefined,
    };
  });

const execute = (input: number[]): State => {
  const state = { ...init };
  let inputPointer = 0;

  for (const instruction of instructions) {
    if (instruction.type === "inp") {
      state[instruction.a] = input[inputPointer];
      inputPointer += 1;
      continue;
    }

    let a = state[instruction.a];
    let b = instruction.n ?? state[instruction.b!];
    let result: number;
    switch (instruction.type) {
      case "add":
        result = a + b;
        break;
      case "mul":
        result = a * b;
        break;
      case "div":
        result = Math.trunc(a / b);
        break;
      case "mod":
        result = a % b;
        break;
      case "eql":
        result = a === b ? 1 : 0;
        break;
    }
    state[instruction.a] = result;
  }

  return state;
};

// Reverse engineered code on pen and paper to get following constraints:

// d6 == d5 - 2
// d7 == d4 + 7
// d9 == d8 + 4
// d11 == d10 - 6
// d12 == d3 + 5
// d13 == d2 - 7
// d14 == d1

// Given the knowledge of how the code works - multiplying by 26 on 7 of the digits
// and unwinding with a corresponding division on the other 7 digits, but only if
// a constraint on 2 of the digits is met, it would be possible to work this out in
// code using a stack.

console.log("part 1:");
console.log(execute([9, 9, 4, 2, 9, 7, 9, 5, 9, 9, 3, 9, 2, 9]));

console.log("part 2:");
console.log(execute([1, 8, 1, 1, 3, 1, 8, 1, 5, 7, 1, 6, 1, 1]));
