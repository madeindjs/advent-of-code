import assert from "node:assert";
import { readFile } from "node:fs/promises";

const inputFile = new URL("./input.txt", import.meta.url);
const input = await readFile(inputFile, { encoding: "utf8" });

function mainA(line: string) {
  let total = 0;
  for (const match of line.matchAll(/mul\((\d{1,3}),(\d{1,3})\)/g)) {
    total += Number(match[1]) * Number(match[2]);
  }
  return total;
}

function mainB(line: string): number {
  const lineWithoutDont = line
    .replaceAll("\n", "")
    .replaceAll(/don't\(\).*?(do\(\))/g, "")
    .replaceAll(/don't\(\).*/g, "");
  return mainA(lineWithoutDont);
}

assert.strictEqual(mainA(input), 173529487);
assert.strictEqual(mainB(input), 99532691);
