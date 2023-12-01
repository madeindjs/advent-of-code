import { readFileSync } from "fs";
import assert from "node:assert";

/**
 * @typedef Monkey
 * @property {string} name
 * @property {bigint[]} items
 * @property {(old: bigint) => bigint} operation
 * @property {bigint} testNumber
 * @property {string} testIfTrue
 * @property {string} testIfFalse
 * @property {bigint} inspectCount
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
      items: startingItemsStr.replace("  Starting items: ", "").split(", ").map(BigInt),
      operation: (old) => BigInt(eval(operationStr.replace("  Operation: new = ", ""))),
      testNumber: BigInt(testStr.replace("  Test: divisible by ", "")),
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
    .sort((a, b) => (b.inspectCount > a.inspectCount ? 1 : -1))
    .slice(0, 2)
    .reduce((acc, monkey) => monkey.inspectCount * acc, 1);
}

/**
 * @param {string} file
 */
function mainB(file) {
  const monkeys = loadMonkeys(file);

  for (let index = 0; index < 10_000; index++) {
    for (const monkey of monkeys) {
      for (let index = 0; index < monkey.items.length; index++) {
        monkey.inspectCount++;

        const item = monkey.items[index];
        let worryLevel = monkey.operation(item);

        const nextMonkey = worryLevel % monkey.testNumber === 0n ? monkey.testIfTrue : monkey.testIfFalse;
        monkeys.find(({ name }) => name === nextMonkey).items.push(worryLevel);
        monkey.items[index] = undefined;
      }
      monkey.items = monkey.items.filter(Boolean);
    }
    console.log(
      `round ${index + 1}`
      //monkeys.map((m) => m.inspectCount)
    );
  }

  return monkeys
    .sort((a, b) => b.inspectCount - a.inspectCount)
    .slice(0, 2)
    .reduce((acc, monkey) => monkey.inspectCount * acc, 1);
}

// assert.strictEqual(mainA("spec.txt"), 10605);
// const partA = mainA("input.txt");

// console.log("part A", partA);
// assert.strictEqual(partA, 66124);

assert.strictEqual(mainB("spec.txt"), 2713310158n);
const partB = mainB("input.txt");

// assert.strictEqual(partB, 2195372);
console.log("part B", partB);
assert.ok(partB > 14399640002);
assert.ok(partB > 14399640002);
