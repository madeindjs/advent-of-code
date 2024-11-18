import assert from "node:assert";
import { createReadStream } from "node:fs";
import readline from "node:readline";

function getLines(path: string) {
  const file = new URL(path, import.meta.url);
  return readline.createInterface({ input: createReadStream(file) });
}

async function countChars(path: string) {
  const columns: Record<string, number>[] = [];
  for await (const line of getLines(path)) {
    for (let i = 0; i < line.length; i++) {
      const char = line.at(i)!;
      columns[i] ??= {};
      columns[i][char] ??= 0;
      columns[i][char]++;
    }
  }
  return columns;
}

async function mainA(path: string) {
  const columns = await countChars(path);

  return columns
    .map(
      (col) =>
        Object.entries(col)
          .sort(([, a], [, b]) => b - a)
          .shift()![0],
    )
    .join("");
}

assert.strictEqual(await mainA("./spec.txt"), "easter");
assert.strictEqual(await mainA("./input.txt"), "liwvqppc");

async function mainB(path: string) {
  const columns = await countChars(path);

  return columns
    .map(
      (col) =>
        Object.entries(col)
          .sort(([, a], [, b]) => a - b)
          .shift()![0],
    )
    .join("");
}

assert.strictEqual(await mainB("./spec.txt"), "advent");
assert.strictEqual(await mainB("./input.txt"), "");
