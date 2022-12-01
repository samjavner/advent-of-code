import fs from "fs";
import _ from "lodash";

type CaveName = string;
type CaveType = "small" | "big";
type Cave = { type: CaveType; name: CaveName };
type Connection = [Cave, Cave];
type Path = CaveName[];

const connections: Connection[] = fs
  .readFileSync("day12/input.txt", "utf8")
  .split("\n")
  .filter((n) => n)
  .map(
    (n) =>
      n.split("-").map<Cave>((name) => ({
        type: name.toUpperCase() === name ? "big" : "small",
        name,
      })) as Connection
  );

const edges: Record<CaveName, CaveName[]> = {};
const caves: Record<CaveName, Cave> = {};
for (const connection of connections) {
  edges[connection[0].name] = edges[connection[0].name] ?? [];
  edges[connection[0].name].push(connection[1].name);
  caves[connection[0].name] = connection[0];
  edges[connection[1].name] = edges[connection[1].name] ?? [];
  edges[connection[1].name].push(connection[0].name);
  caves[connection[1].name] = connection[1];
}

const initialVisitCounts = _.mapValues(edges, (_) => 0);

const getPaths = (
  predicate: (cave: Cave, visitCounts: Record<CaveName, number>) => boolean,
  from: CaveName = "start",
  visitCounts: Record<CaveName, number> = initialVisitCounts
): Path[] => {
  visitCounts = { ...visitCounts, [from]: visitCounts[from] + 1 };

  if (from === "end") {
    return [["end"]];
  }

  return _(edges[from])
    .map((name) => caves[name])
    .filter((cave) => predicate(cave, visitCounts))
    .flatMap((next) =>
      getPaths(predicate, next.name, visitCounts).map((partial) => [
        next.name,
        ...partial,
      ])
    )
    .value();
};

const part1 = getPaths(
  ({ type, name }, visitCounts) => type === "big" || visitCounts[name] === 0
);

console.log("part 1: %d", part1.length);

const part2 = getPaths(
  ({ type, name }, visitCounts) =>
    type === "big" ||
    visitCounts[name] === 0 ||
    (visitCounts[name] === 1 &&
      name !== "start" &&
      !_(caves)
        .keys()
        .some((n) => visitCounts[n] > 1 && caves[n].type === "small"))
);

console.log("part 2: %d", part2.length);
