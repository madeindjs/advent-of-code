// @ts-check
const assert = require("assert");
const { readFileSync } = require("fs");

const buildGrid = (file) =>
  readFileSync(file)
    .toString()
    .split("\n")
    .map((row) => row.split("").map(Number));

const realGrid = buildGrid("09.txt");
const testGrid = buildGrid("09.test.txt");
console.log();

function partA(grid) {
  let y = 0;
  let x = 0;

  let risk = 0;

  while (grid[y][x] !== undefined) {
    const current = grid[y][x];

    // console.log(`Scan ${y}*${x}`);

    const top = y > 0 ? grid[y - 1][x] : undefined;
    const bottom = y < grid.length - 1 ? grid[y + 1][x] : undefined;
    const left = x > 0 ? grid[y][x - 1] : undefined;
    const right = x < grid[y].length - 1 ? grid[y][x + 1] : undefined;

    const isLowest = [top, bottom, left, right].filter((c) => c !== undefined).every((c) => current < c);

    if (isLowest) {
      // console.log(current);
      risk += current + 1;
    }

    // move cursor
    if (grid[y][x + 1] !== undefined) {
      x++;
    } else if (grid[y + 1] && grid[y + 1][0] !== undefined) {
      y++;
      x = 0;
    } else {
      return risk;
    }
  }
  return risk;
}
assert.strictEqual(partA(testGrid), 15);

console.log("Part A", partA(realGrid));

///

function partB(grid) {
  let y = 0;
  let x = 0;

  let risk = 0;

  while (grid[y][x] !== undefined) {
    const current = grid[y][x];

    // console.log(`Scan ${y}*${x}`);

    const top = y > 0 ? grid[y - 1][x] : undefined;
    const bottom = y < grid.length - 1 ? grid[y + 1][x] : undefined;
    const left = x > 0 ? grid[y][x - 1] : undefined;
    const right = x < grid[y].length - 1 ? grid[y][x + 1] : undefined;

    const isLowest = [top, bottom, left, right].filter((c) => c !== undefined).every((c) => current < c);

    if (isLowest) {
      // console.log(current);
      risk += current + 1;
    }

    // move cursor
    if (grid[y][x + 1] !== undefined) {
      x++;
    } else if (grid[y + 1] && grid[y + 1][0] !== undefined) {
      y++;
      x = 0;
    } else {
      return risk;
    }
  }
  return risk;
}
assert.strictEqual(partB(testGrid), 15);
console.log("Part B", partB(realGrid));

// console.log(grid);
