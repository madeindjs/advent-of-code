import assert from "node:assert";
import { readFileSync } from "node:fs";

/**
 * @typedef {[x: number, y: number]} Point
 * @typedef {[direction: string, count: number, hex: string]} Instruction
 * @typedef {string[][]} Grid
 */

/** @type {Record<string, Point>} */
const MOVES = {
  R: [0, 1],
  L: [0, -1],
  U: [-1, 0],
  D: [1, 0],
};

/**
 * @returns {Instruction[]}
 */
function parseFile(file) {
  return readFileSync(file, { encoding: "utf-8" })
    .split("\n")
    .map((r) => {
      const [direction, count, hex] = r.split(" ");
      return [direction, Number(count), hex];
    });
}

// class Grid {
//   /** @type {string[][]} */
//   data = [];
// }

/**
 * @param {Point[]} points
 */
function drawGrid(points) {
  const xOffset = Math.abs(Math.min(...points.map((p) => p[0])));
  const yOffset = Math.abs(Math.min(...points.map((p) => p[1])));

  const pointsOffset = points.map(([x, y]) => [x + xOffset, y + yOffset]);

  const yMax = Math.max(...pointsOffset.map((p) => p[1]));

  /** @type {Grid} */
  const grid = [];

  for (const [x, y] of pointsOffset) {
    grid[x] ??= new Array(yMax + 1).fill(" ");
    grid[x][y] = "#";
  }

  return grid;
}

/**
 * @param {Instruction[]} instructions
 * @returns {Generator<Point, void, unknown>}
 */
function* computePoints(instructions) {
  /** @type {Point} */
  let point = [0, 0];

  for (const [direction, count] of instructions) {
    const move = MOVES[direction];
    if (move === undefined) throw `Could not get move for ${direction}`;

    for (let index = 1; index <= count; index++) {
      point = [point[0] + move[0], point[1] + move[1]];
      yield point;
    }
  }
}

/**
 *
 * @param {Grid} grid
 */
function* getBorderPoints(grid) {
  for (let x = 0; x < grid.length; x++) {
    yield [x, 0];
    yield [x, grid[x].length - 1];
  }
  for (let y = 0; y < grid[0].length; y++) {
    yield [0, y];
    yield [grid.length - 1, y];
  }
}

/**
 * @param {Grid} grid
 * @returns {Generator<Point, void, unknown>}
 */
function* getPointsByValue(grid, value) {
  for (let x = 0; x < grid.length; x++) {
    const row = grid[x];
    for (let y = 0; y < row.length; y++) {
      if (row[y] === value) yield [x, y];
    }
  }
}

/**
 * @param {Grid} grid
 * @param {Point} point
 * @param {string} value
 */
function fillSpaces(grid, point, value) {
  const getNeighbors = ([x, y]) =>
    Object.values(MOVES)
      .map(([tx, ty]) => [x + tx, y + ty])
      .filter(([x, y]) => grid[x]?.[y] === " ");

  const stack = [point];

  while (stack.length) {
    const p = stack.pop();
    if (p === undefined) throw "should not happens";
    grid[p[0]][p[1]] = value;

    stack.push(...getNeighbors(p));
  }
}

function mainA(file) {
  const points = Array.from(computePoints(parseFile(file)));
  const grid = drawGrid(points);

  for (const [x, y] of getBorderPoints(grid)) {
    const value = grid[x][y];
    if (value === " ") fillSpaces(grid, [x, y], ".");
  }

  // console.log(grid.map((r) => r.join("")).join("\n"));

  return Array.from(getPointsByValue(grid, " ")).length + Array.from(getPointsByValue(grid, "#")).length;
  // console.log(Array.from(getBorderPoints(grid)));
}

assert.strictEqual(mainA("spec.txt"), 62);
const a = mainA("input.txt");
assert.ok(a > 40083);
console.log(a);
