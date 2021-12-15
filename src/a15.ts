import { Map2D, Map2DNode } from "./util/map2D";
import { p, readLines } from "./util/util";
import { dijkstraSearch, Neighbor } from "./util/graphUtil";

const lines = readLines("input/a15.txt");

const height = lines.length;
const width = lines[0].length;

const map = new Map2D<number>();
for (let y = 0; y < height; y++) {
  const line = lines[y];
  for (let x = 0; x < width; x++) {
    map.set(x, y, parseInt(line[x]));
  }
}

function getLowestRisk(map: Map2D<number>, start: Map2DNode<number>, finish: Map2DNode<number>) {
  let result: number = -1;
  dijkstraSearch(
    (node: Map2DNode<number>, state: void, distance: number) => {
      if (node.x === finish.x && node.y === finish.y) {
        result = distance;
        return null;
      }
      return node
        .get4Neighbors()
        .filter((n) => n.value)
        .map((n) => new Neighbor(n, n.value!, undefined));
    },
    start,
    undefined
  );
  return result;
}

p(getLowestRisk(map, map.getNode(0, 0), map.getNode(width - 1, height - 1)));

const map2 = new Map2D<number>();
for (let yCopy = 0; yCopy < 5; yCopy++) {
  const yBase = yCopy * width;
  for (let xCopy = 0; xCopy < 5; xCopy++) {
    const xBase = xCopy * height;
    const addition = yBase + xBase;
    for (let y = 0; y < height; y++) {
      const line = lines[y];
      for (let x = 0; x < width; x++) {
        let value = map.get(x, y)! + addition;
        while (value > 9) {
          value -= 9;
        }
        map2.set(xBase + x, yBase + y, value);
      }
    }
  }
}

p(getLowestRisk(map2, map2.getNode(0, 0), map2.getNode(width * 5 - 1, height * 5 - 1)));
