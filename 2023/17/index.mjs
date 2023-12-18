import assert from "node:assert";
import { readFileSync } from "node:fs";

/**
 * @typedef {number[][]} Grid
 * @typedef {{x: number, y: number}} Point
 * @typedef {{x: number, y: number, direction: number, directionCount: number}} Vector
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
 * @returns
 */
function dijkstra(grid, start, end) {
  /** @type {Vector[]} */
  const queue = [
    { ...start, direction: DIRECTIONS.H, directionCount: 1 },
    { ...start, direction: DIRECTIONS.V, directionCount: 1 },
  ];

  /** @type {Map<string, {from?: Vector, distance: number}>} */
  const visited = new Map();
  queue.forEach((p) => visited.set(JSON.stringify(p), { distance: 0 }));
  const result = [];

  function getNext() {
    let minDistance = -Infinity;
    let minKey = "";

    for (const [key, { distance }] of visited.entries()) {
      if (minDistance < distance) {
        minDistance = distance;
        minKey = key;
      }
    }

    return JSON.parse(minKey);
  }

  function debug() {
    const clone = structuredClone(grid);
    for (const key of visited.keys()) {
      const { x, y } = JSON.parse(key);
      // @ts-ignore
      clone[x][y] = colorize(clone[x][y]);
    }
    console.log(clone.map((r) => r.join("")).join("\n"));
  }

  while (true) {
    const vector = getNext();
    if (!vector) throw Error;

    const vectorKey = JSON.stringify(vector);

    const prevDistance = visited.get(vectorKey);
    if (prevDistance === undefined) throw Error;

    const neighbors = MOVES.map(([tx, ty, td]) => ({
      x: vector.x + tx,
      y: vector.y + ty,
      direction: td,
      directionCount: vector.direction === td ? vector.directionCount + 1 : 1,
      // distance: vector.distance + grid[vector.x + tx]?.[vector.y + ty],
    }))
      .filter(({ directionCount }) => directionCount <= 3)
      .filter(({ x, y }) => grid[x]?.[y] !== undefined);

    for (const next of neighbors) {
      const nextKey = JSON.stringify(next);
      if (visited.has(nextKey)) continue;

      const newDistance = prevDistance.distance + grid[next.x]?.[next.y];

      const existsingDistance = visited.get(nextKey)?.distance ?? Infinity;

      if (existsingDistance > newDistance) {
        visited.set(nextKey, { distance: newDistance, from: vector });
        // queue.push(next);

        if (end.x === next.x && end.y === next.y) return newDistance;
      } else {
        // console.log(next);
      }

      debug();
      console.log();
    }

    // if (!visited.has(vertex)) {
    //   visited.add(vertex);
    //   yield vertex;

    //   for (const neighbor of grid[vertex]) {
    //     queue.push(neighbor);
    //   }
    // }
  }

  return result;
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
