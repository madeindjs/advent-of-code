import assert from "node:assert";
import { readFileSync } from "node:fs";

/**
 * @typedef {number[][]} Grid
 * @typedef {{x: number, y: number}} Point
 * @typedef {{x: number, y: number, direction: number, directionCount: number, distance: number, from?: Point}} Vector
 */

/**
 * @returns {Grid}
 */
function parseFile(file) {
  return readFileSync(file, { encoding: "utf-8" })
    .split("\n")
    .map((r) => r.split("").map(Number));
}

const DIRECTIONS = Object.freeze({ H: 1, V: 2 });

const MOVES = Object.freeze([
  [0, -1, DIRECTIONS.H],
  [1, 0, DIRECTIONS.V],
  [0, 1, DIRECTIONS.H],
  [-1, 0, DIRECTIONS.V],
]);

const colorize = (str) => `\x1b[36m${str}\x1b[0m`;

/**
 * @param {Grid} grid
 * @param {Point} start
 * @param {Point} end
 * @returns {number}
 */
function dijkstra(grid, start, end) {
  /** @type {Vector[]} */
  const queue = [
    { ...start, direction: DIRECTIONS.H, directionCount: 1, distance: 0, from: start },
    { ...start, direction: DIRECTIONS.V, directionCount: 1, distance: 0, from: start },
  ];

  /** @type {Map<string, {from?: Vector, distance: number}>} */
  const visited = new Map();

  /** @param {Vector} v */
  function getVectorKey(v) {
    return `${v.x},${v.y},${v.direction},${v.directionCount}`;
  }

  /** @returns {Vector} */
  function getNext() {
    let minDistance = Infinity;
    let minIndex = -1;

    for (let index = 0; index < queue.length; index++) {
      const v = queue[index];
      if (v.distance < minDistance) {
        minDistance = v.distance;
        minIndex = index;
      }
    }

    return queue.splice(minIndex, 1)?.[0];
  }

  function debug() {
    const clone = structuredClone(grid);
    for (const key of visited.keys()) {
      const [x, y] = key.split(",").map(Number);
      // @ts-ignore
      clone[x][y] = colorize(clone[x][y]);
    }
    console.log(clone.map((r) => r.join("")).join("\n"));
  }

  while (true) {
    const vector = getNext();
    if (!vector) throw new Error();
    // if (!vector) return best.get(`${end.x},${end.y}`) ?? Infinity;

    const vectorKey = getVectorKey(vector);
    if (visited.has(vectorKey)) continue;

    visited.set(vectorKey, { distance: vector.distance });

    const neighbors = MOVES.map(([tx, ty, td]) => ({
      x: vector.x + tx,
      y: vector.y + ty,
      direction: td,
      directionCount: vector.direction === td ? vector.directionCount + 1 : 1,
      distance: vector.distance + grid[vector.x + tx]?.[vector.y + ty],
      from: { x: vector.x, y: vector.y },
    }))
      .filter(({ directionCount }) => directionCount <= 3)
      .filter(({ x, y }) => !(x === vector.from?.x && y === vector.from?.y))
      .filter(({ x, y }) => grid[x]?.[y] !== undefined);

    for (const next of neighbors) {
      if (end.x === next.x && end.y === next.y) return next.distance;

      queue.push(next);
    }

    if (false) {
      console.log();
      debug();
    }
  }
}

function mainA(file) {
  const grid = parseFile(file);
  /** @type {Point} */
  const start = { x: 0, y: 0 };
  /** @type {Point} */
  const end = { x: grid.length - 1, y: grid[0].length - 1 };

  return dijkstra(grid, start, end);
}

assert.strictEqual(mainA("spec.txt"), 102);
console.log("test done");
const a = mainA("input.txt");
assert.strictEqual(a, 755);
