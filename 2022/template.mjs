import { createReadStream } from "fs";
import assert from "node:assert";
import readline from "readline";

/**
 * @param {string} file
 * @returns {Promise<number>}
 */
async function mainA(file) {
  const lines = readline.createInterface({ input: createReadStream(file) });
  return 0;
}

/**
 * @param {string} file
 * @returns {Promise<number>}
 */
async function mainB(file) {
  const lines = readline.createInterface({ input: createReadStream(file) });
  return 0;
}

async function main() {
  const testA = await mainA("spec.txt");
  assert.strictEqual(testA, 0);

  const resultA = await mainA("input.txt");
  console.log("result A", resultA);

  const testB = await mainB("spec.txt");
  assert.strictEqual(testB, 45000);

  const resultB = await mainB("input.txt");
  console.log("result B", resultB);
}

main().catch(console.error);
