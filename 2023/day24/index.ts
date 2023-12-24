import fs from "fs";
import { max, min, sum } from "radash";

interface Projectile {
  position: Vector;
  velocity: Vector;
}

interface Vector {
  x: number;
  y: number;
  z: number;
}

const hailstones = fs
  .readFileSync("day24/input.txt", "utf8")
  .split("\n")
  .filter((x) => x)
  .map((line) => {
    const [, px, py, pz, vx, vy, vz] =
      /^(.+), (.+), (.+) @ (.+), (.+), (.+)$/.exec(line)!;

    const hailstone: Projectile = {
      position: {
        x: Number(px),
        y: Number(py),
        z: Number(pz),
      },
      velocity: {
        x: Number(vx),
        y: Number(vy),
        z: Number(vz),
      },
    };

    return hailstone;
  });

function get2dLineIntersection(
  h1: Projectile,
  h2: Projectile
): { x: number; y: number } {
  const x =
    (h2.position.y -
      h1.position.y +
      (h1.position.x * h1.velocity.y) / h1.velocity.x -
      (h2.position.x * h2.velocity.y) / h2.velocity.x) /
    (h1.velocity.y / h1.velocity.x - h2.velocity.y / h2.velocity.x);

  const y =
    (h2.position.x -
      h1.position.x +
      (h1.position.y * h1.velocity.x) / h1.velocity.y -
      (h2.position.y * h2.velocity.x) / h2.velocity.y) /
    (h1.velocity.x / h1.velocity.y - h2.velocity.x / h2.velocity.y);

  return { x, y };
}

function part1() {
  let count = 0;

  for (let i = 0; i < hailstones.length; i += 1) {
    const h1 = hailstones[i];
    for (let j = i + 1; j < hailstones.length; j += 1) {
      const h2 = hailstones[j];
      const { x, y } = get2dLineIntersection(h1, h2);

      if (
        Number.isFinite(x) &&
        Number.isFinite(y) &&
        x >= 200000000000000 &&
        x <= 400000000000000 &&
        y >= 200000000000000 &&
        y <= 400000000000000 &&
        x * Math.sign(h1.velocity.x) >
          h1.position.x * Math.sign(h1.velocity.x) &&
        x * Math.sign(h2.velocity.x) > h2.position.x * Math.sign(h2.velocity.x)
      ) {
        count += 1;
      }
    }
  }

  return count;
}

console.log("part 1: %d", part1());

function flyBy(rock: Projectile, hailstone: Projectile): number {
  let distance = Number.MAX_SAFE_INTEGER;

  const v = Math.max(
    Math.abs(rock.velocity.x),
    Math.abs(rock.velocity.y),
    Math.abs(rock.velocity.z),
    Math.abs(hailstone.velocity.x),
    Math.abs(hailstone.velocity.y),
    Math.abs(hailstone.velocity.z)
  );

  let rx = rock.position.x;
  let ry = rock.position.y;
  let rz = rock.position.z;

  let hx = hailstone.position.x;
  let hy = hailstone.position.y;
  let hz = hailstone.position.z;

  while (true) {
    const taxicab = Math.abs(rx - hx) + Math.abs(ry - hy) + Math.abs(rz - hz);

    if (taxicab < distance) {
      distance = taxicab;
    } else {
      break;
    }

    const t = Math.ceil(taxicab / 10 / v);

    rx += rock.velocity.x * t;
    ry += rock.velocity.y * t;
    rz += rock.velocity.z * t;

    hx += hailstone.velocity.x * t;
    hy += hailstone.velocity.y * t;
    hz += hailstone.velocity.z * t;
  }

  return distance;
}

function getRandom(target: number, range: number): number {
  return Math.floor(Math.random() * range) - Math.floor(range / 2) + target;
}

function part2() {
  let best = Number.MAX_SAFE_INTEGER;
  let last = best;
  let betterThanLast: Projectile[] = [];

  let estimate: Projectile = {
    position: {
      x: 250000000000000,
      y: 350000000000000,
      z: 100000000000000,
    },
    velocity: {
      x: 110,
      y: -110,
      z: 300,
    },
  };

  let range: Projectile = {
    position: {
      x: 100000000000000,
      y: 100000000000000,
      z: 100000000000000,
    },
    velocity: {
      x: 100,
      y: 100,
      z: 100,
    },
  };

  while (true) {
    const rock: Projectile = {
      position: {
        x: getRandom(estimate.position.x, range.position.x),
        y: getRandom(estimate.position.y, range.position.y),
        z: getRandom(estimate.position.z, range.position.z),
      },
      velocity: {
        x: getRandom(estimate.velocity.x, range.velocity.x),
        y: getRandom(estimate.velocity.y, range.velocity.y),
        z: getRandom(estimate.velocity.z, range.velocity.z),
      },
    };

    const current = Math.max(
      ...hailstones.map((hailstone) => flyBy(rock, hailstone))
    );

    if (current < best) {
      best = current;
      console.log(rock);
      console.log(best.toString());
    }

    if (current === 0) {
      return rock.position.x + rock.position.y + rock.position.z;
    }

    const n = 75;
    if (current < last) {
      betterThanLast.push(rock);
      console.log(n - betterThanLast.length);
    }

    if (betterThanLast.length === n) {
      estimate = {
        position: {
          x: Math.floor(sum(betterThanLast.map((p) => p.position.x)) / n),
          y: Math.floor(sum(betterThanLast.map((p) => p.position.y)) / n),
          z: Math.floor(sum(betterThanLast.map((p) => p.position.z)) / n),
        },
        velocity: {
          x: Math.floor(sum(betterThanLast.map((p) => p.velocity.x)) / n),
          y: Math.floor(sum(betterThanLast.map((p) => p.velocity.y)) / n),
          z: Math.floor(sum(betterThanLast.map((p) => p.velocity.z)) / n),
        },
      };

      range = {
        position: {
          x:
            max(betterThanLast.map((p) => p.position.x))! -
            min(betterThanLast.map((p) => p.position.x))!,
          y:
            max(betterThanLast.map((p) => p.position.y))! -
            min(betterThanLast.map((p) => p.position.y))!,
          z:
            max(betterThanLast.map((p) => p.position.z))! -
            min(betterThanLast.map((p) => p.position.z))!,
        },
        velocity: {
          x:
            max(betterThanLast.map((p) => p.velocity.x))! -
            min(betterThanLast.map((p) => p.velocity.x))!,
          y:
            max(betterThanLast.map((p) => p.velocity.y))! -
            min(betterThanLast.map((p) => p.velocity.y))!,
          z:
            max(betterThanLast.map((p) => p.velocity.z))! -
            min(betterThanLast.map((p) => p.velocity.z))!,
        },
      };

      betterThanLast = [];
      last = best;
    }
  }
}

console.log("part 2: %d", part2());
