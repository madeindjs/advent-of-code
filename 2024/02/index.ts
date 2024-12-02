import assert from "assert";
import { createReadStream } from "node:fs";
import readline from "node:readline";

function getLines(path: string) {
  const file = new URL(path, import.meta.url);
  return readline.createInterface({ input: createReadStream(file) });
}

function isSafe(levels: number[]): boolean {
  const isGrowing = levels[1] - levels[0] > 0;

  for (let i = 1; i < levels.length; i++) {
    const prev = levels.at(i - 1) ?? 0;
    const curr = levels.at(i) ?? 0;

    const isOK = isGrowing ? curr > prev : curr < prev;
    if (!isOK) return false;

    const dist = Math.abs(prev - curr);
    if (dist < 1 || dist > 3) return false;
  }

  return true;
}
assert.strictEqual(isSafe("7 6 4 2 1".split(" ").map(Number)), true);

async function mainA(path: string) {
  let count = 0;
  for await (const line of getLines(path)) {
    const levels = line.split(" ").map(Number);
    if (isSafe(levels)) count++;
  }
  return count;
}

assert.strictEqual(await mainA("./spec.txt"), 2);
assert.strictEqual(await mainA("./input.txt"), 663);
