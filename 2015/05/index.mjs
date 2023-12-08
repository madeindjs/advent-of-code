import assert from "node:assert";
import { createReadStream } from "node:fs";
import readline from "readline";

const blacklist = ["ab", "cd", "pq", "xy"];
const vowels = new Set("aeiou".split(""));

/**
 * @param {string} line
 */
function isNiceV1(line) {
  let vowelsCount = 0;
  let consecutiveCount = 0;
  let previousChar = "";

  for (const char of line.split("")) {
    if (blacklist.includes(`${previousChar}${char}`)) return false;
    if (vowels.has(char)) vowelsCount++;
    if (previousChar === char) consecutiveCount++;

    previousChar = char;
  }
  return Boolean(consecutiveCount && vowelsCount > 2);
}
assert.ok(isNiceV1("ugknbfddgicrmopn"));
assert.ok(isNiceV1("aaa"));
assert.strictEqual(isNiceV1("jchzalrnumimnmhp"), false);
assert.strictEqual(isNiceV1("haegwjzuvuyypxyu"), false);
assert.strictEqual(isNiceV1("dvszwmarrgswjxmb"), false);

/**
 * @param {string} file
 */
async function computeEachLine(file, callback) {
  let total = 0;

  for await (const line of readline.createInterface({ input: createReadStream(file) })) {
    if (callback(line)) total++;
  }

  return total;
}

const mainA = (file) => computeEachLine(file, isNiceV1);

assert.strictEqual(await mainA("./input.txt"), 255);

/**
 *
 * @param {string} line
 */
function isNiceV2(line) {
  let hasPair = false;
  let hasXyx = false;

  for (let i = 0; i < line.length - 1; i++) {
    const char1 = line[i];
    const char2 = line[i + 1];
    const char3 = line[i + 2];

    if (line.slice(i + 2).includes(`${char1}${char2}`)) hasPair = true;
    if (char1 === char3) hasXyx = true;

    if (hasPair && hasXyx) return true;
  }

  return false;
}
assert.ok(isNiceV2("qjhvhtzxzqqjkmpb"));
assert.ok(isNiceV2("xxyxx"));
assert.strictEqual(isNiceV2("uurcxstgmygtbstg"), false);
assert.strictEqual(isNiceV2("ieodomkazucvgmuy"), false);

const mainB = (file) => computeEachLine(file, isNiceV2);

console.log(await mainB("./input.txt"));
