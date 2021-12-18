// @ts-check
const { readFileSync } = require("fs");
const { strictEqual } = require("assert");

const getGrid = (file) =>
  readFileSync(file)
    .toString()
    .split("\n")
    .map((line) => line.split("").map(Number))
    .reduce((acc, row, y) => {
      row.forEach((value, x) => acc.set(`${x},${y}`, value));
      return acc;
    }, new Map());

/**
 * @typedef {Map<string, number>} Grid
 */

/**
 * @param {Grid} grid
 * @param {string} point
 * @returns {string[]}
 */
function getNeighbors(grid, point) {
  const [x, y] = point.split(",").map(Number);

  return [`${x - 1},${y}`, `${x + 1},${y}`, `${x},${y - 1}`, `${x},${y + 1}`].filter((p) => grid.has(p));
}

/**
 * @param {Grid} grid
 * @param {string} from
 * @param {string} to
 */
function dijkstra(grid, from, to) {
  const unvisited = new Set(grid.keys());
  console.time("dijkstra");

  /** @type {Map<string, {distance: number, previous: string}>} */
  const table = new Map();
  table.set(from, { distance: 0, previous: from });

  // const getNext = () =>
  //   Array.from(unvisited.values())
  //     .filter((point) => table.has(point))
  //     .sort((a, b) => table.get(b).distance - table.get(a).distance)
  //     .pop();

  function getNext() {
    let point;
    let currentDistance;

    for (const [distancePoint, { distance }] of table) {
      if ((currentDistance === undefined || distance <= currentDistance) && unvisited.has(distancePoint)) {
        point = distancePoint;
        currentDistance = distance;
      }
    }

    if (point === undefined) {
      throw Error("cannot find next point");
    }

    return { point, distance: currentDistance };
  }

  while (unvisited.size) {
    const { point, distance } = getNext();
    console.timeLog("dijkstra", `rest ${unvisited.size}`);

    const neighbors = getNeighbors(grid, point).filter((p) => unvisited.has(p));

    if (neighbors.length === 0) {
      unvisited.delete(point);
      continue;
    }

    for (const neighbor of neighbors) {
      const newDistance = distance + grid.get(neighbor);

      const previousDistance = table.get(neighbor)?.distance;

      if (previousDistance === undefined || newDistance < previousDistance) {
        table.set(neighbor, {
          previous: point,
          distance: newDistance,
        });
      }
    }

    unvisited.delete(point);
  }

  console.timeEnd("dijkstra");

  return table.get(to)?.distance;
}

function partA(file) {
  const grid = getGrid(file);

  const points = Array.from(grid.keys());

  return dijkstra(grid, points.shift(), points.pop());
}

strictEqual(partA("15.test.txt"), 40);
// console.log("PartA", partA("15.txt"));

/**
 *
 * @param {number} value
 * @param {number} offset
 */
function computeValueOffset(value, offset) {
  let newValue = value + offset;

  while (newValue > 9) {
    newValue -= 9;
  }

  return newValue;
}

strictEqual(computeValueOffset(9, 1), 1);
strictEqual(computeValueOffset(9, 2), 2);
strictEqual(computeValueOffset(1, 9), 1);

/**
 *
 * @param {Grid} grid
 * @returns {Grid}
 */
function increaseGrid(grid) {
  const [maxX, maxY] = Array.from(grid.keys()).pop().split(",").map(Number);

  /** @type {Grid} */
  const newGrid = new Map();

  for (let xOffset = 0; xOffset < 5; xOffset++) {
    for (let yOffset = 0; yOffset < 5; yOffset++) {
      for (const point of grid.keys()) {
        const value = grid.get(point);
        const newValue = computeValueOffset(value, xOffset + yOffset);
        const [x, y] = point.split(",").map(Number);
        const newPoint = `${x + xOffset * (maxX + 1)},${y + yOffset * (maxY + 1)}`;

        newGrid.set(newPoint, newValue);
      }
    }
  }

  return newGrid;
}

function partB(file) {
  const grid = increaseGrid(getGrid(file));
  const points = Array.from(grid.keys());

  return dijkstra(grid, points.shift(), points.pop());
}

strictEqual(partB("15.test.txt"), 315);
console.log("PartB", partB("15.txt"));
