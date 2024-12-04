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
  const xmas = "XMAS";
  for (let i = 0; i < xmas.length; i++) {
    if (getCell(grid, point) !== xmas.at(i)) return false;
    point = translatePoint(point, direction);
  }
  return true;
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

async function getGrid(path: string) {
  const inputFile = new URL(path, import.meta.url);
  const input = await readFile(inputFile, { encoding: "utf8" });
  return input.split("\n") as Grid;
}

function getCell(grid: Grid, [x, y]: Point) {
  return grid[x]?.[y];
}

async function mainA(path: string) {
  const grid = await getGrid(path);

  return findPoints(grid, "X")
    .map((point) => DIRECTIONS.filter((dir) => isXmas(grid, point, dir)).length)
    .reduce((acc, v) => acc + v, 0);
}

assert.strictEqual(await mainA("./spec.txt"), 18);
assert.strictEqual(await mainA("./input.txt"), 2427);

async function mainB(path: string) {
  const grid = await getGrid(path);
  let total = 0;
  const isMs = (str: string) => str === "MS" || str === "SM";

  for (const point of findPoints(grid, "A")) {
    const word1 = [
      getCell(grid, translatePoint(point, [-1, -1])),
      getCell(grid, translatePoint(point, [1, 1])),
    ].join("");
    const word2 = [
      getCell(grid, translatePoint(point, [1, -1])),
      getCell(grid, translatePoint(point, [-1, 1])),
    ].join("");

    if (isMs(word1) && isMs(word2)) total++;
  }

  return total;
}

assert.strictEqual(await mainB("./spec.txt"), 9);
assert.strictEqual(await mainB("./input.txt"), 1900);
