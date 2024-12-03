import assert from "node:assert";
import { readFile } from "node:fs/promises";

const inputFile = new URL("./input.txt", import.meta.url);
const input = await readFile(inputFile, { encoding: "utf8" });

function mainA(line: string) {
  return line
    .matchAll(/mul\((\d{1,3}),(\d{1,3})\)/g)
    .reduce((acc, v) => acc + Number(v[1]) * Number(v[2]), 0);
}

function mainB(line: string): number {
  const lineWithoutDont = line
    .replaceAll("\n", "")
    .replaceAll(/don't\(\).*?(do\(\))/g, "") // replace inside "don't/do"
    .replaceAll(/don't\(\).*/g, ""); // replace ending "don't"
  return mainA(lineWithoutDont);
}

assert.strictEqual(mainA(input), 173529487);
assert.strictEqual(mainB(input), 99532691);
