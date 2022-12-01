import fs from "fs";

const day17 = fs.readFileSync("day17/input.txt", "utf8");

const results =
  /^target area: x=([\d-]+)\.\.([\d-]+), y=([\d-]+)..([\d-]+)/.exec(day17)!;

const x1 = Number.parseInt(results[1]);
const x2 = Number.parseInt(results[2]);
const y1 = Number.parseInt(results[3]);
const y2 = Number.parseInt(results[4]);

const reachesTargetArea = (
  vx: number,
  vy: number
): { maxY: number } | undefined => {
  let x = 0;
  let y = 0;
  let maxY = 0;
  let reached = false;

  while (x <= x2 && (y >= y1 || vy >= 0)) {
    x += vx;
    y += vy;
    vx = Math.max(vx - 1, 0);
    vy -= 1;

    maxY = Math.max(maxY, y);
    reached = reached || (x >= x1 && x <= x2 && y >= y1 && y <= y2);
  }

  if (reached) {
    return { maxY };
  }
};

let maxY = 0;
let distinct = 0;

// determine bounds on initial velocity
let vx1 = 0;
while ((vx1 * (vx1 + 1)) / 2 < x1) {
  vx1 += 1;
}
const vx2 = x2;
let vy1 = y1;
let vy2 = -y1 - 1;

for (let vx = vx1; vx <= vx2; vx++) {
  for (let vy = vy1; vy <= vy2; vy++) {
    const reaches = reachesTargetArea(vx, vy);
    if (reaches) {
      maxY = Math.max(maxY, reaches.maxY);
      distinct += 1;
    }
  }
}

console.log("part 1: %d", maxY);
console.log("part 2: %d", distinct);
