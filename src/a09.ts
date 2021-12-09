import { Map2D, Map2DNode } from "./util/map2D";
import { p, readLines } from "./util/util";

const lines = readLines("input/a09.txt");

const map = new Map2D<number>();
for (let y = 0; y < lines.length; y++) {
  const line = lines[y];
  for (let x = 0; x < line.length; x++) {
    map.set(x, y, parseInt(line[x]));
  }
}

function getBasinSize(node: Map2DNode<number>) {
  const candidates: Map2DNode<number>[] = [node];
  const seen: Record<string, boolean> = {};
  while (candidates.length > 0) {
    const current = candidates.shift()!;
    if (!seen[current.getNodeKey()]) {
      seen[current.getNodeKey()] = true;
      current.get4Neighbors().forEach((neighbor) => {
        if (neighbor.value !== undefined && neighbor.value < 9 && neighbor.value >= current.value!) {
          candidates.push(neighbor);
        }
      });
    }
  }
  return Object.getOwnPropertyNames(seen).length;
}

let lowPointSum = 0;
const basinSizes: number[] = [];
map.forEachNode((node) => {
  const height = node.value;
  if (height !== undefined) {
    const lowerNeighbors = node
      .get4Neighbors()
      .filter((neighborNode) => neighborNode.value !== undefined && neighborNode.value <= height);
    if (lowerNeighbors.length === 0) {
      lowPointSum += height + 1;
      basinSizes.push(getBasinSize(node));
    }
  }
});

p(lowPointSum);

p(
  basinSizes
    .sort((a, b) => b - a)
    .slice(0, 3)
    .reduce((prev, current) => prev * current, 1)
);
