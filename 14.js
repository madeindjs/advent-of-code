// @ts-check
const { readFileSync } = require("fs");
const { strictEqual } = require("assert");

function parseFile(file) {
  const [start, couplesStr] = readFileSync(file).toString().split("\n\n");

  const couples = couplesStr.split("\n").reduce((acc, line) => {
    const [couple, char] = line.split(" -> ");
    acc[couple] = char;
    return acc;
  }, {});

  return { start, couples };
}

/**
 *
 * @param {string} start
 * @param {*} couples
 * @returns
 */
function replace(start, couples) {
  const toInsert = [];

  const keys = Object.keys(couples);

  for (let i = 0; i < start.length - 1; i++) {
    const chunk = start.substring(i, i + 2);
    const key = keys.find((k) => k === chunk);

    if (key !== undefined) {
      toInsert.push({
        index: i + 1,
        char: couples[key],
      });
    }
  }

  toInsert.sort((a, b) => b.index - a.index);

  for (const { index, char } of toInsert) {
    const before = start.substring(0, index);
    const end = start.substring(index);

    start = `${before}${char}${end}`;
  }

  return start;
}

function count(file, loop) {
  let { start, couples } = parseFile(file);

  for (let i = 0; i < loop; i++) {
    console.log(`loop ${i} (length: ${start.length})`);
    start = replace(start, couples);
  }

  const counts = start.split("").reduce((acc, char) => {
    if (acc[char] === undefined) {
      acc[char] = 1;
    } else {
      acc[char]++;
    }
    return acc;
  }, {});

  const maxCount = Math.max(...Object.values(counts));
  const minCount = Math.min(...Object.values(counts));

  return maxCount - minCount;

  // console.log(count);
}

function partA(file) {
  return count(file, 10);
}

function partB(file) {
  return count(file, 40);
}

const testCouples = parseFile("14.test.txt").couples;

strictEqual(replace("NNCB", testCouples), "NCNBCHB");
strictEqual(replace("NCNBCHB", testCouples), "NBCCNBBBCBHCB");

strictEqual(partA("14.test.txt"), 1588);

console.log("Part A", partA("14.txt"));
console.log("Part B", partB("14.txt"));
// not 67
