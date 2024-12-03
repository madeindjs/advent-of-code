import assert from "node:assert";
import { readFileSync } from "node:fs";

const input = readFileSync(new URL("./input.txt", import.meta.url), {
  encoding: "utf8",
});

function mainA(line: string) {
  let total = 0;
  for (const match of line.matchAll(/mul\(([0-9]{1,3}),([0-9]{1,3})\)/g)) {
    total += Number(match[1]) * Number(match[2]);
  }
  return total;
}

function splitOnce(str: string, separator: string) {
  const [first, ...rest] = str.split(separator);
  if (rest.length === 0) return [first];
  return [first, rest.join(separator)];
}

function keepDo(line: string): string {
  const [todo, rest] = splitOnce(line, "don't()");
  if (rest === undefined) return todo;
  const [_, after] = splitOnce(rest, "do()");
  return `${todo}${keepDo(after ?? "")}`;
}
assert.strictEqual(keepDo("1don't()2"), "1");
assert.strictEqual(keepDo("1don't()2do()3"), "13");
assert.strictEqual(keepDo("1don't()2do()3don't()4do()5"), "135");

function mainB(line: string): number {
  return mainA(keepDo(line));
}
assert.strictEqual(
  mainB(
    "xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))",
  ),
  48,
);

assert.strictEqual(mainA(input), 173529487);
assert.strictEqual(mainB(input), 99532691);
