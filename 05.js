// @ts-check
const assert = require("assert");
const fs = require("fs");

const rows = fs.readFileSync("05.txt").toString().split("\n");

/**
 * @typedef {Array<number>} Point
 */

/**
 * @param {Point} point
 * @returns {string}
 */
function getPointKey(point) {
  const [x, y] = point;
  return `${x},${y}`;
}

/**
 * @param {Point} from
 * @param {Point} to
 * @returns {Array<Point>}
 */
function getPoints(from, to, diagonal = false) {
  const [fromX, fromY] = from;
  const [toX, toY] = to;

  /** @type {Array<Point>} */
  const points = [from];

  if (fromX === toX) {
    const moveY = toY - fromY;
    let cursor = 0;

    while (cursor !== moveY) {
      cursor = moveY > 0 ? cursor + 1 : cursor - 1;
      points.push([fromX, fromY + cursor]);
    }
  } else if (fromY === toY) {
    const moveX = toX - fromX;
    let cursor = 0;

    while (cursor !== moveX) {
      cursor = moveX > 0 ? cursor + 1 : cursor - 1;
      points.push([fromX + cursor, fromY]);
    }
  } else if (diagonal) {
    let cursorX = 0;
    let cursorY = 0;
    const moveX = toX - fromX;
    const moveY = toY - fromY;

    if (Math.abs(moveY) !== Math.abs(moveX)) {
      throw `this is not diagonal  ${moveX} - ${moveY}`;
    }

    while (cursorX !== moveX) {
      cursorX = moveX > 0 ? cursorX + 1 : cursorX - 1;
      cursorY = moveY > 0 ? cursorY + 1 : cursorY - 1;
      points.push([fromX + cursorX, fromY + cursorY]);
    }

    // not handled now
    return points;
  }

  return points;
}

assert.deepStrictEqual(
  getPoints([0, 0], [1, 0]),
  [
    [0, 0],
    [1, 0],
  ],
  "horizontal"
);
assert.deepStrictEqual(
  getPoints([0, 0], [0, 2]),
  [
    [0, 0],
    [0, 1],
    [0, 2],
  ],
  "vertical"
);
assert.deepStrictEqual(
  getPoints([2, 2], [2, 1]),
  [
    [2, 2],
    [2, 1],
  ],
  "retro not supported"
);
assert.deepStrictEqual(
  getPoints([0, 0], [2, 2], true),
  [
    [0, 0],
    [1, 1],
    [2, 2],
  ],
  "diagonal not supported"
);

class Grid {
  /** @type {Map<string, number>} */
  points = new Map();
  diagonal = false;

  /** @param {string} line */
  addLine(line) {
    const [fromStr, toStr] = line.split(" -> ");

    const points = getPoints(fromStr.split(",").map(Number), toStr.split(",").map(Number), this.diagonal);

    for (const point of points) {
      const key = getPointKey(point);

      const value = this.points.get(key);

      if (value === undefined) {
        this.points.set(key, 1);
      } else {
        this.points.set(key, value + 1);
      }
    }
  }
}

function partA() {
  console.group("Part A");
  const grid = new Grid();
  rows.forEach((row) => grid.addLine(row));
  const count = Array.from(grid.points.values()).filter(v => v > 1).length
  console.log(count);
  console.groupEnd();
}
function partB() {
  console.group("Part B");
  const grid = new Grid();
  grid.diagonal = true;
  rows.forEach((row) => grid.addLine(row));
  const count = Array.from(grid.points.values()).filter(v => v > 1).length
  console.log(count);
  console.groupEnd();
}

partA();
partB();
