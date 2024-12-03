import assert from "node:assert";
import { open } from "node:fs/promises";

async function getLists() {
  const left: number[] = [];
  const right: number[] = [];

  const file = await open(new URL("./input.txt", import.meta.url));

  for await (const line of file.readLines()) {
    const [l, r] = line.split(/ +/).map(Number);
    left.push(l);
    right.push(r);
  }
  return [left, right];
}

async function mainA() {
  const [left, right] = (await getLists()).map((n) =>
    n.toSorted((a, b) => a - b),
  );

  return left.reduce((acc, l, i) => acc + Math.abs(l - (right.at(i) ?? 0)), 0);
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
  for (const [k, v] of left.entries()) total += v * k * (right.get(k) ?? 0);

  return total;
}

assert.strictEqual(await mainA(), 2904518);
assert.strictEqual(await mainB(), 18650129);
