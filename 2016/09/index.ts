import assert from "assert";
import { createReadStream } from "node:fs";
import readline from "node:readline";

function expand(string: string, pos = 0, expandExpanded = false) {
  let openIndex = -1;

  for (let i = pos; i < string.length; i++) {
    const char = string.at(i);

    if (char === "(") {
      openIndex = i;
    } else if (char === ")") {
      if (openIndex === -1) continue;

      const [range, qty] = string
        .slice(openIndex + 1, i)
        .split("x")
        .map(Number);

      const repeated = string.slice(i + 1, i + 1 + range).repeat(qty);

      const before = string.slice(0, openIndex);
      const after = string.slice(i + 1 + range);

      string = `${before}${repeated}${after}`;

      // i = openIndex;
      openIndex = -1;
      i = expandExpanded ? openIndex : `${before}${repeated}`.length - 1;

      // console.log(range, qty, repeated);
    }
  }
  return string;
}

assert.strictEqual(expand("A(1x5)BC"), "ABBBBBC");
assert.strictEqual(expand("(3x3)XYZ"), "XYZXYZXYZ");
assert.strictEqual(expand("A(2x2)BCD(2x2)EFG"), "ABCBCDEFEFG");
assert.strictEqual(expand("X(8x2)(3x3)ABCY"), "X(3x3)ABC(3x3)ABCY");

function getLines(path: string) {
  const file = new URL(path, import.meta.url);
  return readline.createInterface({ input: createReadStream(file) });
}

async function mainA() {
  let total = 0;
  for await (const line of getLines("./input.txt")) {
    total += expand(line).length;
  }
  return total;
}

assert.strictEqual(await mainA(), 115118);
// ---
assert.strictEqual(
  expand("(25x3)(3x3)ABC(2x3)XY(5x2)PQRSTX(18x9)(3x2)TWO(5x7)SEVEN", 0, true)
    .length,
  445,
);
assert.strictEqual(
  expand("(27x12)(20x12)(13x14)(7x10)(1x12)A", 0, true).length,
  241920,
);

async function mainB() {
  let total = 0;
  for await (const line of getLines("./input.txt")) {
    total += expand(line, 0, true).length;
  }
  return total;
}

assert.strictEqual(await mainB(), 0);
