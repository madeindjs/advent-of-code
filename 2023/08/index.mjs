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
 */
function mainA(network) {
  let i = 0;
  let current = "AAA";

  while (current !== "ZZZ") {
    const direction = network.instructions.at(i % network.instructions.length);
    if (direction === undefined) throw Error();
    const node = network.nodes.get(current);
    if (!node) throw Error(`Could not find node ${current}`);
    current = node[direction];
    i++;
  }

  return i;
}

/**
 * @param {Network} network
 */
function mainB(network) {
  const isPointA = (p) => p.endsWith("A");
  const isPointZ = (p) => p.endsWith("Z");

  let i = 0;

  let current = new Set(Array.from(network.nodes.keys()).filter(isPointA));

  console.log(current);

  const isFinished = () => {
    for (const p of current) {
      if (!isPointZ(p)) return false;
    }
    return true;
  };

  while (!isFinished()) {
    const direction = network.instructions.at(i % network.instructions.length);
    if (direction === undefined) throw Error;
    let newCurrent = new Set();

    for (const point of current) {
      const node = network.nodes.get(point);
      if (!node) throw Error(`Could not find node ${current}`);
      newCurrent.add(node[direction]);
    }

    current = newCurrent;
    i++;
  }

  console.log(current);

  return i;
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
  // assert.strictEqual(partB, 20659);
}
