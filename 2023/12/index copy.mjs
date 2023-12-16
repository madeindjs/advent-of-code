import assert from "node:assert";

/**
 *
 * @param {Array} a
 * @param {Array} b
 */
function isArrayDeepEqual(a, b) {
  return a.join("-") === b.join("-");
}

/**
 * @param {string} line
 * @param {number[]} counts
 */
function* getCombinaisons(line, counts) {
  if (!line.includes("?")) return yield line;

  let offsets = counts.map(() => 0);

  // while (true) {
  const chars = line.split("");
  const countsCopy = [...counts];

  const current = countsCopy.shift();
  if (current === undefined) return;

  for (let i = 0; i < chars.length; i++) {
    const canInsert = chars[i - 1] === "#";
    line.slice(i, i + current);

    get;

    const element = chars[i];
  }
  // }

  // /** @param {string} str */
  // const matches = Array.from(line.matchAll(/(#|\?)+/g));

  // for (const count of matches) {
  // }
}
// assert.strictEqual(count(getCombinaisons(...parseLine("#.#.### 1,1,3"))), 1);
assert.strictEqual(count(getCombinaisons(...parseLine(".??..??...?##. 1,1,3"))), 4);

/**
 * @param {string} combinaison
 * @param {number} count
 */
function isCombinaisonValid(combinaison, count) {
  return combinaison
    .split(".")
    .filter(Boolean)
    .some((a) => a.length === count);
}

/**
 * @param {string} scheme
 * @param {number} count
 */
function* getCombinaisonsForScheme(scheme, count) {
  for (let index = 0; index <= scheme.length - count; index++) {
    const copy = scheme.replace(/\?/g, ".").split("");
    for (let offset = 0; offset < count; offset++) {
      copy[index + offset] = "#";
    }
    const newScheme = copy.join("");

    if (isCombinaisonValid(newScheme, count)) yield newScheme;
  }
}
assert.deepEqual(Array.from(getCombinaisonsForScheme("??", 1)), ["#.", ".#"]);
assert.deepEqual(Array.from(getCombinaisonsForScheme("???", 1)), ["#..", ".#.", "..#"]);
assert.deepEqual(Array.from(getCombinaisonsForScheme("???", 2)), ["##.", ".##"]);
assert.deepEqual(Array.from(getCombinaisonsForScheme("?##", 3)), ["###"]);
assert.deepEqual(Array.from(getCombinaisonsForScheme("??##", 3)), [".###"]);

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
