import assert from "node:assert";
import { createReadStream } from "node:fs";
import readline from "node:readline";

function getLines(path: string) {
  const file = new URL(path, import.meta.url);
  return readline.createInterface({ input: createReadStream(file) });
}

type Adress = { inside: string[]; outside: [] };

function parse(line: string): Adress {
  const adress: Adress = { inside: [], outside: [] };

  let isInside = false;
  for (const match of line.split(/\[|\]/)) {
    (isInside ? adress.inside : adress.outside).push(match);
    isInside = !isInside;
  }

  return adress;
}
assert.deepEqual(parse("abba[mnop]qrst"), {
  inside: ["mnop"],
  outside: ["abba", "qrst"],
});
assert.deepEqual(parse("abba[mnop]qrst[a]b"), {
  inside: ["mnop", "a"],
  outside: ["abba", "qrst", "b"],
});

function containsAbba(line: string) {
  for (let i = 0; i < line.length - 3; i++) {
    if (line[i] === line[i + 1]) continue;
    if (line[i] === line[i + 3] && line[i + 1] === line[i + 2]) return true;
  }
  return false;
}
assert.strictEqual(containsAbba("abba"), true);
assert.strictEqual(containsAbba("ioxxoj"), true);
assert.strictEqual(containsAbba("asdfgh"), false);
assert.strictEqual(containsAbba("abab"), false);

function hasTLS(adress: Adress): boolean {
  return !adress.inside.some(containsAbba) && adress.outside.some(containsAbba);
}
assert.strictEqual(hasTLS(parse("abba[mnop]qrst")), true);
assert.strictEqual(hasTLS(parse("aaba[mnop]abba")), true);
assert.strictEqual(hasTLS(parse("abcd[bddb]xyyx")), false);
assert.strictEqual(hasTLS(parse("aaaa[qwer]tyui")), false);
assert.strictEqual(hasTLS(parse("ioxxoj[asdfgh]zxcvbn")), true);

async function mainA(path: string) {
  let total = 0;
  getLines(path).map((v) => v);
  for await (const line of getLines(path)) {
    if (hasTLS(parse(line))) total++;
  }
  return total;
}
assert.strictEqual(await mainA("./input.txt"), 105);

function* getAba(line: string) {
  for (let i = 0; i < line.length - 2; i++) {
    if (line[i] !== line[i + 1] && line[i] === line[i + 2])
      yield line.slice(i, i + 3);
  }
}

function hasSSL(adress: Adress): boolean {
  const abas = adress.outside
    .flatMap((c) => Array.from(getAba(c)))
    .map((c) => `${c[1]}${c[0]}${c[1]}`);

  return adress.inside.some((i) => abas.some((aba) => i.includes(aba)));
}
assert.strictEqual(hasSSL(parse("aba[bab]xyz")), true);
assert.strictEqual(hasSSL(parse("xyx[xyx]xyx")), false);

async function mainB(path: string) {
  let total = 0;
  for await (const line of getLines(path)) {
    if (hasSSL(parse(line))) total++;
  }
  return total;
}
assert.strictEqual(await mainB("./input.txt"), 258);
