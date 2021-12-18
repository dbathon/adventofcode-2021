import { p, readLines } from "./util/util";

const lines = readLines("input/a18.txt");

type SNumber = [SNumber | number, SNumber | number];

function explodeOne(input: SNumber, depth = 0): { leftAdd?: number; replace?: number; rightAdd?: number } | undefined {
  const [a, b] = input;

  if (depth >= 4 && typeof a === "number" && typeof b === "number") {
    return { leftAdd: a, replace: 0, rightAdd: b };
  }

  function recAdd(sNumber: SNumber, pos: 0 | 1, toAdd: number) {
    const part = sNumber[pos];
    if (typeof part === "number") {
      sNumber[pos] = part + toAdd;
    } else {
      recAdd(part, pos, toAdd);
    }
  }

  if (typeof a !== "number") {
    const result = explodeOne(a, depth + 1);
    if (result) {
      if (result.replace !== undefined) {
        input[0] = result.replace;
        result.replace = undefined;
      }
      if (result.rightAdd !== undefined) {
        if (typeof b == "number") {
          input[1] = b + result.rightAdd;
        } else {
          recAdd(b, 0, result.rightAdd);
        }
        result.rightAdd = undefined;
      }
      return result;
    }
  }

  if (typeof b !== "number") {
    const result = explodeOne(b, depth + 1);
    if (result) {
      if (result.replace !== undefined) {
        input[1] = result.replace;
        result.replace = undefined;
      }
      if (result.leftAdd !== undefined) {
        if (typeof a == "number") {
          input[0] = a + result.leftAdd;
        } else {
          recAdd(a, 1, result.leftAdd);
        }
        result.leftAdd = undefined;
      }
      return result;
    }
  }

  return undefined;
}

function splitOne(input: SNumber): boolean {
  const [a, b] = input;

  function split(num: number): SNumber {
    const a = Math.floor(num / 2);
    return [a, num - a];
  }

  if (typeof a === "number") {
    if (a > 9) {
      input[0] = split(a);
      return true;
    }
  } else if (splitOne(a)) {
    return true;
  }

  if (typeof b === "number") {
    if (b > 9) {
      input[1] = split(b);
      return true;
    }
  } else if (splitOne(b)) {
    return true;
  }

  return false;
}

function reduce(input: SNumber) {
  while (true) {
    if (explodeOne(input)) {
      continue;
    }
    if (splitOne(input)) {
      continue;
    }
    break;
  }
}

function add(a: SNumber, b: SNumber): SNumber {
  const result: SNumber = [a, b];
  reduce(result);
  return result;
}

function magnitude(input: SNumber | number): number {
  if (typeof input === "number") {
    return input;
  } else {
    const [a, b] = input;
    return 3 * magnitude(a) + 2 * magnitude(b);
  }
}

function parseSNumber(input: string): SNumber {
  return JSON.parse(input);
}

p(magnitude(lines.map(parseSNumber).reduce(add)));

let max = 0;

for (let i = 0; i < lines.length; i++) {
  const a = lines[i];
  for (let j = i + 1; j < lines.length; j++) {
    const b = lines[j];
    max = Math.max(max, magnitude(add(parseSNumber(a), parseSNumber(b))));
    max = Math.max(max, magnitude(add(parseSNumber(b), parseSNumber(a))));
  }
}

p(max);
