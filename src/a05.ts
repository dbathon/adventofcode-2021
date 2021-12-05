import { Map2D } from "./util/map2D";
import { p, readLines } from "./util/util";

const lines = readLines("input/a05.txt").map((line) => line.split(/[^\d]+/).map((num) => parseInt(num)));

function drawLine(map: Map2D<number>, line: number[]) {
  let [x, y, toX, toY] = line;
  const stepX = Math.sign(toX - x);
  const stepY = Math.sign(toY - y);
  map.set(x, y, (map.get(x, y) || 0) + 1);
  while (x !== toX || y !== toY) {
    x += stepX;
    y += stepY;
    map.set(x, y, (map.get(x, y) || 0) + 1);
  }
}

const map = new Map2D<number>();
const map2 = new Map2D<number>();

for (const line of lines) {
  if (line[0] == line[2] || line[1] == line[3]) {
    drawLine(map, line);
  }
  drawLine(map2, line);
}

function countAboveOne(map: Map2D<number>) {
  let cnt = 0;
  map.forEach((x, y, value) => {
    if (value && value > 1) {
      ++cnt;
    }
  });
  return cnt;
}

p(countAboveOne(map));
p(countAboveOne(map2));
