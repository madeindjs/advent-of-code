import { readFileSync } from "fs";
import assert from "node:assert";

/**
 * @param {string} file
 */
function mainA(file) {
  const lines = readFileSync(file).toString("utf-8").split("\n");

  let cycle = 0;
  let value = 1;

  let checkpoints = [];

  for (const line of lines) {
    const [verb, qtyStr] = line.split(" ");

    const wait = verb === "noop" ? 1 : 2;

    for (let index = 0; index < wait; index++) {
      cycle++;
      if (verb === "addx" && index === wait - 1) value += Number(qtyStr);

      console.log(line);
      console.log("##", { cycle, value, qtyStr, line });

      if ([20, 60, 100, 140, 180, 220].includes(cycle)) {
        checkpoints.push(value * cycle);
        console.log("##", { cycle, value, qtyStr, line });
      }
    }
  }

  return checkpoints.reduce((acc, v) => acc + v, 0);
}

/**
 * @param {string} file
 */
function mainB(file) {
  const lines = readFileSync(file).toString("utf-8").split("\n");

  return 0;
}

assert.strictEqual(mainA("spec-small.txt"), 13140);
assert.strictEqual(mainA("spec.txt"), 13140);
// const partA = mainA("input.txt");
// assert.ok(partA < 14560);
// console.log("part A", partA);
// assert.strictEqual(partA, 1770595);

// assert.strictEqual(mainB("spec.txt"), 24933642);
// const partB = mainB("input.txt");

// assert.strictEqual(partB, 2195372);
// console.log("part B", partB);
