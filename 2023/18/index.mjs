import assert from "node:assert";
import { readFileSync } from "node:fs";
import { URL } from "node:url";

/**
 * @typedef {[x: number, y: number]} Point
 * @typedef {[direction: string, count: number]} Instruction
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
function parseInstructions(file) {
  return readFileSync(new URL(file, import.meta.url), { encoding: "utf-8" })
    .split("\n")
    .map((r) => {
      const [direction, count, hex] = r.split(" ");
      return [direction, Number(count)];
    });
}

/**
 * @returns {Instruction[]}
 */
function parseInstructionHex(file) {
  return readFileSync(new URL(file, import.meta.url), { encoding: "utf-8" })
    .split("\n")
    .map((r) => {
      const match = r.match(/\(#(.{6})\)/);
      if (!match) throw "Cannot get HEX";

      const count = parseInt(match[1].slice(0, 5), 16);
      const directionIndex = parseInt(match[1].slice(5), 16);
      const DIRECTIONS = ["R", "D", "L", "U"];

      return [DIRECTIONS[directionIndex], count];
    });
}

/**
 * @param {Instruction[]} instructions
 * @returns {Generator<[from: Point, to: Point], void, unknown>}
 */
function* computeLine(instructions) {
  let x = 0;
  let y = 0;

  for (const [direction, count] of instructions) {
    const move = MOVES[direction];
    if (move === undefined) throw `Could not get move for ${direction}`;
    const xN = x + move[0] * count;
    const yN = y + move[1] * count;

    yield [
      [x, y],
      [xN, yN],
    ];
    x = xN;
    y = yN;
  }
}

function main(instructions) {
  let areaTmp = 0;
  let perimeterTmp = 0;

  for (const [[x1, y1], [x2, y2]] of computeLine(instructions)) {
    areaTmp += x1 * y2 - x2 * y1;
    perimeterTmp += Math.abs(Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2)));
  }

  return Math.abs(areaTmp / 2) + perimeterTmp / 2 + 1;
}

const mainA = (file) => main(parseInstructions(file));
assert.strictEqual(mainA("./spec.txt"), 62);
const a = mainA("./input.txt");
assert.strictEqual(a, 47045);
console.log(a);

const mainB = (file) => main(parseInstructionHex(file));
assert.strictEqual(mainB("./spec.txt"), 952408144115);
const b = mainB("input.txt");
assert.strictEqual(b, 147839570293376);
console.log(b);
