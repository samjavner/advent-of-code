import fs from "fs";
import { cluster, min, sort } from "radash";

type Map = RangeMap[];

interface RangeMap {
  destinationStart: number;
  sourceStart: number;
  length: number;
}

interface Range {
  start: number;
  length: number;
}

const input = fs.readFileSync("day5/input.txt", "utf8").split("\n");

let currentLine = 3;
function parseMap(): Map {
  const map: Map = [];

  while (input[currentLine]) {
    const range = input[currentLine].split(" ");
    map.push({
      destinationStart: Number(range[0]),
      sourceStart: Number(range[1]),
      length: Number(range[2]),
    });
    currentLine += 1;
  }

  currentLine += 2;

  return sort(map, (rangeMap) => rangeMap.sourceStart);
}

const seedToSoilMap = parseMap();
const soilToFertilizerMap = parseMap();
const fertilizerToWaterMap = parseMap();
const waterToLightMap = parseMap();
const lightToTemperatureMap = parseMap();
const temperatureToHumidityMap = parseMap();
const humidityToLocationMap = parseMap();

const maps = [
  seedToSoilMap,
  soilToFertilizerMap,
  fertilizerToWaterMap,
  waterToLightMap,
  lightToTemperatureMap,
  temperatureToHumidityMap,
  humidityToLocationMap,
];

// Part 1

const seeds = input[0]
  .split(": ")[1]
  .split(" ")
  .map((seed) => Number(seed));

function mapSourceToDestination(map: Map, source: number): number {
  for (const range of map) {
    if (
      source >= range.sourceStart &&
      source < range.sourceStart + range.length
    ) {
      return source - range.sourceStart + range.destinationStart;
    }
  }

  return source;
}

const locations = seeds.map((seed) =>
  maps.reduce(
    (previous, current) => mapSourceToDestination(current, previous),
    seed
  )
);

const part1 = min(locations);

console.log("part 1: %d", part1);

// Part 2

function mapSourceRangeToDestination(map: Map, source: Range): Range[] {
  let result: Range[] = [];
  let remainder: Range | undefined = source;

  for (const current of map) {
    if (!remainder) {
      break;
    }

    if (remainder.start < current.sourceStart) {
      if (remainder.start + remainder.length < current.sourceStart) {
        // no overlap
      } else {
        // remainder goes into current
        result.push({
          start: remainder.start,
          length: current.sourceStart - remainder.start,
        }),
          (remainder = {
            start: current.sourceStart,
            length: remainder.start + remainder.length - current.sourceStart,
          });
      }
    } else {
      if (remainder.start >= current.sourceStart + current.length) {
        // no overlap
      } else if (
        remainder.start + remainder.length <=
        current.sourceStart + current.length
      ) {
        // remainder contained within current
        result.push({
          start:
            remainder.start - current.sourceStart + current.destinationStart,
          length: remainder.length,
        });
        remainder = undefined;
      } else {
        // remainder goes past current
        result.push({
          start:
            remainder.start - current.sourceStart + current.destinationStart,
          length: current.sourceStart + current.length - remainder.start,
        });
        remainder = {
          start: current.sourceStart + current.length,
          length:
            remainder.start +
            remainder.length -
            (current.sourceStart + current.length),
        };
      }
    }
  }

  if (remainder) {
    result.push(remainder);
  }

  return result;
}

const seedRanges: Range[] = cluster(seeds, 2).map(([start, length]) => ({
  start,
  length,
}));

const locationRanges = maps.reduce((previous, currentMap) => {
  return previous.reduce<Range[]>(
    (previousRanges, currentRange) => [
      ...previousRanges,
      ...mapSourceRangeToDestination(currentMap, currentRange),
    ],
    []
  );
}, seedRanges);

const part2 = min(locationRanges.map((range) => range.start));

console.log("part 2: %d", part2);
