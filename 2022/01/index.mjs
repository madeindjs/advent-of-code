import { createReadStream } from "fs";
import assert from "node:assert";
import readline from "readline";

/**
 * @param {readline.Interface} lines
 * @return {Promise<number[]>}
 */
async function getGuys(lines) {
  /** @type {number[]} */
  const guys = [];
  let i = 0;

  for await (const line of lines) {
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
  const lines = readline.createInterface({ input: createReadStream(file) });
  const guys = await getGuys(lines);

  return Math.max(...guys);
}

/**
 * @param {string} file
 * @returns {Promise<number>}
 */
async function mainB(file) {
  const lines = readline.createInterface({ input: createReadStream(file) });
  const guys = await getGuys(lines);

  return guys
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
