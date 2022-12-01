import _ from "lodash";
import { alternative, Bit, num, Parser, sequence } from "./parserBase";

export interface PacketHeader {
  version: number;
  typeId: number;
}

export interface OperatorPacketHeader extends PacketHeader {
  lengthTypeId: number;
}

export type LiteralPacket = {
  type: "literal";
  header: PacketHeader;
  value: number;
};

export type OperatorPacket = {
  type: "operator";
  header: OperatorPacketHeader;
  subPackets: Packet[];
};

export type Packet = LiteralPacket | OperatorPacket;

const packetHeader: Parser<PacketHeader> = sequence(
  [num(3), num(3)],
  (version, typeId) => ({ version, typeId })
);

const literalPacketHeader: Parser<PacketHeader> = (input) => {
  const header = packetHeader(input);
  return header && header.value.typeId === 4 ? header : undefined;
};

const literalValue: Parser<number> = (input) => {
  let remaining = _.chunk(input, 5);
  const parsed: Bit[][] = [];
  const valueBits: Bit[] = [];
  let value: number | undefined;

  while (remaining.length > 0) {
    const chunk = remaining[0];
    remaining = remaining.slice(1);
    parsed.push(chunk);
    valueBits.push(...chunk.slice(1));

    if (chunk[0] === 0) {
      value = Number.parseInt(valueBits.join(""), 2);
      break;
    }
  }

  if (value) {
    return {
      parsed: _.flatMap(parsed),
      remaining: _.flatMap(remaining),
      value,
    };
  }
};

const literalPacket: Parser<LiteralPacket> = sequence(
  [literalPacketHeader, literalValue],
  (header, value) => ({
    type: "literal",
    header,
    value,
  })
);

const operatorPacketHeader: Parser<OperatorPacketHeader> = sequence(
  [packetHeader, num(1)],
  (header, lengthTypeId) => ({ ...header, lengthTypeId })
);

const operatorSubPacketsType0: Parser<Packet[]> = (input) => {
  const length = num(15)(input);

  if (!length) {
    return;
  }

  let parsed: Bit[] = [];
  let remaining = length.remaining;
  let packets: Packet[] = [];

  while (parsed.length < length.value) {
    const result = packet(remaining);

    if (!result) {
      return;
    }

    parsed.push(...result.parsed);
    remaining = result.remaining;
    packets.push(result.value);
  }

  return {
    parsed: [...length.parsed, ...parsed],
    remaining,
    value: packets,
  };
};

const operatorSubPacketsType1: Parser<Packet[]> = (input) => {
  const count = num(11)(input);

  if (!count) {
    return;
  }

  const nPackets: Parser<Packet>[] = new Array(count.value).fill(packet);
  const result = sequence(nPackets, (...results) => results)(count.remaining);

  if (result) {
    return {
      parsed: [...count.parsed, ...result.parsed],
      remaining: result.remaining,
      value: result.value,
    };
  }
};

const operatorPacket: Parser<OperatorPacket> = (input) => {
  const header = operatorPacketHeader(input);

  if (!header) {
    return;
  }

  const packets =
    header.value.lengthTypeId === 0
      ? operatorSubPacketsType0(header.remaining)
      : operatorSubPacketsType1(header.remaining);

  if (!packets) {
    return;
  }

  const value: OperatorPacket = {
    type: "operator",
    header: header.value,
    subPackets: packets.value,
  };

  return {
    remaining: packets.remaining,
    parsed: [...header.parsed, ...packets.parsed],
    value,
  };
};

export const packet: Parser<Packet> = alternative(
  literalPacket,
  operatorPacket
);
