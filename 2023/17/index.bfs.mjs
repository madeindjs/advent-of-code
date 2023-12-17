import { readFileSync } from "node:fs";

/**
 * @typedef {number[][]} Grid
 * @typedef {[number, number]} Point
 * @typedef {{path: Path, distance: number}} PathSummary
 * @typedef {Point[]} Path
 * @returns {Grid}
 */
function parseFile(file) {
  return readFileSync(file, { encoding: "utf-8" })
    .split("\n")
    .map((r) => r.split("").map(Number));
}

/**
 * Manathan distance.
 * @param {Point} param0
 * @param {Point} param1
 * @returns
 */
function getManathanDistance([xA, yA], [xB, yB]) {
  return Math.abs(xB - xA) + Math.abs(yB - yA);
}

class Point {
  constructor(x, y) {}
}

/**
 * @param {Point} param0
 * @param {Point} param1
 * @returns
 */
const isSamePoint = ([xA, yA], [xB, yB]) => xB === xA && yB === yA;

/**
 * @param {Grid} grid
 * @param {Point} param1
 * @param {Point[]} blacklist
 * @returns {Point[]}
 */
function getNeighbors(grid, [x, y], blacklist = []) {
  // @ts-ignore
  return (
    [
      [x + 1, y],
      [x - 1, y],
      [x, y - 1],
      [x, y + 1],
    ]
      .filter((p) => grid[p[0]]?.[p[1]] !== undefined)
      // @ts-ignore
      .filter((p) => !blacklist.some((b) => isSamePoint(b, p)))
  );
}

const serializeGrid = (grid) => grid.map((row) => row.join("")).join("\n");

const colorize = (str) => `\x1b[36m${str}\x1b[0m`;

/**
 * @param {Grid} grid
 * @param {Point} from
 * @param {Point} to
 */
function* run(grid, from, to) {
  // let current = from;
  /**
   * @typedef {{path: Path, distance: number}} PathSummary
   * @type {PathSummary[]}
   */
  const stack = [{ path: [from], distance: 0 }];
  const completePath = [];

  let currentDistance = Infinity;

  // /** @param {Path} path */
  // const computePathDistance = (path) => path.reduce((acc, [x, y]) => acc + grid[x][y] ?? 0, 0);

  function getNext() {
    return stack.pop();
    let minDistance = Infinity;
    let mixIndex = -1;
    for (let index = 0; index < stack.length; index++) {
      const { path, distance } = stack[index];
      // const distance = computePathDistance(path);
      if (distance < minDistance) {
        minDistance = distance;
        mixIndex = index;
      }
    }

    if (mixIndex === -1) throw Error("not any next");

    return stack.splice(mixIndex, 1)[0];
  }

  /**
   *
   * @param {Point[]} path
   * @returns {Point[]}
   */
  function computeForbiddenPoint(path) {
    if (path.length < 3) return [];

    const last3 = path.slice(path.length - 3);
    const firstPoint = last3[0];
    const lastPoint = last3[last3.length - 1];

    if (last3.every((p) => firstPoint[0] === p[0])) {
      return [
        [lastPoint[0], lastPoint[1] + 1],
        [lastPoint[0], lastPoint[1] - 1],
      ];
    }
    if (last3.every((p) => firstPoint[1] === p[1])) {
      return [
        [lastPoint[0] + 1, lastPoint[1]],
        [lastPoint[0] - 1, lastPoint[1]],
      ];
    }

    return [];
  }

  /**
   * @param {Path} path
   */
  function printPath(path) {
    const clone = structuredClone(grid);
    // @ts-ignore
    path.forEach(([x, y]) => (clone[x][y] = colorize(clone[x][y])));
    console.log(serializeGrid(clone));
  }

  const visited = new Set();

  while (stack.length > 0) {
    // @ts-ignore
    const { path, distance } = getNext();
    if (!path) throw Error();
    // console.log("----");
    // printPath(path);

    const current = path[path.length - 1];
    if (!current) throw Error();

    const neighbors = getNeighbors(grid, current, [...path, ...computeForbiddenPoint(path)]);
    // .sort((a, b) => {
    //   const d1 = getManathanDistance(current, a);
    //   const d2 = getManathanDistance(current, b);
    //   if (d1 === d2) return 0;
    //   return d1 < d2 ? -1 : 1;
    // });

    for (const next of neighbors) {
      /** @type {PathSummary} */
      const newSummary = { path: [...path, next], distance: distance + grid[next[0]][next[1]] };
      // newSummary.path.slice('')
      if (currentDistance !== Infinity && currentDistance < newSummary.distance) {
        continue;
      }
      const nextStr = pointStringify(next);
      // if (visited.has(nextStr)) continue;

      if (isSamePoint(next, to)) {
        // const newPath = ;
        // const newDista
        // if ()
        currentDistance = Math.min(newSummary.distance, currentDistance);
        completePath.push(newSummary);
        console.log(`new min! ${currentDistance} (stack: ${stack.length})`);
      } else {
        // visited.add(pointStringify(next));
        // console.log(`oops (stack: ${stack.length})`);
        stack.push(newSummary);
      }
    }
  }

  console.log(completePath);
}

