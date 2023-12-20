import fs from "fs";
import { list, objectify } from "radash";

type ModuleName = string;

interface Module {
  type: "flip_flop" | "conjunction" | "broadcast";
  name: ModuleName;
  destinations: ModuleName[];
}

type On = true;
type Off = false;

const on: On = true;
const off: Off = false;

type High = true;
type Low = false;

const high: High = true;
const low: Low = false;

interface State {
  flipFlop: Record<ModuleName, On | Off>;
  conjunction: Record<ModuleName, Record<ModuleName, High | Low>>;
}

const moduleList = fs
  .readFileSync("day20/input.txt", "utf8")
  .split("\n")
  .filter((x) => x)
  .map((module): Module => {
    const [name, destinationList] = module.split(" -> ");
    const destinations = destinationList.split(", ");

    if (name.startsWith("%")) {
      return {
        type: "flip_flop",
        name: name.slice(1),
        destinations,
      };
    } else if (name.startsWith("&")) {
      return {
        type: "conjunction",
        name: name.slice(1),
        destinations,
      };
    } else {
      return {
        type: "broadcast",
        name,
        destinations,
      };
    }
  });

const modules = objectify(moduleList, (module) => module.name);

function init(): State {
  return {
    flipFlop: objectify(
      moduleList.filter((module) => module.type === "flip_flop"),
      (module) => module.name,
      () => off
    ),
    conjunction: objectify(
      moduleList.filter((module) => module.type === "conjunction"),
      (module) => module.name,
      (module) =>
        objectify(
          moduleList
            .filter((source) => source.destinations.includes(module.name))
            .map((source) => source.name),
          (name) => name,
          () => low
        )
    ),
  };
}

interface Pulse {
  type: High | Low;
  source: ModuleName;
  destination: ModuleName;
}

function pushButton(state: State) {
  let lowCount = 0;
  let highCount = 0;
  let rmHighSource: string | undefined;

  const pulses: Pulse[] = [
    {
      type: low,
      source: "button",
      destination: "broadcaster",
    },
  ];

  while (pulses.length > 0) {
    const pulse = pulses[0];
    pulses.splice(0, 1);
    const module = modules[pulse.destination];

    if (pulse.type === high) {
      highCount += 1;
    } else {
      lowCount += 1;
    }

    if (!module) {
      continue;
    }

    if (pulse.destination === "rm" && pulse.type === high) {
      rmHighSource = pulse.source;
    }

    if (module.type === "flip_flop") {
      if (pulse.type === low) {
        state.flipFlop[module.name] = !state.flipFlop[module.name];

        pulses.push(
          ...module.destinations.map((destination) => ({
            type: state.flipFlop[module.name] === on ? high : low,
            source: module.name,
            destination,
          }))
        );
      }
    } else if (module.type === "conjunction") {
      state.conjunction[module.name][pulse.source] = pulse.type;

      const pulseType = Object.values(state.conjunction[module.name]).every(
        (s) => s === high
      )
        ? low
        : high;

      pulses.push(
        ...module.destinations.map((destination) => ({
          type: pulseType,
          source: module.name,
          destination,
        }))
      );
    } else {
      pulses.push(
        ...module.destinations.map((destination) => ({
          type: pulse.type,
          source: module.name,
          destination,
        }))
      );
    }
  }

  return {
    lowCount,
    highCount,
    rmHighSource,
  };
}

function part1() {
  let lowCount = 0;
  let highCount = 0;
  const state = init();

  for (let i = 0; i < 1000; i += 1) {
    const result = pushButton(state);
    lowCount += result.lowCount;
    highCount += result.highCount;
  }

  return lowCount * highCount;
}

console.log("part 1: %d", part1());

function part2() {
  let dh = 0;
  let bb = 0;
  let qd = 0;
  let dp = 0;

  const state = init();

  for (let i = 1; i < 10000; i += 1) {
    const result = pushButton(state);

    switch (result.rmHighSource) {
      case "dh":
        !dh && (dh = i);
        break;
      case "bb":
        !bb && (bb = i);
        break;
      case "qd":
        !qd && (qd = i);
        break;
      case "dp":
        !dp && (dp = i);
        break;
    }
  }

  return dh * bb * qd * dp;
}

console.log("part 2: %d", part2());
