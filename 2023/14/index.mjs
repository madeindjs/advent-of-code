import assert from "node:assert";
import { readFileSync } from "node:fs";

const movable = "O";

function parseGrid(str) {
  return str
    .split("\n")
    .filter(Boolean)
    .map((row) => row.split(""));
}

/**
 * @typedef {string[][]} Grid
 * @returns {Grid}
 */
function parseFile(file) {
  return parseGrid(readFileSync(file, { encoding: "utf-8" }));
}

/** @param {Grid} grid */
function movePointNorth(grid, x, y) {
  grid[x][y] = ".";
  grid[x - 1][y] = "O";
}

/**
 * @param {Grid} grid
 */
function findMovablePoints(grid) {
  let points = [];

  for (let x = 1; x < grid.length; x++) {
    const row = grid[x];
    for (let y = 0; y < row.length; y++) {
      const value = row[y];
      if (value === "O" && grid[x - 1][y] === ".") points.push([x, y]);
    }
  }

  return points;
}

/** @param {Grid} grid */
function countResult(grid) {
  const xMax = grid.length;
  let total = 0;
  for (let x = 0; x < grid.length; x++) {
    const row = grid[x];
    for (let y = 0; y < row.length; y++) {
      if (row[y] === movable) total += xMax - x;
    }
  }
  return total;
}

/**
 * @param {Grid} grid
 */
function moveNorth(grid) {
  let didSomething = false;

  do {
    didSomething = false;
    for (const [x, y] of findMovablePoints(grid)) {
      didSomething = true;
      movePointNorth(grid, x, y);
    }
  } while (didSomething);
}

function mainA(file) {
  const grid = parseFile(file);
  moveNorth(grid);
  return countResult(grid);
}

/**
 * @param {Grid} grid
 * @returns {Grid}
 */
function rotateGrid(grid) {
  return grid[0].map((_, index) => grid.map((row) => row[index]).reverse());
}

function mainB(file) {
  let grid = parseFile(file);
  const gridToStr = () => grid.map((row) => row.join("")).join("\n");

  const targetCycles = 1_000_000_000;
  let cycles = 0;

  const doCycle = () => {
    for (let j = 0; j < 4; j++) {
      moveNorth(grid);
      grid = rotateGrid(grid);
    }
    cycles++;
  };

  let loopFirst = -1;

  const resultHistory = [];

  // loop until find the first repetitive loop
  while (loopFirst < 0) {
    doCycle();
    const str = gridToStr();
    loopFirst = resultHistory.indexOf(str);
    resultHistory.push(str);
  }

  const loopLength = resultHistory.length - loopFirst - 1;

  while (targetCycles % loopLength !== cycles % loopLength) doCycle();

  return countResult(grid);
}

assert.strictEqual(mainA("spec.txt"), 136);
assert.strictEqual(mainA("input.txt"), 112048);

assert.strictEqual(mainB("spec.txt"), 64);
assert.strictEqual(mainB("input.txt"), 105606);
