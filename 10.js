// @ts-check
const assert = require("assert");
const { getFips } = require("crypto");
const { readFileSync } = require("fs");

const getLines = (file) => readFileSync(file).toString().split("\n");

const couples = [
  { start: "{", end: "}", p: 1197 },
  { start: "(", end: ")", p: 3 },
  { start: "[", end: "]", p: 57 },
  { start: "<", end: ">", p: 25137 },
];

/**
 * @param {string} line
 */
function findClosingChar(line) {
  let position = 0;

  const stack = [];

  do {
    const char = line[position];

    const openingCouple = couples.find(({ start }) => start === char);

    if (openingCouple) {
      stack.push(openingCouple);
      position++;
      continue;
    }

    const lastCouple = stack.pop();

    if (char !== lastCouple.end) {
      // console.log(char);
      // return lastCouple.p;
      return couples.find(({ end, start }) => end === char || start === char).p;
    } else {
      position++;
    }
  } while (stack.length !== 0 && line.length > position);

  return 0;
}

// assert.throws(() => , );

assert.strictEqual(findClosingChar("{(<>)}"), 0);
assert.strictEqual(findClosingChar("{<}"), 1197);

function partA(file) {
  return getLines(file)
    .map(findClosingChar)
    .reduce((a, b) => a + b, 0);
}

// console.log(getLines("10.test.txt").map(findClosingChar));
assert.strictEqual(partA("10.test.txt"), 26397);
console.log("Part A", partA("10.txt"));

// console.log();
