import assert from "node:assert";
import { readFileSync } from "node:fs";

/**
 * @typedef {string[][]} Grid
 * @typedef {[number, number]} Point
 * @typedef {'N' | 'S' | 'E' | 'W'} Direction
 * @typedef {{point: Point, direction: Direction}} Beam
 * @returns {Grid}
 */
function parseFile(file) {
  return readFileSync(file, { encoding: "utf-8" })
    .split("\n")
    .map((r) => r.split(""));
}

/**
 * @param {Point} param0
 * @param {Direction} direction
 * @returns {Point}
 */
function getNextPoint([x, y], direction) {
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

/** @param {Beam} beam */
const serializeBeam = (beam) => `${beam.point.toString()},${beam.direction}`;

/**
 * @param {Grid} grid
 * @param {Beam} start
 * @returns {Generator<Point, void, unknown>}
 */
function* getTraversedPoints(grid, start) {
  /** @type {Beam[]} */
  let beams = [start];
  const existinsBeams = new Set(serializeBeam(start));

  while (beams.length > 0) {
    /** @type {Beam[]} */
    let newBeams = [];
    const addBeam = (b) => {
      const str = serializeBeam(b);
      if (existinsBeams.has(str)) return;
      existinsBeams.add(str);
      newBeams.push(b);
    };

    for (const beam of beams) {
      const [x, y] = getNextPoint(beam.point, beam.direction);
      const isInside = x >= 0 && y >= 0 && x < grid.length && y < grid[0].length;
      if (!isInside) continue;
      yield [x, y];

      const value = grid[x][y];
      (BEAM_DIRECTION_MAPPING[value][beam.direction] ?? []).forEach((direction) =>
        addBeam({ point: [x, y], direction: direction })
      );
    }
    beams = newBeams;
  }
}

/**
 * @param {Grid} grid
 * @param {Beam} start
 */
function computePoints(grid, start = { point: [0, -1], direction: "E" }) {
  return new Set(Array.from(getTraversedPoints(grid, start)).map((b) => b.toString())).size;
}

const mainA = (file) => computePoints(parseFile(file));

/**
 * @param {Grid} grid
 * @returns {Generator<Beam, void, unknown>}
 */
function* getStartingPoints(grid) {
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

function mainB(file) {
  const grid = parseFile(file);
  let max = 0;
  for (const start of getStartingPoints(grid)) max = Math.max(max, computePoints(grid, start));
  return max;
}

assert.strictEqual(mainA("spec.txt"), 46);
assert.strictEqual(mainA("input.txt"), 6605);

assert.strictEqual(mainB("spec.txt"), 51);
assert.strictEqual(mainB("input.txt"), 6766);
