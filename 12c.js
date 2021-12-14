// @ts-check
const { readFileSync } = require("fs");

/**
 * @type {Array<Array<string>>}
 */
const paths = readFileSync("12.test.txt")
  .toString()
  .split("\n")
  .map((line) => line.split("-"));

/**
 * @param {string} node
 */
function isSmallCave(node) {
  return node !== "start" && node !== "end" && node.toLowerCase() === node;
}


const nextPaths = new Map();

paths.forEach(([a, b]) => {
  const mA = nextPaths.get(a);
  
  if (mA === undefined) {
    nextPaths.set(a, [b]);
  } else {
    nextPaths.set(a, [...mA, b]);
  }
  
  const mB = nextPaths.get(b);
  
  if (mB === undefined) {
    nextPaths.set(b, [a]);
  } else {
    nextPaths.set(b, [...mB, a]);
  }
});

const smallCaves = Array.from(nextPaths.keys()).filter(isSmallCave)

c
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

  if (isSmallCave(node) && path.filter((p) => node === p).length === 2) {
    return false;
  }

  return true;
}

/**
 * @param {string[]} path
 * @returns {string[]}
 */
function getNextNodes(path) {
  const node = path[path.length - 1];

  return nextPaths.get(node).filter((next) => canBeNextNode(next, path));
}

function start() {
  const stack = [["start"]];
  const results = [];

  while (stack.length !== 0) {
    const path = stack.shift();

    for (const nextNode of getNextNodes(path)) {
      const nextPath = [...path, nextNode];

      if (nextNode === "end") {
        console.log(`${nextPath.join(",")} (stack:${stack.length})`);
        results.push(nextPath);
      } else {
        stack.push(nextPath);
      }
    }
  }

  console.log("Total path", results.length);
}

start();
