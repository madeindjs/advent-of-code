import assert from "assert";
import { readFileSync } from "fs";

/**
 * @typedef {string[][]} Grid
 */

/**
 * @param {string} grid
 * @returns {Grid}
 */
function parseGrid(grid) {
  return grid
    .split("\n")
    .filter(Boolean)
    .map((row) => row.split(""));
}

function* getGridsFromFile(file) {
  for (const grid of readFileSync(file, { encoding: "utf-8" }).split("\n\n")) {
    yield parseGrid(grid);
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
assert.deepEqual(Array.from(getMirrors([true, true, true, true], 1, 2)), [
  [1, 2],
  [0, 3],
]);

/**
 * @param {Readonly<Grid>} grid
 */
function getHoriontalSplit(grid) {
  for (let x = 0; x < grid.length - 1; x++) {
    const ok = Array.from(getMirrors(grid, x, x + 1)).every(([a, b]) => grid[a].join("") === grid[b].join(""));

    // const ok = Array.from(getMirrors(grid, x, x + 1)).every(([a, b]) =>
    //   grid[a].every((_, index) => grid[a][index] === grid[b][index])
    // );

    if (ok) return [x, x + 1];
  }
}

// assert.deepEqual(
//   getHoriontalSplit(
//     parseGrid(`#...#..######.#.#
// ...#.###.##..#.#.
// ###....#..#..#.#.
// .##.######.###.#.
// ##..#..#..###....
// ##..#..#..###....
// .##.##########.#.
// ###....#..#..#.#.
// ...#.###.##..#.#.
// #...#..######.#.#
// .##.#.#..#....##.
// .##.#.#..#....##.
// #...#..######.#.#`)
//   ),
//   [10, 11]
// );

// assert.deepEqual(
//   getHoriontalSplit(
//     parseGrid(`#...#..######.#.#
// ...#.###.##..#.#.
// ###....#..#..#.#.
// .##.######.###.#.
// ##..#..#..###....
// ##..#..#..###....
// .##.##########.#.
// ###....#..#..#.#.
// ...#.###.##..#.#.
// #...#..######.#.#
// .##.#.#..#....##.
// .##.#.#..#....##.
// #...#..######.#.#`)
//   ),
//   [10, 11]
// );

// assert.deepEqual(
//   getVerticalSplit(
//     parseGrid(
//       `..#.#......#.
// ###.#.####.#.
// ##.##.#..#.##
// ##..#.####.#.
// ...###.##.###
// ###.##.##.##.
// ###..##..#...
// ###..##..##..
// ####.#.##.#.#`
//     )
//   ),
//   [0, 1]
// );

/**
 * @param {Grid} grid
 */
function getVerticalSplit(grid) {
  return getHoriontalSplit(flipGrid(grid));
}

/**
 * @param {Grid} grid
 * @returns {Grid}
 */
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

function mainA(file) {
  let total = 0;

  let totalTop = 0;
  let totalLeft = 0;

  for (const grid of getGridsFromFile(file)) {
    const horizontalSplit = getHoriontalSplit(grid);
    const verticalSplit = getVerticalSplit(grid);

    console.log(horizontalSplit, verticalSplit);

    if (horizontalSplit) {
      // console.log("h", horizontalSplit);
      totalTop += horizontalSplit[0] + 1;
      // total += (horizontalSplit[0] + 1) * 100;
    } else if (verticalSplit) {
      // console.log("v", verticalSplit);
      // total += (verticalSplit[0] + 1) * 1;
      totalLeft += verticalSplit[0] + 1;
    } else {
      printGrid(grid);
    }
  }

  return totalTop * 100 + totalLeft;
  return total;
}

/**
 * @param {Grid} grid
 */
function printGrid(grid) {
  console.log(grid.map((row) => row.join("")).join("\n"));
}

assert.strictEqual(mainA("spec.txt"), 405);
console.log(mainA("input.txt"));
// too low 26885
// not 27795
