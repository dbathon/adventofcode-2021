import { p, readLines } from "./util/util";

const lines = readLines("input/a17.txt");

const [targetMinX, targetMaxX, targetMinY, targetMaxY] = lines[0]
  .split(/[^\d\-]+/)
  .filter((e) => e)
  .map((e) => parseInt(e));

let totalCount = 0;
let maxHeight = targetMinY;
for (let yVelStart = targetMinY; yVelStart < 1000; yVelStart++) {
  let y = 0;
  let yVel = yVelStart;
  while (y > targetMaxY) {
    y += yVel;
    yVel -= 1;
  }

  if (y >= targetMinY) {
    for (let xVelStart = 0; xVelStart < 1000; xVelStart++) {
      let x = 0;
      let xVel = xVelStart;

      let y = 0;
      let yVel = yVelStart;
      let yMax = y;

      while (y >= targetMinY) {
        x += xVel;
        xVel = Math.max(0, xVel - 1);

        y += yVel;
        yVel -= 1;
        yMax = Math.max(y, yMax);

        if (x >= targetMinX && x <= targetMaxX && y >= targetMinY && y <= targetMaxY) {
          ++totalCount;
          maxHeight = Math.max(maxHeight, yMax);
          break;
        }
      }
    }
  }
}

p(maxHeight);
p(totalCount);
