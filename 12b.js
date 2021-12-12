// Not works cauz' too long :'(
// @ts-check
const { readFileSync } = require("fs");

const map = new Map();

/**
 * @typedef {{current: string, smallCaves: [], length: number}} Path
 */

/**
 * @type {Array<Array<string>>}
 */
const paths = readFileSync("12.txt")
  .toString()
  .split("\n")
  .map((line) => line.split("-"));

const nextPaths = new Map();

paths.forEach(([a, b]) => {
  const mA = nextPaths.get(a);

  if (mA === undefined) {
    nextPaths.set(a, [b]);
  } else {
    nextPaths.set(a, [...mA, b]);
  }

  const mB = nextPaths.get(a);

  if (mB === undefined) {
    nextPaths.set(b, [a]);
  } else {
    nextPaths.set(b, [...mB, a]);
  }
});

/**
 * @param {string} node
 */
function isSmallCave(node) {
  return node !== "start" && node !== "end" && node.toLowerCase() === node;
}

/**
 *
 * @param {string} node
 * @param {Path} path
 * @returns {boolean}
 */
function canBeNextNode(node, path) {
  if (node === "start") {
    return false;
  }

  if (isSmallCave(node) && path.smallCaves.filter((n) => n === node).length === 2) {
    return false;
  }

  return true;
}

/**
 * @param {Path} path
 * @returns {string[]}
 */
function getNextNodes(path) {
  const node = path.current;

  return nextPaths.get(node).filter((next) => canBeNextNode(next, path));
}

function start() {
  /** @type {Path[]} */
  const stack = [{ current: "start", smallCaves: [], length: 1 }];
  let results = 0;

  const start = new Date().getTime();

  while (stack.length !== 0) {
    const path = stack.shift();

    const nextNodes = getNextNodes(path);

    for (const nextNode of nextNodes) {
      const smallCaves = isSmallCave(nextNode) ? [...path.smallCaves, nextNode] : [...path.smallCaves];
      /** @type {Path} */
      const nextPath = { current: nextNode, length: path.length + 1, smallCaves };

      if (nextNode === "end") {
        const time = Math.round((new Date().getTime() - start) / 1000);
        console.log(`${results} -  (${time}s) (stack: ${stack.length})`);
        // results.push(nextPath);
        results++;
      } else {
        stack.push(nextPath);
      }
    }
  }

  console.log("Total path", results);
  // console.timeEnd();
}

start();
