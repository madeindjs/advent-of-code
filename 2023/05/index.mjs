import assert from "node:assert";
import { readFileSync } from "node:fs";

function extractNubersFromStr(str) {
  return Array.from(str.matchAll(/ ?([0-9]+)/g)).map((match) => Number(match[1]));
}

/**
 * @param {number} nb
 * @param {number} start
 * @param {number} range
 */
function isInRange(nb, start, range) {
  return nb >= start && nb < start + range;
}
assert.strictEqual(isInRange(51, 50, 2), true);

function applyTransform(nb, from, to, range) {
  // if (!isInRange(nb, from, range)) return nb;
  const offset = to - from;
  return nb + offset;
}
/**
 * @param {number} nb
 * @param {number[][]} trans
 * @returns
 */
function applyTransforms(nb, trans) {
  for (const [to, from, range] of trans) {
    if (isInRange(nb, from, range)) {
      return applyTransform(nb, from, to, range);
    }
  }
  return nb;
}

/** @param {string} lineGroup */
function parseInstruction(lineGroup) {
  const [titleStr, ...transformationLines] = lineGroup.split("\n");
  const [from, to] = titleStr.replace(" map:", "").split("-to-");

  return { from, to, trans: transformationLines.map(extractNubersFromStr) };
}

function mainA(file) {
  const linesGroups = readFileSync(file, { encoding: "utf-8" }).split("\n\n");

  const map = { seed: extractNubersFromStr(linesGroups.shift()) };

  for (const lineGroup of linesGroups) {
    const { from, to, trans } = parseInstruction(lineGroup);

    map[to] = (map[from] ?? []).map((s) => applyTransforms(s, trans));
    map[from] = [];
  }
  return Math.min(...Object.values(map).flatMap((m) => m));
}

/**
 * @param {number[]} numbers
 * @returns {Generator<number, void, unknown>}
 */
function* createRanges(numbers) {
  for (let i = 0; i < numbers.length; i += 2) {
    const from = numbers[i];
    const to = numbers[i + 1] + numbers[i] - 1;

    for (let i = from; i <= to; i++) {
      yield i;
    }
  }
}
assert.deepEqual(Array.from(createRanges([0, 2, 6, 2])), [0, 1, 6, 7]);

function mainB(file) {
  const linesGroups = readFileSync(file, { encoding: "utf-8" }).split("\n\n");
  const seedsNbs = extractNubersFromStr(linesGroups.shift());
  const total = seedsNbs.filter((_, i) => i % 2 === 1).reduce((acc, v) => acc + v, 0);
  const seedsGenerator = createRanges(seedsNbs);
  const instructions = linesGroups.map(parseInstruction);

  let min = Infinity;

  let i = 0;

  for (const start of seedsGenerator) {
    i++;
    let type = "seed";
    let qty = start;

    if (i % 1000000 === 0) {
      console.log(`Progress ${Math.round((i / total) * 100)}% (${Math.round(i / 100)}K/${Math.round(total / 100)}K)`);
    }

    for (const { from, to, trans } of instructions) {
      if (from !== type) continue;
      type = to;
      qty = applyTransforms(qty, trans);
    }
    if (qty < min && type === "location") min = qty;
  }

  return min;
}

assert.strictEqual(mainB("./spec.txt"), 46);
console.log(mainB("./input.txt"));
