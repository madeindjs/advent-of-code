import assert from "node:assert";
import { createReadStream } from "node:fs";
import readline from "node:readline";

const file = new URL("./input.txt", import.meta.url);

function parseLine(line: string): [number, number, number] {
  const [a, b, c] = line.trimStart().trimEnd().split(/ +/);

  return [Number(a), Number(b), Number(c)];
}

function isTrangle(a: number, b: number, c: number) {
  console.log("a", a, b + c);
  if (a >= b + c) return false;
  console.log("b", b, a + c);
  if (b >= a + c) return false;
  console.log("c", c, a + b);
  if (c >= a + b) return false;
  return true;
}
assert.strictEqual(isTrangle(5, 10, 25), false);
assert.strictEqual(isTrangle(10, 25, 5), false);

async function mainA() {
  let total = 0;
  for await (const line of readline.createInterface({
    input: createReadStream(file),
  })) {
    const [a, b, c] = parseLine(line);
    if (isTrangle(a, b, c)) total++;
  }
  return total;
}

mainA().then(console.log);
