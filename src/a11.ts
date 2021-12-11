import { Map2D, Map2DNode } from "./util/map2D";
import { p, readLines } from "./util/util";

const lines = readLines("input/a11.txt");

const map = new Map2D<number>();
for (let y = 0; y < lines.length; y++) {
  const line = lines[y];
  for (let x = 0; x < line.length; x++) {
    map.set(x, y, parseInt(line[x]));
  }
}

function doNodeIncrease(node: Map2DNode<number>, flashed: Record<string, boolean>) {
  const nodeKey = node.getNodeKey();
  if (node.value !== undefined && !flashed[nodeKey]) {
    ++node.value;
    if (node.value > 9) {
      flashed[nodeKey] = true;
      for (const neighbor of node.get8Neighbors()) {
        if (neighbor.value !== undefined) {
          doNodeIncrease(neighbor, flashed);
        }
      }
    }
  }
}

function doStep(map: Map2D<number>) {
  const flashed: Record<string, boolean> = {};
  map.forEachNode((node) => {
    doNodeIncrease(node, flashed);
  });
  let count = 0;
  map.forEachNode((node) => {
    if (node.value !== undefined && node.value > 9) {
      node.value = 0;
      ++count;
    }
  });
  return count;
}

let total = 0;
for (let step = 1; ; step++) {
  const flashes = doStep(map);
  total += flashes;
  if (step === 100) {
    p(total);
  }
  if (flashes === 100) {
    p(step);
    break;
  }
}
