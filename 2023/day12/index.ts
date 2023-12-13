import fs from "fs";
import { list, sum } from "radash";

interface ConditionRecord {
  springs: Row;
  damagedGroupSizes: number[];
}

type Row = PossiblyUnknownSpring[];

type Arrangement = Spring[];

type PossiblyUnknownSpring = Spring | "unknown";

type Spring = "operational" | "damaged";

const validArrangements: Record<string, number> = {};

function getValidArrangements(conditionRecord: ConditionRecord): number {
  const value =
    conditionRecord.springs.join("") +
    " " +
    conditionRecord.damagedGroupSizes.join(",");

  if (validArrangements[value] !== undefined) {
    return validArrangements[value];
  }

  if (conditionRecord.damagedGroupSizes.length === 0) {
    const result = conditionRecord.springs.includes("damaged") ? 0 : 1;
    validArrangements[value] = result;
    return result;
  }

  const [size, ...remainingSizes] = conditionRecord.damagedGroupSizes;

  const lastPossibleValidStartPosition = conditionRecord.springs.includes(
    "damaged"
  )
    ? conditionRecord.springs.indexOf("damaged")
    : conditionRecord.springs.length - size;

  const validStartPositions = list(0, lastPossibleValidStartPosition).filter(
    (i) =>
      list(i, i + size - 1).every((j) =>
        ["damaged", "unknown"].includes(conditionRecord.springs[j])
      ) &&
      conditionRecord.springs[i - 1] !== "damaged" &&
      conditionRecord.springs[i + size] !== "damaged"
  );

  const result = validStartPositions.reduce(
    (previous, current) =>
      previous +
      getValidArrangements({
        springs: conditionRecord.springs.slice(current + size + 1),
        damagedGroupSizes: remainingSizes,
      }),
    0
  );

  validArrangements[value] = result;
  return result;
}

const conditionRecords: ConditionRecord[] = fs
  .readFileSync("day12/input.txt", "utf8")
  .split("\n")
  .filter((x) => x)
  .map((record) => {
    const [springs, damagedGroupSizes] = record.split(" ");

    return {
      springs: springs
        .split("")
        .map((spring) =>
          spring === "."
            ? "operational"
            : spring === "#"
            ? "damaged"
            : "unknown"
        ),
      damagedGroupSizes: damagedGroupSizes
        .split(",")
        .map((size) => Number(size)),
    };
  });

const part1 = sum(
  conditionRecords.map((record) => getValidArrangements(record))
);

console.log("part 1: %d", part1);

function unfold(conditionRecord: ConditionRecord): ConditionRecord {
  const result: ConditionRecord = {
    springs: [],
    damagedGroupSizes: [],
  };

  for (let i = 0; i < 5; i += 1) {
    if (i > 0) {
      result.springs.push("unknown");
    }
    result.springs.push(...conditionRecord.springs);
    result.damagedGroupSizes.push(...conditionRecord.damagedGroupSizes);
  }

  return result;
}

const part2 = sum(
  conditionRecords.map((record) => getValidArrangements(unfold(record)))
);

console.log("part 2: %d", part2);
