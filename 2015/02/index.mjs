import { readFileSync } from "fs";
import assert from "node:assert";

const boxes = readFileSync("input.txt").toString("utf-8").split("\n");

/**
 * @param {number} l
 * @param {number} w
 * @param {number} h
 * @returns
 */
const getPaperSize = (l, w, h) => {
  const sideA = l * w;
  const sideB = w * h;
  const sideC = h * l;
  const area = 2 * sideA + 2 * sideB + 2 * sideC;
  return area + Math.min(sideA, sideB, sideC);
};

assert.strictEqual(getPaperSize(2, 3, 4), 58);
assert.strictEqual(getPaperSize(1, 1, 10), 43);

console.log(
  "Part A",
  boxes.reduce((acc, box) => {
    const [l, w, h] = box.split("x").map(Number);
    return acc + getPaperSize(l, w, h);
  }, 0)
);

/**
 * @param {number} l
 * @param {number} w
 * @param {number} h
 * @returns
 */
const getRibon = (l, w, h) => {
  const perimeterA = l * 2 + w * 2;
  const perimeterB = w * 2 + h * 2;
  const perimeterC = h * 2 + l * 2;
  const cubic = l * w * h;
  return cubic + Math.min(perimeterA, perimeterB, perimeterC);
};
assert.strictEqual(getRibon(2, 3, 4), 34);

console.log(
  "Part B",
  boxes.reduce((acc, box) => {
    const [l, w, h] = box.split("x").map(Number);
    return acc + getRibon(l, w, h);
  }, 0)
);
