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
  const count = Object.entries(getCharCount(line)).sort(
    ([ak, av], [bk, bv]) => {
      const diff = bv - av;
      if (diff !== 0) return diff;
      return ak.charCodeAt(0) - bk.charCodeAt(0);
    },
  );

  return count.slice(0, 5).map(([k]) => k);
}
assert.deepEqual(get5MostCommonChars("aaaabbbbccccddeefgh"), "abcde".split(""));
assert.deepEqual(get5MostCommonChars("abcdefghi"), "abcde".split(""));

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
assert.strictEqual(await mainA("./input.txt"), 158835);
