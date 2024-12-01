import assert from "assert";
import { createReadStream } from "node:fs";
import readline from "node:readline";

function getLines(path: string) {
  const file = new URL(path, import.meta.url);
  return readline.createInterface({ input: createReadStream(file) });
}

const left: number[] = [];
const right: number[] = [];

for await (const line of getLines("./input.txt")) {
  const [l, r] = line.split(/ +/).map(Number);
  left.push(l);
  right.push(r);
}

left.sort((a, b) => a - b);
right.sort((a, b) => a - b);

let total = 0;

while (left.length > 0) {
  const l = left.pop() ?? 0;
  const r = right.pop() ?? 0;
  total += Math.abs(l - r);
}

console.log(total);
