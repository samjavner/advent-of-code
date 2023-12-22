import fs from "fs";

interface Brick {
  name: string;
  from: Position;
  to: Position;
}

interface Position {
  x: number;
  y: number;
  z: number;
}

const bricks = fs
  .readFileSync("day22/input.txt", "utf8")
  .split("\n")
  .filter((x) => x)
  .map((x, line) => {
    const [from, to] = x.split("~");

    const [x1, y1, z1] = from.split(",");
    const [x2, y2, z2] = to.split(",");

    const brick: Brick = {
      name: (line + 1).toString(),
      from: {
        x: Number(x1),
        y: Number(y1),
        z: Number(z1),
      },
      to: {
        x: Number(x2),
        y: Number(y2),
        z: Number(z2),
      },
    };

    if (
      brick.from.x > brick.to.x ||
      brick.from.y > brick.to.y ||
      brick.from.z > brick.to.z
    ) {
      throw new Error(brick.name);
    }

    return brick;
  });

function drop(brick: Brick): Brick {
  return {
    name: brick.name,
    from: {
      x: brick.from.x,
      y: brick.from.y,
      z: brick.from.z - 1,
    },
    to: {
      x: brick.to.x,
      y: brick.to.y,
      z: brick.to.z - 1,
    },
  };
}

function intersects(brick1: Brick, brick2: Brick): boolean {
  return (
    brick1.from.x <= brick2.to.x &&
    brick2.from.x <= brick1.to.x &&
    brick1.from.y <= brick2.to.y &&
    brick2.from.y <= brick1.to.y &&
    brick1.from.z <= brick2.to.z &&
    brick2.from.z <= brick1.to.z
  );
}

function settle(bricks: Brick[]): [bricks: Brick[], count: number] {
  let unsettled = bricks;
  const settled: Brick[] = [];
  const bricksThatSettled = new Set<string>();

  while (unsettled.length > 0) {
    const [brick, ...remaining] = unsettled;

    if (brick.from.z === 1) {
      settled.push(brick);
      unsettled = remaining;
      continue;
    }

    const dropped = drop(brick);

    let restingOnSettled = false;
    for (const other of settled) {
      if (intersects(dropped, other)) {
        restingOnSettled = true;
        break;
      }
    }
    if (restingOnSettled) {
      settled.push(brick);
      unsettled = remaining;
      continue;
    }

    let restingOnUnsettled = false;
    for (const other of remaining) {
      if (intersects(dropped, other)) {
        restingOnUnsettled = true;
        break;
      }
    }
    if (restingOnUnsettled) {
      unsettled = [...remaining, brick];
      continue;
    }

    unsettled = [dropped, ...remaining];
    bricksThatSettled.add(dropped.name);
  }

  return [settled, bricksThatSettled.size];
}

function solve() {
  let safeCount = 0;
  let total = 0;
  const [settled] = settle(bricks);

  for (const brick of settled) {
    const [, count] = settle(settled.filter((b) => b !== brick));
    total += count;
    if (count === 0) {
      safeCount += 1;
    }
  }

  return {
    part1: safeCount,
    part2: total,
  };
}

const { part1, part2 } = solve();

console.log("part 1: %d", part1);
console.log("part 2: %d", part2);
