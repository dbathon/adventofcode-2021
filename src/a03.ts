import { p, readLines } from "./util/util";

const lines = readLines("input/a03.txt");

const counts: number[] = [];

for (const line of lines) {
  line.split("").forEach((d, i) => {
    if (d === "0") {
      counts[i] = (counts[i] || 0) + 1;
    }
  });
}

let gamma = "";
let epsilon = "";

counts.forEach((c) => {
  if (c > lines.length / 2) {
    gamma += "0";
    epsilon += "1";
  } else {
    gamma += "1";
    epsilon += "0";
  }
});

p(parseInt(gamma, 2) * parseInt(epsilon, 2));

function findMatching(numbers: string[], position: number, mostCommon: boolean): string[] {
  const zeros = numbers.map((num) => num[position]).filter((digit) => digit === "0").length;
  const ones = numbers.length - zeros;
  const digit = mostCommon ? (ones >= zeros ? "1" : "0") : zeros <= ones ? "0" : "1";
  return numbers.filter((num) => num[position] === digit);
}

function find(numbers: string[], mostCommon: boolean): string {
  let selection = numbers;
  for (let i = 0; ; i++) {
    selection = findMatching(selection, i, mostCommon);
    if (selection.length === 1) {
      return selection[0];
    }
  }
}

p(parseInt(find(lines, true), 2) * parseInt(find(lines, false), 2));
