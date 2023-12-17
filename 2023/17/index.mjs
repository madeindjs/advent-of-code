import { readFileSync } from "node:fs";

/**
 * @typedef {number[][]} Grid
 * @typedef {[x: number, y: number]} Point
 * @typedef {[x: number, y: number, direction: number, directionCount: number, distance: number]} Vector
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

function* bfs(grid) {
  /** @type {Vector[]} */
  const queue = [
    [0, 0, DIRECTIONS.H, 1, 0],
    [0, 0, DIRECTIONS.V, 1, 0],
  ];
  const visited = new Set();
  const result = [];

  while (queue.length) {
    const vector = queue.shift();
    if (!vector) throw Error;
    const [x, y, direction, count] = vector;
    const vectorKey = vector.toString();

    if (visited.has(vectorKey)) continue;

    visited.add(vectorKey);

    const neighbors = MOVES.map(([tx, ty, td]) => [x + tx, y + ty, td, direction === td ? count + 1 : 1])
      .filter(([x, y, d, c]) => c <= 3)
      .filter(([x, y]) => grid[x]?.[y] !== undefined);

    for (const next of neighbors) {
      console.log(next);
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
  const start = [0, 0];
  /** @type {Point} */
  const end = [grid.length - 1, grid[0].length - 1];

  for (const path of bfs(grid, start, end)) {
    console.log(path);
  }
}

mainA("spec.txt");
