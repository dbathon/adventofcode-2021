import { p, readLines } from "./util/util";

const lines = readLines("input/a21.txt");

const startPositions = lines.map((line) => parseInt(line.split(": ")[1]));

function step(position: number, advance: number): number {
  position += advance;
  while (position > 10) {
    position -= 10;
  }
  return position;
}

function play(pos1: number, pos2: number, rollDie: () => number): number {
  let rollCount = 0;
  let score1 = 0;
  let score2 = 0;

  while (true) {
    pos1 = step(pos1, rollDie() + rollDie() + rollDie());
    rollCount += 3;
    score1 += pos1;
    if (score1 >= 1000) {
      return score2 * rollCount;
    }
    pos2 = step(pos2, rollDie() + rollDie() + rollDie());
    rollCount += 3;
    score2 += pos2;
    if (score2 >= 1000) {
      return score1 * rollCount;
    }
  }
}

let diePos = 1;
p(
  play(startPositions[0], startPositions[1], () => {
    const result = diePos;
    ++diePos;
    if (diePos > 100) {
      diePos -= 100;
    }
    return result;
  })
);

const cache = new Map<string, [number, number]>();
function diracWins(pos1: number, pos2: number, rollSum = 0, rollStep = 1, score1 = 0, score2 = 0): [number, number] {
  if (rollStep > 6) {
    rollStep -= 6;
  }
  if (score1 >= 21 && rollStep === 4) {
    return [1, 0];
  }
  if (score2 >= 21 && rollStep === 1) {
    return [0, 1];
  }
  const key = pos1 + "," + pos2 + "," + rollSum + "," + rollStep + "," + score1 + "," + score2;
  const cachedResult = cache.get(key);
  if (cachedResult) {
    return cachedResult;
  }
  let wins1Sum = 0;
  let wins2Sum = 0;
  for (let roll = 1; roll <= 3; roll++) {
    let wins: [number, number];
    if (rollStep <= 3) {
      wins = diracWins(
        step(pos1, roll),
        pos2,
        rollStep == 1 ? roll : rollSum + roll,
        rollStep + 1,
        rollStep == 3 ? score1 + step(pos1, roll) : score1,
        score2
      );
    } else {
      wins = diracWins(
        pos1,
        step(pos2, roll),
        rollStep == 4 ? roll : rollSum + roll,
        rollStep + 1,
        score1,
        rollStep == 6 ? score2 + step(pos2, roll) : score2
      );
    }
    wins1Sum += wins[0];
    wins2Sum += wins[1];
  }

  const result: [number, number] = [wins1Sum, wins2Sum];
  cache.set(key, result);
  return result;
}

p(Math.max(...diracWins(startPositions[0], startPositions[1])));
