import { p, readLines, sum } from "./util/util";

const lines = readLines("input/a22.txt");

class Range {
  constructor(readonly from: number, readonly to: number) {
    if (to < from) {
      throw "to < from";
    }
  }

  get length(): number {
    return this.to - this.from + 1;
  }

  subtract(otherRange: Range): { result: Range[]; subtracted?: Range } {
    if (otherRange.to < this.from || this.to < otherRange.from) {
      // no overlap
      return { result: [this] };
    }
    if (otherRange.from <= this.from && this.to <= otherRange.to) {
      // otherRange contains this entirely
      return { result: [], subtracted: this };
    }
    if (this.from < otherRange.from && otherRange.to < this.to) {
      // otherRange splits this
      return {
        result: [new Range(this.from, otherRange.from - 1), new Range(otherRange.to + 1, this.to)],
        subtracted: otherRange,
      };
    }
    if (this.from < otherRange.from && otherRange.to >= this.to) {
      return { result: [new Range(this.from, otherRange.from - 1)], subtracted: new Range(otherRange.from, this.to) };
    }
    if (this.from >= otherRange.from && otherRange.to < this.to) {
      return { result: [new Range(otherRange.to + 1, this.to)], subtracted: new Range(this.from, otherRange.to) };
    }
    throw "unexpected case";
  }
}

class Cube {
  constructor(readonly xRange: Range, readonly yRange: Range, readonly zRange: Range) {}

  get volume(): number {
    return this.xRange.length * this.yRange.length * this.zRange.length;
  }

  subtract(otherCube: Cube): Cube[] {
    const xResult = this.xRange.subtract(otherCube.xRange);
    const yResult = this.yRange.subtract(otherCube.yRange);
    const zResult = this.zRange.subtract(otherCube.zRange);
    if (!xResult.subtracted || !yResult.subtracted || !zResult.subtracted) {
      // no overlap
      return [this];
    }
    if (xResult.result.length > 0) {
      return [
        ...xResult.result.map((xRange) => new Cube(xRange, this.yRange, this.zRange)),
        ...new Cube(xResult.subtracted, this.yRange, this.zRange).subtract(otherCube),
      ];
    }
    if (yResult.result.length > 0) {
      return [
        ...yResult.result.map((yRange) => new Cube(this.xRange, yRange, this.zRange)),
        ...new Cube(this.xRange, yResult.subtracted, this.zRange).subtract(otherCube),
      ];
    }
    if (zResult.result.length > 0) {
      return [
        ...zResult.result.map((zRange) => new Cube(this.xRange, this.yRange, zRange)),
        ...new Cube(this.xRange, this.yRange, zResult.subtracted).subtract(otherCube),
      ];
    }
    return [];
  }
}

interface Step {
  turnOn: boolean;
  cube: Cube;
}

function inPart1Range(x: number): boolean {
  return x >= -50 && x <= 50;
}

const part1Steps: Step[] = [];
const allSteps: Step[] = [];

for (const line of lines) {
  const [x1, x2, y1, y2, z1, z2] = line
    .split(/[^\d\-]/)
    .filter((p) => p)
    .map((p) => parseInt(p));
  const step: Step = {
    turnOn: line.startsWith("on"),
    cube: new Cube(new Range(x1, x2), new Range(y1, y2), new Range(z1, z2)),
  };

  if (
    inPart1Range(x1) &&
    inPart1Range(x2) &&
    inPart1Range(y1) &&
    inPart1Range(y2) &&
    inPart1Range(z1) &&
    inPart1Range(z2)
  ) {
    part1Steps.push(step);
  }

  allSteps.push(step);
}

function countOn(steps: Step[]): number {
  let onCubes: Cube[] = [];
  for (const step of steps) {
    onCubes = onCubes.flatMap((cube) => cube.subtract(step.cube));
    if (step.turnOn) {
      onCubes.push(step.cube);
    }
  }

  return sum(onCubes.map((cube) => cube.volume));
}

p(countOn(part1Steps));
p(countOn(allSteps));
