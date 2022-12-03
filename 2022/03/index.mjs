import { createReadStream } from "fs";
import assert from "node:assert";
import readline from "readline";

// class Rucksack {
//   /** @var {string} */
//   #content;
//   /**
//    * @param {string} content
//    */
//   constructor(content) {
//     this.#content = content;
//   }
// }

/**
 *
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

    const duplicate = compartment1.find((item1) => compartment2.some((item2) => item2 === item1));
    if (duplicate === undefined) throw Error();

    result += getPriority(duplicate);
  }
  return result;
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
  assert.strictEqual(await mainA("spec.txt"), 157);
  console.log("result A", await mainA("input.txt"));

  // assert.strictEqual(await mainB("spec.txt"), 0);
  // console.log("result B", await mainB("input.txt"));
}

main().catch(console.error);
