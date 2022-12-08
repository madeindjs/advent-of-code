import { readFileSync } from "fs";
import assert from "node:assert";

/**
 * @param {string} file
 */
function mainA(file) {
  const lines = readFileSync(file).toString("utf-8").split("\n");

  return 0;
}

/**
 * @param {string} file
 */
function mainB(file) {
  const lines = readFileSync(file).toString("utf-8").split("\n");

  return 0;
}

assert.strictEqual(mainA("spec.txt"), 95437);
const partA = mainA("input.txt");

console.log("part A", partA);
assert.strictEqual(partA, 1770595);

assert.strictEqual(mainB("spec.txt"), 24933642);
const partB = mainB("input.txt");

assert.strictEqual(partB, 2195372);
console.log("part B", partB);
