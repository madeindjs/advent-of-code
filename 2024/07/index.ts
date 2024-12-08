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
  if (n === undefined) return result === count;

  return [n + count, n * count]
    .filter((next) => next <= result)
    .some((next) => isMatching(result, numbers.slice(1), next));
}

function isMatching2(result: number, numbers: number[], count = 0): boolean {
  const n = numbers.at(0);
  if (n === undefined) return result === count;

  return [n + count, n * count, Number(`${count ?? ""}${n ?? "0"}`)]
    .filter((next) => next <= result)
    .some((next) => isMatching2(result, numbers.slice(1), next));
}
assert.ok(isMatching2(156, [15, 6]));
assert.ok(isMatching2(123, [1, 2, 3]));

async function main(
  path: string,
  isMatching: (result: number, numbers: number[], count: number) => boolean,
) {
  const file = await open(new URL(path, import.meta.url));

  let total = 0;
  for await (const line of file.readLines()) {
    const { result, numbers } = parse(line);
    if (isMatching(result, numbers, 0)) total += result;
  }
  return total;
}

assert.strictEqual(await main("./spec.txt", isMatching), 3749);
assert.strictEqual(await main("./input.txt", isMatching), 2654749936343);

assert.strictEqual(await main("./spec.txt", isMatching2), 11387);
assert.strictEqual(await main("./input.txt", isMatching2), 0);
