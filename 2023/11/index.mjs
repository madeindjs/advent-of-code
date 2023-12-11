import assert from "node:assert";
import { readFileSync } from "node:fs";

/**
 * @typedef {[number, number]} Point
 * @param {string} file
 * @returns {Generator<Point, void, unknown>}
 */
function* parseFile(file, expansion = 1) {
  const map = readFileSync(file, { encoding: "utf-8" })
    .split("\n")
    .map((line) => line.split("").map((a) => a === "#"));

  function* getXEmptyList() {
    for (let x = 0; x < map.length; x++) {
      if (map[x].every((r) => !r)) yield x;
    }
  }

  function* getYEmptyList() {
    for (let y = 0; y < map[0].length; y++) {
      if (map.every((r) => !r[y])) yield y;
    }
  }

  const xEmptyList = Array.from(getXEmptyList());
  const yEmptyList = Array.from(getYEmptyList());

  const expandsionFactor = expansion === 1 ? 1 : expansion - 1;

  for (let x = 0; x < map.length; x++) {
    const row = map[x];
    for (let y = 0; y < row.length; y++) {
      if (!row[y]) continue;

      const xOffset = xEmptyList.filter((xE) => xE < x).length * expandsionFactor;
      const yOffset = yEmptyList.filter((yE) => yE < y).length * expandsionFactor;

      yield [x + xOffset, y + yOffset];
    }
  }
}

/**
 * @template T
 * @param {Array<T>} arr
 * @returns {Generator<[T, T], void, unknown>}
 */
function* getCouples(arr) {
  for (let index = 0; index < arr.length; index++) {
    const element = arr[index];
    for (const next of arr.slice(index + 1)) yield [element, next];
  }
}

/**
 * @param {Point} a
 * @param {Point} b
 */
function getDistance(a, b) {
  return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
}

function main(file, expansion = 1) {
  const points = Array.from(parseFile(file, expansion));
  let total = 0;
  for (const couple of getCouples(points)) total += getDistance(...couple);
  return total;
}

const mainA = main("input.txt");
assert.strictEqual(mainA, 9418609);
console.log(mainA);

assert.strictEqual(main("spec.txt", 10), 1030);
assert.strictEqual(main("spec.txt", 100), 8410);
const mainB = main("input.txt", 1_000_000);
assert.strictEqual(mainB, 593821230983);
console.log(mainB);
