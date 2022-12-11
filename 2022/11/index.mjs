import { readFileSync } from "fs";
import assert from "node:assert";

/**
 * @typedef Monkey
 * @property {string} name
 * @property {number[]} items
 * @property {(old: number) => number} operation
 * @property {number} testNumber
 * @property {string} testIfTrue
 * @property {string} testIfFalse
 * @property {number} inspectCount
 */

/**
 * @param {string} file
 * @return {Monkey[]}
 */
function loadMonkeys(file) {
  const monkeys = [];

  for (const monkeysStr of readFileSync(file).toString("utf-8").split("\n\n")) {
    const [nameStr, startingItemsStr, operationStr, testStr, trueStr, falseStr] = monkeysStr.split("\n");

    monkeys.push({
      name: nameStr.slice(0, -1).toLowerCase(),
      items: startingItemsStr.replace("  Starting items: ", "").split(", ").map(Number),
      operation: (old) => Number(eval(operationStr.replace("  Operation: new = ", ""))),
      testNumber: Number(testStr.replace("  Test: divisible by ", "")),
      testIfTrue: trueStr.replace("    If true: throw to ", "").toLowerCase(),
      testIfFalse: falseStr.replace("    If false: throw to ", "").toLowerCase(),
      inspectCount: 0,
    });
  }

  return monkeys;
}

/**
 * @param {string} file
 */
function mainA(file) {
  const monkeys = loadMonkeys(file);

  for (let index = 0; index < 20; index++) {
    for (const monkey of monkeys) {
      for (let index = 0; index < monkey.items.length; index++) {
        monkey.inspectCount++;

        const item = monkey.items[index];
        const worryLevel = Math.floor(monkey.operation(item) / 3);
        const nextMonkey = worryLevel % monkey.testNumber === 0 ? monkey.testIfTrue : monkey.testIfFalse;
        monkeys.find(({ name }) => name === nextMonkey).items.push(worryLevel);
        monkey.items[index] = undefined;
      }
      monkey.items = monkey.items.filter(Boolean);
    }
    // console.log(`round ${index + 1}`, monkeys);
  }

  return monkeys
    .sort((a, b) => b.inspectCount - a.inspectCount)
    .slice(0, 2)
    .reduce((acc, monkey) => monkey.inspectCount * acc, 1);
}

/**
 * @param {string} file
 */
function mainB(file) {
  const lines = readFileSync(file).toString("utf-8").split("\n");

  return 0;
}

assert.strictEqual(mainA("spec.txt"), 10605);
const partA = mainA("input.txt");

console.log("part A", partA);
assert.strictEqual(partA, 66124);

assert.strictEqual(mainB("spec.txt"), 24933642);
const partB = mainB("input.txt");

assert.strictEqual(partB, 2195372);
console.log("part B", partB);
