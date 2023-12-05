import assert from "node:assert";
import { readFileSync } from "node:fs";

function extractNubersFromStr(str) {
  return Array.from(str.matchAll(/ ?([0-9]+)/g)).map((match) => Number(match[1]));
}

/**
 *
 * @param {number} nb
 * @param {number} start
 * @param {number} range
 */
function isInRange(nb, start, range) {
  return nb >= start && nb < start + range;
}
assert.strictEqual(isInRange(51, 50, 2), true);

function applyTransform(nb, from, to, range) {
  if (!isInRange(nb, from, range)) return nb;
  const offset = to - from;
  return nb + offset;
}
/**
 *
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
  // let seeds = extractNubersFromStr(linesGroups.shift());

  const map = { seed: extractNubersFromStr(linesGroups.shift()) };
  console.log(map);

  for (const lineGroup of linesGroups) {
    const { from, to, trans } = parseInstruction(lineGroup);

    map[to] = (map[from] ?? []).map((s) => applyTransforms(s, trans));
    map[from] = [];

    // seeds = seeds.map((s) => applyTransforms(s, parseInstruction(lineGroup).trans));
    // for (const [from, to, range] of parseInstruction(lineGroup).trans) {
    //   seeds = seeds.map((s) => applyTransform(s, from, to, range));
    // }
    console.log(map);
  }
  return Math.min(...Object.values(map).flatMap((m) => m));
}

assert.strictEqual(mainA("./spec.txt"), 35);
console.log(mainA("./input.txt"));
