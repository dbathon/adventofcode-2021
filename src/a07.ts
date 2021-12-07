import { findMax, p, readLines, sum } from "./util/util";

const lines = readLines("input/a07.txt");

const positions = lines[0].split(",").map((n) => parseInt(n));

const min = findMax(positions, (pos) => -pos).maxElement!;
const max = findMax(positions, (pos) => pos).maxElement!;

function requiredFuel(positions: number[], target: number) {
  return sum(positions.map((pos) => Math.abs(pos - target)));
}

const targets: number[] = [];
for (let i = min; i <= max; i++) {
  targets.push(i);
}

p(-findMax(targets, (target) => -requiredFuel(positions, target)).max!);

function requiredFuel2(positions: number[], target: number) {
  return sum(
    positions.map((pos) => {
      const dist = Math.abs(pos - target);
      return (dist * (dist + 1)) / 2;
    })
  );
}

p(-findMax(targets, (target) => -requiredFuel2(positions, target)).max!);
