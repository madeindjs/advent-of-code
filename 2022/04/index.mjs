import { createReadStream } from "fs";
import assert from "node:assert";
import readline from "readline";

/**
 * @param {string} line
 * @returns {[[number, number], [number, number]]}
 */
// @ts-ignore
const parseLine = (line) => line.split(",").map((range) => range.split("-").map(Number));

/**
 * @param {[number, number]} range1
 * @param {[number, number]} range2
 * @returns {boolean}
 */
const fullyContains = ([x1, x2], [y1, y2]) => x1 <= y1 && x2 >= y2;
assert.ok(fullyContains([2, 8], [3, 7]));
assert.ok(!fullyContains([2, 8], [3, 9]));

/**
 * @param {string} file
 * @returns {Promise<number>}
 */
async function mainA(file) {
  let result = 0;
  for await (const line of readline.createInterface({ input: createReadStream(file) })) {
    const [range1, range2] = parseLine(line);
    if (fullyContains(range1, range2) || fullyContains(range2, range1)) result += 1;
  }
  return result;
}

/**
 * @param {[number, number]} range
 * @returns {number[]}
 */
const expandRange = ([from, to]) => {
  let results = [];
  for (let index = from; index <= to; index++) {
    results.push(index);
  }
  return results;
};
assert.deepEqual(expandRange([0, 3]), [0, 1, 2, 3]);

/**
 * @param {[number, number]} range1
 * @param {[number, number]} range2
 * @returns {boolean}
 */
const isOverlap = (range1, range2) => {
  const fullRange2 = expandRange(range2);
  return expandRange(range1).some((i) => fullRange2.includes(i));
};

/**
 * @param {string} file
 * @returns {Promise<number>}
 */
async function mainB(file) {
  let result = 0;
  for await (const line of readline.createInterface({ input: createReadStream(file) })) {
    const [range1, range2] = parseLine(line);
    if (isOverlap(range1, range2)) result += 1;
  }
  return result;
}

async function main() {
  assert.strictEqual(await mainA("spec.txt"), 2);
  console.log("result A", await mainA("input.txt"));

  assert.strictEqual(await mainB("spec.txt"), 4);
  console.log("result B", await mainB("input.txt"));
}

main().catch(console.error);
