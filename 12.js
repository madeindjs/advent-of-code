// @ts-check
const assert = require("assert");
const { readFileSync } = require("fs");

/**
 * @type {Array<Array<string>>}
 */
const paths = readFileSync("12.txt")
  .toString()
  .split("\n")
  .map((line) => line.split("-"));

const nodes = paths
  .flatMap((p) => p)
  .reduce((acc, v) => {
    if (!acc.includes(v)) {
      acc.push(v);
    }
    return acc;
  }, []);

/**
 * @param {string} node
 */
function isSmallCave(node) {
  return !["start", "end"].includes(node) && node.toLowerCase() === node;
}

const smallCaves = nodes.filter(isSmallCave);

// /**
//  * @param {string} node
//  */
// function isBigCave(node) {
//   return node.toUpperCase() === node;
// }

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

  // const previousNode = path[path.length - 1];

  // if (node === previousNode) {
  //   return false;
  // }

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

function uniq(a) {
  return Array.from(new Set(a));
}

function start() {
  const stack = [["start"]];
  const results = [];

  // const sma

  while (stack.length !== 0) {
    const path = stack.shift();

    const nextNodes = getNextNodes(path);

    for (const nextNode of nextNodes) {
      const nextPath = [...path, nextNode];

      if (nextNode === "end") {
        const finalPath = [...path, nextNode];

        // if (smallCaves.every((cave) => nextPath.includes(cave))) {
        results.push(finalPath);
        // } else {
        // console.error(`Invalid path ${nextPath.join("-")}`);
        // }
      } else {
        stack.push(nextPath);
      }
    }
  }

  console.log("Total path", results.length);

  const reachableSmallCaves = uniq(results.flatMap((r) => r).filter(isSmallCave));
  // console.log(reachableSmallCaves);

  const filterPath = results.filter((result) => reachableSmallCaves.every((cave) => result.includes(cave)));
  console.log("Filter path", filterPath.length);

  // console.log(results);

  // return finishPath(["start"]);
  // let currentNode = "start";
  // let path = [];

  // const nextNode =
}

console.log(start());
// 591 too low

// console.log("smallCaves", smallCaves.length);
