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
    if (value > position) {
      return value - position + acc;
    } else if (value === position) {
      return acc;
    } else {
      return position - value + acc;
    }
  }, 0);
}

/**
 * @param {number} move
 * @return {number}
 */
function moveToFuel(move) {
  return new Array(move)
    .fill()
    .map((_, i) => i + 1)
    .reduce((acc, v) => acc + v, 0);
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
    if (value > position) {
      return moveToFuel(value - position) + acc;
    } else if (value === position) {
      return acc;
    } else {
      return moveToFuel(position - value) + acc;
    }
  }, 0);
}

const min = Math.min(...positions);
const max = Math.max(...positions);

function partA() {
  console.group("Part A");

  const result = {};

  for (let p = min; p < max; p++) {
    result[p] = getFuelForPositionA(p);
  }

  const minFuel = Math.min(...Object.values(result));

  console.log(minFuel);
  console.groupEnd();
}

function partB() {
  console.group("Part B");

  const result = {};

  for (let p = min; p < max; p++) {
    result[p] = getFuelForPositionB(p);
  }

  const minFuel = Math.min(...Object.values(result));

  console.log(minFuel);
  console.groupEnd();
}

partA();
partB();
