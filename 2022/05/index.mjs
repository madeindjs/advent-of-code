import { readFileSync } from "fs";
import assert from "node:assert";
import readline from "readline";

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
  return { from: Number(matches[2]), to: Number(matches[3]), qty: Number(matches[1]) };
}
assert.deepEqual(parseMove("move 1 from 2 to 3"), { from: 2, to: 3, qty: 1 });

/**
 * @param {string} file
 * @returns {Promise<string>}
 */
async function mainA(file) {
  const content = readFileSync(file).toString("utf-8");

  const [stacksScheme, moves] = content.split("\n\n");
  const stacks = parseStacks(stacksScheme);

  for (const line of moves.split("\n")) {
    const { from, to, qty } = parseMove(line);

    new Array(qty).fill(undefined).forEach(() => {
      const item = stacks[from - 1].pop();
      stacks[to - 1].push(item);
    });
  }

  return stacks.map((stack) => stack[stack.length - 1]).join("");
}

/**
 * @param {string} file
 * @returns {Promise<number>}
 */
async function mainB(file) {
  for await (const line of readline.createInterface({ input: createReadStream(file) })) {
  }
  return 0;
}

async function main() {
  assert.strictEqual(await mainA("spec.txt"), "CMZ");
  console.log("result A", await mainA("input.txt"));

  // assert.strictEqual(await mainB("spec.txt"), 0);
  // console.log("result B", await mainB("input.txt"));
}

main().catch(console.error);
