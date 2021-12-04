import { p, readLines } from "./util/util";

const lines = readLines("input/a04.txt");

const numbers = lines[0].split(",").map((n) => parseInt(n));

type Board = number[][];

const boards: Board[] = [];

for (let i = 1; i < lines.length; ) {
  const board: Board = [];
  for (let row = 0; row < 5; row++) {
    board.push(lines[i].split(/ +/).map((n) => parseInt(n)));
    ++i;
  }
  boards.push(board);
}

function won(board: Board, numbers: number[]): number | undefined {
  const set = new Set(numbers);
  let restSum = 0;
  let won = false;

  // check rows
  for (const row of board) {
    let notDone = 0;
    for (const num of row) {
      if (!set.has(num)) {
        ++notDone;
        restSum += num;
      }
    }
    if (notDone === 0) {
      won = true;
    }
  }

  // check columns
  for (let col = 0; col < board[0].length; col++) {
    let notDone = 0;
    for (let row = 0; row < board.length; row++) {
      if (!set.has(board[row][col])) {
        ++notDone;
      }
    }
    if (notDone === 0) {
      won = true;
    }
  }

  return won ? restSum : undefined;
}

const winNumbers: number[] = [];
for (let i = 5; i <= numbers.length; i++) {
  for (const board of boards) {
    if (board.length === 0) {
      // already won
      continue;
    }
    const result = won(board, numbers.slice(0, i));
    if (result) {
      winNumbers.push(result * numbers[i - 1]);
      board.length = 0;
    }
  }
}

p(winNumbers[0]);
p(winNumbers[winNumbers.length - 1]);
