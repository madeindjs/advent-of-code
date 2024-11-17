import assert from "node:assert";
import { createReadStream } from "node:fs";
import readline from "node:readline";

const file = new URL("./input.txt", import.meta.url);

function parseLine(line: string): [number, number, number] {
  const [a, b, c] = line.trimStart().trimEnd().split(/ +/);
  return [Number(a), Number(b), Number(c)];
}

function isTrangle(a: number, b: number, c: number) {
  if (a >= b + c) return false;
  if (b >= a + c) return false;
  if (c >= a + b) return false;
  return true;
}
assert.strictEqual(isTrangle(5, 10, 25), false);
assert.strictEqual(isTrangle(10, 25, 5), false);

function getLines() {
  return readline.createInterface({ input: createReadStream(file) });
}

async function mainA() {
  let total = 0;
  for await (const line of getLines()) {
    const [a, b, c] = parseLine(line);
    if (isTrangle(a, b, c)) total++;
  }
  return total;
}

async function mainB() {
  async function* getTriangles(): AsyncGenerator<[number, number, number]> {
    const triangles: number[] = [];

    for await (const line of getLines()) {
      triangles.push(...parseLine(line));

      if (triangles.length >= 9) {
        yield [triangles[0], triangles[3], triangles[6]];
        yield [triangles[1], triangles[4], triangles[7]];
        yield [triangles[2], triangles[5], triangles[8]];
        triangles.splice(0, 9);
      }
    }
  }
  let total = 0;
  for await (const t of getTriangles()) if (isTrangle(...t)) total++;

  return total;
}

assert.strictEqual(await mainA(), 993);
assert.strictEqual(await mainB(), 1849);
