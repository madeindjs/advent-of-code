import assert from "node:assert";
import { readFileSync } from "node:fs";

function* parse(file) {
  const extractNumbers = (str) => Array.from(str.matchAll(/ ?([0-9]+)/g)).map((match) => Number(match[1]));
  const [times, distances] = readFileSync(file, { encoding: "utf-8" }).split("\n").map(extractNumbers);

  for (let i = 0; i < times.length; i++) {
    yield [times[i], distances[i]];
  }
}
assert.deepEqual(Array.from(parse("./spec.txt")), [
  [7, 9],
  [15, 40],
  [30, 200],
]);

/**
 * @param {number} distance
 * @param {number} holdMs
 */
function computeTime(holdMs, distance) {
  return holdMs + distance / holdMs;
}
assert.strictEqual(computeTime(1, 10), 11);
assert.strictEqual(computeTime(5, 10), 7);
assert.strictEqual(computeTime(4, 10), 6.5);

function* getBetterSolutions(timeToBeat, distance) {
  let possibilities = new Array(timeToBeat).fill(0).map((_, i) => i);

  for (const holdMs of possibilities) {
    const timeSpent = computeTime(holdMs, distance);
    if (timeSpent < timeToBeat) yield holdMs;
  }
}
assert.deepEqual(Array.from(getBetterSolutions(7, 9)), [2, 3, 4, 5]);

function mainA(file) {
  let total = 1;
  for (const [timeToBeat, distance] of parse(file)) {
    const betterSolutions = Array.from(getBetterSolutions(timeToBeat, distance)).length;
    total *= betterSolutions;
  }
  return total;
}
assert.strictEqual(mainA("./spec.txt"), 288);
console.log(mainA("./input.txt"));
