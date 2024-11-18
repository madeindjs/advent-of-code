import assert from "node:assert";
import { createReadStream } from "node:fs";
import readline from "node:readline";

function getLines(path: string) {
  const file = new URL(path, import.meta.url);
  return readline.createInterface({ input: createReadStream(file) });
}

async function countChars(
  path: string,
  sort: (a: number, b: number) => number,
) {
  const columns: Record<string, number>[] = [];
  for await (const line of getLines(path)) {
    for (let i = 0; i < line.length; i++) {
      const char = line.at(i)!;
      columns[i] ??= {};
      columns[i][char] ??= 0;
      columns[i][char]++;
    }
  }
  return columns
    .map(
      (col) =>
        Object.entries(col)
          .sort(([, a], [, b]) => sort(a, b))
          .shift()![0],
    )
    .join("");
}

function mainA(path: string) {
  return countChars(path, (a, b) => b - a);
}

assert.strictEqual(await mainA("./spec.txt"), "easter");
assert.strictEqual(await mainA("./input.txt"), "liwvqppc");

function mainB(path: string) {
  return countChars(path, (a, b) => a - b);
}

assert.strictEqual(await mainB("./spec.txt"), "advent");
assert.strictEqual(await mainB("./input.txt"), "caqfbzlh");
