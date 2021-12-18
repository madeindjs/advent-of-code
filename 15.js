// @ts-check
const { readFileSync } = require("fs");
const { strictEqual, deepEqual, ok } = require("assert");

const getGrid = (file) =>
  readFileSync(file)
    .toString()
    .split("\n")
    .map((line) => line.split("").map(Number));

/**
 * @typedef {number[][]} Grid
 * @typedef {{x: number, y: number}} Pos
 * @typedef {{[point: string]: { distance: number, previous: string }}} Table
 */

/**
 *
 * @param {Grid} grid
 * @param {Pos} point
 */
function getPointValue(grid, point) {
  if (grid[point.y] === undefined) {
    return undefined;
  }

  return grid[point.y][point.x];
}

/**
 * @param {Pos} point
 * @returns {string}
 */
function pointToString(point) {
  return `${point.x},${point.y}`;
}

/**
 * @param {string} point
 * @returns {Pos}
 */
function getPointFromStr(point) {
  const [x, y] = point.split(",");
  return { x: Number(x), y: Number(y) };
}

/**
 * @param {Grid} grid
 * @param {Pos} point
 * @returns {Pos[]}
 */
function getNeighbors(grid, point) {
  return [
    { x: point.x - 1, y: point.y },
    { x: point.x + 1, y: point.y },
    { x: point.x, y: point.y - 1 },
    { x: point.x, y: point.y + 1 },
  ].filter((p) => getPointValue(grid, p) !== undefined);
}

/**
 *
 * @param {Pos} a
 * @param {Pos} b
 * @returns {boolean}
 */
function isSamePoint(a, b) {
  return a.x === b.x && a.y === b.y;
}

/**
 *
 * @param {Grid} grid
 * @returns {Pos[]}
 */
function getAllPoints(grid) {
  return grid.flatMap((_, y) => grid[y].map((_, x) => ({ x, y })));
}

/**
 * @param {Grid} grid
 * @param {Pos} from
 * @param {Pos} to
 */
function dijkstra(grid, from, to) {
  let unvisited = getAllPoints(grid);

  /** @type {Table} */
  const table = {
    [pointToString(from)]: { distance: 0, previous: pointToString(from) },
  };

  const getNext = () => {
    const points = Object.keys(table)
      .filter((pointStr) => {
        const p = getPointFromStr(pointStr);
        return unvisited.some((u) => isSamePoint(u, p));
      })
      .sort((a, b) => table[b].distance - table[a].distance);

    return getPointFromStr(points.pop());
  };

  while (unvisited.length) {
    const current = getNext();
    const { distance } = table[pointToString(current)];

    const neighbors = getNeighbors(grid, current).filter((p) => unvisited.some((u) => isSamePoint(u, p)));

    if (neighbors.length === 0) {
      unvisited = unvisited.filter((p) => !isSamePoint(p, current));
      continue;
    }

    for (const neighbor of neighbors) {
      const neighborStr = pointToString(neighbor);
      const newDistance = distance + getPointValue(grid, neighbor);

      const previousDistance = table[neighborStr]?.distance;

      if (previousDistance === undefined || newDistance < previousDistance) {
        table[neighborStr] = {
          previous: pointToString(current),
          distance: newDistance,
        };
      }
    }

    unvisited = unvisited.filter((p) => !isSamePoint(p, current));
  }

  return table[pointToString(to)].distance;
}

function partA(file) {
  const grid = getGrid(file);

  const endPoint = { y: grid.length - 1, x: grid[0].length - 1 };

  return dijkstra(grid, { x: 0, y: 0 }, endPoint);
}

// too long
// function partB(file) {
//   return count(file);
// }

// const testCouples = parseFile("14.test.txt").couples;

// strictEqual(replace("NNCB", testCouples), "NCNBCHB");
// strictEqual(replace("NCNBCHB", testCouples), "NBCCNBBBCBHCB");

strictEqual(partA("15.test.txt"), 40);
console.log("PartA", partA("15.txt"));
// ok(partB("14.test.txt").includes(2188189693529));
