import { p, readLines, sum } from "./util/util";

const numbers = readLines("input/a01.txt").map((str) => parseInt(str));

let cntIncrease = 0;

for (let i = 1; i < numbers.length; ++i) {
  if (numbers[i] > numbers[i - 1]) {
    ++cntIncrease;
  }
}

p(cntIncrease);

let cntWindowIncrease = 0;

for (let i = 3; i < numbers.length; ++i) {
  //  if (numbers[i] + numbers[i - 1] + numbers[i - 2] > numbers[i - 1] + numbers[i - 2] + numbers[i - 3]) {
  if (sum(numbers.slice(i - 2, i + 1)) > sum(numbers.slice(i - 3, i))) {
    ++cntWindowIncrease;
  }
}

p(cntWindowIncrease);
