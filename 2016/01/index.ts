import assert from "assert";
import { readFileSync } from "fs";

/**
 * | -1,-1 | -1,0 | -1,1
 * | 0,-1  |  0,0 | 0,1
 * | 1,-1  |  1,0 | 1,1
 */
type Point = [number, number];

function* computePath(moves: string[]) {
  let pos: Point = [0, 0];
  let dir: Point = [-1, 0];

  for (const move of moves) {
    const rot = move.at(0);
    const qty = Number(move.slice(1));
    dir = rotateDirection(rot as "L" | "R", dir);
    for (let i = 0; i < qty; i++) {
      pos[0] += dir[0];
      pos[1] += dir[1];
      yield pos;
    }
  }
  return pos;
}

function mainA(moves: string[]) {
  let pos: Point = [0, 0];
  for (const nPos of computePath(moves)) pos = nPos;
  return getDistance(pos);
}

function getDistance(pos: Point): number {
  return Math.abs(pos[0]) + Math.abs(pos[1]);
}

function rotateDirection(rot: "L" | "R", dir: Point): Point {
  const [x, y] = dir;

  if (x === -1) return rot == "L" ? [0, -1] : [0, 1];
  if (y === 1) return rot == "L" ? [-1, 0] : [1, 0];
  if (x === 1) return rot == "L" ? [0, 1] : [0, -1];
  if (y === -1) return rot == "L" ? [1, 0] : [-1, 0];
  throw Error;
}

const moves = readFileSync(new URL("./input.txt", import.meta.url))
  .toString("utf-8")
  .split(", ");
assert.strictEqual(mainA(moves), 236);

function mainB(moves: string[]) {
  const has = new Set<string>();
  for (const pos of computePath(moves)) {
    const pointStr = pos.toString();
    console.log(pointStr);
    if (has.has(pointStr)) return getDistance(pos);
    has.add(pointStr);
  }
}
assert.strictEqual(mainB(moves), 182);
