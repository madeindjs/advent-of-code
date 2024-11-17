import assert from "assert";
import { readFileSync } from "fs";

/**
 * | -1,-1 | -1,0 | -1,1
 * | 0,-1  |  0,0 | 0,1
 * | 1,-1  |  1,0 | 1,1
 */
type Point = [number, number];

const KEYPAD = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

const DIRECTIONS: Record<string, Point> = {
  U: [-1, 0],
  D: [1, 0],
  L: [0, -1],
  R: [0, 1],
};

function computeSequence(moves: string, [x, y]: Point = [1, 1]): Point {
  for (const move of moves.split("")) {
    if (!(move in DIRECTIONS)) throw Error();
    const [tx, ty] = DIRECTIONS[move];
    const newX = x + tx;
    if (newX >= 0 && newX <= 2) x = newX;

    const newY = y + ty;
    if (newY >= 0 && newY <= 2) y = newY;
  }
  return [x, y];
}

function mainA(file: string | URL) {
  const moves = readFileSync(file).toString("utf-8").trim().split("\n");
  let point: Point = [1, 1];
  let res = "";

  for (const move of moves) {
    point = computeSequence(move, point);
    res += KEYPAD[point[0]][point[1]];
  }

  return res;
}

assert.strictEqual(mainA(new URL("./spec.txt", import.meta.url)), "1985");
assert.strictEqual(mainA(new URL("./input.txt", import.meta.url)), "76792");
