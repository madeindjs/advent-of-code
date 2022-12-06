import { readFileSync } from "fs";
import assert from "node:assert";

/**
 *
 * @param {string} string
 * @returns {number}
 */
function findMarker(string) {
  let cursor = 0;

  while (string[cursor + 4]) {
    const letters = string.split("").slice(cursor, cursor + 4);

    if (letters.every((letter) => letters.filter((l) => l === letter).length === 1)) {
      return cursor + 4;
    }
    cursor++;
  }

  return -1;
}
assert.strictEqual(findMarker("mjqjpqmgbljsphdztnvjfqwrcgsmlb"), 7);
assert.strictEqual(findMarker("bvwbjplbgvbhsrlpgdmjqwftvncz"), 5);
assert.strictEqual(findMarker("nppdvjthqldpwncqszvftbrmjlhg"), 6);
assert.strictEqual(findMarker("nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg"), 10);
assert.strictEqual(findMarker("zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw"), 11);

/**
 * @param {string} file
 * @returns {number}
 */
function mainA(file) {
  const content = readFileSync(file).toString("utf-8");
  return findMarker(content);
}

// /**
//  * @param {string} file
//  * @returns {string}
//  */
// function mainB(file) {
//   const content = readFileSync(file).toString("utf-8");

//   const [stacksScheme, moves] = content.split("\n\n");
//   const stacks = parseStacks(stacksScheme);

//   for (const line of moves.split("\n")) {
//     const { from, to, qty } = parseMove(line);

//     const items = stacks[from].splice(stacks[from].length - qty);
//     stacks[to].push(...items);
//   }

//   return stacks.map((stack) => stack[stack.length - 1]).join("");
// }

function main() {
  // assert.strictEqual(mainA("spec.txt"), "CMZ");
  console.log("result A", mainA("input.txt"));

  // assert.strictEqual(mainB("spec.txt"), "MCD");
  // console.log("result B", mainB("input.txt"));
}

main();
