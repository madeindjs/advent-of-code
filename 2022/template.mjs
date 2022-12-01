import { readFile } from "fs/promises";
import assert from "node:assert";

/**
 * @param {string} file
 * @returns {Promise<string[]>}
 */
const readLines = (file) => readFile(file).then((buff) => buff.toString("utf-8").split("\n"));

/**
 * @param {string} file
 * @returns {Promise<number>}
 */
async function mainA(file) {
  const lines = await readLines(file);
  return 0;
}

/**
 * @param {string} file
 * @returns {Promise<number>}
 */
async function mainB(file) {
  const lines = await readLines(file);
  return 0;
}

async function main() {
  const testA = await mainA("spec.txt");
  assert.strictEqual(testA, 0);

  const resultA = await mainA("input.txt");
  console.log("result A", resultA);

  const testB = await mainB("spec.txt");
  assert.strictEqual(testB, 0);

  const resultB = await mainB("input.txt");
  console.log("result B", resultB);
}

main().catch(console.error);
