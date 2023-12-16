import assert from "node:assert";
import { readFileSync } from "node:fs";

function parseFile(file) {
  return readFileSync(file, { encoding: "utf-8" }).split(",");
}

/**
 * @param {string} str
 */
function hash(str) {
  let value = 0;
  for (let i = 0; i < str.length; i++) {
    const charCode = str.charCodeAt(i);
    value += charCode;
    value *= 17;
    value = value % 256;
  }
  return value;
}
assert.strictEqual(hash("HASH"), 52);

function mainA(file) {
  let total = 0;
  for (const str of parseFile(file)) total += hash(str);
  return total;
}
assert.strictEqual(mainA("spec.txt"), 1320);
assert.strictEqual(mainA("input.txt"), 507666);
