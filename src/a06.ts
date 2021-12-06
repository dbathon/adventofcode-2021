import { p, readLines, sum } from "./util/util";

const lines = readLines("input/a06.txt");

const startAges = lines[0].split(",").map((n) => parseInt(n));

function afterGenerations(startAges: number[], generations: number): number {
  // the index is the age and the value is the count
  let state: number[] = [];
  for (const age of startAges) {
    state[age] = (state[age] || 0) + 1;
  }
  for (let i = 0; i < generations; i++) {
    let newState: number[] = [];
    state.forEach((count, age) => {
      let nextAge = age - 1;
      if (age === 0) {
        newState[8] = count;
        nextAge = 6;
      }
      newState[nextAge] = (newState[nextAge] || 0) + count;
    });
    state = newState;
  }
  return sum(state);
}

p(afterGenerations(startAges, 80));
p(afterGenerations(startAges, 256));
