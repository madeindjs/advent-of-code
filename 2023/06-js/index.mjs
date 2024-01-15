import assert from "node:assert";
import { readFileSync } from "node:fs";

const extractNumbers = (str) => Array.from(str.matchAll(/ ?([0-9]+)/g)).map((match) => Number(match[1]));

function* parse(file) {
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

function parse2(file) {
  return readFileSync(file, { encoding: "utf-8" })
    .split("\n")
    .map(extractNumbers)
    .map((a) => Number(a.join("")));
}
assert.deepEqual(parse2("./spec.txt"), [71530, 940200]);

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

function* getBetterSolutions(timeToBeat, distance, from = 1) {
  for (let i = from; i < timeToBeat; i++) {
    const timeSpent = computeTime(i, distance);
    if (timeSpent < timeToBeat) yield i;
  }
}
assert.deepEqual(Array.from(getBetterSolutions(7, 9)), [2, 3, 4, 5]);

function countIterable(generator) {
  let i = 0;
  for (const _ of generator) {
    i++;
  }
  return i;
}

function mainA(file) {
  let total = 1;
  for (const [timeToBeat, distance] of parse(file)) {
    const betterSolutions = countIterable(getBetterSolutions(timeToBeat, distance));
    total *= betterSolutions;
  }
  return total;
}

assert.strictEqual(mainA("./spec.txt"), 288);
console.log(mainA("./input.txt"));

function mainB(file) {
  const [timeToBeat, distance] = parse2(file);
  return countIterable(getBetterSolutions(timeToBeat, distance));
}
assert.strictEqual(mainB("./spec.txt"), 71503);
console.log(mainB("./input.txt"));
