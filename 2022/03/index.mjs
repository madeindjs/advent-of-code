import { createReadStream } from "fs";
import assert from "node:assert";
import readline from "readline";

/**
 * @param {string} string
 * @returns {[string, string]}
 */
function splitString(string) {
  return [string.substring(0, string.length / 2), string.substring(string.length / 2)];
}
assert.deepEqual(splitString("AB"), ["A", "B"]);
assert.deepEqual(splitString("ABCD"), ["AB", "CD"]);

/**
 * @param {string} char
 * @returns {number}
 */
function getPriority(char) {
  const abc = "abcdefghijklmnopqrstuvwxyz".split("");
  const index = abc.findIndex((c) => c === char.toLowerCase());
  const isUpper = char.toUpperCase() === char;

  return index + 1 + (isUpper ? 26 : 0);
}
assert.strictEqual(getPriority("c"), 3);
assert.strictEqual(getPriority("C"), 3 + 26);

/**
 * @param {string} file
 * @returns {Promise<number>}
 */
async function mainA(file) {
  let result = 0;
  for await (const line of readline.createInterface({ input: createReadStream(file) })) {
    const [compartment1, compartment2] = splitString(line).map((s) => s.split(""));

    const duplicate = compartment1.find((item1) => compartment2.includes(item1));
    if (duplicate === undefined) throw Error();

    result += getPriority(duplicate);
  }
  return result;
}

/**
 * @param {string} file
 * @return {AsyncGenerator<string[][], void, unknown>}
 */
async function* getGroups(file) {
  let current = [];
  for await (const line of readline.createInterface({ input: createReadStream(file) })) {
    current.push(line.split(""));

    if (current.length === 3) {
      yield current;
      current = [];
    }
  }
}

/**
 * @param {string} file
 * @returns {Promise<number>}
 */
async function mainB(file) {
  let result = 0;
  for await (const [compartment1, compartment2, compartment3] of getGroups(file)) {
    const badge = compartment1.find((c1) => compartment2.includes(c1) && compartment3.includes(c1));
    if (badge === undefined) throw Error();

    result += getPriority(badge);
  }
  return result;
}

async function main() {
  assert.strictEqual(await mainA("spec.txt"), 157);
  console.log("result A", await mainA("input.txt"));

  assert.strictEqual(await mainB("spec.txt"), 70);
  console.log("result B", await mainB("input.txt"));
}

main().catch(console.error);
