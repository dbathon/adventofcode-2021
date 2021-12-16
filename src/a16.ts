import { p, readLines, sum } from "./util/util";

const lines = readLines("input/a16.txt");

class Packet {
  readonly subPackets: Packet[] = [];

  constructor(readonly version: number, readonly typeId: number, readonly literal?: number) {}

  get versionsSum(): number {
    return this.version + sum(this.subPackets.map((p) => p.versionsSum));
  }

  get value(): number {
    const subPacketValues = this.subPackets.map((p) => p.value);
    switch (this.typeId) {
      case 0:
        return sum(subPacketValues);
      case 1:
        return subPacketValues.reduce((a, b) => a * b, 1);
      case 2:
        return subPacketValues.reduce((a, b) => Math.min(a, b), Number.MAX_SAFE_INTEGER);
      case 3:
        return subPacketValues.reduce((a, b) => Math.max(a, b), 0);
      case 4:
        return this.literal!;
      case 5:
        return subPacketValues[0] > subPacketValues[1] ? 1 : 0;
      case 6:
        return subPacketValues[0] < subPacketValues[1] ? 1 : 0;
      case 7:
        return subPacketValues[0] === subPacketValues[1] ? 1 : 0;
      default:
        throw "unexpected type " + this.typeId;
    }
  }
}

class BitStream {
  readonly bits: string;
  pos = 0;

  constructor(hexString: string) {
    this.bits = hexString
      .split("")
      .map((char) => {
        const unpaddedBits = parseInt(char, 16).toString(2);
        return "0000".substr(0, 4 - unpaddedBits.length) + unpaddedBits;
      })
      .join("");
  }

  readBits(count: number): number {
    const result = parseInt(this.bits.substr(this.pos, count), 2);
    this.pos += count;
    return result;
  }
}

const stream = new BitStream(lines[0]);

function parsePacket(stream: BitStream): Packet {
  const version = stream.readBits(3);
  const typeId = stream.readBits(3);
  if (typeId === 4) {
    let literal = 0;
    while (true) {
      const cont = stream.readBits(1);
      literal = literal * 16 + stream.readBits(4);
      if (cont !== 1) {
        break;
      }
    }
    return new Packet(version, typeId, literal);
  } else {
    const packet = new Packet(version, typeId);
    const lengthType = stream.readBits(1);
    if (lengthType === 0) {
      const length = stream.readBits(15);
      const untilPos = stream.pos + length;
      while (stream.pos < untilPos) {
        packet.subPackets.push(parsePacket(stream));
      }
    } else {
      const subPacketCount = stream.readBits(11);
      for (let i = 0; i < subPacketCount; i++) {
        packet.subPackets.push(parsePacket(stream));
      }
    }
    return packet;
  }
}

const packet = parsePacket(stream);
p(packet.versionsSum);
p(packet.value);
