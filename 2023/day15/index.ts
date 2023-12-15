import fs from "fs";
import { list, sum } from "radash";

type Step = String;

const initializationSequence = fs
  .readFileSync("day15/input.txt", "utf8")
  .split("\n")[0]
  .split(",") as Step[];

function hash(input: Step): number {
  return input
    .split("")
    .reduce(
      (previous, current) => ((previous + current.charCodeAt(0)) * 17) % 256,
      0
    );
}

const part1 = sum(initializationSequence.map(hash));

console.log("part 1: %d", part1);

interface Box {
  lensSlots: Lens[];
}

interface Lens {
  label: string;
  focalLength: number;
}

function hashmap() {
  const boxes = list(0, 255).map<Box>(() => ({
    lensSlots: [],
  }));

  function perform(step: Step) {
    if (step.endsWith("-")) {
      const label = step.slice(0, -1);
      const box = boxes[hash(label)];

      box.lensSlots = box.lensSlots.filter((lens) => lens.label !== label);
    } else {
      const label = step.slice(0, step.indexOf("="));
      const focalLength = Number(step.slice(step.indexOf("=") + 1));
      const box = boxes[hash(label)];

      const existingLens = box.lensSlots.find((lens) => lens.label === label);
      if (existingLens) {
        existingLens.focalLength = focalLength;
      } else {
        box.lensSlots.push({ label, focalLength });
      }
    }
  }

  for (const step of initializationSequence) {
    perform(step);
  }

  return boxes;
}

function getFocusingPower(
  boxNumber: number,
  slotNumber: number,
  lens: Lens
): number {
  return (1 + boxNumber) * slotNumber * lens.focalLength;
}

const part2 = sum(
  hashmap().flatMap((box, boxNumber) =>
    box.lensSlots.map((lens, slotIndex) =>
      getFocusingPower(boxNumber, slotIndex + 1, lens)
    )
  )
);

console.log("part 2: %d", part2);
