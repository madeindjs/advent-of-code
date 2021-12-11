// @ts-check
const assert = require("assert");
const { readFileSync } = require("fs");

const getGrid = (file) =>
  readFileSync(file)
    .toString()
    .split("\n")
    .map((line) => line.split("").map(Number));

/**
 * @typedef {number[][]} Grid
 * @typedef {{x: number, y: number}} Pos
 */

/**
 * @param {Grid} grid
 * @param {Pos} pos
 */
function flash(grid, pos) {
  grid[pos.y][pos.x] = 0;

  [
    { x: pos.x - 1, y: pos.y + 1 },
    { x: pos.x, y: pos.y + 1 },
    { x: pos.x + 1, y: pos.y + 1 },
    { x: pos.x + 1, y: pos.y },
    { x: pos.x + 1, y: pos.y - 1 },
    { x: pos.x, y: pos.y - 1 },
    { x: pos.x - 1, y: pos.y - 1 },
    { x: pos.x - 1, y: pos.y },
  ]
    .filter(({ x, y }) => grid[y] !== undefined && grid[y][x])
    .forEach(({ x, y }) => {
      grid[y][x]++;
    });
}

/**
 *
 * @param {Grid} grid
 */
function gridToString(grid) {
  return grid.map((line) => line.join("")).join("\n");
}

/**
 *
 * @param {Grid} grid
 * @returns {Pos}
 */
function getPointToFlash(grid) {
  for (const y in grid) {
    const line = grid[y];

    for (const x in line) {
      if (grid[y][x] > 9) {
        return { x: Number(x), y: Number(y) };
      }
    }
  }
}

/**
 * @param {Grid} grid
 */
function step(grid) {
  for (const y in grid) {
    const line = grid[y];

    for (const x in line) {
      line[x]++;
    }
  }
  let flashCount = 0;

  while (getPointToFlash(grid)) {
    flashCount++;
    const point = getPointToFlash(grid);

    flash(grid, point);
  }
  return flashCount;
}

function test() {
  const testGrid = getGrid("11.test.txt");
  step(testGrid);
  assert.strictEqual(
    gridToString(testGrid),
    `6594254334
3856965822
6375667284
7252447257
7468496589
5278635756
3287952832
7993992245
5957959665
6394862637`
  );
  step(testGrid);

  assert.strictEqual(
    gridToString(testGrid),
    `8807476555
5089087054
8597889608
8485769600
8700908800
6600088989
6800005943
0000007456
9000000876
8700006848`
  );
}

function partA() {
  const grid = getGrid("11.txt");
  let flashCount = 0;

  for (let i = 0; i < 100; i++) {
    flashCount += step(grid);
  }

  console.log("PartA", flashCount);
}

test();
partA();

function partB() {
  const grid = getGrid("11.txt");
  const isSynchronized = () => grid.flatMap((l) => l).every((c) => c === 0);

  let count = 0;

  while (!isSynchronized()) {
    count++;
    step(grid);
  }

  console.log("PartB", count);
}

partB();
