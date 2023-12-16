import assert from "node:assert";
import { readFileSync } from "node:fs";

/**
 * @param {Array} a
 * @param {Array} b
 */
function isArrayDeepEqual(a, b) {
  if (a.length !== b.length) return false;
  return a.join("-") === b.join("-");
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
 * @param {string} line
 * @param {number[]} counts
 */
function getCombinaisons(line, counts) {
  if (!line.includes("?")) return [line];

  const stack = [line];
  /** @type {string[]} */
  const results = [];

  const getCurrentCount = (sol) =>
    sol
      .split(".")
      .filter(Boolean)
      .map((l) => l.length);

  /**
   *
   * @param {string} sol
   */
  const isPossible = (sol) => {
    const c = getCurrentCount(sol.split("?")[0]);
    c.pop();
    return isArrayDeepEqual(c, counts.slice(0, c.length));
  };

  while (stack.length > 0) {
    const current = stack.pop();
    if (current === undefined) throw Error();

    const index = current.indexOf("?");
    if (index === -1) {
      results.push(current);
    } else {
      const sol1 = setCharAt(current, index, "#");
      if (isPossible(sol1)) stack.push(sol1);

      const sol2 = setCharAt(current, index, ".");
      if (isPossible(sol2)) stack.push(sol2);
    }
  }

  return results.filter((line) => isArrayDeepEqual(getCurrentCount(line), counts));
}
assert.strictEqual(count(getCombinaisons(...parseLine("#.#.### 1,1,3"))), 1);
assert.strictEqual(count(getCombinaisons(...parseLine(".??..??...?##. 1,1,3"))), 4);

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

assert.strictEqual(count(getCombinaisons(...parseLine(".??..??...?##. 1,1,3"))), 4);

function parseFile(file) {
  return readFileSync(file, { encoding: "utf-8" }).split("\n").filter(Boolean).map(parseLine);
}

/**
 * @param {string} line
 * @param {number[]} count
 * @returns {[string, number[]]}
 */
function expandLine(line, count) {
  return [line.repeat(5), new Array(5).fill(count).flatMap((r) => r)];
}

function mainA(file) {
  let total = 0;
  for (const [line, counts] of parseFile(file)) {
    const cmbs = getCombinaisons(line, counts);
    total += cmbs.length;
  }
  return total;
}

function mainB(file) {
  let total = 0;
  for (const [line, counts] of parseFile(file).map(([l, c]) => expandLine(l, c))) {
    console.log(".");
    const cmbs = getCombinaisons(line, counts);
    total += cmbs.length;
  }
  return total;
}

assert.strictEqual(mainA("input.txt"), 7025);
console.log(mainB("input.txt"));
