import assert from "node:assert";
import { readFile } from "node:fs/promises";

type Grid = string[];
type Point = [number, number];

function getGridDiagonal(
  grid: Grid,
  xStart: number,
  yStart: number,
  direction: (v: number) => number,
) {
  const text: string[] = [];
  let x = xStart;
  let y = yStart;
  while (grid[x]?.[y] !== undefined) {
    text.push(grid[x]?.[y]);
    x = direction(x);
    y++;
  }
  return text.join("");
}

function getBorderPoints(grid: Grid) {
  const yMax = grid[0]!.length - 1;
  const xMax = grid.length - 1;

  const points = new Set<string>();

  for (let x = 0; x <= xMax; x++) {
    points.add([x, 0].join());
    points.add([x, yMax].join());
  }
  for (let y = 0; y <= yMax; y++) {
    points.add([0, y].join());
    points.add([xMax, y].join());
  }

  return points.values().map((p) => p.split(",").map(Number));
}

// 123
// 456
// 789
const exampleGrid: Grid = ["123", "456", "789"];
assert.deepStrictEqual(
  getGridDiagonal(exampleGrid, 0, 0, (v) => v + 1),
  "159",
);

function* getLines(grid: Grid): Generator<string> {
  const yMax = grid[0]!.length - 1;
  const xMax = grid.length - 1;

  // rows
  for (const row of grid) {
    yield row;
  }
  // colums
  for (let x = 0; x <= xMax; x++) {
    yield grid.map((row) => row[x]!).join("");
  }
  // diag
  for (const [x, y] of getBorderPoints(grid)) {
    yield getGridDiagonal(grid, x, y, (v) => v + 1);
    yield getGridDiagonal(grid, x, y, (v) => v - 1);
  }
}
function countRegex(str: string, re: RegExp): number {
  return (str.match(re) ?? []).length;
}
assert.strictEqual(countRegex("A.A.A", /A/g), 3);

async function mainA(path: string) {
  const inputFile = new URL(path, import.meta.url);
  const input = await readFile(inputFile, { encoding: "utf8" });

  const grid = input.split("\n") as Grid;
  return getLines(grid)
    .filter((line) => {
      // console.log(line.match(/xmas/));
      return true;
    })
    .map((line) => countRegex(line, /XMAS/g) + countRegex(line, /SAMX/g))
    .reduce((acc, v) => acc + v, 0);
}

assert.strictEqual(await mainA("./spec2.txt"), 4);
assert.strictEqual(await mainA("./spec.txt"), 18);
