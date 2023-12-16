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

  while (stack.length > 0) {
    const current = stack.pop();
    if (current === undefined) throw Error();

    const index = current.indexOf("?");
    if (index === -1) {
      results.push(current);
    } else {
      stack.push(setCharAt(current, index, "#"), setCharAt(current, index, "."));
    }
  }

  return results.filter((line) =>
    isArrayDeepEqual(
      line
        .split(".")
        .filter(Boolean)
        .map((l) => l.length),
      counts
    )
  );
}
assert.strictEqual(count(getCombinaisons(...parseLine("#.#.### 1,1,3"))), 1);
assert.strictEqual(count(getCombinaisons(...parseLine(".??..??...?##. 1,1,3"))), 4);

// /**
//  * @param {string} scheme
//  * @param {number} count
//  */
// function* getCombinaisonsForScheme(scheme, count) {
//   for (let index = 0; index <= scheme.length - count; index++) {
//     const copy = scheme.replace(/\?/g, ".").split("");
//     for (let offset = 0; offset < count; offset++) {
//       copy[index + offset] = "#";
//     }
//     const newScheme = copy.join("");

//     if (isCombinaisonValid(newScheme, count)) yield newScheme;
//   }
// }
// assert.deepEqual(Array.from(getCombinaisonsForScheme("??", 1)), ["#.", ".#"]);
// assert.deepEqual(Array.from(getCombinaisonsForScheme("???", 1)), ["#..", ".#.", "..#"]);
// assert.deepEqual(Array.from(getCombinaisonsForScheme("???", 2)), ["##.", ".##"]);
// assert.deepEqual(Array.from(getCombinaisonsForScheme("?##", 3)), ["###"]);
// assert.deepEqual(Array.from(getCombinaisonsForScheme("??##", 3)), [".###"]);

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
  for (const _ of gen) {
    total++;
  }
  return total;
}

// assert.strictEqual(count(getCombinaisons(...parseLine("#.#.### 1,1,3"))), 1);
assert.strictEqual(count(getCombinaisons(...parseLine(".??..??...?##. 1,1,3"))), 4);

function parseFile(file) {
  return readFileSync(file, { encoding: "utf-8" }).split("\n").filter(Boolean).map(parseLine);
}

function mainA(file) {
  let total = 0;
  for (const [line, counts] of parseFile(file)) {
    const cmbs = getCombinaisons(line, counts);
    total += cmbs.length;
  }
  return total;
}

console.log(mainA("input.txt"));
