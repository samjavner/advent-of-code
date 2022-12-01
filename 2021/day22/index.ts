import fs from "fs";
import _ from "lodash";

interface RebootStep {
  type: "on" | "off";
  cuboid: Cuboid;
}

type Cuboid = [
  x1: number,
  x2: number,
  y1: number,
  y2: number,
  z1: number,
  z2: number
];

const allSteps: RebootStep[] = fs
  .readFileSync("day22/input.txt", "utf8")
  .split("\n")
  .filter((n) => n)
  .map((n) => {
    const result =
      /^(on|off) x=([\-\d]+)\.\.([\-\d]+),y=([\-\d]+)\.\.([\-\d]+),z=([\-\d]+)\.\.([\-\d]+)$/.exec(
        n
      )!;

    return {
      type: result[1] as "on" | "off",
      cuboid: [
        Number.parseInt(result[2]),
        Number.parseInt(result[3]),
        Number.parseInt(result[4]),
        Number.parseInt(result[5]),
        Number.parseInt(result[6]),
        Number.parseInt(result[7]),
      ],
    };
  });

const initializationSteps = allSteps.filter(
  ({ cuboid: [x1, x2, y1, y2, z1, z2] }) =>
    x1 >= -50 && x2 <= 50 && y1 >= -50 && y2 <= 50 && z1 >= -50 && z2 <= 50
);

const getVolume = ([x1, x2, y1, y2, z1, z2]: Cuboid): number => {
  return (x2 - x1 + 1) * (y2 - y1 + 1) * (z2 - z1 + 1);
};

const isValid = ([x1, x2, y1, y2, z1, z2]: Cuboid): boolean =>
  x1 <= x2 && y1 <= y2 && z1 <= z2;

const intersect = (
  [ax1, ax2, ay1, ay2, az1, az2]: Cuboid,
  [bx1, bx2, by1, by2, bz1, bz2]: Cuboid
): Cuboid | undefined => {
  const result: Cuboid = [
    Math.max(ax1, bx1),
    Math.min(ax2, bx2),
    Math.max(ay1, by1),
    Math.min(ay2, by2),
    Math.max(az1, bz1),
    Math.min(az2, bz2),
  ];

  return isValid(result) ? result : undefined;
};

const subtract = (c1: Cuboid, c2: Cuboid): Cuboid[] => {
  const [ax1, ax2, ay1, ay2, az1, az2] = c1;
  const intersection = intersect(c1, c2);

  if (!intersection) {
    return [c1];
  }

  const [bx1, bx2, by1, by2, bz1, bz2] = intersection;

  const results: Cuboid[] = [];

  if (ax1 < bx1) {
    results.push([ax1, bx1 - 1, ay1, ay2, az1, az2]);
  }

  if (bx2 < ax2) {
    results.push([bx2 + 1, ax2, ay1, ay2, az1, az2]);
  }

  if (ay1 < by1) {
    results.push([bx1, bx2, ay1, by1 - 1, az1, az2]);
  }

  if (by2 < ay2) {
    results.push([bx1, bx2, by2 + 1, ay2, az1, az2]);
  }

  if (az1 < bz1) {
    results.push([bx1, bx2, by1, by2, az1, bz1 - 1]);
  }

  if (bz2 < az2) {
    results.push([bx1, bx2, by1, by2, bz2 + 1, az2]);
  }

  return results;
};

const execute = (steps: RebootStep[]): Cuboid[] =>
  steps.reduce<Cuboid[]>((cuboids, step) => {
    const subtracted = cuboids.flatMap((cuboid) =>
      subtract(cuboid, step.cuboid)
    );
    switch (step.type) {
      case "on":
        return [...subtracted, step.cuboid];
      case "off":
        return subtracted;
    }
  }, []);

const p1Cuboids = execute(initializationSteps);
const p1Volume = _(p1Cuboids).map(getVolume).sum();

console.log("part 1: %d", p1Volume);

const p2Cuboids = execute(allSteps);
const p2Volume = _(p2Cuboids).map(getVolume).sum();

console.log("part 2: %d", p2Volume);
