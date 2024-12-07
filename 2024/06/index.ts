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

function* walk(
  grid: Grid,
  point: Point,
  direction: Direction = "N",
  extraBlock?: Point,
): Generator<[Point, Direction], boolean> {
  const seq = new Set<string>();
  seq.add(`${point[0]},${point[1]},${direction}`);

  while (true) {
    const next = translatePoint(point, DIRECTIONS[direction]);
    const nextKey = `${next[0]},${next[1]},${direction}`;
    const cell = getCell(grid, next);

    if (seq.has(nextKey)) return true;

    if (cell === "#" || next.join() === extraBlock?.join()) {
      direction = turn(direction);
    } else if (cell === undefined) {
      return false;
    } else {
      yield [next, direction];
      point = next;
      seq.add(nextKey);
    }
  }
}

async function mainA(path: string) {
  const grid = await getGrid(path);
  let point = findPoint(grid, "^")!;

  const seq = new Set<string>([point.join()]);
  for (const [p] of walk(grid, point)) seq.add(p.join());
  return seq.size;
}

assert.strictEqual(await mainA("./spec.txt"), 41);
assert.strictEqual(await mainA("./input.txt"), 5329);

function getGeneratorReturn<T>(gen: Generator<unknown, T>): T {
  let result;
  while (!(result = gen.next()).done) {}
  return result.value;
}

async function mainB(path: string) {
  const grid = await getGrid(path);

  let point = findPoint(grid, "^")!;
  const points = new Set<string>();

  for (const [p, direction] of walk(grid, point)) {
    const newBlock = translatePoint(p, DIRECTIONS[direction]);
    const newGen = walk(grid, point, direction, newBlock);
    const isInfinite = getGeneratorReturn(newGen);
    if (isInfinite) {
      console.log(newBlock);

      points.add(newBlock.join());
    }
  }

  return points.size;
}

assert.strictEqual(await mainB("./spec.txt"), 6);
assert.strictEqual(await mainB("./input.txt"), 5329);
