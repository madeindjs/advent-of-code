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
  ].filter(([x, y]) => lines[x]?.[y] !== undefined || blacklist.some(([xB, yB]) => xB === x && yB === y));
}

/**
 * @param {string[]} lines
 * @param {number[]} param1
 * @param {string} str
 */
function getNeighborsString(lines, [x, y], str) {
  return str
    .split("")
    .map((_, i) => [x, y + i])
    .flatMap(([xN, yN], _, points) => getNeighbors(lines, [xN, yN], points));
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

const isCharNumber = (char) => !Number.isNaN(Number(char));
const isCharSymbol = (char) => !isCharNumber(char) && char !== ".";

function mainA(file) {
  let total = 0;
  const lines = readFileSync(file, { encoding: "utf-8" }).split("\n");

  for (const { number, pos } of getNumbersInGrid(lines)) {
    const touchSymbol = getNeighborsString(lines, pos, number).some(([xN, yN]) => isCharSymbol(lines[xN][yN]));
    if (touchSymbol) total += Number(number);
  }

  return total;
}

assert.strictEqual(mainA("./spec.txt"), 4361);
console.log("A", mainA("./input.txt"));
