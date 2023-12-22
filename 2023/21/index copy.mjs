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

function mainA(file, steps) {
  const grid = parseFile(file);
  const start = Array.from(findPointByValue(grid, "S"))[0];
  if (!start) throw `cannot find starting point`;

  /** @type {{step: number, point: Point}[]} */
  let stack = [{ step: 1, point: start }];

  // const visitStack = () => stack.forEach((p) => visited.add(p.toString()));

  // const visited = new Set();

  // const debug = () => {
  //   const copy = structuredClone(grid);
  //   stack.forEach(([x, y]) => (copy[x][y] = colorize("O")));
  //   console.log(copy.map((r) => r.join("")).join("\n"));
  //   console.log("---");
  // };

  /** @type {Map<string, Map<number, Point>>} */
  const cache = new Map();

  /**
   * @param {Point} point
   * @param {number} step
   * @param {Point[]} road
   * @returns
   */
  const cacheRoad = (point, step, road) => cache.set(point.toString(), []);

  while (stack.length) {
    const item = stack.pop();
    if (item === undefined) throw `impossible`;

    let point = item.point;

    /** @type {Map<string, Map<number, Point>>} */
    let path = new Map();

    for (let i = item.step; i <= steps; i++) {
      const neighbors = getNeighbors(grid, item.point);
      const neighbor1 = neighbors.pop();
      if (neighbor1 === undefined) break;
      path.set(i, fi);
    }

    /** @type {Point[]} */
    // let newStack = []

    // for (const [x,y] of stack) {
    //   const neighbors = ;

    // }

    stack = stack.flatMap((p) => getNeighbors(grid, p));
    // .filter((p) => !visited.has(p.toString()));
    console.log(i, stack.length);
    // visitStack();
    // debug();
  }
  return new Set(stack.map((p) => p.toString())).size;
}

strictEqual(mainA("./spec.txt", 6), 16);
strictEqual(mainA("./input.txt", 64), 64);
