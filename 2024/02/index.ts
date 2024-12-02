import assert from "assert";
import { createReadStream } from "node:fs";
import readline from "node:readline";

function getLines(path: string) {
  const file = new URL(path, import.meta.url);
  return readline.createInterface({ input: createReadStream(file) });
}

function isSafe(levels: number[], tolerance = 0): boolean {
  const isGrowing = levels[1] - levels[0] > 0;

  for (let i = 1; i < levels.length; i++) {
    const prev = levels.at(i - 1) ?? 0;
    const curr = levels.at(i) ?? 0;

    const dist = Math.abs(prev - curr);
    const isDistanceOk = dist >= 1 && dist <= 3;

    const isSequence = isGrowing ? curr > prev : curr < prev;

    if (!isSequence || !isDistanceOk) {
      if (tolerance === 0) return false;

      return [i - 1, i].some((j) =>
        isSafe(levels.toSpliced(j, 1), tolerance - 1),
      );
    }
  }

  return true;
}
assert.strictEqual(isSafe("7 6 4 2 1".split(" ").map(Number)), true);
assert.strictEqual(isSafe("6 6 4 2 1".split(" ").map(Number), 1), true);
assert.strictEqual(isSafe("1 3 2 4 5".split(" ").map(Number), 1), true);
assert.strictEqual(isSafe("8 6 4 4 1".split(" ").map(Number), 1), true);

async function main(path: string, tolerance = 0) {
  let count = 0;
  for await (const line of getLines(path)) {
    const levels = line.split(" ").map(Number);
    if (isSafe(levels, tolerance)) count++;
  }
  return count;
}

assert.strictEqual(await main("./spec.txt"), 2);
assert.strictEqual(await main("./input.txt"), 663);

assert.strictEqual(await main("./spec.txt", 1), 4);
assert.strictEqual(await main("./input.txt", 1), 0); //681,691 too low
