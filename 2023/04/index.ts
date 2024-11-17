import { createReadStream } from "fs";
import assert from "node:assert";
import readline from "readline";

type Card = { nbPlayer: number[]; nbWin: number[]; id: number };

function parseCard(line: string): Card {
  const [title, numbers] = line.split(": ");

  const extractNumbers = (str) =>
    Array.from(str.matchAll(/ ?([0-9]+)/g)).map((match) => Number(match[1]));
  const [nbPlayer, nbWin] = numbers.split(" | ").map(extractNumbers);

  return {
    nbPlayer,
    nbWin: nbWin,
    id: Number(title.match(/[0-9]+/)?.[0] ?? -1),
  };
}

function computeCardMatches(card: Card) {
  return card.nbPlayer.filter((n) => card.nbWin.includes(n));
}

async function computeEachLine(
  file: string,
  computeFn: (line: string) => number,
) {
  let total = 0;
  for await (const line of readline.createInterface({
    input: createReadStream(file),
  })) {
    total += computeFn(line);
  }
  return total;
}

function mainACompute(line: string) {
  const card = parseCard(line);
  return computeCardMatches(card).reduce((acc) => (acc === 0 ? 1 : acc * 2), 0);
}
assert.strictEqual(
  mainACompute("Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53"),
  8,
);

const mainA = (file: string) => computeEachLine(file, mainACompute);

async function mainB(file: string) {
  const counts: Record<number, number> = {};

  for await (const line of readline.createInterface({
    input: createReadStream(file),
  })) {
    const card = parseCard(line);
    counts[card.id] ??= 1;
    const qty = counts[card.id];
    computeCardMatches(card).forEach((_, j) => {
      const id = card.id + j + 1;
      counts[id] ??= 1;
      counts[id] += qty;
    });
  }

  const sum = (numbers: number[]) => numbers.reduce((acc, v) => acc + v, 0);

  return sum(Object.values(counts));
}

const testA = await mainA("./spec.txt");
assert.strictEqual(testA, 13);

const resultA = await mainA("input.txt");
assert.strictEqual(resultA, 32001);
console.log("result A", resultA);

const testB = await mainB("spec.txt");
assert.strictEqual(testB, 30);

const resultB = await mainB("input.txt");
assert.strictEqual(resultB, 5037841);
console.log("result B", resultB);
