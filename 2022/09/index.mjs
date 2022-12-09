import { createReadStream } from "fs";
import assert from "node:assert";
import readline from "readline";

/**
 * @typedef {number[][]} Map
 * @typedef {[number, number]} Point
 * @typedef {(point: Point) => Point} Move
 */

/** @type {Record<string, Move>} */
const moves = {
  L: ([px, py]) => [px - 1, py],
  R: ([px, py]) => [px + 1, py],
  U: ([px, py]) => [px, py + 1],
  D: ([px, py]) => [px, py - 1],
};

/**
 * @param {Point} headPoint
 * @param {Point} tailPoint
 */
const isTailTooFar = ([hx, hy], [tx, ty]) => ![hx, hx - 1, hx + 1].includes(tx) || ![hy, hy - 1, hy + 1].includes(ty);

/**
 * @param {Point} headPoint
 * @param {Point} tailPoint
 * @return {Point}
 */
function moveTail(headPoint, tailPoint) {
  if (!isTailTooFar(headPoint, tailPoint)) return tailPoint;

  const newPoint = [...tailPoint];

  [0, 1].forEach((axe) => {
    if (headPoint[axe] > tailPoint[axe]) newPoint[axe]++;
    if (headPoint[axe] < tailPoint[axe]) newPoint[axe]--;
  });

  // @ts-ignore
  return newPoint;
}
assert.deepEqual(moveTail([1, 1], [1, 1]), [1, 1]);
assert.deepEqual(moveTail([1, 1], [0, 0]), [0, 0]);
assert.deepEqual(moveTail([2, 2], [0, 0]), [1, 1]);
assert.deepEqual(moveTail([2, 0], [0, 0]), [1, 0]);

/**
 * @param {string} file
 * @returns {Promise<number>}
 */
async function mainA(file) {
  /** @type {Point} */
  let headPoint = [0, 0];
  /** @type {Point} */
  let tailPoint = [0, 0];

  const tailVisits = new Set();

  for await (const line of readline.createInterface({ input: createReadStream(file) })) {
    const [direction, qtyStr] = line.split(" ");
    const qty = Number(qtyStr);

    for (let index = 0; index < qty; index++) {
      headPoint = moves[direction](headPoint);
      tailPoint = moveTail(headPoint, tailPoint);
      tailVisits.add(`${tailPoint[0]}*${tailPoint[1]}`);
    }
  }
  return tailVisits.size;
}

/**
 * @param {string} file
 * @returns {Promise<number>}
 */
async function mainB(file) {
  /** @type {Point[]} */
  const rope = new Array(10).fill([0, 0]);

  const tailVisits = new Set();

  for await (const line of readline.createInterface({ input: createReadStream(file) })) {
    const [direction, qtyStr] = line.split(" ");
    const qty = Number(qtyStr);

    for (let index = 0; index < qty; index++) {
      for (let index = 0; index < rope.length; index++) {
        if (index === 0) {
          rope[index] = moves[direction](rope[index]);
        } else {
          rope[index] = moveTail(rope[index - 1], rope[index]);
        }

        if (index === 9) tailVisits.add(`${rope[index][0]}*${rope[index][1]}`);
      }
    }
  }
  return tailVisits.size;
}

async function main() {
  assert.strictEqual(await mainA("spec.txt"), 13);
  console.log("result A", await mainA("input.txt"));

  assert.strictEqual(await mainB("specb.txt"), 36);
  console.log("result B", await mainB("input.txt"));
}

main().catch(console.error);
