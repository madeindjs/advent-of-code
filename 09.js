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

/**
 * @typedef {{x: number, y: number}} Point
 */

/**
 *
 * @param {*} grid
 * @returns {Point[]}
 */
function getLowestPoint(grid) {
  let y = 0;
  let x = 0;

  const points = [];

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
      points.push({ x, y });
    }

    // move cursor
    if (grid[y][x + 1] !== undefined) {
      x++;
    } else if (grid[y + 1] && grid[y + 1][0] !== undefined) {
      y++;
      x = 0;
    } else {
      return points;
    }
  }
  return points;
}

function partA(grid) {
  let risk = 0;

  for (const { x, y } of getLowestPoint(grid)) {
    risk += grid[y][x] + 1;
  }
  return risk;
}
assert.strictEqual(partA(testGrid), 15);

console.log("Part A", partA(realGrid));

///

function isValidPoint(grid, point) {
  return grid[point.y] !== undefined && ![undefined, 9].includes(grid[point.y][point.x]);
}

/**
 * @param {Point} point
 * @param {Point[]} visited
 * @returns {Point[]}
 */
function getNearPoints(grid, point, visited) {
  const { x, y } = point;
  // console.log(`get near point`, point)

  const points = [
    { x: x - 1, y },
    { x: x + 1, y },
    { x, y: y + 1 },
    { x, y: y - 1 },
  ];

  for (const p of points) {
    if (visited.some((from) => from.x === p.x && from.y === p.y)) {
      continue;
    }
    if (!isValidPoint(grid, p)) {
      continue;
    }
    visited.push(p);
    getNearPoints(grid, p, visited);
  }

  return visited;
}

function getBassin(grid, point) {
  return getNearPoints(grid, point, [point]).reduce((acc, p) => {
    if (!acc.some((from) => from.x === p.x && from.y === p.y)) {
      acc.push(p);
    }

    return acc;
  }, []);
}

function partB(grid) {
  return getLowestPoint(grid)
    .map((p) => getBassin(grid, p).length)
    .sort((a, b) => b - a)
    .slice(0, 3)
    .reduce((acc, v) => acc * v, 1);
}
assert.strictEqual(partB(testGrid), 1134);

console.log("Part B", partB(realGrid));
