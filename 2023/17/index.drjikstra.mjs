import { strictEqual } from "node:assert";
import { readFileSync } from "node:fs";

/**
 * @typedef {Map<string, number>} Grid
 * @returns {Grid}
 */
const getGrid = (file) =>
  readFileSync(file)
    .toString()
    .split("\n")
    .map((line) => line.split("").map(Number))
    .reduce((acc, row, y) => {
      row.forEach((value, x) => acc.set(stringifyPoint({ x, y }), value));
      return acc;
    }, new Map());

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
 * @param {string} point
 */
function parsePoint(point) {
  const [x, y] = point.split(",").map(Number);
  return { x, y };
}

/**
 * @param {{x: number, y: number}} point
 */
function stringifyPoint(point) {
  return `${point.x},${point.y}`;
}

/**
 *
 * @param {string[]} points
 * @returns {string[]}
 */
function computeForbiddenPoint(points) {
  if (points.length < 3) return [];

  const ps = points.map(parsePoint).slice(points.length - 3);
  const firstPoint = ps[0];
  const lastPoint = ps[ps.length - 1];

  if (ps.every((p) => firstPoint.x === p.x)) {
    return [
      stringifyPoint({ x: lastPoint.x, y: lastPoint.y + 1 }),
      stringifyPoint({ x: lastPoint.x, y: lastPoint.y - 1 }),
    ];
  }
  if (ps.every((p) => firstPoint.y === p.y)) {
    return [
      stringifyPoint({ x: lastPoint.x - 1, y: lastPoint.y }),
      stringifyPoint({ x: lastPoint.x + 1, y: lastPoint.y }),
    ];
  }

  return [];
}

/**
 * @param {Grid} grid
 * @param {string} from
 * @param {string} to
 */
function dijkstra(grid, from, to) {
  const unvisited = new Set(grid.keys());
  console.time("dijkstra");

  /** @type {Map<string, {distance: number, previous: string, path: string[]}>} */
  const table = new Map();
  table.set(from, { distance: 0, previous: from, path: [] });

  /**
   * @param {string[]} path
   */
  const getTailKey = (path) => {
    if (path.length <= 3) return path.toString();
    return path.slice(path.length - 3);
  };

  function getNext() {
    let point;
    let currentDistance;
    let currentPath = [];

    for (const [distancePoint, { distance, path }] of table) {
      if ((currentDistance === undefined || distance <= currentDistance) && unvisited.has(distancePoint)) {
        point = distancePoint;
        currentDistance = distance;
        currentPath = path;
      }
    }

    if (point === undefined) {
      throw Error("cannot find next point");
    }

    return { point, distance: currentDistance, path: currentPath };
  }

  while (unvisited.size) {
    const { point, distance, path } = getNext();
    console.timeLog("dijkstra", `rest ${unvisited.size}`);

    const forbiddenPoints = computeForbiddenPoint(path);

    const neighbors = getNeighbors(grid, point)
      .filter((p) => unvisited.has(p))
      .filter((p) => !forbiddenPoints.includes(p));

    if (neighbors.length === 0) {
      unvisited.delete(point);
      continue;
    }

    for (const neighbor of neighbors) {
      // const newPath = [...path, point];
      // const pathKey = getTailKey(newPath);
      const newDistance = (distance ?? 0) + (grid.get(neighbor) ?? 0);

      const previousDistance = table.get(neighbor)?.distance;

      if (previousDistance === undefined || newDistance < previousDistance) {
        table.set(neighbor, { previous: point, distance: newDistance, path: [...path, point] });
      }
    }

    unvisited.delete(point);
  }

  console.timeEnd("dijkstra");
  console.log(table.get(to)?.path);

  return table.get(to)?.distance;
}

function partA(file) {
  const grid = getGrid(file);

  const points = Array.from(grid.keys());

  return dijkstra(grid, points.shift(), points.pop());
}

strictEqual(partA("spec.txt"), 102);
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

// strictEqual(partB("15.test.txt"), 315);
// console.log("PartB", partB("15.txt"));
