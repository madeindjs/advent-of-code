import assert from "node:assert";
import { readFileSync } from "node:fs";

const parseFile = (file) =>
  readFileSync(file, { encoding: "utf-8" })
    .split("\n")
    .map((line) => line.split(" ").map(Number));

/**
 * @template T
 * @param {Array<T>} arr
 * @returns T
 */
const last = (arr) => arr[arr.length - 1];

/** @param {number[]} line */
function buildGraph(line) {
  const graph = [line];

  while (!last(graph).every((a) => a === 0)) {
    const lastLine = last(graph);
    const newLine = [];
    for (let i = 0; i < lastLine.length - 1; i++) {
      newLine.push(lastLine[i + 1] - lastLine[i]);
    }
    graph.push(newLine);
  }
  return graph;
}
assert.deepEqual(buildGraph([0, 3, 6, 9, 12, 15]), [
  [0, 3, 6, 9, 12, 15],
  [3, 3, 3, 3, 3],
  [0, 0, 0, 0],
]);

/** @param {number[]} line */
function computeLineRight(line) {
  const graph = buildGraph(line);
  last(graph).push(0);

  for (let i = graph.length - 2; i >= 0; i--) {
    const previousLine = graph[i + 1];
    const line = graph[i];
    line.push(last(line) + last(previousLine));
  }

  const firstLine = graph[0];
  return last(firstLine);
}
assert.strictEqual(computeLineRight([0, 3, 6, 9, 12, 15]), 18);
assert.strictEqual(computeLineRight([1, 3, 6, 10, 15, 21]), 28);

/** @param {number[]} line */
function computeLineLeft(line) {
  const graph = buildGraph(line);
  last(graph).unshift(0);

  for (let i = graph.length - 2; i >= 0; i--) {
    const previousLine = graph[i + 1];
    const line = graph[i];
    line.unshift(line[0] - previousLine[0]);
  }

  return graph[0][0];
}
assert.strictEqual(computeLineLeft([10, 13, 16, 21, 30, 45]), 5);

const spec = parseFile("spec.txt");
const input = parseFile("input.txt");

const mainA = (lines) => lines.reduce((acc, line) => acc + computeLineRight(line), 0);
assert.strictEqual(mainA(spec), 114);
console.log(mainA(input));

const mainB = (lines) => lines.reduce((acc, line) => acc + computeLineLeft(line), 0);
console.log(mainB(input));
