import { p, readLines } from "./util/util";

const lines = readLines("input/a19.txt");

type Vec = [number, number, number];

function rotX(p: Vec): Vec {
  return [p[0], -p[2], p[1]];
}

function rotY(p: Vec): Vec {
  return [-p[2], p[1], p[0]];
}

function rotZ(p: Vec): Vec {
  return [p[1], -p[0], p[2]];
}

function add(a: Vec, b: Vec): Vec {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

function subtract(a: Vec, b: Vec): Vec {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

const sixFaceRotations: ((p: Vec) => Vec)[] = [
  (p) => p,
  (p) => rotY(p),
  (p) => rotY(rotY(p)),
  (p) => rotY(rotY(rotY(p))),
  (p) => rotX(p),
  (p) => rotX(rotX(rotX(p))),
];

const allRotations: ((p: Vec) => Vec)[] = [];

sixFaceRotations.forEach((faceRot) => {
  allRotations.push(faceRot);
  allRotations.push((p) => faceRot(rotZ(p)));
  allRotations.push((p) => faceRot(rotZ(rotZ(p))));
  allRotations.push((p) => faceRot(rotZ(rotZ(rotZ(p)))));
});

interface BeaconPositions {
  input: Vec[];
  rotatedAndRelToZero?: Vec[];
  offset?: Vec;
}

const beaconPositionsPerScanner: BeaconPositions[] = [];

lines.forEach((line) => {
  if (line.startsWith("--- scanner ")) {
    beaconPositionsPerScanner.push({ input: [] });
  } else {
    beaconPositionsPerScanner[beaconPositionsPerScanner.length - 1].input.push(JSON.parse("[" + line + "]"));
  }
});

// use the rotation of scanner 0
beaconPositionsPerScanner[0].rotatedAndRelToZero = beaconPositionsPerScanner[0].input;
beaconPositionsPerScanner[0].offset = [0, 0, 0];

// loop until we have the adjusted positions for each beacon
const checked = new Set<string>();
while (beaconPositionsPerScanner.find((p) => p.rotatedAndRelToZero === undefined)) {
  for (const [i, positions1] of beaconPositionsPerScanner.entries()) {
    if (!positions1.rotatedAndRelToZero) {
      continue;
    }
    const basePositions1 = positions1.rotatedAndRelToZero;
    const basePositionStrings1 = new Set(basePositions1.map((p) => JSON.stringify(p)));

    for (const [j, positions2] of beaconPositionsPerScanner.entries()) {
      if (positions2.rotatedAndRelToZero || positions1 === positions2) {
        continue;
      }
      const checkedKey = i + "," + j;
      if (checked.has(checkedKey)) {
        continue;
      }
      checked.add(checkedKey);

      // find rotations with at least 12 matching points
      matchSearch: for (const rotation of allRotations) {
        const rotatedPositions2 = positions2.input.map(rotation);

        // try the differences between all positions as offset
        for (const p1 of basePositions1) {
          for (const p2 of rotatedPositions2) {
            const offset = subtract(p1, p2);
            const offsetPositions2 = rotatedPositions2.map((p) => add(p, offset));
            const matchCount = offsetPositions2.filter((p) => basePositionStrings1.has(JSON.stringify(p))).length;

            if (matchCount >= 12) {
              positions2.rotatedAndRelToZero = offsetPositions2;
              positions2.offset = offset;
              break matchSearch;
            }
          }
        }
      }
    }
  }
}

p(
  new Set(
    beaconPositionsPerScanner
      .map((positions) => positions.rotatedAndRelToZero!.map((p) => JSON.stringify(p)))
      .flatMap((positionStrings) => positionStrings)
  ).size
);

const scannerPositions = beaconPositionsPerScanner.map((p) => p.offset!);
let maxDist = 0;

for (let i = 0; i < scannerPositions.length; i++) {
  for (let j = i + 1; j < scannerPositions.length; j++) {
    const diff = subtract(scannerPositions[i], scannerPositions[j]);
    const dist = Math.abs(diff[0]) + Math.abs(diff[1]) + Math.abs(diff[2]);
    maxDist = Math.max(maxDist, dist);
  }
}

p(maxDist);
