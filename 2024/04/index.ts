import assert from "node:assert";
import { readFile } from "node:fs/promises";

type Grid = string[];
type Point = [number, number];

function* findPoints(grid: Grid, value: string): Generator<Point> {
  for (let x = 0; x < grid.length; x++) {
    const row = grid[x];
    for (let y = 0; y < row.length; y++) {
      if (row[y] === value) yield [x, y];
    }
  }
}

function translatePoint([x, y]: Point, [tx, ty]: Point): Point {
  return [x + tx, y + ty];
}

function isXmas(grid: Grid, point: Point, direction: Point) {
  let res = "";
  for (let i = 0; i < 4; i++) {
    const cell = grid[point[0]]?.[point[1]];
    if (cell === undefined) return false;
    res += cell;
    point = translatePoint(point, direction);
  }
  return res === "XMAS";
}

const DIRECTIONS: Point[] = [
  [0, 1],
  [0, -1],
  [1, 0],
  [-1, 0],
  [-1, -1],
  [-1, 1],
  [1, -1],
  [1, 1],
];

async function mainA(path: string) {
  const inputFile = new URL(path, import.meta.url);
  const input = await readFile(inputFile, { encoding: "utf8" });

  const grid = input.split("\n") as Grid;

  let total = 0;

  for (const start of findPoints(grid, "X")) {
    for (const direction of DIRECTIONS) {
      if (isXmas(grid, start, direction)) total++;
    }
  }

  return total;
}

assert.strictEqual(await mainA("./spec2.txt"), 4);
assert.strictEqual(await mainA("./spec.txt"), 18);
assert.strictEqual(await mainA("./input.txt"), 2427);
