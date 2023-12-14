import assert from "assert";
import { readFileSync } from "fs";

/**
 * @typedef {string[][]} Grid
 * @returns {Generator<Grid, void, unknown>}
 */
function* getGridsFromFile(file) {
  for (const grid of readFileSync(file, { encoding: "utf-8" }).split("\n\n")) {
    yield grid
      .split("\n")
      .filter(Boolean)
      .map((r) => r.split(""));
  }
}

/**
 * @param {Readonly<any[]>} grid
 * @param {number} a
 * @param {number} b
 */
function* getMirrors(grid, a, b) {
  let i = 0;
  while (true) {
    const col1 = a - i;
    const col2 = b + i;
    if (grid[col1] === undefined || grid[col2] === undefined) return;
    yield [col1, col2];
    i++;
  }
}

/** @param {Readonly<Grid>} grid */
function getHoriontalSplit(grid) {
  for (let x = 0; x < grid.length - 1; x++) {
    if (Array.from(getMirrors(grid, x, x + 1)).every(([a, b]) => grid[a].join("") === grid[b].join("")))
      return [x, x + 1];
  }
}

/** @param {Grid} grid */
function flipGrid(grid) {
  /** @type {Grid} */
  const newGrid = [];
  for (let x = 0; x < grid.length; x++) {
    const row = grid[x];
    for (let y = 0; y < row.length; y++) {
      newGrid[y] ??= [];
      newGrid[y][x] = row[y];
    }
  }
  return newGrid;
}

function main(file, getSplitFn) {
  let total = 0;

  for (const grid of getGridsFromFile(file)) {
    const horizontalSplit = getSplitFn(grid);
    const verticalSplit = getSplitFn(flipGrid(grid));

    if (horizontalSplit) {
      total += (horizontalSplit[0] + 1) * 100;
    } else if (verticalSplit) {
      total += verticalSplit[0] + 1;
    } else {
      throw Error(`Didnt find a mirror\n${grid.map((row) => row.join("")).join("\n")}`);
    }
  }

  return total;
}

const mainA = (file) => main(file, getHoriontalSplit);

/** @param {Grid} grid */
function getAlmostHoriontalSplit(grid) {
  for (let x = 0; x < grid.length - 1; x++) {
    let diff = 0;
    for (const [a, b] of getMirrors(grid, x, x + 1)) diff += diffCount(grid[a], grid[b]);
    if (diff === 1) return [x, x + 1];
  }
}

/**
 * @param {string[]} arrA
 * @param {string[]} arrB
 */
const diffCount = (arrA, arrB) => arrA.filter((a, i) => arrB[i] !== a).length;

const mainB = (file) => main(file, getAlmostHoriontalSplit);

assert.strictEqual(mainA("spec.txt"), 405);
assert.strictEqual(mainA("input.txt"), 28895);

assert.strictEqual(mainB("spec.txt"), 400);
assert.strictEqual(mainB("input.txt"), 31603);