/**
 * @param {Point} point
 */
function pointStringify(point) {
  return point.toString();
}

/**
 * @param {string} point
 * @return {Point}
 */
function pointParse(point) {
  // @ts-ignore
  return point.split(",").map(Number);
}

/**
 * @param {Grid} grid
 * @returns {Generator<Point, void, unknown>}
 */
function* getAllPoint(grid) {
  for (let x = 0; x < grid.length; x++) {
    const row = grid[x];
    for (let y = 0; y < row.length; y++) {
      yield [x, y];
    }
  }
}

/**
 * @param {Grid} grid
 * @param {Point} from
 * @param {Point} to
 */
function* run2(grid, from, to) {
  // let current = from;

  /** @type {Map<string, PathSummary>} */
  const visited = new Map();
  const unvisited = Array.from(getAllPoint(grid));

  function printVisited() {
    const clone = structuredClone(grid);
    // @ts-ignore
    for (const str of visited.keys()) {
      const [x, y] = pointParse(str);
      // @ts-ignore
      clone[x][y] = colorize(clone[x][y]);
    }
    // path.forEach(([x, y]) => ());
    console.log(serializeGrid(clone));
  }

  while (unvisited.length) {
    const point = unvisited.shift();
    if (!point) throw Error;
    console.log(point);
    visited.set(pointStringify(point), { path: [] });
    printVisited();
    return;
  }

  return;

  /**
   * @typedef {{path: Path, distance: number}} PathSummary
   * @type {PathSummary[]}
   */
  const stack = [{ path: [from], distance: 0 }];
  const completePath = [];

  let currentDistance = Infinity;

  /** @param {Path} path */
  const computePathDistance = (path) => path.reduce((acc, [x, y]) => acc + grid[x][y] ?? 0, 0);

  function getNext() {
    return stack.pop();
    let minDistance = Infinity;
    let mixIndex = -1;
    for (let index = 0; index < stack.length; index++) {
      const { path, distance } = stack[index];
      // const distance = computePathDistance(path);
      if (distance < minDistance) {
        minDistance = distance;
        mixIndex = index;
      }
    }

    if (mixIndex === -1) throw Error("not any next");

    return stack.splice(mixIndex, 1)[0];
  }

  /**
   *
   * @param {Point[]} path
   * @returns {Point[]}
   */
  function computeForbiddenPoint(path) {
    if (path.length < 3) return [];

    const last3 = path.slice(path.length - 3);
    const firstPoint = last3[0];
    const lastPoint = last3[last3.length - 1];

    if (last3.every((p) => firstPoint[0] === p[0])) {
      return [
        [lastPoint[0], lastPoint[1] + 1],
        [lastPoint[0], lastPoint[1] - 1],
      ];
    }
    if (last3.every((p) => firstPoint[1] === p[1])) {
      return [
        [lastPoint[0] + 1, lastPoint[1]],
        [lastPoint[0] - 1, lastPoint[1]],
      ];
    }

    return [];
  }

  /**
   * @param {Path} path
   */
  function printPath(path) {
    const clone = structuredClone(grid);
    // @ts-ignore
    path.forEach(([x, y]) => (clone[x][y] = colorize(clone[x][y])));
    console.log(serializeGrid(clone));
  }

  while (stack.length > 0) {
    // @ts-ignore
    const { path, distance } = getNext();
    if (!path) throw Error();
    // console.log("----");
    // printPath(path);

    const current = path[path.length - 1];
    if (!current) throw Error();

    const neighbors = getNeighbors(grid, current, [...path, ...computeForbiddenPoint(path)]);
    // .sort((a, b) => {
    //   const d1 = getManathanDistance(current, a);
    //   const d2 = getManathanDistance(current, b);
    //   if (d1 === d2) return 0;
    //   return d1 < d2 ? -1 : 1;
    // });

    for (const next of neighbors) {
      /** @type {PathSummary} */
      const newSummary = { path: [...path, next], distance: distance + grid[next[0]][next[1]] };
      if (currentDistance !== Infinity && currentDistance < newSummary.distance) {
        continue;
      }
      // const newPath = ;
      // const newDista
      if (isSamePoint(next, to)) {
        // if ()
        currentDistance = Math.min(newSummary.distance, currentDistance);
        completePath.push(newSummary);
        console.log(`new min! ${currentDistance} (stack: ${stack.length})`);
      } else {
        // console.log(`oops (stack: ${stack.length})`);
        stack.push(newSummary);
      }
    }
  }

  console.log(completePath);
}

function mainA(file) {
  const grid = parseFile(file);
  /** @type {Point} */
  const start = [0, 0];
  /** @type {Point} */
  const end = [grid.length - 1, grid[0].length - 1];

  for (const path of run2(grid, start, end)) {
    console.log(path);
  }
}

mainA("spec.txt");
