import { p, readLines } from "./util/util";

const lines = readLines("input/a25.txt");

function moveEast(map: string[]): string[] {
  return map.map((line) => {
    const width = line.length;
    let result = "";
    for (let x = 0; x < width; x++) {
      const prev = line[(x + width - 1) % width];
      const current = line[x];
      const next = line[(x + 1) % width];
      if (current === "." && prev === ">") {
        result += ">";
      } else if (current === ">" && next === ".") {
        result += ".";
      } else {
        result += current;
      }
    }
    return result;
  });
}

function moveSouth(map: string[]): string[] {
  const width = map[0].length;
  const height = map.length;
  let resultMap: string[] = map.map((_) => "");
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const prev = map[(y + height - 1) % height][x];
      const current = map[y][x];
      const next = map[(y + 1) % height][x];
      let result = current;
      if (current === "." && prev === "v") {
        result = "v";
      } else if (current === "v" && next === ".") {
        result = ".";
      }
      resultMap[y] = resultMap[y] += result;
    }
  }
  return resultMap;
}

let current = lines;
let steps = 0;

while (true) {
  const next = moveSouth(moveEast(current));
  ++steps;
  if (next.join("\n") === current.join("\n")) {
    break;
  }
  current = next;
}
p(steps);
