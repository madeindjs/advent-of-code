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
  assert.strictEqual(await mainA("spec.txt"), 0);
  console.log("result A", await mainA("input.txt"));

  assert.strictEqual(await mainB("spec.txt"), 0);
  console.log("result B", await mainB("input.txt"));
}

main().catch(console.error);
