// @ts-check
const { readFileSync } = require("fs");

/**
 * @type {Array<Array<string>>}
 */
const paths = readFileSync("12.txt")
  .toString()
  .split("\n")
  .map((line) => line.split("-"));

/**
 * @param {string} node
 */
function isSmallCave(node) {
  return node !== "start" && node !== "end" && node.toLowerCase() === node;
}

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

  if (isSmallCave(node) && path.includes(node)) {
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

  return (
    paths
      // is connected
      .filter(([a, b]) => a === node || b === node)
      // dont include reverse path
      .map(([a, b]) => (a === node ? b : a))
      .filter((next) => canBeNextNode(next, path))
  );
}

function start() {
  const stack = [["start"]];
  const results = [];

  while (stack.length !== 0) {
    const path = stack.shift();

    for (const nextNode of getNextNodes(path)) {
      const nextPath = [...path, nextNode];

      if (nextNode === "end") {
        results.push(nextPath);
      } else {
        stack.push(nextPath);
      }
    }
  }

  console.log("Total path", results.length);
}

start();
