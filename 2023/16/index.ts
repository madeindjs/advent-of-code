import assert from "node:assert";
import { readFileSync } from "node:fs";

type Grid = string[][];

type Point = [number, number];

type Direction = "N" | "S" | "E" | "W";

type Beam = { point: Point; direction: Direction };

function parseFile(file: string): Grid {
  return readFileSync(file, { encoding: "utf-8" })
    .split("\n")
    .map((r) => r.split(""));
}

function getNextPoint([x, y]: Point, direction: Direction): Point {
  if (direction === "N") return [x - 1, y];
  if (direction === "S") return [x + 1, y];
  if (direction === "E") return [x, y + 1];
  if (direction === "W") return [x, y - 1];
  throw Error(`Unknown direction: ${direction}`);
}

const BEAM_DIRECTION_MAPPING = {
  "/": { N: ["E"], S: ["W"], E: ["N"], W: ["S"] },
  "\\": { N: ["W"], S: ["E"], W: ["N"], E: ["S"] },
  ".": { N: ["N"], S: ["S"], W: ["W"], E: ["E"] },
  "-": { W: ["W"], E: ["E"], N: ["E", "W"], S: ["E", "W"] },
  "|": { W: ["N", "S"], E: ["N", "S"], N: ["N"], S: ["S"] },
};

const serializeBeam = (beam: Beam) =>
  `${beam.point.toString()},${beam.direction}`;

function* getTraversedPoints(
  grid: Grid,
  start: Beam,
): Generator<Point, void, unknown> {
  /** @type {Beam[]} */
  let beams: Beam[] = [start];
  const existinsBeams = new Set(serializeBeam(start));

  while (beams.length > 0) {
    /** @type {Beam[]} */
    let newBeams: Beam[] = [];
    const addBeam = (b: Beam) => {
      const str = serializeBeam(b);
      if (existinsBeams.has(str)) return;
      existinsBeams.add(str);
      newBeams.push(b);
    };

    for (const beam of beams) {
      const [x, y] = getNextPoint(beam.point, beam.direction);
      const isInside =
        x >= 0 && y >= 0 && x < grid.length && y < grid[0].length;
      if (!isInside) continue;
      yield [x, y];

      const value = grid[x][y];
      for (const direction of BEAM_DIRECTION_MAPPING[value][beam.direction] ??
        []) {
        addBeam({ point: [x, y], direction: direction });
      }
    }
    beams = newBeams;
  }
}

function computePoints(
  grid: Grid,
  start: Beam = { point: [0, -1], direction: "E" },
) {
  return new Set(
    Array.from(getTraversedPoints(grid, start)).map((b) => b.toString()),
  ).size;
}

const mainA = (file: string) => computePoints(parseFile(file));

function* getStartingPoints(grid: Grid): Generator<Beam, void, unknown> {
  const xMax = grid.length - 1;
  const yMax = grid[0].length - 1;

  for (let x = 0; x <= xMax; x++) {
    yield { point: [x, -1], direction: "E" };
    yield { point: [x, yMax + 1], direction: "W" };
  }
  for (let y = 0; y <= yMax; y++) {
    yield { point: [-1, y], direction: "S" };
    yield { point: [xMax + 1, y], direction: "N" };
  }
}

function mainB(file: string) {
  const grid = parseFile(file);
  let max = 0;
  for (const start of getStartingPoints(grid))
    max = Math.max(max, computePoints(grid, start));
  return max;
}

assert.strictEqual(mainA("spec.txt"), 46);
assert.strictEqual(mainA("input.txt"), 6605);

assert.strictEqual(mainB("spec.txt"), 51);
assert.strictEqual(mainB("input.txt"), 6766);
