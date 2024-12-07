import assert from "node:assert";
import { open } from "node:fs/promises";

function parse(line: string) {
  const [resStr, numbersStr] = line.split(": ");
  const result = Number(resStr);
  const numbers = numbersStr.split(" ").map(Number);
  return { result, numbers };
}

function isMatching(result: number, numbers: number[], count = 0): boolean {
  const n = numbers.at(0);
  if (!n) return result === count;

  return (
    isMatching(result, numbers.slice(1), n + count) ||
    isMatching(result, numbers.slice(1), n * count)
  );
}

async function mainA(path: string) {
  const file = await open(new URL(path, import.meta.url));

  let total = 0;
  for await (const line of file.readLines()) {
    const { result, numbers } = parse(line);
    if (isMatching(result, numbers)) total += result;
  }
  return total;
}

assert.strictEqual(await mainA("./spec.txt"), 3749);
assert.strictEqual(await mainA("./input.txt"), 0);
