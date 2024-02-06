import assert from "node:assert";
import { readFileSync } from "node:fs";
import { URL } from "node:url";

/** @type {Map<string, number>} */
const cache = new Map();

/**
 * @param {string} line
 * @param {number[]} counts
 * @returns {Set<string>}
 */
function getPossibleLines(line, counts, before = "", set = new Set()) {
  const wholeLine = `${before}${line}`;
  // console.log(`${before}|${line}`, counts);
  if (counts.length === 0 && !line.includes("?")) {
    if (!line.includes("#")) {
      set.add(wholeLine);
    }
    return set;
  }
  if (line.length === 0) {
    if (counts.length === 0) {
      set.add(wholeLine);
    }
    return set;
    // return counts.length === 0 ? 1 : 0;
  }

  // let linesCount = 0;
  let currentCount = 0;

  // const key = [line, counts].join("-");

  // loop char by char
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
        return set;
      }
    } else if (char === "?") {
      const next = line.slice(index + 1);

      // add next possibility for hash
      const hashes = "#".repeat(currentCount);
      getPossibleLines(`${hashes}#${next}`, counts, `${before}${line.slice(0, index - hashes.length)}`, set);

      // add next possibility for point
      if (currentCount) {
        if (currentCount === counts[0]) {
          getPossibleLines(`.${next}`, counts.slice(1), `${before}${line.slice(0, index)}`, set);
        } else {
          return set;
        }
      } else {
        getPossibleLines(`.${next}`, counts, `${before}${line.slice(0, index)}`, set);
      }

      return set;
    } else {
      throw Error();
    }
  }

  if (currentCount) {
    if (currentCount === counts[0]) {
      counts = counts.slice(1);
      currentCount = 0;
    } else {
      return set;
    }
  }

  if (counts.length === 0) {
    set.add(wholeLine);
  }

  return set;
}
assert.strictEqual(getPossibleLines(...parseLine("#.#.### 1,1,3")).size, 1);
assert.strictEqual(getPossibleLines(...parseLine("#.?.### 1,1,3")).size, 1);
assert.strictEqual(getPossibleLines(...parseLine("#.?.?### 1,1,4")).size, 1);
assert.strictEqual(getPossibleLines(...parseLine("#.??? 1,3")).size, 1);
assert.strictEqual(getPossibleLines(...parseLine("?? 1")).size, 2);
assert.strictEqual(getPossibleLines(...parseLine("??.?##. 1,3")).size, 2);
assert.strictEqual(getPossibleLines(...parseLine(".??..??...?##. 1,1,3")).size, 4);
assert.strictEqual(getPossibleLines(...parseLine("??? 2")).size, 2);
assert.strictEqual(getPossibleLines(...parseLine(".??? 2")).size, 2);
assert.strictEqual(getPossibleLines(...parseLine("???. 2")).size, 2);
assert.strictEqual(getPossibleLines(...parseLine(".??#?.???.# 3,1")).size, 2);

/**
 * @param {string} lineStr
 * @returns {[string, number[]]}
 */
function parseLine(lineStr) {
  const [line, countStr] = lineStr.split(" ");
  return [line, countStr.split(",").map(Number)];
}

// function count(gen) {
//   let total = 0;
//   for (const _ of gen) total++;
//   return total;
// }

// assert.strictEqual(count(getPossibleLines(...parseLine(".??..??...?##. 1,1,3"))), 4);

function parseFile(file) {
  return readFileSync(new URL(file, import.meta.url), { encoding: "utf-8" })
    .split("\n")
    .filter(Boolean)
    .map(parseLine);
}

/**
 * @param {string} file
 * @param {(line: string, counts: number[]) => Set<string>} getPossibilities
 */
function mainA(file, getPossibilities = getPossibleLines) {
  let total = 0;
  const lines = parseFile(file);
  let i = 0;
  for (const [line, counts] of lines) {
    const res = getPossibilities(line, counts);
    // console.log(i, res);
    i++;
    total += res.size;
  }
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
// assert.strictEqual(getPossibleLinesWithFold(...parseLine("???.### 1,1,3")), 1);
// assert.strictEqual(getPossibleLinesWithFold(...parseLine(".??..??...?##. 1,1,3")), 16384);
// assert.strictEqual(getPossibleLinesWithFold(...parseLine("??#??#???????? 1,5,1")), 16384);

function mainB(file) {
  return mainA(file, getPossibleLinesWithFold);
}

assert.strictEqual(mainA("spec.txt"), 21);
assert.strictEqual(mainA("input.txt"), 7025);
// assert.strictEqual(mainB("spec.txt"), 525152);
// assert.strictEqual(mainB("input.txt"), 7025);
