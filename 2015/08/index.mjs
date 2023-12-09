import { readFileSync } from "fs";
import assert from "node:assert";

/**
 * @param {string} str
 */
function getEscapedSize(str) {
  return eval(str).length;
}

/**
 * @param {string} file
 */
function mainA(file) {
  const lines = readFileSync(file).toString("utf-8").split("\n");

  const [sumRaw, sumMem] = lines.reduce(
    ([sumRaw, sumMem], line) => [sumRaw + line.length, sumMem + getEscapedSize(line)],
    [0, 0]
  );

  return sumRaw - sumMem;
}

/**
 * @param {string} file
 */
function mainB(file) {
  const lines = readFileSync(file).toString("utf-8").split("\n");

  const [sumRaw, sumEncoded] = lines.reduce(
    ([sumRaw, sumEncoded], line) => [sumRaw + line.length, sumEncoded + JSON.stringify(line).length],
    [0, 0]
  );

  return sumEncoded - sumRaw;
}

assert.strictEqual(mainA("spec.txt"), 12);
const partA = mainA("input.txt");

console.log("part A", partA);
assert.strictEqual(partA, 1342);

assert.strictEqual(mainB("spec.txt"), 19);
const partB = mainB("input.txt");

// assert.strictEqual(partB, 19);
console.log("part B", partB);
