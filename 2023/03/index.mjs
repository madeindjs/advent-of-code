import assert from "node:assert";
import { readFileSync } from "node:fs";

/**
 * @param {string[]} lines
 * @param {number[]} param1
 * @param {number[][]} blacklist
 */
function getNeighbors(lines, [x, y], blacklist = []) {
  return [
    [x - 1, y - 1],
    [x + 0, y - 1],
    [x + 1, y - 1],
    [x + 1, y],
    [x + 1, y + 1],
    [x + 0, y + 1],
    [x - 1, y + 1],
    [x - 1, y + 0],
  ].filter(([x, y]) => lines[x]?.[y] !== undefined || blacklist.some((b) => isSamePoint(b, [x, y])));
}

/**
 * @param {string[]} lines
 * @param {number[]} point
 * @param {string} str
 * @returns {number[][]}
 */
function getTextNeighbors(lines, point, str) {
  return getTextPoints(point, str).flatMap((p, _, points) => getNeighbors(lines, p, points));
}

/**
 * @param {number[]} param0
 */
function getTextPoints([x, y], str) {
  return str.split("").map((_, i) => [x, y + i]);
}

function isSamePoint(a, b) {
  return a[0] === b[0] && a[1] === b[1];
}

/**
 * @param {string[]} lines
 */
function* getNumbersInGrid(lines) {
  for (let x = 0; x < lines.length; x++) {
    const line = lines[x];
    for (const match of line.matchAll(/([0-9]+)/g)) {
      yield { number: match[0], pos: [x, Number(match.index)] };
    }
  }
}

function mainA(file) {
  const isCharNumber = (char) => !Number.isNaN(Number(char));
  const isCharSymbol = (char) => !isCharNumber(char) && char !== ".";

  let total = 0;
  const lines = readFileSync(file, { encoding: "utf-8" }).split("\n");

  for (const { number, pos } of getNumbersInGrid(lines)) {
    const touchSymbol = getTextNeighbors(lines, pos, number).some(([xN, yN]) => isCharSymbol(lines[xN][yN]));
    if (touchSymbol) total += Number(number);
  }

  return total;
}

/**
 * @param {string[]} lines
 */
function* getStarPoints(lines) {
  for (let x = 0; x < lines.length; x++) {
    const line = lines[x];
    for (let y = 0; y < line.length; y++) {
      if (line[y] === "*") yield [x, y];
    }
  }
}

function mainB(file) {
  let total = 0;
  const lines = readFileSync(file, { encoding: "utf-8" }).split("\n");

  const numbers = Array.from(getNumbersInGrid(lines)).map((number) => ({
    ...number,
    neighbors: getTextNeighbors(lines, number.pos, number.number),
  }));

  for (const starPoint of getStarPoints(lines)) {
    const numbersTouch = numbers.filter((number) => number.neighbors.some((n) => isSamePoint(starPoint, n)));
    if (numbersTouch.length === 2) total += Number(numbersTouch[0].number) * Number(numbersTouch[1].number);
  }

  return total;
}

assert.strictEqual(mainA("./spec.txt"), 4361);
console.log("A", mainA("./input.txt"));

assert.strictEqual(mainB("./spec.txt"), 467835);
console.log("B", mainB("./input.txt"));
