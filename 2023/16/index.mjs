import assert from "node:assert";
import { readFileSync } from "node:fs";

/**
 * @typedef {string[][]} Grid
 * @typedef {[number, number]} Point
 * @typedef {'N' | 'S' | 'E' | 'W'} Direction
 * @typedef {{point: Point, direction: Direction}} Beam
 */

/**
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

/**
 * @param {Grid} grid
 * @param {Point} param1
 */
function isPointInsideTheGrid(grid, [x, y]) {
  return x >= 0 && y >= 0 && x < grid.length && y < grid[0].length;
}

const BEAM_DIRECTION_MAPPING = {
  "/": { N: ["E"], S: ["W"], E: ["N"], W: ["S"] },
  "\\": { N: ["W"], S: ["E"], W: ["N"], E: ["S"] },
  ".": { N: ["N"], S: ["S"], W: ["W"], E: ["E"] },
  "-": { W: ["W"], E: ["E"], N: ["E", "W"], S: ["E", "W"] },
  "|": { W: ["N", "S"], E: ["N", "S"], N: ["N"], S: ["S"] },
};

/**
 * @param {Beam} beam
 */
function serializeBeam(beam) {
  return `${beam.point.toString()},${beam.direction}`;
}

/**
 * @param {Grid} grid
 * @returns {Generator<Point, void, unknown>}
 */
function* getTraversedPoints(grid) {
  /** @type {Beam[]} */
  let beams = [{ point: [0, -1], direction: "E" }];
  const existinsBeams = new Set(serializeBeam(beams[0]));

  while (beams.length > 0) {
    // console.log(beams);
    /** @type {Beam[]} */
    let newBeams = [];
    const addBeam = (b) => {
      const str = serializeBeam(b);
      if (existinsBeams.has(str)) return;
      existinsBeams.add(str);
      newBeams.push(b);
    };

    for (const beam of beams) {
      const point = getNextPoint(beam.point, beam.direction);
      if (!isPointInsideTheGrid(grid, point)) continue;

      yield point;

      const value = grid[point[0]][point[1]];

      (BEAM_DIRECTION_MAPPING[value][beam.direction] ?? []).forEach((direction) =>
        addBeam({ point, direction: direction })
      );
    }
    beams = newBeams;
  }
}

function mainA(file) {
  const grid = parseFile(file);

  // const points = [];

  // for (const point of getTraversedPoints(grid)) {
  //   points.push(point);
  //   const newGrid = parseFile(file);
  //   points.forEach(([x, y]) => (newGrid[x][y] = "#"));
  //   console.log(newGrid.map((r) => r.join("")).join("\n"));
  //   console.log("---");
  // }

  return new Set(Array.from(getTraversedPoints(grid)).map((b) => b.toString())).size;
}

assert.strictEqual(mainA("spec.txt"), 46);
assert.strictEqual(mainA("input.txt"), 6605);
