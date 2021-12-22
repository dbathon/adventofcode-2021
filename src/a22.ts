import { p, readLines } from "./util/util";

const lines = readLines("input/a22.txt");

function inPart1Range(x: number): boolean {
  return x >= -50 && x <= 50;
}

const isOnPart1: boolean[] = [];
for (const line of lines) {
  const [x1, x2, y1, y2, z1, z2] = line
    .split(/[^\d\-]/)
    .filter((p) => p)
    .map((p) => parseInt(p));
  const turnOn = line.startsWith("on");
  if (
    inPart1Range(x1) &&
    inPart1Range(x2) &&
    inPart1Range(y1) &&
    inPart1Range(y2) &&
    inPart1Range(z1) &&
    inPart1Range(z2)
  ) {
    for (let x = x1; x <= x2; x++) {
      for (let y = y1; y <= y2; y++) {
        for (let z = z1; z <= z2; z++) {
          isOnPart1[101 * 101 * (x + 50) + 101 * (y + 50) + z + 50] = turnOn;
        }
      }
    }
  }
}

p(isOnPart1.filter((p) => p).length);
