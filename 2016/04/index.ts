import assert from "node:assert";
import { createReadStream } from "node:fs";
import readline from "node:readline";

type Entry = {
  names: string[];
  name: string;
  sectorId: number;
  checksum: string;
};

function getLines(path: string) {
  const file = new URL(path, import.meta.url);
  return readline.createInterface({ input: createReadStream(file) });
}

function getCharCount(line: string): Record<string, number> {
  return line.split("").reduce<Record<string, number>>((acc, v) => {
    acc[v] ??= 0;
    acc[v] += 1;
    return acc;
  }, {});
}

function getMostCommonChars(line: string): string[] {
  const count = getCharCount(line);
  const countMax = Math.max(...Object.values(count));

  return Object.entries(count)
    .filter(([k, v]) => v === countMax)
    .map(([k]) => k);
}
assert.deepEqual(getMostCommonChars("a"), ["a"]);
assert.deepEqual(getMostCommonChars("aac"), ["a"]);
assert.deepEqual(getMostCommonChars("aacc"), ["a", "c"]);
assert.deepEqual(getMostCommonChars("abc"), ["a", "b", "c"]);

function get5MostCommonChars(line: string): string[] {
  const count = getCharCount(line);
  const min = Object.values(count).sort((a, b) => b - a)[4];

  return Object.entries(count)
    .filter(([k, v]) => v >= min)
    .map(([k, v]) => k);
  // const count = Object.entries(getCharCount(line)).sort((a, b) => b[1] - a[1]);
  const countMax = Math.max(...Object.values(count));

  const res: string[] = [];
  for (let i = 0; i < 4; i++) {
    const p = count.shift();
    if (!p) return res;
    res.push(p[0]);
  }

  return res;

  return Object.entries(count)
    .slice(0, 5)
    .map(([k]) => k);
}
assert.deepEqual(get5MostCommonChars("aaaabbbbccccddeefgh"), "abcde".split(""));
assert.deepEqual(get5MostCommonChars("abcdefghi"), "abcdefghi".split(""));

function parse(line: string): Entry {
  const [before, checksum] = line.slice(0, line.length - 1).split("[");
  const parts = before.split("-");
  const sectorId = Number(parts.pop());
  return { sectorId, checksum, names: parts, name: parts.join("") };
}

function isValid({ name, checksum }: Entry): boolean {
  // const chars = new Set(names.flatMap(getMostCommonChars));
  const chars = new Set(get5MostCommonChars(name));
  if (checksum.length !== 5) throw Error;

  return checksum.split("").every((c) => chars.has(c));
}

assert.strictEqual(isValid(parse("aaaaa-bbb-z-y-x-123[abxyz]")), true);
assert.strictEqual(isValid(parse("a-b-c-d-e-f-g-h-987[abcde]")), true);
assert.strictEqual(isValid(parse("not-a-real-room-404[oarel]")), true);
assert.strictEqual(isValid(parse("totally-real-room-200[decoy]")), false);

async function mainA(path: string) {
  let count = 0;
  for await (const line of getLines(path)) {
    const entry = parse(line);
    if (isValid(entry)) count += entry.sectorId;
  }
  return count;
}

assert.strictEqual(await mainA("./spec.txt"), 1514);
assert.strictEqual(await mainA("./input.txt"), 89619);
