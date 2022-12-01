import fs from "fs";
import _ from "lodash";

type Position = [r: number, c: number];

const caveP1 = fs
  .readFileSync("day15/input.txt", "utf8")
  .split("\n")
  .filter((n) => n)
  .map((n) => n.split("").map((r) => Number.parseInt(r)));

const getLowestTotalRisk = (cave: number[][]): number => {
  const size = cave.length;
  let frontier: Position[] = [
    [0, 1],
    [1, 0],
  ];
  const risks: (number | undefined)[][] = cave.map((row) =>
    row.map((_) => undefined)
  );
  risks[0][0] = 0;
  risks[0][1] = cave[0][1];
  risks[1][0] = cave[1][0];

  let i = 0;
  while (frontier.length > 0) {
    let minRisk = Number.MAX_SAFE_INTEGER;
    let minPosition = frontier[0];

    for (const [r, c] of frontier) {
      const risk = risks[r][c]!;
      if (risk < minRisk) {
        minRisk = risk;
        minPosition = [r, c];
      }
    }

    const [mr, mc] = minPosition;

    const candidates: Position[] = [
      [mr - 1, mc],
      [mr + 1, mc],
      [mr, mc - 1],
      [mr, mc + 1],
    ];

    const neighbors = candidates.filter(
      ([cr, cc]) => cr >= 0 && cc >= 0 && cr < size && cc < size
    );

    const newFrontier = neighbors.filter(
      ([nr, nc]) =>
        risks[nr][nc] === undefined &&
        !frontier.some(([fr, fc]) => fr === nr && fc === nc)
    );

    frontier = frontier.filter(([fr, fc]) => fr !== mr || fc !== mc);
    frontier = [...frontier, ...newFrontier];

    for (const [nr, nc] of neighbors) {
      const risk = minRisk + cave[nr][nc];
      const neighborRisk = risks[nr][nc];
      if (neighborRisk === undefined || risk < neighborRisk) {
        risks[nr][nc] = risk;
      }
    }
  }

  return risks[size - 1][size - 1]!;
};

console.log("part 1: %d", getLowestTotalRisk(caveP1));

const sizeP1 = caveP1.length;
const caveP2 = _.chain(0)
  .range(sizeP1 * 5)
  .map((r) =>
    _.chain(0)
      .range(sizeP1 * 5)
      .map(
        (c) =>
          ((caveP1[r % sizeP1][c % sizeP1] +
            Math.floor(r / sizeP1) +
            Math.floor(c / sizeP1) -
            1) %
            9) +
          1
      )
      .value()
  )
  .value();

console.log("part 2: %d", getLowestTotalRisk(caveP2));
