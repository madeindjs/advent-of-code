import { readFileSync } from "node:fs";

/**
 * @typedef {[x: number, y: number]} Point
 * @typedef {[direction: string, count: number, hex: string]} Instruction
 * @typedef {string[][]} Grid
 */

/** @type {Record<string, Point>} */
const MOVES = {
  R: [0, 1],
  L: [0, -1],
  U: [-1, 0],
  D: [1, 0],
};

/**
 * @returns {Instruction[]}
 */
function parseFile(file) {
  return readFileSync(file, { encoding: "utf-8" })
    .split("\n")
    .map((r) => {
      const [direction, count, hex] = r.split(" ");
      return [direction, Number(count), hex];
    });
}

/**
 *
 * @param {Point[]} points
 */
function drawGrid(points) {
  const xOffset = Math.abs(Math.min(...points.map((p) => p[0])));
  const yOffset = Math.abs(Math.min(...points.map((p) => p[1])));

  const pointsOffset = points.map(([x, y]) => [x + xOffset, y + yOffset]);

  const xMax = Math.max(...pointsOffset.map((p) => p[0]));
  const yMax = Math.max(...pointsOffset.map((p) => p[1]));

  /** @type {Grid} */
  const grid = [];

  for (const [x, y] of pointsOffset) {
    grid[x] ??= new Array(yMax + 1).fill("");
    grid[x][y] = "#";
  }

  return grid;
}

function mainA(file) {
  /** @type {Point[]} */
  const points = [[0, 0]];

  /**
   * @param {Point} move
   * @param {number} count
   */
  function movePoint([tx, ty], count) {
    let [x, y] = points[0];

    for (let index = 1; index <= count; index++) {
      points.push([x + tx * index, y + ty * index]);
    }
  }

  for (const [direction, count] of parseFile(file)) {
    const move = MOVES[direction];
    if (move === undefined) throw `Could not get move for ${direction}`;
    movePoint(move, count);
  }

  const grid = drawGrid(points);

  console.log(grid.map((r) => r.join("")).join("\n"));
}

console.log(mainA("spec.txt"));
