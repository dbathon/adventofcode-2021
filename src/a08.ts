import { p, readLines } from "./util/util";

const lines = readLines("input/a08.txt");

let count1 = 0;
for (const line of lines) {
  count1 += line
    .split(" | ")[1]
    .split(" ")
    .map((part) => part.length)
    .filter((l) => l === 2 || l === 3 || l === 4 || l === 7).length;
}

p(count1);

const DIGITS: Record<string, string> = {
  abcefg: "0",
  cf: "1",
  acdeg: "2",
  acdfg: "3",
  bcdf: "4",
  abdfg: "5",
  abdefg: "6",
  acf: "7",
  abcdefg: "8",
  abcdfg: "9",
};

function readDigits(digits: string[], segmentMap: Record<string, string | undefined>): number | undefined {
  const mappedDigits = digits.map((digit) =>
    digit
      .split("")
      .map((segment) => segmentMap[segment] || "-")
      .sort()
      .join("")
  );
  const numberString = mappedDigits.map((mappedDigit) => DIGITS[mappedDigit] || "-").join("");
  return numberString.indexOf("-") >= 0 ? undefined : parseInt(numberString);
}

const LETTERS = "abcdefg".split("");

let sum = 0;
outer: for (const line of lines) {
  const [notes, input] = line.split(" | ");
  const notedDigits = notes.split(" ");
  const digits = input.split(" ");

  const segmentMap: Record<string, string | undefined> = {};
  for (let a = 0; a < 7; a++) {
    const ma = LETTERS[a];
    segmentMap[ma] = "a";
    for (let b = 0; b < 7; b++) {
      const mb = LETTERS[b];
      if (segmentMap[mb]) continue;
      segmentMap[mb] = "b";
      for (let c = 0; c < 7; c++) {
        const mc = LETTERS[c];
        if (segmentMap[mc]) continue;
        segmentMap[mc] = "c";
        for (let d = 0; d < 7; d++) {
          const md = LETTERS[d];
          if (segmentMap[md]) continue;
          segmentMap[md] = "d";
          for (let e = 0; e < 7; e++) {
            const me = LETTERS[e];
            if (segmentMap[me]) continue;
            segmentMap[me] = "e";
            for (let f = 0; f < 7; f++) {
              const mf = LETTERS[f];
              if (segmentMap[mf]) continue;
              segmentMap[mf] = "f";
              for (let g = 0; g < 7; g++) {
                const mg = LETTERS[g];
                if (segmentMap[mg]) continue;
                segmentMap[mg] = "g";

                if (readDigits(notedDigits, segmentMap)) {
                  sum += readDigits(digits, segmentMap)!;
                  continue outer;
                }

                segmentMap[mg] = undefined;
              }
              segmentMap[mf] = undefined;
            }
            segmentMap[me] = undefined;
          }
          segmentMap[md] = undefined;
        }
        segmentMap[mc] = undefined;
      }
      segmentMap[mb] = undefined;
    }
    segmentMap[ma] = undefined;
  }
}

p(sum);
