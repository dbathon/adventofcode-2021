import { Map2D } from "./util/map2D";
import { p, readLines } from "./util/util";

const lines = readLines("input/a20.txt");

const enhancement = lines[0];

const map = new Map2D<string>();
for (let y = 1; y < lines.length; y++) {
  const line = lines[y];
  for (let x = 0; x < line.length; x++) {
    if (line[x] === "#") {
      map.set(x, y - 1, "#");
    }
  }
}

const cache = new Map<string, boolean>();

function litAfter(x: number, y: number, n: number): boolean {
  if (n <= 0) {
    return map.get(x, y) === "#";
  }
  const key = x + "|" + y + "|" + n;
  const cachedResult = cache.get(key);
  if (cachedResult !== undefined) {
    return cachedResult;
  }
  const enhanceIndex = [
    litAfter(x - 1, y - 1, n - 1),
    litAfter(x, y - 1, n - 1),
    litAfter(x + 1, y - 1, n - 1),
    litAfter(x - 1, y, n - 1),
    litAfter(x, y, n - 1),
    litAfter(x + 1, y, n - 1),
    litAfter(x - 1, y + 1, n - 1),
    litAfter(x, y + 1, n - 1),
    litAfter(x + 1, y + 1, n - 1),
  ].reduce((val, bit) => val * 2 + (bit ? 1 : 0), 0);
  const result = enhancement[enhanceIndex] === "#";
  cache.set(key, result);
  return result;
}

function countLitAfter(n: number): number {
  let lit = 0;
  const maxX = map.originX + map.width + 2 * n;
  const maxY = map.originY + map.height + 2 * n;
  for (let x = map.originX - n; x < maxX; x++) {
    for (let y = map.originY - n; y < maxY; y++) {
      if (litAfter(x, y, n)) {
        ++lit;
      }
    }
  }
  return lit;
}

p(countLitAfter(2));
p(countLitAfter(50));
