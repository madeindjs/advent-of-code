import assert from "assert";
import { createReadStream } from "node:fs";
import readline from "node:readline";

function getLines(path: string) {
  const file = new URL(path, import.meta.url);
  return readline.createInterface({ input: createReadStream(file) });
}

async function getLists() {
  const left: number[] = [];
  const right: number[] = [];

  for await (const line of getLines("./input.txt")) {
    const [l, r] = line.split(/ +/).map(Number);
    left.push(l);
    right.push(r);
  }
  return [left, right];
}

async function mainA() {
  const [left, right] = await getLists();

  left.sort((a, b) => a - b);
  right.sort((a, b) => a - b);

  let total = 0;

  while (left.length > 0) {
    const l = left.pop() ?? 0;
    const r = right.pop() ?? 0;
    total += Math.abs(l - r);
  }
  return total;
}

assert.strictEqual(await mainA(), 2904518);

function getSideObj(vals: number[]) {
  return vals.reduce((acc, v) => {
    acc.set(v, (acc.get(v) ?? 0) + 1);
    return acc;
  }, new Map<number, number>());
}
async function mainB() {
  const [left, right] = (await getLists()).map(getSideObj);

  let total = 0;
  for (const [k, v] of left.entries()) {
    total += v * k * (right.get(k) ?? 0);
  }

  return total;
}

assert.strictEqual(await mainA(), 2904518);
assert.strictEqual(await mainB(), 18650129);
