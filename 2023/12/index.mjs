import assert from "node:assert";
import { readFileSync } from "node:fs";
import { URL } from "node:url";

/**
 * @param {Array} a
 * @param {Array} b
 */
function isArrayDeepEqual(a, b) {
  if (a.length !== b.length) return false;

  for (let index = 0; index < a.length; index++) {
    if (a[index] !== b[index]) return false;
  }

  return true;
}

/**
 * @param {string} str
 * @param {number} index
 * @param {string} chr
 */
function setCharAt(str, index, chr) {
  if (index > str.length - 1) return str;
  return str.substring(0, index) + chr + str.substring(index + 1);
}

/**
 * @param {string} sol
 * @param {number[]} counts
 */
function isPossible(sol, counts) {
  let currentCount = 0;
  let previous = undefined;

  const groups = [];

  for (const char of sol) {
    if (char === ".") {
      if (previous === "#") {
        if (counts[groups.length] !== currentCount) return false;
        groups.push(currentCount);
      }

      currentCount = 0;
    } else if (char === "#") {
      currentCount++;
    } else {
      return groups.length <= counts.length;
    }
    previous = char;
  }

  if (currentCount) {
    groups.push(currentCount);
  }

  return isArrayDeepEqual(groups, counts);
}
// assert.ok(isPossible("##.?.##", [2, 2]));
// assert.ok(isPossible("##?.??", [3, 0]));
// assert.ok(isPossible("##??.#", [4, 1]));
// assert.ok(isPossible("#.?.###", [1, 1, 3]));
// assert.strictEqual(isPossible("####.##.?.#", [4, 1]), false);
// assert.strictEqual(isPossible("####.##", [4, 1]), false);
// assert.ok(isPossible("####.##", [4, 2]));
// assert.strictEqual(isPossible(".#....#...###.", [1, 1, 3]), true);
// assert.strictEqual(isPossible(".#....#...##", [1, 1, 3]), false);
// assert.strictEqual(isPossible(".#....#...", [1, 1, 3]), false);
// assert.strictEqual(isPossible(".#....#...###", [1, 1, 3]), true);

/**
 * @param {string} line
 * @param {number[]} counts
 */
function* getPossibleLines(line, counts) {
  const stack = [line];

  while (stack.length > 0) {
    const current = stack.pop();
    if (current === undefined) throw Error();

    // console.log(stack.length);

    const index = current.indexOf("?");
    if (index === -1) {
      if (isPossible(current, counts)) yield current;
    } else {
      const sol1 = setCharAt(current, index, "#");
      const sol2 = setCharAt(current, index, ".");

      if (isPossible(sol1, counts)) stack.push(sol1);
      if (isPossible(sol2, counts)) stack.push(sol2);
    }
  }
}
// assert.strictEqual(count(getPossibleLines(...parseLine("#.#.### 1,1,3"))), 1);
// assert.strictEqual(count(getPossibleLines(...parseLine("#.?.### 1,1,3"))), 1);
assert.strictEqual(count(getPossibleLines(...parseLine(".??..??...?##. 1,1,3"))), 4);

/**
 * @param {string} lineStr
 * @returns {[string, number[]]}
 */
function parseLine(lineStr) {
  const [line, countStr] = lineStr.split(" ");
  return [line, countStr.split(",").map(Number)];
}

function count(gen) {
  let total = 0;
  for (const _ of gen) total++;
  return total;
}

assert.strictEqual(count(getPossibleLines(...parseLine(".??..??...?##. 1,1,3"))), 4);

function parseFile(file) {
  return readFileSync(new URL(file, import.meta.url), { encoding: "utf-8" })
    .split("\n")
    .filter(Boolean)
    .map(parseLine);
}

/**
 * @param {string} file
 * @param {(line: string, counts: number[]) => Generator<string>} getPossibilities
 */
function mainA(file, getPossibilities = getPossibleLines) {
  let total = 0;
  const lines = parseFile(file);
  let i = 0;
  for (const [line, counts] of lines) {
    console.log(`${i}/${lines.length}`);
    for (const _ of getPossibilities(line, counts)) total++;
    i++;
  }
  return total;
}

/**
 * @param {string} line
 * @param {number[]} counts
 */
function getPossibleLinesWithFold(line, counts) {
  const arr5 = new Array(5).fill("");
  line = arr5.map(() => line).join("?");
  counts = arr5.flatMap(() => counts);

  return getPossibleLines(line, counts);
}
assert.strictEqual(count(getPossibleLinesWithFold(...parseLine("???.### 1,1,3"))), 1);
assert.strictEqual(count(getPossibleLinesWithFold(...parseLine(".??..??...?##. 1,1,3"))), 16384);
assert.strictEqual(count(getPossibleLinesWithFold(...parseLine("??#??#???????? 1,5,1"))), 16384);

function mainB(file) {
  return mainA(file, getPossibleLinesWithFold);
}

// assert.strictEqual(mainA("spec.txt"), 21);
// assert.strictEqual(mainA("input.txt"), 7025);
// assert.strictEqual(mainB("spec.txt"), 525152);
// assert.strictEqual(mainB("input.txt"), 7025);
