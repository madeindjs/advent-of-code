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

    const dist = Math.abs(prev - curr);
    const isDistanceOk = dist >= 1 && dist <= 3;

    const isSequence = isGrowing ? curr > prev : curr < prev;

    if (!isSequence || !isDistanceOk) return false;
  }

  return true;
}

async function main(path: string, isSafe: (levels: number[]) => boolean) {
  let count = 0;
  for await (const line of getLines(path)) {
    const levels = line.split(" ").map(Number);
    if (isSafe(levels)) count++;
  }
  return count;
}

assert.strictEqual(await main("./spec.txt", isSafe), 2);
assert.strictEqual(await main("./input.txt", isSafe), 663);

function isSafe2(levels: number[]): boolean {
  if (isSafe(levels)) return true;
  return levels.some((_, i) => isSafe(levels.toSpliced(i, 1)));
}

assert.strictEqual(await main("./spec.txt", isSafe2), 4);
assert.strictEqual(await main("./input.txt", isSafe2), 692);
