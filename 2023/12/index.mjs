import assert from "node:assert";
import { readFileSync } from "node:fs";
import { URL } from "node:url";

/** @type {Map<string, number>} */
const cache = new Map();

/**
 * @param {string} line
 * @param {number[]} counts
 * @returns {number}
 */
function getPossibleLines(line, counts, before = "") {
  const key = [line, counts].join("-");

  const cached = cache.get(key);
  if (cached !== undefined) return cached;

  if (counts.length === 0 && !line.includes("?")) {
    return line.includes("#") ? 0 : 1;
  }
  if (line.length === 0) {
    return counts.length === 0 ? 1 : 0;
  }

  let linesCount = 0;
  let currentCount = 0;

  for (let index = 0; index < line.length; index++) {
    const char = line[index];

    if (char === "#") {
      currentCount++;
    } else if (char === ".") {
      //  if didn't encounter
      if (!currentCount) continue;

      if (currentCount === counts[0]) {
        counts = counts.slice(1);
        currentCount = 0;
      } else {
        cache.set(key, linesCount);
        return linesCount;
      }
    } else if (char === "?") {
      const next = line.slice(index + 1);

      // add next possibility for hash
      const hashes = "#".repeat(currentCount);
      linesCount += getPossibleLines(`${hashes}#${next}`, counts, `${before}${line.slice(0, index - hashes.length)}`);

      // add next possibility for point
      if (currentCount) {
        if (currentCount === counts[0]) {
          linesCount += getPossibleLines(`.${next}`, counts.slice(1), `${before}${line.slice(0, index)}`);
        } else {
          cache.set(key, linesCount);
          return linesCount; // 0 ?
        }
      } else {
        linesCount += getPossibleLines(`.${next}`, counts, `${before}${line.slice(0, index)}`);
      }

      cache.set(key, linesCount);
      return linesCount;
    } else {
      throw Error();
    }
  }

  if (currentCount) {
    if (currentCount === counts[0]) {
      counts = counts.slice(1);
      currentCount = 0;
    } else {
      cache.set(key, 0);
      return 0;
    }
  }

  if (counts.length === 0) linesCount++;

  cache.set(key, linesCount);

  return linesCount;
}
assert.strictEqual(getPossibleLines(...parseLine("#.#.### 1,1,3")), 1);
assert.strictEqual(getPossibleLines(...parseLine("#.?.### 1,1,3")), 1);
assert.strictEqual(getPossibleLines(...parseLine("#.?.?### 1,1,4")), 1);
assert.strictEqual(getPossibleLines(...parseLine("#.??? 1,3")), 1);
assert.strictEqual(getPossibleLines(...parseLine("?? 1")), 2);
assert.strictEqual(getPossibleLines(...parseLine("??.?##. 1,3")), 2);
assert.strictEqual(getPossibleLines(...parseLine(".??..??...?##. 1,1,3")), 4);
assert.strictEqual(getPossibleLines(...parseLine("??? 2")), 2);
assert.strictEqual(getPossibleLines(...parseLine(".??#?.???.# 3,1")), 2);

/**
 * @param {string} lineStr
 * @returns {[string, number[]]}
 */
function parseLine(lineStr) {
  const [line, countStr] = lineStr.split(" ");
  return [line, countStr.split(",").map(Number)];
}

function parseFile(file) {
  return readFileSync(new URL(file, import.meta.url), { encoding: "utf-8" })
    .split("\n")
    .filter(Boolean)
    .map(parseLine);
}

/**
 * @param {string} file
 * @param {(line: string, counts: number[]) => number} getPossibilities
 */
function mainA(file, getPossibilities = getPossibleLines) {
  let total = 0;
  const lines = parseFile(file);
  for (const [line, counts] of lines) total += getPossibilities(line, counts);
  return total;
}

/**
 * @param {string} line
 * @param {number[]} counts
 */
function getPossibleLinesWithFold(line, counts) {
  const arr5 = new Array(5).fill("");
  return getPossibleLines(
    arr5.map(() => line).join("?"),
    arr5.flatMap(() => counts)
  );
}
assert.strictEqual(getPossibleLinesWithFold(...parseLine("???.### 1,1,3")), 1);
assert.strictEqual(getPossibleLinesWithFold(...parseLine(".??..??...?##. 1,1,3")), 16384);
assert.strictEqual(getPossibleLinesWithFold(...parseLine("????.#...#... 4,1,1")), 16);
assert.strictEqual(getPossibleLinesWithFold(...parseLine("????.######..#####. 1,6,5")), 2500);
assert.strictEqual(getPossibleLinesWithFold(...parseLine("?###???????? 3,2,1")), 506250);

function mainB(file) {
  return mainA(file, getPossibleLinesWithFold);
}

assert.strictEqual(mainA("spec.txt"), 21);
assert.strictEqual(mainA("input.txt"), 7025);
assert.strictEqual(mainB("spec.txt"), 525152);
assert.strictEqual(mainB("input.txt"), 11461095383315);
