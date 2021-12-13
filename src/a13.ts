import { Map2D } from "./util/map2D";
import { p, readLines } from "./util/util";

const lines = readLines("input/a13.txt");

class Point {
  constructor(readonly x: number, readonly y: number) {}
}

const inputPoints: Point[] = [];

const foldFunctions: ((p: Point) => Point)[] = [];

for (const line of lines) {
  if (line.startsWith("fold along x=")) {
    const x = parseInt(line.split("=")[1]);
    foldFunctions.push((p) => (p.x < x ? p : new Point(x - (p.x - x), p.y)));
  } else if (line.startsWith("fold along y=")) {
    const y = parseInt(line.split("=")[1]);
    foldFunctions.push((p) => (p.y < y ? p : new Point(p.x, y - (p.y - y))));
  } else {
    const [x, y] = line.split(",");
    inputPoints.push(new Point(parseInt(x), parseInt(y)));
  }
}

p(new Set(inputPoints.map(foldFunctions[0]).map((p) => p.x + ", " + p.y)).size);

const map: Map2D<string> = new Map2D();

for (const point of inputPoints) {
  let p = point;
  for (const foldFunction of foldFunctions) {
    p = foldFunction(p);
  }
  map.set(p.x, p.y, "#");
}

p(map.draw());
