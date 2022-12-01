import fs from "fs";
import _ from "lodash";

type Vector = [x: number, y: number, z: number];
type Orientation = [order: Vector, scale: Vector];

// prettier-ignore
const orientations: Orientation[] = [
  // east
  [[0, 1, 2], [1, 1, 1]],
  [[0, 1, 2], [1, -1, -1]],
  [[0, 2, 1], [1, 1, -1]],
  [[0, 2, 1], [1, -1, 1]],
  // west
  [[0, 1, 2], [-1, 1, -1]],
  [[0, 1, 2], [-1, -1, 1]],
  [[0, 2, 1], [-1, -1, -1]],
  [[0, 2, 1], [-1, 1, 1]],
  // north
  [[2, 0, 1], [1, 1, 1]],
  [[2, 0, 1], [1, -1, -1]],
  [[2, 1, 0], [1, 1, -1]],
  [[2, 1, 0], [1, -1, 1]],
  // south
  [[2, 0, 1], [-1, 1, -1]],
  [[2, 0, 1], [-1, -1, 1]],
  [[2, 1, 0], [-1, -1, -1]],
  [[2, 1, 0], [-1, 1, 1]],
  // up
  [[1, 2, 0], [1, 1, 1]],
  [[1, 2, 0], [1, -1, -1]],
  [[1, 0, 2], [1, 1, -1]],
  [[1, 0, 2], [1, -1, 1]],
  // down
  [[1, 2, 0], [-1, 1, -1]],
  [[1, 2, 0], [-1, -1, 1]],
  [[1, 0, 2], [-1, -1, -1]],
  [[1, 0, 2], [-1, 1, 1]],
]

const input = fs
  .readFileSync("day19/input.txt", "utf8")
  .split(/\n*\-\-\- scanner \d+ \-\-\-\n*/)
  .filter((n) => n)
  .map((n) =>
    n
      .split("\n")
      .filter((r) => r)
      .map((r) => r.split(",").map((c) => Number.parseInt(c)) as Vector)
  );

const equals = (v1: Vector, v2: Vector): boolean =>
  v1[0] === v2[0] && v1[1] === v2[1] && v1[2] === v2[2];

const add = (v1: Vector, v2: Vector): Vector => [
  v1[0] + v2[0],
  v1[1] + v2[1],
  v1[2] + v2[2],
];

const negate = (v: Vector): Vector => [-v[0], -v[1], -v[2]];

const subtract = (v1: Vector, v2: Vector): Vector => add(v1, negate(v2));

const orient = ([order, scale]: Orientation, pos: Vector): Vector => [
  pos[order[0]] * scale[0],
  pos[order[1]] * scale[1],
  pos[order[2]] * scale[2],
];

const locate = (orientation: number, offset: Vector, pos: Vector): Vector =>
  add(orient(orientations[orientation], pos), offset);

const detectOverlap = (
  located: Vector[],
  locatedRelativeBeaconPositions: Vector[][],
  unlocated: Vector[],
  unlocatedRelativeBeaconPositions: Vector[][]
): Vector | undefined => {
  for (
    let locatedBeaconNumber = 0;
    locatedBeaconNumber < locatedRelativeBeaconPositions.length;
    locatedBeaconNumber++
  ) {
    for (
      let unlocatedBeaconNumber = 0;
      unlocatedBeaconNumber < unlocatedRelativeBeaconPositions.length;
      unlocatedBeaconNumber++
    ) {
      let common = 0;

      for (const locatedBeacon of locatedRelativeBeaconPositions[
        locatedBeaconNumber
      ]) {
        for (const unlocatedBeacon of unlocatedRelativeBeaconPositions[
          unlocatedBeaconNumber
        ]) {
          if (equals(locatedBeacon, unlocatedBeacon)) {
            common += 1;
          }
        }
      }

      if (common >= 12) {
        return subtract(
          located[locatedBeaconNumber],
          unlocated[unlocatedBeaconNumber]
        );
      }
    }
  }
  return undefined;
};

const orientedReadings: Vector[][][] = input.map((readings) =>
  orientations.map((orientation) => readings.map((v) => orient(orientation, v)))
);

const orientedRelativeBeaconPositions: Vector[][][][] = orientedReadings.map(
  (orientationReadings) =>
    orientationReadings.map((readings) =>
      readings.map((v1) => readings.map((v2) => subtract(v1, v2)))
    )
);

const locatedScannerDetails: {
  [scanner: number]: [orientation: number, offset: Vector];
} = {
  [0]: [0, [0, 0, 0]],
};

const attempted: { [unlocated: number]: { [located: number]: boolean } } = {};

while (Object.keys(locatedScannerDetails).length < input.length) {
  outer: for (let unlocated = 0; unlocated < input.length; unlocated++) {
    if (locatedScannerDetails[unlocated]) {
      continue;
    }
    attempted[unlocated] = attempted[unlocated] || {};

    for (let located = 0; located < input.length; located++) {
      if (!locatedScannerDetails[located] || attempted[unlocated][located]) {
        continue;
      }
      attempted[unlocated][located] = true;

      const [locatedOrientation, locatedOffset] =
        locatedScannerDetails[located];

      for (
        let unlocatedOrientation = 0;
        unlocatedOrientation < orientations.length;
        unlocatedOrientation++
      ) {
        const offset = detectOverlap(
          orientedReadings[located][locatedOrientation],
          orientedRelativeBeaconPositions[located][locatedOrientation],
          orientedReadings[unlocated][unlocatedOrientation],
          orientedRelativeBeaconPositions[unlocated][unlocatedOrientation]
        );

        if (offset) {
          locatedScannerDetails[unlocated] = [
            unlocatedOrientation,
            add(offset, locatedOffset),
          ];
          break outer;
        }
      }
    }
  }
}

const beacons = _(input)
  .flatMap((readings, scanner) => {
    const [orientation, offset] = locatedScannerDetails[scanner];
    return readings.map((reading) => locate(orientation, offset, reading));
  })
  .uniqWith(equals)
  .value();

console.log("part 1: %d", beacons.length);

const manhattan = (v1: Vector, v2: Vector) =>
  _(subtract(v1, v2))
    .map((x) => Math.abs(x))
    .sum();

const scannerPositions = _(locatedScannerDetails)
  .values()
  .map(([, offset]) => offset)
  .value();

const maxManhattan = _(scannerPositions)
  .map(
    (s1) =>
      _(scannerPositions)
        .map((s2) => manhattan(s1, s2))
        .max()!
  )
  .max()!;

console.log("part 2: %d", maxManhattan);
