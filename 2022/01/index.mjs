import { readFile } from "fs/promises";
import assert from "node:assert";

/**
 * @param {string[]} lines
 * @return {number[]}
 */
function getGuys(lines) {
  /** @type {number[]} */
  const guys = [];
  let i = 0;

  for (const line of lines) {
    if (line === "") {
      i++;
      continue;
    }

    guys[i] ??= 0;
    guys[i] += Number(line);
  }

  return guys;
}

/**
 * @param {string} file
 * @returns {Promise<number>}
 */
async function mainA(file) {
  const lines = await readFile(file).then((buff) => buff.toString("utf-8").split("\n"));
  const guys = getGuys(lines);

  return Math.max(...guys);
}

/**
 * @param {string} file
 * @returns {Promise<number>}
 */
async function mainB(file) {
  const lines = await readFile(file).then((buff) => buff.toString("utf-8").split("\n"));

  return getGuys(lines)
    .sort()
    .slice(0, 3)
    .reduce((a, b) => a + b, 0);
}

async function main() {
  const testA = await mainA("spec.txt");
  assert.strictEqual(testA, 24000);

  const resultA = await mainA("input.txt");
  console.log("result A", resultA);

  const testB = await mainB("spec.txt");
  assert.strictEqual(testB, 45000);

  const resultB = await mainB("input.txt");
  console.log("result B", resultB);
}

main().catch(console.error);
