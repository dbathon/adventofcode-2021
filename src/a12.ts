import { p, readLines } from "./util/util";

const lines = readLines("input/a12.txt");

const edges: Record<string, string[] | undefined> = {};

for (const line of lines) {
  const [from, to] = line.split("-");
  (edges[from] ||= []).push(to);
  (edges[to] ||= []).push(from);
}

function countPathes(
  edges: Record<string, string[] | undefined>,
  from: string,
  to: string,
  visitedCount: Record<string, number>,
  smallDoubleVisitAllowed: boolean
): number {
  const isSmall = from.toLowerCase() === from;
  const visitedCountFrom = visitedCount[from] || 0;
  if (isSmall) {
    if ((!smallDoubleVisitAllowed && visitedCountFrom >= 1) || visitedCountFrom >= 2) {
      return 0;
    }
    if (visitedCountFrom >= 1) {
      smallDoubleVisitAllowed = false;
    }
  }
  if (to === from) {
    return 1;
  }
  let sum = 0;
  visitedCount[from] = visitedCountFrom + 1;
  for (const next of edges[from] || []) {
    if (next !== "start") {
      sum += countPathes(edges, next, to, visitedCount, smallDoubleVisitAllowed);
    }
  }
  visitedCount[from] = visitedCountFrom;
  return sum;
}

p(countPathes(edges, "start", "end", {}, false));
p(countPathes(edges, "start", "end", {}, true));
