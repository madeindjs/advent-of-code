// @ts-check
const { strictEqual, ok } = require("assert");
const { assert } = require("console");
const { readFileSync } = require("fs");

function partB(file) {
  /**
   * @type {Array<Array<string>>}
   */
  const paths = readFileSync(file)
    .toString()
    .split("\n")
    .map((line) => line.split("-"));

  /**
   * @param {string} node
   */
  function isSmallCave(node) {
    return node !== "start" && node !== "end" && node.toLowerCase() === node;
  }

  const smallCaves = paths
    .flatMap((a) => a)
    .reduce((acc, p) => {
      if (isSmallCave(p) && !acc.includes(p)) {
        acc.push(p);
      }

      return acc;
    }, []);

  /**
   *
   * @param {string} node
   * @param {string[]} path
   * @returns {boolean}
   */
  function canBeNextNode(node, path) {
    if (node === "start") {
      return false;
    }

    const haveVisitedSmallCaveTwice = smallCaves.some((sC) => path.filter((n) => n === sC).length > 1);

    if (isSmallCave(node)) {
      return haveVisitedSmallCaveTwice ? !path.includes(node) : true;

      //  return false;
    }

    return true;
  }

  /**
   * @param {string[]} path
   * @returns {string[]}
   */
  function getNextNodes(path) {
    const node = path[path.length - 1];

    return (
      paths
        // is connected
        .filter(([a, b]) => a === node || b === node)
        // dont include reverse path
        .map(([a, b]) => (a === node ? b : a))
        .filter((next) => canBeNextNode(next, path))
    );
  }

  const stack = [["start"]];
  const results = [];

  while (stack.length !== 0) {
    const path = stack.shift();

    for (const nextNode of getNextNodes(path)) {
      const nextPath = [...path, nextNode];

      if (nextNode === "end") {
        results.push(nextPath.join(","));
        // console.log("found this path", nextPath.join(","));
      } else {
        stack.push(nextPath);
      }
    }
  }

  return results;
}

const testResult = partB("12.test.txt");

const expectedTestsResult = [
  "start,A,b,A,b,A,c,A,end",
  "start,A,b,A,b,A,end",
  "start,A,b,A,b,end",
  "start,A,b,A,c,A,b,A,end",
  "start,A,b,A,c,A,b,end",
  "start,A,b,A,c,A,c,A,end",
  "start,A,b,A,c,A,end",
  "start,A,b,A,end",
  "start,A,b,d,b,A,c,A,end",
  "start,A,b,d,b,A,end",
  "start,A,b,d,b,end",
  "start,A,b,end",
  "start,A,c,A,b,A,b,A,end",
  "start,A,c,A,b,A,b,end",
  "start,A,c,A,b,A,c,A,end",
  "start,A,c,A,b,A,end",
  "start,A,c,A,b,d,b,A,end",
  "start,A,c,A,b,d,b,end",
  "start,A,c,A,b,end",
  "start,A,c,A,c,A,b,A,end",
  "start,A,c,A,c,A,b,end",
  "start,A,c,A,c,A,end",
  "start,A,c,A,end",
  "start,A,end",
  "start,b,A,b,A,c,A,end",
  "start,b,A,b,A,end",
  "start,b,A,b,end",
  "start,b,A,c,A,b,A,end",
  "start,b,A,c,A,b,end",
  "start,b,A,c,A,c,A,end",
  "start,b,A,c,A,end",
  "start,b,A,end",
  "start,b,d,b,A,c,A,end",
  "start,b,d,b,A,end",
  "start,b,d,b,end",
  "start,b,end",
];

expectedTestsResult.forEach((expectedPath) =>
  ok(testResult.includes(expectedPath), `result not include ${expectedPath}`)
);

testResult.forEach((result) => ok(expectedTestsResult.includes(result), `result have this path in trop ${result}`));

strictEqual(testResult.length, 36);

console.log(partB("12.txt").length);
