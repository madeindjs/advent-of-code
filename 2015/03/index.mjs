import { readFileSync } from "fs";
import assert from "node:assert";

const content = readFileSync("input.txt").toString("utf-8");

/**
 * @param {[number, number]} position
 * @returns {string}
 */
function positionToStr(position) {
  return `${position[0]}x${position[1]}`;
}

/**
 * @param {[number, number]} position
 * @param {string} direction
 */
function updatePosition(position, direction) {
  switch (direction) {
    case ">":
      position[1]++;
      break;
    case "v":
      position[0]--;
      break;
    case "<":
      position[1]--;
      break;
    case "^":
      position[0]++;
      break;
  }
}

function getHomes(path) {
  /** @type {[number, number]} */
  let current = [0, 0];
  const points = new Set();
  points.add(positionToStr(current));

  for (const direction of path.split("")) {
    updatePosition(current, direction);
    points.add(positionToStr(current));
  }
  // console.log(points.values());
  return points.size;
}

assert.strictEqual(getHomes("^>v<"), 4);
assert.strictEqual(getHomes("^v^v^v^v^v"), 2);

console.log("Part A", getHomes(content));

function getHomesWithRobot(path) {
  /** @type {[number, number]} */
  let currentSanta = [0, 0];
  /** @type {[number, number]} */
  let currentRobot = [0, 0];
  const points = new Set();
  points.add(positionToStr(currentSanta));

  let isSanta = true;

  for (const direction of path.split("")) {
    updatePosition(isSanta ? currentSanta : currentRobot, direction);
    points.add(positionToStr(isSanta ? currentSanta : currentRobot));
    isSanta = !isSanta;
  }
  return points.size;
}
assert.strictEqual(getHomesWithRobot(">"), 2);
assert.strictEqual(getHomesWithRobot("^>v<"), 3);
assert.strictEqual(getHomesWithRobot("^v^v^v^v^v"), 11);

console.log("Part B", getHomesWithRobot(content));
// 2837
