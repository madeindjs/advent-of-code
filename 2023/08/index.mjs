import { readFileSync } from "fs";
import assert from "node:assert";

/**
 * @typedef {{instructions: string, nodes: Map<string, [string, string]>}} Network
 * @param {string} file
 * @returns {Network}
 */
function parseFile(file) {
  const [instructions, lines] = readFileSync(file).toString("utf-8").split("\n\n");

  const nodes = lines.split("\n").map((line) => {
    const [r, o] = line.split(" = ");
    return [r, o.replace("(", "").replace(")", "").split(", ")];
  });
  // @ts-ignore
  return { instructions, nodes: new Map(nodes) };
}

/**
 * @param {Network} network
 */
function mainA(network) {
  let i = 0;
  let current = "AAA";

  while (current !== "ZZZ") {
    console.log(current);
    const direction = network.instructions.at(i % network.instructions.length);
    const node = network.nodes.get(current);
    if (!node) throw Error(`Could not find node ${current}`);
    current = node[direction === "L" ? 0 : 1];
    i++;
  }

  return i;
}

/**
 * @param {string} file
 */
function mainB(file) {
  const lines = readFileSync(file).toString("utf-8").split("\n");

  return 0;
}

const spec = parseFile("spec.txt");
const input = parseFile("input.txt");
{
  assert.strictEqual(mainA(spec), 2);
  const partA = mainA(input);
  console.log("part A", partA);
  // assert.strictEqual(partA, 1770595);
}

// assert.strictEqual(mainB("spec.txt"), 24933642);
// const partB = mainB("input.txt");

// assert.strictEqual(partB, 2195372);
// console.log("part B", partB);
