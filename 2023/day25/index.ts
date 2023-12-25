import fs from "fs";

interface Connection {
  component1: string;
  component2: string;
}

const components = new Set<string>();
const connections: Connection[] = [];
const hasConnection: Record<string, Record<string, boolean>> = {};

fs.readFileSync("day25/input.txt", "utf8")
  .split("\n")
  .filter((x) => x)
  .forEach((x) => {
    const [source, destinationList] = x.split(": ");
    const destinations = destinationList.split(" ");

    components.add(source);
    hasConnection[source] = hasConnection[source] ?? {};
    for (const destination of destinations) {
      components.add(destination);
      connections.push({ component1: source, component2: destination });
      hasConnection[destination] = hasConnection[destination] ?? {};
      hasConnection[source][destination] = true;
      hasConnection[destination][source] = true;
    }
  });

// Visualize graph to determine three cuts to make
// https://dreampuf.github.io/GraphvizOnline/
fs.writeFileSync(
  "day25/output.dot",
  "digraph G {\n" +
    connections
      .map(
        ({ component1, component2 }) =>
          `  ${component1} -> ${component2} [dir=both];`
      )
      .join("\n") +
    "\n}"
);

function find(c1: string, c2: string): Connection {
  return connections.find(
    (c) =>
      [c.component1, c.component2].includes(c1) &&
      [c.component1, c.component2].includes(c2)
  )!;
}

const cuts = [find("xkf", "rcn"), find("thk", "cms"), find("dht", "xmv")];

cuts.forEach((cut) => {
  hasConnection[cut.component1][cut.component2] = false;
  hasConnection[cut.component2][cut.component1] = false;
});

function getConnectedCount(start: string) {
  const visited = new Set<string>();
  const toVisit: string[] = [start];

  while (toVisit.length > 0) {
    const component = toVisit.pop()!;

    if (visited.has(component)) {
      continue;
    }

    visited.add(component);

    toVisit.push(
      ...Object.keys(hasConnection[component]).filter(
        (c) => hasConnection[component][c]
      )
    );
  }

  return visited.size;
}

const part1 =
  getConnectedCount(cuts[0].component1) * getConnectedCount(cuts[1].component2);

console.log("part 1: %d", part1);
