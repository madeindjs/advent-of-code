import assert from "node:assert";
import { readFileSync } from "node:fs";

/**
 * @typedef {[x: number, y: number]} Point
 * @typedef {[direction: string, count: number]} Instruction
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
      return [direction, Number(count)];
    });
}

/**
 * @returns {Instruction[]}
 */
function parseFile2(file) {
  return readFileSync(file, { encoding: "utf-8" })
    .split("\n")
    .map((r) => {
      const match = r.match(/\(#(.{6})\)/);
      if (!match) throw "Cannot get HEX";

      const count = parseInt(match[1].slice(0, 5), 16);
      const directionIndex = parseInt(match[1].slice(5), 16);
      const DIRCTIONS = ["R", "D", "L", "U"];

      return [DIRCTIONS[directionIndex], count];
    });
}

/**
 * @param {Point[]} points
 */
function drawGrid(points) {
  let xMin = 0;
  let yMin = 0;
  let yMax = 0;

  for (const [x, y] of points) {
    if (x < xMin) xMin = x;
    if (y < yMin) yMin = y;
    if (y > yMax) yMax = y;
  }

  const xOffset = Math.abs(xMin);
  const yOffset = Math.abs(yMin);

  // const pointsOffset = points.map(([x, y]) => [x + xOffset, y + yOffset]);

  /** @type {Grid} */
  const grid = [];

  for (const [x, y] of points) {
    // grid[x] ??= new Array(yMax + 1 + yOffset).fill(" ");
    // grid[x][y] = "#";
    const xOffseted = x + xOffset;
    grid[xOffseted] ??= new Array(yMax + 1 + yOffset).fill(" ");
    grid[xOffseted][y + yOffset] = "#";
  }

  return grid;
}

/**
 * @param {Instruction[]} instructions
 * @returns {Generator<Point, void, unknown>}
 */
function* computePoints(instructions) {
  /** @type {Point} */
  let point = [0, 0];

  for (const [direction, count] of instructions) {
    const move = MOVES[direction];
    if (move === undefined) throw `Could not get move for ${direction}`;

    for (let index = 1; index <= count; index++) {
      point = [point[0] + move[0], point[1] + move[1]];
      yield point;
    }
  }
}

/**
 * @param {Instruction[]} instructions
 * @returns {Generator<[from: Point, to: Point], void, unknown>}
 */
function* computeLine(instructions) {
  /** @type {Point} */
  let point = [0, 0];
  let x = 0;
  let y = 0;

  for (const [direction, count] of instructions) {
    const move = MOVES[direction];
    if (move === undefined) throw `Could not get move for ${direction}`;
    const xNext = x + move[0] * count;
    const yNext = y + move[1] * count;

    /** @type {Point} */
    // const next = [point[0] + move[0] * count, point[1] + move[1] * count];
    yield [
      [x, y],
      [xNext, yNext],
    ];
    x = xNext;
    y = yNext;
  }

  // yield [point];
}

// /**
//  * @param {Instruction[]} instructions
//  * @returns {Line[]}
//  */
// function computeLine(instructions) {
//   /** @type {Point} */
//   let point = [0, 0];

//   /** @type {Line[]} */
//   const lines = [];

//   let xMin = 0;
//   let yMin = 0;

//   for (const [direction, count] of instructions) {
//     const move = MOVES[direction];
//     if (move === undefined) throw `Could not get move for ${direction}`;
//     const [x, y] = point;

//     /** @type {Point} */
//     const next = [x + move[0] * count, y + move[1] * count];

//     if (next[0] < xMin) xMin = next[x];
//     if (next[y] < yMin) yMin = next[y];

//     lines.push([point, next]);

//     point = next;
//   }

//   // move every point
//   const xOffset = Math.abs(xMin);
//   const yOffset = Math.abs(yMin);

//   return lines.map(([[x1, y1], [x2, y2]]) => [
//     [x1 + xOffset, y1 + yOffset],
//     [x2 + xOffset, y2 + yOffset],
//   ]);
// }

/**
 *
 * @param {Grid} grid
 */
function* getBorderPoints(grid) {
  for (let x = 0; x < grid.length; x++) {
    yield [x, 0];
    yield [x, grid[x].length - 1];
  }
  for (let y = 0; y < grid[0].length; y++) {
    yield [0, y];
    yield [grid.length - 1, y];
  }
}

/**
 * @param {Grid} grid
 * @returns {Generator<Point, void, unknown>}
 */
function* getPointsByValue(grid, value) {
  for (let x = 0; x < grid.length; x++) {
    const row = grid[x];
    for (let y = 0; y < row.length; y++) {
      if (row[y] === value) yield [x, y];
    }
  }
}

/**
 * @param {Grid} grid
 * @param {Point} param1
 * @returns {Point[]}
 */
function getNeighbors(grid, [x, y], value = " ") {
  // @ts-ignore
  return Object.values(MOVES)
    .map(([tx, ty]) => [x + tx, y + ty])
    .filter(([x, y]) => grid[x]?.[y] === value);
}

/**
 * @param {Grid} grid
 * @param {Point} point
 * @param {string} value
 */
function fillSpaces(grid, point, value) {
  const stack = [point];

  while (stack.length) {
    const p = stack.pop();
    if (p === undefined) throw "should not happens";
    grid[p[0]][p[1]] = value;

    stack.push(...getNeighbors(grid, p, " "));
  }
}

function mainA(file) {
  let areaTmp = 0;
  let perimeterTmp = 0;

  for (const [[x1, y1], [x2, y2]] of computeLine(parseFile(file))) {
    areaTmp += Math.abs(x1 * y2 - x2 * y1);
    perimeterTmp += Math.abs(Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2)));
    console.log([[x1, y1], [x2, y2], areaTmp]);
  }

  return areaTmp / 2 + perimeterTmp / 2;
}

assert.strictEqual(mainA("spec.txt"), 62);
const a = mainA("input.txt");
assert.strictEqual(a, 47045);
console.log(a);

function mainB(file) {
  let shoelaceTmp = 0;
  let perimeter = 0;

  for (const [[x1, y1], [x2, y2]] of computeLine(parseFile2(file))) {
    shoelaceTmp += Math.abs(x1 * y2 - x2 * y1);
    perimeter += Math.abs(Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2)));
  }

  const shoelace = shoelaceTmp / 2 + 1;

  return shoelace + perimeter / 2 + 1;
}
assert.strictEqual(mainB("spec.txt"), 952408144115);
// const b = mainB("input.txt");
// assert.strictEqual(a, 47045);
// console.log(b);
