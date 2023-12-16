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

function getCurrentCount(sol) {
  return sol
    .split(".")
    .filter(Boolean)
    .map((l) => l.length);
}

/**
 * @param {string[]} combs
 * @param {number[]} counts
 */
function filterCombinaisons(combs, counts) {
  return combs.filter((line) => isArrayDeepEqual(getCurrentCount(line), counts));
}

function isPossible(sol, counts) {
  const c = getCurrentCount(sol.split("?")[0]);
  c.pop();
  return isArrayDeepEqual(c, counts.slice(0, c.length));
}

const getPossibleLinesCache = new Map();

/**
 * @param {string} line
 * @param {number[]} counts
 */
function getPossibleLines(line, counts, check = true) {
  if (!line.includes("?")) return [line];

  const cache = getPossibleLinesCache.get(line);

  if (cache) {
    return check ? filterCombinaisons(cache, counts) : cache;
  }

  const stack = [line];
  /** @type {string[]} */
  const results = [];

  while (stack.length > 0) {
    const current = stack.pop();
    if (current === undefined) throw Error();

    const index = current.indexOf("?");
    if (index === -1) {
      results.push(current);
    } else {
      const sol1 = setCharAt(current, index, "#");
      const sol2 = setCharAt(current, index, ".");

      if (check) {
        if (isPossible(sol1, counts)) stack.push(sol1);
        if (isPossible(sol2, counts)) stack.push(sol2);
      } else {
        stack.push(sol1, sol2);
      }
    }
  }

  return check ? filterCombinaisons(results, counts) : results;
}
// {
//   const [line, count] =
// }
// assert.strictEqual(count(getCombinaisons(...parseLine("#.#.### 1,1,3"))), 1);
// assert.strictEqual(count(getCombinaisons(...parseLine(".??..??...?##. 1,1,3"))), 4);

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
  return readFileSync(file, { encoding: "utf-8" }).split("\n").filter(Boolean).map(parseLine);
}

function mainA(file) {
  let total = 0;
  for (const [line, counts] of parseFile(file)) {
    const cmbs = getPossibleLines(line, counts);
    total += cmbs.length;
  }
  return total;
}

/**
 * @template T
 * @param {T[]} lines
 * @returns {Generator<string, void, unknown>}
 */
function* getAllCombinaisons(lines) {
  for (let a = 0; a < lines.length; a++) {
    for (let b = 0; b < lines.length; b++) {
      for (let c = 0; c < lines.length; c++) {
        for (let d = 0; d < lines.length; d++) {
          for (let e = 0; e < lines.length; e++) {
            yield `${lines[a]}${lines[b]}${lines[c]}${lines[d]}${lines[e]}`;
          }
        }
      }
    }
  }
}

// assert.deepEqual(Array.from(getAllCombinaisons([1, 2, 3])), [1, 1, 1], [1, 2, 1]);

function mainB(file) {
  let total = 0;
  for (const [line, counts] of parseFile(file)) {
    const combinaison = getPossibleLines(line, counts, false);
    const count5 = new Array(5).fill(count).flatMap((r) => r);

    for (const line of getAllCombinaisons(combinaison)) {
      // const element = array[a];
      if (isArrayDeepEqual(getCurrentCount(line), count5)) total++;
    }
    // total += cmbs.length;
    console.log(".");
  }
  return total;
}

assert.strictEqual(mainA("input.txt"), 7025);
console.log(mainB("input.txt"));
