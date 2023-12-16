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

function mainB(file) {
  const boxes = new Array(256).fill("").map(() => ({}));
  let total = 0;

  for (const str of parseFile(file)) {
    if (str.endsWith("-")) {
      const label = str.replace("-", "");
      const value = hash(label);
      delete boxes[value][label];
    } else if (str.includes("=")) {
      const [label, slot] = str.split("=");
      const value = hash(label);
      boxes[value][label] = Number(slot);
    }
  }
  console.log(boxes);

  for (let i = 0; i < boxes.length; i++) {
    const lens = boxes[i];

    let j = 0;
    for (const [label, value] of Object.entries(lens)) {
      const inc = (i + 1) * (j + 1) * value;
      total += inc;
      j++;
    }
  }
  return total;
}
assert.strictEqual(mainB("spec.txt"), 145);
assert.strictEqual(mainB("input.txt"), 233537);
