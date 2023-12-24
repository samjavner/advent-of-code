import fs from "fs";

interface Path {
  row: number;
  col: number;
  type: "." | ">" | "<" | "^" | "v";
}

const map = fs
  .readFileSync("day23/input.txt", "utf8")
  .split("\n")
  .filter((x) => x)
  .map((x) => x.split(""));

const trail = map.flatMap((row, r) =>
  row
    .map((col, c) => ({
      row: r,
      col: c,
      type: col,
    }))
    .filter((p): p is Path => p.type !== "#")
);

const trailMap = map.map((row, r) =>
  row.map((_, c) => trail.find((path) => path.row === r && path.col === c))
);

function part1() {
  const start = trail[0];
  const end = trail[trail.length - 1];

  let maxLength = 0;
  const toVisit: [
    current: Path,
    visited: Record<number, Record<number, true>>,
    length: number
  ][] = [[start, {}, 0]];

  while (toVisit.length > 0) {
    const [current, visited, length] = toVisit.pop()!;

    if (current === end) {
      maxLength = Math.max(maxLength, length);
      continue;
    }

    const candidates = [
      [current.row - 1, current.col],
      [current.row + 1, current.col],
      [current.row, current.col - 1],
      [current.row, current.col + 1],
    ] as const;

    const nextPaths = candidates
      .filter(([row, col]) => trailMap[row]?.[col])
      .filter(([row, col]) => !visited[row]?.[col])
      .filter(
        ([row, col]) =>
          (current.type !== "<" || col === current.col - 1) &&
          (current.type !== ">" || col === current.col + 1) &&
          (current.type !== "^" || row === current.row - 1) &&
          (current.type !== "v" || row === current.row + 1)
      )
      .map(([row, col]) => trailMap[row][col]!);

    for (const path of nextPaths) {
      toVisit.push([
        path,
        {
          ...visited,
          [path.row]: {
            ...(visited[path.row] || {}),
            [path.col]: true,
          },
        },
        length + 1,
      ]);
    }
  }

  return maxLength;
}

console.log("part 1: %d", part1());

interface Junction {
  row: number;
  col: number;
}

interface Edge {
  fromIndex: number;
  toIndex: number;
  length: number;
}

function part2() {
  const start = trail[0];
  const end = trail[trail.length - 1];

  const junctions: Junction[] = [
    {
      row: start.row,
      col: start.col,
    },
  ];
  const edges: Edge[] = [];
  const startIndex = 0;
  let endIndex = -1;

  let toVisit: [
    current: Path,
    previous: Path,
    previousJunctionIndex: number,
    length: number
  ][] = [[start, start, 0, 0]];

  while (toVisit.length > 0) {
    const [[current, previous, previousJunctionIndex, length], ...remaining] =
      toVisit;
    toVisit = remaining;

    const candidates = [
      [current.row - 1, current.col],
      [current.row + 1, current.col],
      [current.row, current.col - 1],
      [current.row, current.col + 1],
    ] as const;

    const nextPaths = candidates
      .filter(([row, col]) => trailMap[row]?.[col])
      .filter(([row, col]) => row !== previous.row || col !== previous.col)
      .map(([row, col]) => trailMap[row][col]!);

    const isJunction = current === end || nextPaths.length > 1;

    if (isJunction) {
      const junctionIndex = junctions.findIndex(
        (j) => j.row === current.row && j.col === current.col
      );

      const edge = {
        fromIndex: previousJunctionIndex,
        toIndex: junctionIndex === -1 ? junctions.length : junctionIndex,
        length,
      };

      if (
        !edges.find(
          (e) =>
            e.fromIndex === edge.toIndex &&
            e.toIndex === edge.fromIndex &&
            e.length === edge.length
        )
      ) {
        edges.push(edge);
      }

      if (junctionIndex !== -1) {
        continue;
      }

      junctions.push({
        row: current.row,
        col: current.col,
      });

      if (current === end) {
        endIndex = junctions.length - 1;
      }
    }

    for (const path of nextPaths) {
      toVisit.push([
        path,
        current,
        isJunction ? junctions.length - 1 : previousJunctionIndex,
        isJunction ? 1 : length + 1,
      ]);
    }
  }

  function solve() {
    let maxLength = 0;
    const toVisit: [
      currentIndex: number,
      visited: Record<number, true>,
      length: number
    ][] = [[startIndex, { [startIndex]: true }, 0]];

    while (toVisit.length > 0) {
      const [currentIndex, visited, length] = toVisit.pop()!;

      if (currentIndex === endIndex) {
        maxLength = Math.max(maxLength, length);
        continue;
      }

      const next = edges.filter((edge) => {
        if (edge.fromIndex === currentIndex) {
          return !visited[edge.toIndex];
        } else if (edge.toIndex === currentIndex) {
          return !visited[edge.fromIndex];
        } else {
          return false;
        }
      });

      for (const edge of next) {
        const toIndex =
          edge.fromIndex === currentIndex ? edge.toIndex : edge.fromIndex;

        toVisit.push([
          toIndex,
          {
            ...visited,
            [toIndex]: true,
          },
          length + edge.length,
        ]);
      }
    }

    return maxLength;
  }

  return solve();
}

console.log("part 2: %d", part2());
