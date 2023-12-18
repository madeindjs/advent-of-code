import assert from "node:assert";
import { readFileSync } from "node:fs";

/**
 * @typedef {number[][]} Grid
 * @typedef {{x: number, y: number}} Point
 * @typedef {{x: number, y: number, direction: number, directionCount: number, distance: number, from?: Vector}} Vector
 */

/** @returns {Grid} */
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

class VectorHeap {
  /**
   * @typedef {{value?: Vector, left?: VectorHeapNode, right?: VectorHeapNode}} VectorHeapNode
   * @type {VectorHeapNode}
   */
  #tree = {};

  /**
   * @param {Vector} vector
   */
  add(vector) {
    let leaf = this.#tree;
    while (true) {
      if (leaf.value === undefined) return (leaf.value = vector);

      if (leaf.left?.value === undefined) return (leaf.left = { value: vector });
      if (leaf.right?.value === undefined) return (leaf.right = { value: vector });

      leaf = leaf.left.value.distance < vector.distance ? leaf.right : leaf.left;
    }
  }

  shift() {
    let leaf = this.#tree;

    while (true) {
      if (leaf.left === undefined) {
        const value = leaf.value;
        leaf.value = undefined;
        return value;
      }

      leaf = leaf.left;
    }
  }
}

/**
 * @param {Grid} grid
 * @param {Point} start
 * @param {Point} end
 * @param {{max: number, min: number}} directionConstraints
 * @returns {number}
 */
function dijkstra(grid, start, end, directionConstraints) {
  const heap = new VectorHeap();
  heap.add({ ...start, direction: DIRECTIONS.H, directionCount: 1, distance: 0 });
  heap.add({ ...start, direction: DIRECTIONS.V, directionCount: 1, distance: 0 });

  /** @type {Map<string, {from?: Vector, distance: number}>} */
  const visited = new Map();

  /** @param {Vector} v */
  const getVectorKey = (v) => `${v.x},${v.y},${v.direction},${v.directionCount},${v.from?.x},${v.from?.y}`;

  while (true) {
    const vector = heap.shift();
    if (!vector) throw new Error();

    const vectorKey = getVectorKey(vector);
    if (visited.has(vectorKey)) continue;

    visited.set(vectorKey, { distance: vector.distance, from: vector.from });

    const neighbors = MOVES.map(([tx, ty, td]) => ({
      x: vector.x + tx,
      y: vector.y + ty,
      direction: td,
      directionCount: vector.direction === td ? vector.directionCount + 1 : 1,
      distance: vector.distance + grid[vector.x + tx]?.[vector.y + ty],
      from: vector,
    }))
      .filter((v) => v.direction === vector.direction || vector.directionCount >= directionConstraints.min)
      .filter(({ directionCount }) => directionCount <= directionConstraints.max)
      .filter(({ x, y }) => !(x === vector.from?.x && y === vector.from?.y))
      .filter(({ x, y }) => grid[x]?.[y] !== undefined);

    for (const next of neighbors) {
      if (end.x === next.x && end.y === next.y) {
        if (next.directionCount >= directionConstraints.min) return next.distance;
      } else {
        heap.add(next);
      }
    }
  }
}

/**
 *
 * @param {string} file
 * @param {{max: number, min: number}} directionConstraints
 * @returns
 */
function main(file, directionConstraints) {
  const grid = parseFile(file);
  /** @type {Point} */
  const start = { x: 0, y: 0 };
  /** @type {Point} */
  const end = { x: grid.length - 1, y: grid[0].length - 1 };

  return dijkstra(grid, start, end, directionConstraints);
}

const mainA = (file) => main(file, { min: 0, max: 3 });
const mainB = (file) => main(file, { min: 4, max: 10 });

assert.strictEqual(mainA("spec.txt"), 102);
const a = mainA("input.txt");
assert.strictEqual(a, 755);
console.log("part A", a);

assert.strictEqual(mainB("spec.txt"), 94);
assert.strictEqual(mainB("spec2.txt"), 71);
const b = mainB("input.txt");
assert.strictEqual(b, 881);
console.log("part B", b);
