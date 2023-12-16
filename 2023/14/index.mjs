import assert from "node:assert";
import { readFileSync } from "node:fs";

const rock = "#";
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
  grid[x - 1][y] = movable;
}

/**
 * @param {Grid} grid
 */
function* findMovablePoints(grid) {
  for (let x = 1; x < grid.length; x++) {
    const row = grid[x];
    for (let y = 0; y < row.length; y++) {
      const value = row[y];
      if (value === movable && grid[x - 1][y] === ".") yield [x, y];
    }
  }

  return;

  for (let y = 0; y < grid[0].length; y++) {
    for (let x = 1; x < grid.length; x++) {
      // const value = grid[x][y];
      // if (value === rock) {
      //   x++;
      //   continue;
      // }

      if (grid[x][y] === movable && grid[x - 1][y] === ".") yield [x, y];
    }
  }
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

function mainA(file) {
  const grid = parseFile(file);

  let didSomething = false;

  do {
    didSomething = false;
    for (const [x, y] of findMovablePoints(grid)) {
      didSomething = true;
      movePointNorth(grid, x, y);
    }
  } while (didSomething);

  return countResult(grid);
}

/**
 * @param {Grid} grid
 * @returns {Grid}
 */
function rotateGrid(grid) {
  return grid[0].map((_, index) => grid.map((row) => row[index]).reverse());
}
assert.deepEqual(
  rotateGrid([
    ["0", "#"],
    [".", "."],
  ]),
  [
    [".", "0"],
    [".", "#"],
  ]
);
assert.deepEqual(
  rotateGrid(
    rotateGrid(
      rotateGrid(
        rotateGrid([
          ["0", "#"],
          [".", "."],
        ])
      )
    )
  ),
  [
    ["0", "#"],
    [".", "."],
  ]
);

function mainB(file) {
  let grid = parseFile(file);

  const started = new Date().getTime();

  // const cache = new Map();

  // const gridToStr = () => grid.map((r) => r.join("")).join("\n");

  const cycles = 3;

  const getCount = () => grid.flatMap((r) => r.filter((v) => v === "O")).length;

  const initialCount = getCount();

  for (let index = 0; index < cycles; index++) {
    // console.log(grid.map((r) => r.join("")).join("\n"));
    for (let j = 0; j < 4; j++) {
      for (const [x, y] of findMovablePoints(grid)) movePointNorth(grid, x, y);

      grid = rotateGrid(grid);
      // console.log(index, countResult(grid));
    }
    console.log("----");
    console.log(grid.map((r) => r.join("")).join("\n"));

    // if (index % 3 === 0) {
    //   const percentage = index / cycles;

    //   const elapsedMs = new Date().getTime() - started;
    //   const elapsedSec = elapsedMs / 1000;
    //   const elapsedMin = elapsedMs / 1000 / 60;

    //   const estimated = elapsedMs / percentage / 1000 / 60;

    //   console.log(`elapsed: ${Math.round(elapsedSec)}sec (${Math.round(elapsedMin)}min) / ${Math.round(estimated)}min`);
    // }
  }

  return countResult(grid);
}

assert.strictEqual(mainA("spec.txt"), 136);
assert.strictEqual(mainA("input.txt"), 112048);

assert.strictEqual(mainB("spec.txt"), 64);
// assert.strictEqual(mainB("input.txt"), 112048);
