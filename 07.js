// @ts-check
const assert = require("assert");
const { readFileSync } = require("fs");

const positions = readFileSync("07.txt").toString().split(",").map(Number);

/**
 * @param {number} position
 * @return {number}
 */
function getFuelForPositionA(position) {
  return positions.reduce((acc, value) => {
    if (value === position) {
      return acc;
    } else {
      return Math.abs(position - value) + acc;
    }
  }, 0);
}

/**
 * @param {number} move
 * @return {number}
 */
function moveToFuel(move) {
  let count = 0;

  for (let i = 1; i <= move; i++) {
    count += i;
  }

  return count;
}

assert.strictEqual(moveToFuel(0), 0);
assert.strictEqual(moveToFuel(1), 1);
assert.strictEqual(moveToFuel(2), 3);

/**
 * @param {number} position
 * @return {number}
 */
function getFuelForPositionB(position) {
  return positions.reduce((acc, value) => {
    if (value === position) {
      return acc;
    } else {
      return moveToFuel(Math.abs(position - value)) + acc;
    }
  }, 0);
}

const min = Math.min(...positions);
const max = Math.max(...positions);

/**
 * @param {Function} func
 * @returns {number}
 */
function compute(func) {
  const result = {};

  for (let p = min; p < max; p++) {
    result[p] = func(p);
  }

  return Math.min(...Object.values(result));
}

function partA() {
  console.group("Part A");
  console.log(compute(getFuelForPositionA));
  console.groupEnd();
}

function partB() {
  console.group("Part B");
  console.log(compute(getFuelForPositionB));
  console.groupEnd();
}

partA();
partB();
