import { readFileSync } from "fs";
import assert from "node:assert";

/**
 * @typedef {{instructions: number[], nodes: Map<string, [string, string]>}} Network
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
  return { instructions: instructions.split("").map((c) => (c === "L" ? 0 : 1)), nodes: new Map(nodes) };
}

/**
 * @param {Network} network
 * @param {string} from
 * @param {(node: string) => boolean} goal
 */
function computePathLength(network, from, goal) {
  let i = 0;
  let current = from;

  while (!goal(current)) {
    const direction = network.instructions.at(i % network.instructions.length);
    if (direction === undefined) throw Error();
    const node = network.nodes.get(current);
    if (!node) throw Error(`Could not find node ${current}`);
    current = node[direction];
    i++;
  }

  return i;
}

/** @param {Network} network */
const mainA = (network) => computePathLength(network, "AAA", (n) => n === "ZZZ");

/**  @param {Network} network */
function mainB(network) {
  let nodesA = new Set(Array.from(network.nodes.keys()).filter((p) => p.endsWith("A")));

  const res = [];
  for (const node of nodesA) {
    res.push(computePathLength(network, node, (p) => p.endsWith("Z")));
  }

  const gcd = (a, b) => (a ? gcd(b % a, a) : b);
  const lcm = (a, b) => (a * b) / gcd(a, b);
  return res.reduce(lcm);
}

{
  const spec = parseFile("spec.txt");
  assert.strictEqual(mainA(spec), 2);

  const input = parseFile("input.txt");
  const partA = mainA(input);
  console.log("part A", partA);
  assert.strictEqual(partA, 20659);
}

{
  const spec = parseFile("spec2.txt");
  assert.strictEqual(mainB(spec), 6);

  const input = parseFile("input.txt");
  const partB = mainB(input);
  console.log("part B", partB);
  assert.strictEqual(partB, 15690466351717);
}
