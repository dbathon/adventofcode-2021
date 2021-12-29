import { p, readLines } from "./util/util";

const lines = readLines("input/a24.txt");

interface Expression {
  render(requiredExpressionsOut: Map<string, string>): string;
}

class Literal implements Expression {
  constructor(readonly value: number) {}

  render(): string {
    return "" + this.value;
  }
}

class Input implements Expression {
  constructor(readonly index: number) {}

  render(): string {
    return "input[" + this.index + "]";
  }
}

function div(a: number, b: number): number {
  if (b === 0) {
    throw "invalid div arg";
  }
  const res = a / b;
  return res >= 0 ? Math.floor(res) : Math.ceil(res);
}

function mod(a: number, b: number): number {
  if (a < 0 || b <= 0) {
    throw "invalid mod arg";
  }
  return a % b;
}

function eql(a: number, b: number): number {
  return a === b ? 1 : 0;
}

const ops: Record<string, (a: number, b: number) => number> = {
  add: (a, b) => a + b,
  mul: (a, b) => a * b,
  div,
  mod,
  eql,
};

const opsRender: Record<string, string> = {
  add: "+",
  mul: "*",
  div: "div",
  mod: "mod",
  eql: "eql",
};

class OpExpression implements Expression {
  private static NEXT_ID = 0;

  useCount = 0;
  readonly id: number;

  constructor(readonly left: Expression, readonly op: string, readonly right: Expression) {
    this.id = OpExpression.NEXT_ID++;
    if (left instanceof OpExpression) {
      ++left.useCount;
    }
    if (right instanceof OpExpression) {
      ++right.useCount;
    }
  }

  static simplifyAndCreate(left: Expression, op: string, right: Expression): Expression {
    if (left instanceof Literal && right instanceof Literal) {
      return new Literal(ops[op](left.value, right.value));
    } else if (op === "add") {
      if (left instanceof Literal && left.value === 0) {
        return right;
      }
      if (right instanceof Literal && right.value === 0) {
        return left;
      }
    } else if (op === "mul") {
      if (left instanceof Literal && left.value === 0) {
        return left;
      }
      if (right instanceof Literal && right.value === 0) {
        return right;
      }
      if (left instanceof Literal && left.value === 1) {
        return right;
      }
      if (right instanceof Literal && right.value === 1) {
        return left;
      }
    } else if (op === "div") {
      if (right instanceof Literal && right.value === 1) {
        return left;
      }
    }

    return new OpExpression(left, op, right);
  }

  render(requiredExpressionsOut: Map<string, string>): string {
    const name = "e" + this.id;
    if (requiredExpressionsOut.has(name)) {
      // already rendered before
      return name;
    }

    const opRender = opsRender[this.op];
    const expressionString =
      (opRender.length > 1 ? opRender : "") +
      "(" +
      this.left.render(requiredExpressionsOut) +
      (opRender.length > 1 ? "," : " " + opRender) +
      " " +
      this.right.render(requiredExpressionsOut) +
      ")";

    if (this.useCount <= 1) {
      // render this inline
      return expressionString;
    } else {
      // only evaluate this once and store it in a "required expression"
      requiredExpressionsOut.set(name, expressionString);
      return name;
    }
  }
}

const variables: Record<string, Expression> = {
  w: new Literal(0),
  x: new Literal(0),
  y: new Literal(0),
  z: new Literal(0),
};

let nextInput = 0;
for (const [i, line] of lines.entries()) {
  const [instruction, a1, a2] = line.split(" ");
  const constantName = "c" + i;
  if (instruction === "inp") {
    variables[a1] = new Input(nextInput++);
  } else {
    variables[a1] = OpExpression.simplifyAndCreate(
      variables[a1],
      instruction,
      variables[a2] !== undefined ? variables[a2] : new Literal(parseInt(a2))
    );
  }
}

const expressions = new Map<string, string>();

expressions.set("z", variables.z.render(expressions));

expressions.forEach((exp, name) => {
  p("const " + name + " = " + exp + ";");
});

function monad(input: number[]) {
  const e5 = input[0] + 4;
  const e15 = e5 * 26 + (input[1] + 11);
  const e25 = e15 * 26 + (input[2] + 5);
  const e35 = e25 * 26 + (input[3] + 11);
  const e45 = e35 * 26 + (input[4] + 14);
  const e50 = eql(eql(mod(e45, 26) + -10, input[5]), 0);
  p([mod(e45, 26) + -10, e50]);
  const e56 = div(e45, 26) * (25 * e50 + 1) + (input[5] + 7) * e50;
  const e66 = e56 * 26 + (input[6] + 11);
  const e71 = eql(eql(mod(e66, 26) + -9, input[7]), 0);
  p([mod(e66, 26) + -9, e71]);
  const e77 = div(e66, 26) * (25 * e71 + 1) + (input[7] + 4) * e71;
  const e82 = eql(eql(mod(e77, 26) + -3, input[8]), 0);
  p([mod(e77, 26) + -3, e82]);
  const e88 = div(e77, 26) * (25 * e82 + 1) + (input[8] + 6) * e82;
  const e98 = e88 * 26 + (input[9] + 5);
  const e103 = eql(eql(mod(e98, 26) + -5, input[10]), 0);
  p([mod(e98, 26) + -5, e103]);
  const e109 = div(e98, 26) * (25 * e103 + 1) + (input[10] + 9) * e103;
  const e114 = eql(eql(mod(e109, 26) + -10, input[11]), 0);
  p([mod(e109, 26) + -10, e114]);
  const e120 = div(e109, 26) * (25 * e114 + 1) + (input[11] + 12) * e114;
  const e125 = eql(eql(mod(e120, 26) + -4, input[12]), 0);
  p([mod(e120, 26) + -4, e125]);
  const e131 = div(e120, 26) * (25 * e125 + 1) + (input[12] + 14) * e125;
  const e136 = eql(eql(mod(e131, 26) + -5, input[13]), 0);
  p([mod(e131, 26) + -5, e136]);
  const z = div(e131, 26) * (25 * e136 + 1) + (input[13] + 14) * e136;

  return z;
}

const testNumbers = [
  [0, 0, 0, 0, 0, 5, 0, 7, 4, 0, 10, 3, 2, 1],
  [9, 2, 9, 1, 5, 9, 7, 9, 9, 9, 9, 4, 9, 8],
  [2, 1, 6, 1, 1, 5, 1, 3, 9, 1, 1, 1, 8, 1],
];

for (const tn of testNumbers) {
  p(monad(tn));
  p("------------");
}
