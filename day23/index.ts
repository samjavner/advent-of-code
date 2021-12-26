import fs from "fs";
import _ from "lodash";

type Amphipod = "A" | "B" | "C" | "D";
type MaybeAmphipod = Amphipod | undefined;

// ## ## ## ## ## ## ## ## ## ## ## ## ##
// ## L1 L0    X     Y     Z     R0 R1 ##
// ## ## ## A0 ## B0 ## C0 ## D0 ## ## ##
//       ## A1 ## B1 ## C1 ## D1 ##
//       ## A2 ## B2 ## C2 ## D2 ##
//       ## A3 ## B3 ## C3 ## D3 ##
//       ## ## ## ## ## ## ## ## ##

type Room = "A" | "B" | "C" | "D" | "L" | "R" | "X" | "Y" | "Z";

const rooms: Room[] = ["A", "B", "C", "D", "L", "R", "X", "Y", "Z"];

interface Position {
  room: Room;
  index: number;
}

const getPositions = (burrow: Burrow): Position[] =>
  rooms.flatMap((room) =>
    _.chain(0)
      .range(burrow[room].length)
      .map((index) => ({ room, index }))
      .value()
  );

type Burrow = Record<Room, MaybeAmphipod[]>;

interface State {
  burrow: Burrow;
  energyUsed: number;
}

const isValidMove = (from: Position, to: Position, burrow: Burrow): boolean => {
  const amphipod = burrow[from.room][from.index];

  const isPrevented =
    (from.room === to.room && from.index === to.index) ||
    !amphipod ||
    burrow[from.room].some(
      (x, index) => x !== undefined && index < from.index
    ) ||
    burrow[from.room].every((x) => x === from.room || x === undefined) ||
    !!burrow[to.room][to.index] ||
    (["A", "B", "C", "D"].includes(to.room) &&
      (amphipod !== to.room ||
        burrow[to.room].some((x) => x !== amphipod && x !== undefined))) ||
    (["L", "R"].includes(to.room) &&
      burrow[to.room].some((x, index) => x && index < to.index)) ||
    (!!burrow.X[0] &&
      ((["A", "L"].includes(from.room) &&
        ["B", "C", "D", "R", "Y", "Z"].includes(to.room)) ||
        (["A", "L"].includes(to.room) &&
          ["B", "C", "D", "R", "Y", "Z"].includes(from.room)))) ||
    (!!burrow.Y[0] &&
      ((["A", "B", "L", "X"].includes(from.room) &&
        ["C", "D", "R", "Z"].includes(to.room)) ||
        (["A", "B", "L", "X"].includes(to.room) &&
          ["C", "D", "R", "Z"].includes(from.room)))) ||
    (!!burrow.Z[0] &&
      ((["A", "B", "C", "L", "X", "Y"].includes(from.room) &&
        ["D", "R"].includes(to.room)) ||
        (["A", "B", "C", "L", "X", "Y"].includes(to.room) &&
          ["D", "R"].includes(from.room)))) ||
    (["L", "R", "X", "Y", "Z"].includes(from.room) &&
      ["L", "R", "X", "Y", "Z"].includes(to.room));

  return !isPrevented;
};

const centerHallPosition: Record<string, number> = {
  L: 0,
  A: 0,
  X: 1,
  B: 2,
  Y: 3,
  C: 4,
  Z: 5,
  D: 6,
  R: 6,
};

const getSteps = (from: Position, to: Position): number => {
  const stepsToCenterHall = ["X", "Y", "Z"].includes(from.room)
    ? 0
    : from.index + 1;

  const stepsFromCenterHall = ["X", "Y", "Z"].includes(to.room)
    ? 0
    : to.index + 1;

  const stepsWithinCenterHall = Math.abs(
    centerHallPosition[from.room] - centerHallPosition[to.room]
  );

  return stepsToCenterHall + stepsFromCenterHall + stepsWithinCenterHall;
};

const energyPerStep: Record<Amphipod, number> = {
  A: 1,
  B: 10,
  C: 100,
  D: 1000,
};

const move = (from: Position, to: Position, state: State): State => {
  const amphipod = state.burrow[from.room][from.index]!;
  const energyUsed = energyPerStep[amphipod] * getSteps(from, to);

  return {
    burrow: {
      ...state.burrow,
      [from.room]: state.burrow[from.room].map((x, index) =>
        index === from.index ? undefined : x
      ),
      [to.room]: state.burrow[to.room].map((x, index) =>
        index === to.index
          ? amphipod
          : to.room === from.room && index === from.index
          ? undefined
          : x
      ),
    },
    energyUsed: state.energyUsed + energyUsed,
  };
};

const isOrganized = (burrow: Burrow): boolean =>
  burrow.A.every((x) => x === "A") &&
  burrow.B.every((x) => x === "B") &&
  burrow.C.every((x) => x === "C") &&
  burrow.D.every((x) => x === "D");

const toString = (positions: Position[], state: State): string =>
  positions.map((pos) => state.burrow[pos.room][pos.index] ?? "-").join("");

const evaluate = (initial: Burrow): number => {
  const positions = getPositions(initial);

  let energyUsed = Number.MAX_SAFE_INTEGER;
  const found: Record<string, number> = {};
  const pending: State[] = [{ burrow: initial, energyUsed: 0 }];

  while (pending.length > 0) {
    const current = pending.pop()!;

    if (current.energyUsed > energyUsed) {
      continue;
    }

    const currentString = toString(positions, current);
    if (found[currentString] > current.energyUsed) {
      continue;
    }

    if (isOrganized(current.burrow)) {
      energyUsed = current.energyUsed;
      continue;
    }

    for (const from of positions) {
      for (const to of positions) {
        if (isValidMove(from, to, current.burrow)) {
          const next = move(from, to, current);
          const nextString = toString(positions, next);
          if (!found[nextString] || found[nextString] > next.energyUsed) {
            found[nextString] = next.energyUsed;
            pending.push(next);
          }
        }
      }
    }
  }

  return energyUsed;
};

const [, , line1, line2] = fs
  .readFileSync("day23/input.txt", "utf8")
  .split("\n");

const burrow1: Burrow = {
  A: [line1[3] as Amphipod, line2[3] as Amphipod],
  B: [line1[5] as Amphipod, line2[5] as Amphipod],
  C: [line1[7] as Amphipod, line2[7] as Amphipod],
  D: [line1[9] as Amphipod, line2[9] as Amphipod],
  L: [undefined, undefined],
  R: [undefined, undefined],
  X: [undefined],
  Y: [undefined],
  Z: [undefined],
};

const energy1 = evaluate(burrow1);

console.log("part 1: %d", energy1);

const burrow2: Burrow = {
  A: [line1[3] as Amphipod, "D", "D", line2[3] as Amphipod],
  B: [line1[5] as Amphipod, "C", "B", line2[5] as Amphipod],
  C: [line1[7] as Amphipod, "B", "A", line2[7] as Amphipod],
  D: [line1[9] as Amphipod, "A", "C", line2[9] as Amphipod],
  L: [undefined, undefined],
  R: [undefined, undefined],
  X: [undefined],
  Y: [undefined],
  Z: [undefined],
};

const energy2 = evaluate(burrow2);

console.log("part 2: %d", energy2);
