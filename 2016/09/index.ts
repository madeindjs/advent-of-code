import assert from "assert";
import { createReadStream } from "node:fs";
import readline from "node:readline";

function expand(string: string, expandExpanded = false): number {
  let stack = string.split("");
  let isScanning = false;
  let count = 0;
  let scan = "";

  while (stack.length > 0) {
    const char = stack.shift();

    if (char === "(") {
      isScanning = true;
    } else if (char === ")") {
      if (!isScanning) continue;

      const [range, qty] = scan.split("x").map(Number);

      // i = openIndex;
      isScanning = false;
      scan = "";

      const repeated = stack.splice(0, range);

      if (expandExpanded) {
        for (let j = 0; j < qty; j++) {
          stack.splice(0, 0, ...repeated);
        }
      } else {
        count += qty * range;
      }

      // console.log(range, qty, repeated);
    } else if (isScanning) {
      scan += char;
    } else {
      count++;
    }
  }

  return count;
}

assert.strictEqual(expand("A(1x5)BC"), "ABBBBBC".length);
assert.strictEqual(expand("(3x3)XYZ"), "XYZXYZXYZ".length);
assert.strictEqual(expand("A(2x2)BCD(2x2)EFG"), "ABCBCDEFEFG".length);
assert.strictEqual(expand("X(8x2)(3x3)ABCY"), "X(3x3)ABC(3x3)ABCY".length);

function getLines(path: string) {
  const file = new URL(path, import.meta.url);
  return readline.createInterface({ input: createReadStream(file) });
}

async function mainA() {
  let total = 0;
  for await (const line of getLines("./input.txt")) {
    total += expand(line);
  }
  return total;
}

assert.strictEqual(await mainA(), 115118);
// ---
assert.strictEqual(
  expand("(25x3)(3x3)ABC(2x3)XY(5x2)PQRSTX(18x9)(3x2)TWO(5x7)SEVEN", true),
  445,
);
assert.strictEqual(expand("(27x12)(20x12)(13x14)(7x10)(1x12)A", true), 241920);

async function mainB() {
  let total = 0;
  for await (const line of getLines("./input.txt")) {
    console.log(total);
    total += expand(line, true);
  }
  return total;
}

assert.strictEqual(await mainB(), 0);
