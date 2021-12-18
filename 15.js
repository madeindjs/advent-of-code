// @ts-check
const { readFileSync } = require("fs");
const { strictEqual } = require("assert");

const getGrid = (file) =>
  readFileSync(file)
    .toString()
    .split("\n")
    .map((line) => line.split("").map(Number))
    .reduce((acc, row, y) => {
      row.forEach((value, x) => {
        acc[`${x},${y}`] = value;
      });
      return acc;
    }, {});

/**
 * @typedef {{[point: string]: number}} Grid
 * @typedef {{[point: string]: { distance: number, previous: string }}} Table
 */

/**
 * @param {Grid} grid
 * @param {string} point
 * @returns {string[]}
 */
function getNeighbors(grid, point) {
  const [x, y] = point.split(",").map(Number);

  return [`${x - 1},${y}`, `${x + 1},${y}`, `${x},${y - 1}`, `${x},${y + 1}`].filter((p) => grid[p] !== undefined);
}

/**
 * @param {Grid} grid
 * @param {string} from
 * @param {string} to
 */
function dijkstra(grid, from, to) {
  let unvisited = Object.keys(grid);

  /** @type {Table} */
  const table = {
    [from]: { distance: 0, previous: from },
  };

  const getNext = () =>
    Object.keys(table)
      .filter((point) => unvisited.includes(point))
      .sort((a, b) => table[b].distance - table[a].distance)
      .pop();

  while (unvisited.length) {
    const current = getNext();
    const { distance } = table[current];

    const neighbors = getNeighbors(grid, current).filter((p) => unvisited.includes(p));

    if (neighbors.length === 0) {
      unvisited = unvisited.filter((p) => p !== current);
      continue;
    }

    for (const neighbor of neighbors) {
      const newDistance = distance + grid[neighbor];

      const previousDistance = table[neighbor]?.distance;

      if (previousDistance === undefined || newDistance < previousDistance) {
        table[neighbor] = {
          previous: current,
          distance: newDistance,
        };
      }
    }

    unvisited = unvisited.filter((p) => p !== current);
  }

  return table[to]?.distance;
}

function partA(file) {
  const grid = getGrid(file);

  return dijkstra(grid, Object.keys(grid).shift(), Object.keys(grid).pop());
}

strictEqual(partA("15.test.txt"), 40);
console.log("PartA", partA("15.txt"));
