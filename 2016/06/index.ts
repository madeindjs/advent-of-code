import assert from "node:assert";
import { createReadStream } from "node:fs";
import readline from "node:readline";

function getLines(path: string) {
  const file = new URL(path, import.meta.url);
  return readline.createInterface({ input: createReadStream(file) });
}

async function mainA(path: string) {
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
          .sort(([, a], [, b]) => b - a)
          .shift()![0],
    )
    .join("");
}

assert.strictEqual(await mainA("./spec.txt"), "easter");
assert.strictEqual(await mainA("./input.txt"), "liwvqppc");
