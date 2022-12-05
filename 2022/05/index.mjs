import { readFileSync } from "fs";
import assert from "node:assert";

/**
 * @param {string} stackScheme
 * @returns {string[][]}
 */
function parseStacks(stackScheme) {
  const lines = stackScheme.split("\n");
  lines.pop(); // remove legend line

  const result = [];

  for (const line of lines.reverse()) {
    let i = 0;
    let index = i * 4 + 1;
    do {
      result[i] ??= [];
      if (line[index] !== " ") result[i].push(line[index]);
      i++;
      index = i * 4 + 1;
    } while (line[index] !== undefined);
  }

  return result;
}
assert.deepEqual(
  parseStacks(`    [D]
[N] [C]
[Z] [M] [P]
 1   2   3`),
  [["Z", "N"], ["M", "C", "D"], ["P"]]
);

/**
 * @param {string} line
 */
function parseMove(line) {
  const matches = /move ([0-9]+) from ([0-9]+) to ([0-9]+)/.exec(line);
  if (!matches) throw Error();
  return { from: Number(matches[2]) - 1, to: Number(matches[3]) - 1, qty: Number(matches[1]) };
}
assert.deepEqual(parseMove("move 1 from 2 to 3"), { from: 1, to: 2, qty: 1 });

/**
 * @param {string} file
 * @returns {string}
 */
function mainA(file) {
  const content = readFileSync(file).toString("utf-8");

  const [stacksScheme, moves] = content.split("\n\n");
  const stacks = parseStacks(stacksScheme);

  for (const line of moves.split("\n")) {
    const { from, to, qty } = parseMove(line);

    new Array(qty).fill(undefined).forEach(() => {
      const item = stacks[from].pop();
      if (!item) throw Error;
      stacks[to].push(item);
    });
  }

  return stacks.map((stack) => stack[stack.length - 1]).join("");
}

/**
 * @param {string} file
 * @returns {string}
 */
function mainB(file) {
  const content = readFileSync(file).toString("utf-8");

  const [stacksScheme, moves] = content.split("\n\n");
  const stacks = parseStacks(stacksScheme);

  for (const line of moves.split("\n")) {
    const { from, to, qty } = parseMove(line);

    const items = stacks[from].splice(stacks[from].length - qty);
    stacks[to].push(...items);
  }

  return stacks.map((stack) => stack[stack.length - 1]).join("");
}

function main() {
  assert.strictEqual(mainA("spec.txt"), "CMZ");
  console.log("result A", mainA("input.txt"));

  assert.strictEqual(mainB("spec.txt"), "MCD");
  console.log("result B", mainB("input.txt"));
}

main();
