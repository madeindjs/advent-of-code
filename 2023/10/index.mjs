import { readFileSync } from "node:fs";

/**
 * @typedef {{x:number, y:number}} Point
 */

/**
 *
 * @param {Point} a
 * @param {Point} b
 */
const isSamePoint = (a, b) => a.x === b.x && a.y === b.y;

const DIR_N = new Set(["|", "L", "J"]);
const DIR_S = new Set(["|", "7", "F"]);
const DIR_E = new Set(["-", "L", "F"]);
const DIR_W = new Set(["-", "J", "7"]);

class Grid {
  constructor(file) {
    this.map = readFileSync(file, { encoding: "utf-8" })
      .split("\n")
      .map((line) => line.split(""));
  }

  /**
   * @param {Point} param0
   */
  getPointValue({ x, y }) {
    return this.map[x]?.[y];
  }

  /**
   * @returns {Point}
   */
  findStartingPoint() {
    for (let x = 0; x < this.map.length; x++) {
      const line = this.map[x];
      for (let y = 0; y < line.length; y++) {
        if (line[y] === "S") return { x, y };
      }
    }
    throw Error("Cound not find S");
  }

  /**
   * @param {Point} param1
   * @param {Point[]} blacklist
   * @returns {Generator<Point, any, undefined>}
   */
  *getNeighbors({ x, y }, blacklist = []) {
    /**
     * @param {Point} p
     * @param {Set<string>} values
     * @returns
     */
    const isValidPoint = (p, values) => values.has(this.getPointValue(p)) && !blacklist.some((b) => isSamePoint(p, b));

    const value = this.getPointValue({ x, y });
    const isStart = value === "S";

    if (DIR_S.has(value) || isStart) {
      const next = { x: x + 1, y };
      if (isValidPoint(next, DIR_N)) yield next;
    }

    if (DIR_N.has(value) || isStart) {
      const next = { x: x - 1, y };
      if (isValidPoint(next, DIR_S)) yield next;
    }

    if (DIR_E.has(value) || isStart) {
      const next = { x, y: y + 1 };
      if (isValidPoint(next, DIR_W)) yield next;
    }

    if (DIR_W.has(value) || isStart) {
      const next = { x, y: y + -1 };
      if (isValidPoint(next, DIR_E)) yield next;
    }
  }

  /**
   * @param {Point} point
   * @param {Point[]} visited
   */
  *computePaths(point = this.findStartingPoint(), visited = [point]) {
    let hasNeighbor = false;
    for (const neighbor of this.getNeighbors(point, visited)) {
      let hasNeighbor = true;
      if (visited.some((v) => isSamePoint(v, neighbor))) {
        yield visited;
      } else {
        console.log(neighbor);
        yield* this.computePaths(neighbor, [...visited, neighbor]);
      }
    }
    if (!hasNeighbor) yield visited;
  }

  /**
   * @param {Point[]} points
   */
  printPath(points) {
    const map = new Array(this.map.length).fill(undefined).map(() => new Array(this.map[0].length).fill(" "));
    points.forEach(({ x, y }, i) => (map[x][y] = String(i)));
    console.log(map);
  }

  /**
   * @param {Point[][]} paths
   */
  findfurthest(paths) {
    // /** @type {Array<Point & {index: number}>[]} */
    let pathsWithIndex = paths.flatMap((path) => path.map((p, i) => ({ ...p, i })));

    let furthest = -Infinity;

    while (pathsWithIndex.length > 0) {
      const point = pathsWithIndex.pop();
      const samePoints = pathsWithIndex.filter((p) => isSamePoint(point, p));
      pathsWithIndex = pathsWithIndex.filter((p) => !isSamePoint(point, p));

      furthest = Math.max(furthest, Math.min(...samePoints.map((p) => p.i)));
    }

    return furthest;

    // const maxLength = Math.max(...paths.map((p) => p.length));

    // for (let index = 0; index < maxLength; index++) {}
  }
}

const spec = new Grid("input.txt");
// console.log(Math.max(...Array.from(spec.computePaths()).map((p) => p.length)));
// console.log(Array.from(spec.computePaths()));
// console.log(Array.from(spec.computePaths()).map((ps) => spec.printPath(ps)));
console.log(spec.findfurthest(Array.from(spec.computePaths())));
