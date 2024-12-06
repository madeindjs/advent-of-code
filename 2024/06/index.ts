import assert, { throws } from "node:assert";
import { readFile } from "node:fs/promises";

type Grid = string[];
type Point = [number, number];
type Direction = "N" | "S" | "W" | "E";

const DIRECTIONS: Record<Direction, Point> = {
  N: [-1, 0],
  S: [1, 0],
  W: [0, -1],
  E: [0, 1],
};

function turn(direction: Direction): Direction {
  switch (direction) {
    case "N":
      return "E";
    case "E":
      return "S";
    case "S":
      return "W";
    case "W":
      return "N";
  }
}

function* findPoints(grid: Grid, value: string): Generator<Point> {
  for (let x = 0; x < grid.length; x++) {
    const row = grid[x];
    for (let y = 0; y < row.length; y++) {
      if (row[y] === value) yield [x, y];
    }
  }
}
function findPoint(grid: Grid, value: string): Point | undefined {
  for (const point of findPoints(grid, value)) return point;
}
function getCell(grid: Grid, [x, y]: Point) {
  return grid[x]?.[y];
}
function translatePoint([x, y]: Point, [tx, ty]: Point): Point {
  return [x + tx, y + ty];
}

async function getGrid(path: string) {
  const inputFile = new URL(path, import.meta.url);
  const input = await readFile(inputFile, { encoding: "utf8" });
  return input.split("\n") as Grid;
}
async function mainA(path: string) {
  const grid = await getGrid(path);

  let point = findPoint(grid, "^");
  if (point === undefined) throw Error();

  let direction: Direction = "N";

  const seq = new Set<string>([point.join()]);

  while (getCell(grid, point) !== undefined) {
    const next = translatePoint(point, DIRECTIONS[direction]);
    const cell = getCell(grid, next);

    if (cell === "#") {
      direction = turn(direction);
    } else if (cell === undefined) {
      console.log(seq);
      return seq.size;
    } else {
      seq.add(next.join());
      point = next;
    }
  }

  return seq.size;
}

assert.strictEqual(await mainA("./spec.txt"), 41);
assert.strictEqual(await mainA("./input.txt"), 0);
