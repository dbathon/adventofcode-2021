import { p, readLines, sum } from "./util/util";

const lines = readLines("input/a02.txt");

let pos = 0;
let depthOrAim = 0;
let depth2 = 0;

for (const line of lines) {
  const [command, distStr] = line.split(" ");
  const dist = parseInt(distStr);
  if (command === "forward") {
    pos += dist;
    depth2 += depthOrAim * dist;
  }
  if (command === "up") {
    depthOrAim -= dist;
  }
  if (command === "down") {
    depthOrAim += dist;
  }
}

p(pos * depthOrAim);
p(pos * depth2);
