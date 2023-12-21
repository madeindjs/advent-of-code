import { strictEqual } from "node:assert";
import { readFileSync } from "node:fs";
import { URL } from "node:url";

/**
 * @typedef {string[][]} Grid
 * @typedef {[x: number, y: number]} Point
 * @typedef {Map<number, Point>} Road
 */

function parseFile(file) {
  return readFileSync(new URL(file, import.meta.url), { encoding: "utf-8" })
    .split("\n")
    .map((raw) => raw.split(""));
}

/**
 * @param {Grid} grid
 * @param {string} value
 * @returns {Generator<Point, void, unknown>}
 */
function* findPointByValue(grid, value) {
  for (let x = 0; x < grid.length; x++) {
    const row = grid[x];
    for (let y = 0; y < row.length; y++) {
      if (row[y] === value) yield [x, y];
    }
  }
}

/** @type {Point[]} */
const MOVES = [
  [0, 1],
  [0, -1],
  [-1, 0],
  [1, 0],
];

const colorize = (str) => `\x1b[36m${str}\x1b[0m`;

class Tree {
  /**
   * @param {number} level
   * @param {Point} point
   * @param {Tree[]} children
   * @param {number} levelMax
   */
  constructor(level, point, children = [], levelMax) {
    this.level = level;
    this.point = point;
    this.children = children;
    this.visited = false;
    this.levelMax = levelMax;
  }

  addPoint(point) {
    if (this.level > this.levelMax) return;
    this.children.push(new Tree(this.level + 1, point, [], this.levelMax));
  }

  /**
   * @returns {Generator<Tree, void, unknown>}
   */
  *getAllNodes() {
    yield this;
    for (const child of this.children) {
      yield* child.getAllNodes();
    }
  }

  /**
   * @param {number} level
   */
  *getLevel(level) {
    for (const node of this.getAllNodes()) {
      if (node.level === level) yield node;
    }
  }

  /**
   * @returns {Generator<Tree, void, unknown>}
   */
  *getUnivisited() {
    if (!this.visited) yield this;
    for (const child of this.children) yield* child.getUnivisited();
  }

  getFirstUnvisited() {
    const gen = this.getUnivisited();
    return gen.next().value || undefined;
  }
}

/**
 *
 * @param {Grid} grid
 * @param {Point} param1
 * @return {Point[]}
 */
function getNeighbors(grid, [x, y]) {
  // @ts-ignore
  return MOVES.map(([tx, ty]) => [x + tx, y + ty]).filter(([x, y]) => grid[x]?.[y] === "." || grid[x]?.[y] === "S");
}

function mainA(file, level) {
  const grid = parseFile(file);
  const start = Array.from(findPointByValue(grid, "S"))[0];
  if (!start) throw `cannot find starting point`;

  const tree = new Tree(1, start, [], level);

  let node = tree.getFirstUnvisited();

  while (node) {
    node.visited = true;
    getNeighbors(grid, node.point).forEach((p) => node.addPoint(p));
    node = tree.getFirstUnvisited();
  }

  const points = new Set();

  for (const node of tree.getLevel(level + 1)) {
    points.add(node.point.toString());
  }

  return points.size;
}

strictEqual(mainA("./spec.txt", 6), 16);
// strictEqual(mainA("./input.txt", 64), 64);
