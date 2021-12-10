import { p, readLines, sum } from "./util/util";

const lines = readLines("input/a10.txt");

const MATCHES: Record<string, string | undefined> = {
  "(": ")",
  "[": "]",
  "{": "}",
  "<": ">",
};

const ERROR_POINTS: Record<string, number> = {
  ")": 3,
  "]": 57,
  "}": 1197,
  ">": 25137,
};

const COMPLETION_POINTS: Record<string, number> = {
  ")": 1,
  "]": 2,
  "}": 3,
  ">": 4,
};

function calculateScores(line: string) {
  const stack: string[] = [];
  for (let i = 0; i < line.length; i++) {
    const cur = line[i];
    const match = MATCHES[cur];
    if (match) {
      stack.push(match);
    } else {
      const expected = stack.pop();
      if (expected !== cur) {
        return { error: ERROR_POINTS[cur], completion: 0 };
      }
    }
  }

  const expected = [...stack].reverse();
  return { error: 0, completion: expected.reduce((sum, closing) => sum * 5 + COMPLETION_POINTS[closing], 0) };
}

const scores = lines.map(calculateScores);
p(sum(scores.map((score) => score.error)));

const sortedCompletionScores = scores
  .map((score) => score.completion)
  .filter((score) => score > 0)
  .sort((a, b) => a - b);

p(sortedCompletionScores[Math.floor(sortedCompletionScores.length / 2)]);
