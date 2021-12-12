// Not works :'(
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
  return !["start", "end"].includes(node) && node.toLowerCase() === node;
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

  if (isSmallCave(node) && path.filter((n) => n === node).length === 2) {
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
  let results = 0;

  const start = new Date().getTime();

  while (stack.length !== 0) {
    const path = stack.shift();

    const nextNodes = getNextNodes(path);

    for (const nextNode of nextNodes) {
      const nextPath = [...path, nextNode];

      if (nextNode === "end") {
        const time = Math.round((new Date().getTime() - start) / 1000);
        console.log(`${results} - ${nextPath.join("-")} (${time}s) (stack: ${stack.length})`);
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
