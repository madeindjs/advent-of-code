import { readFileSync } from "fs";
import assert from "node:assert";

/**
 * @typedef {number[][]} Map
 * @typedef {[number, number]} Point
 * @typedef {(point: Point) => Point} Move
 */

/**
 * @param {string} file
 * @return {Map}
 */
const loadMap = (file) =>
  readFileSync(file)
    .toString("utf-8")
    .split("\n")
    .map((line) => line.split("").map(Number));

/** @type {Move[]} */
const directions = [
  ([px, py]) => [px - 1, py],
  ([px, py]) => [px + 1, py],
  ([px, py]) => [px, py - 1],
  ([px, py]) => [px, py + 1],
];

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
 */
function isInsideMap(map, [x, y]) {
  const maxX = map.length - 1;
  const maxY = map[0].length - 1;
  return x >= 0 && x <= maxX && y >= 0 && y <= maxY;
}

/**
 * @param {Map} map
 * @param {Point} point
 * @param {Move} move
 */
function* getPointsInDirection(map, point, move) {
  let currentPoint = move(point);

  while (isInsideMap(map, currentPoint)) {
    yield currentPoint;
    currentPoint = move(currentPoint);
  }
}

/**
 * @param {string} file
 */
function mainA(file) {
  const map = loadMap(file);

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
    const isVisibleFromColumn = (move) => {
      for (const [nX, nY] of getPointsInDirection(map, point, move)) {
        if (map[nX][nY] >= value) return false;
      }
      return true;
    };

    if (directions.some(isVisibleFromColumn)) count++;
  }

  return count;
}

/**
 * @param {Map} map
 * @param {Point} point
 * @return {number}
 */
function getScore(map, [x, y]) {
  const value = map[x][y];

  /**
   * @param {Move} move
   * @returns {number}
   */
  const getScoreInDirection = (move) => {
    let seen = 0;

    for (const [nx, ny] of getPointsInDirection(map, [x, y], move)) {
      seen++;
      if (map[nx][ny] >= value) return seen;
    }

    return seen;
  };

  const pointScores = directions.map(getScoreInDirection);

  return pointScores.reduce((acc, v) => acc * (v || 1), 1);
}
const testMap = loadMap("spec.txt");
assert.strictEqual(getScore(testMap, [1, 2]), 4);
assert.strictEqual(getScore(testMap, [3, 2]), 8);

/**
 * @param {string} file
 */
function mainB(file) {
  const map = loadMap(file);

  let bestScore = 0;

  for (const point of walk(map)) {
    const score = getScore(map, point);
    if (score > bestScore) bestScore = score;
  }

  return bestScore;
}

assert.strictEqual(mainA("spec.txt"), 21);

const partA = mainA("input.txt");
console.log("part A", partA);
assert.strictEqual(partA, 1711);

const partB = mainB("input.txt");
console.log("part B", partB);
assert.strictEqual(partB, 301392);
