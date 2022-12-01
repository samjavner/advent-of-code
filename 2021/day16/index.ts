import fs from "fs";
import _ from "lodash";
import { packet, Packet } from "./parser";
import { Bit } from "./parserBase";

type Visitor<T> = (packet: Packet) => T;

const getBits = (hex: string): Bit[] =>
  hex.split("").flatMap((h) => {
    const d = Number.parseInt(h, 16);
    return [
      d & 8 ? 1 : 0,
      d & 4 ? 1 : 0,
      d & 2 ? 1 : 0,
      d & 1 ? 1 : 0,
    ] as Bit[];
  });

const transmission = getBits(
  fs.readFileSync("day16/input.txt", "utf8").split("\n")[0]
);

const result = packet(transmission)!.value;

const sumVersionNumbers: Visitor<number> = (packet) => {
  switch (packet.type) {
    case "literal":
      return packet.header.version;
    case "operator":
      return (
        packet.header.version +
        _(packet.subPackets).map(sumVersionNumbers).sum()
      );
  }
};

console.log("part 1: %d", sumVersionNumbers(result));

const calculateValue: Visitor<number> = (packet) => {
  switch (packet.type) {
    case "literal":
      return packet.value;
    case "operator":
      const values = packet.subPackets.map(calculateValue);
      switch (packet.header.typeId) {
        case 0:
          return _(values).sum();
        case 1:
          return values.reduce((previous, current) => previous * current, 1);
        case 2:
          return _(values).min()!;
        case 3:
          return _(values).max()!;
        case 5:
          return values[0] > values[1] ? 1 : 0;
        case 6:
          return values[0] < values[1] ? 1 : 0;
        case 7:
          return values[0] === values[1] ? 1 : 0;
        default:
          return 0;
      }
  }
};

console.log("part 2: %d", calculateValue(result));
