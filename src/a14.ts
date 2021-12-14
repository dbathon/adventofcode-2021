import { p, readLines } from "./util/util";

const lines = readLines("input/a14.txt");

const start = lines[0];

const rules: Map<string, string> = new Map();
for (const line of lines) {
  const [from, to] = line.split(" -> ");
  if (to) {
    rules.set(from, to);
  }
}

const allLetters = [...new Set((start + [...rules.values()].join("")).split(""))];

const cache: Record<string, number | undefined> = {};
function countAfterSteps(pair: string, letter: string, steps: number): number {
  const key = pair + "-" + letter + "-" + steps;
  const cachedResult = cache[key];
  if (cachedResult !== undefined) {
    return cachedResult;
  }

  let result: number;
  const insert = rules.get(pair);
  if (steps <= 0 || !insert) {
    result = pair.split("").filter((l) => l === letter).length;
  } else {
    result =
      countAfterSteps(pair[0] + insert, letter, steps - 1) + countAfterSteps(insert + pair[1], letter, steps - 1);
    if (letter === insert) {
      // the inserted letter was counted in both calls, so subtract one
      --result;
    }
  }

  cache[key] = result;
  return result;
}

function getCountsAfterSteps(pattern: string, steps: number): Record<string, number> {
  let result: Record<string, number> = {};
  for (let i = 0; i < pattern.length - 1; i++) {
    const pair = pattern[i] + pattern[i + 1];
    for (const letter of allLetters) {
      result[letter] = (result[letter] || 0) + countAfterSteps(pair, letter, steps);
    }
    if (i > 0) {
      // reduce count for letter that would otherwise be counted twice
      result[pattern[i]] -= 1;
    }
  }
  return result;
}

function getSortedValues(map: Record<string, number>): number[] {
  return Object.getOwnPropertyNames(map)
    .map((key) => map[key])
    .sort((a, b) => a - b);
}

const sortedCounts10 = getSortedValues(getCountsAfterSteps(start, 10));
p(sortedCounts10[sortedCounts10.length - 1] - sortedCounts10[0]);

const sortedCounts40 = getSortedValues(getCountsAfterSteps(start, 40));
p(sortedCounts40[sortedCounts40.length - 1] - sortedCounts40[0]);
