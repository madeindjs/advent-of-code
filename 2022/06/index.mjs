import { readFileSync } from "fs";
import assert from "node:assert";

/**
 * @param {string} string
 * @param {number} size
 * @returns {number}
 */
function findMarker(string, size) {
  let cursor = 0;

  while (string[cursor + size]) {
    const letters = string.split("").slice(cursor, cursor + size);

    if (letters.every((letter) => letters.filter((l) => l === letter).length === 1)) {
      return cursor + size;
    }
    cursor++;
  }

  return -1;
}
assert.strictEqual(findMarker("mjqjpqmgbljsphdztnvjfqwrcgsmlb", 4), 7);
assert.strictEqual(findMarker("bvwbjplbgvbhsrlpgdmjqwftvncz", 4), 5);
assert.strictEqual(findMarker("nppdvjthqldpwncqszvftbrmjlhg", 4), 6);
assert.strictEqual(findMarker("nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg", 4), 10);
assert.strictEqual(findMarker("zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw", 4), 11);

assert.strictEqual(findMarker("mjqjpqmgbljsphdztnvjfqwrcgsmlb", 14), 19);
assert.strictEqual(findMarker("bvwbjplbgvbhsrlpgdmjqwftvncz", 14), 23);
assert.strictEqual(findMarker("nppdvjthqldpwncqszvftbrmjlhg", 14), 23);
assert.strictEqual(findMarker("nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg", 14), 29);
assert.strictEqual(findMarker("zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw", 14), 26);

const content = readFileSync("input.txt").toString("utf-8");
console.log("result A", findMarker(content, 4));
console.log("result B", findMarker(content, 14));
