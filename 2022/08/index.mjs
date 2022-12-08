import { readFileSync } from "fs";
import assert from "node:assert";

/**
 * @typedef {number[][]} Map
 * @typedef {[number, number]} Point
 */

/**
 * @param {Map} map
 * @returns {Generator<Point, void, unknown>}
 */
function* walk(map) {
  for (let x = 0; x < map.length; x++) {
    const row = map[x];
    for (let y = 0; y < row.length; y++) {
      yield [x, y];
    }
  }
}

/**
 * @param {Map} map
 * @param {Point} point
 * @return {boolean}
 */
function isInsideMap(map, [x, y]) {
  const maxX = map.length - 1;
  const maxY = map[0].length - 1;
  return x >= 0 && x <= maxX && y >= 0 && y <= maxY;
}

/**
 * @param {Map} map
 * @param {Point} point
 * @param {(point: Point) => Point} move
 * @return {Point[]}
 */
function getPointsInDirection(map, point, move) {
  let currentPoint = move(point);

  let points = [];

  while (isInsideMap(map, currentPoint)) {
    points.push(currentPoint);
    currentPoint = move(currentPoint);
  }

  return points;
}

/**
 * @param {string} file
 */
function mainA(file) {
  const map = readFileSync(file)
    .toString("utf-8")
    .split("\n")
    .map((line) => line.split("").map(Number));

  console.log(map);

  const maxX = map.length - 1;
  const maxY = map[0].length - 1;

  let count = 0;

  for (const point of walk(map)) {
    const [x, y] = point;
    const value = map[x][y];

    if ([0, maxX].includes(x) || [0, maxY].includes(y)) {
      count++;
      continue;
    }
    const isVisibleFromColumn = (move) =>
      !getPointsInDirection(map, point, move).some(([nX, nY]) => map[nX][nY] >= value);

    if (
      isVisibleFromColumn(([px, py]) => [px - 1, py]) ||
      isVisibleFromColumn(([px, py]) => [px + 1, py]) ||
      isVisibleFromColumn(([px, py]) => [px, py - 1]) ||
      isVisibleFromColumn(([px, py]) => [px, py + 1])
    ) {
      count++;
    }
  }

  return count;
}

/**
 * @param {string} file
 */
function mainB(file) {
  const lines = readFileSync(file).toString("utf-8").split("\n");

  return 0;
}

assert.strictEqual(mainA("spec.txt"), 21);
const partA = mainA("input.txt");

console.log("part A", partA);
assert.strictEqual(partA, 1711);

// assert.strictEqual(mainB("spec.txt"), 24933642);
// const partB = mainB("input.txt");

// assert.strictEqual(partB, 2195372);
// console.log("part B", partB);
