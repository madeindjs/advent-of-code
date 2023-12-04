import { createReadStream, readFileSync } from "fs";
import assert from "node:assert";
import readline from "readline";

/**
 * @typedef {{ nbPlayer: number[]; nbWin: number[]; id: number; }} Card
 * @param {string} line
 * @returns {Card}
 */
function parseCard(line) {
  const [title, numbers] = line.split(": ");

  const extractNumbers = (str) => Array.from(str.matchAll(/ ?([0-9]+)/g)).map((match) => Number(match[1]));
  const [nbPlayer, nbWin] = numbers.split(" | ").map(extractNumbers);

  return { nbPlayer, nbWin: nbWin, id: Number(title.match(/[0-9]+/)?.[0] ?? -1) };
}

/**
 * @param {Card} card
 */
function computeCardMatches(card) {
  return card.nbPlayer.filter((n) => card.nbWin.includes(n));
}

/**
 * @param {string} file
 * @param {(line: string) => number} computeFn
 */
async function computeEachLine(file, computeFn) {
  let total = 0;
  for await (const line of readline.createInterface({ input: createReadStream(file) })) {
    total += computeFn(line);
  }
  return total;
}

function mainACompute(line) {
  const card = parseCard(line);
  return computeCardMatches(card).reduce((acc) => (acc === 0 ? 1 : acc * 2), 0);
}
assert.strictEqual(mainACompute("Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53"), 8);

const mainA = (file) => computeEachLine(file, mainACompute);

function mainB(file) {
  let cards = readFileSync(file, { encoding: "utf-8" }).split("\n").filter(Boolean).map(parseCard);

  const addCardId = (id) => {
    const card = cards.find((c) => c.id === id);
    if (card === undefined) throw Error(`cannot find card ${id}`);
    cards.push(card);
  };

  const maxId = cards.length;

  for (let id = 1; id <= maxId; id++) {
    const currentCards = cards.filter((c) => c.id === id);
    const card = currentCards[0];
    if (card === undefined) throw Error(`cannot find card ${id}`);
    for (const _ of currentCards) computeCardMatches(card).forEach((_, j) => addCardId(card.id + j + 1));
  }

  return cards;
}

const testA = await mainA("./spec.txt");
assert.strictEqual(testA, 13);

const resultA = await mainA("input.txt");
assert.strictEqual(resultA, 32001);
console.log("result A", resultA);

const testB = mainB("spec.txt");
assert.strictEqual(testB.filter((c) => c.id === 2).length, 2);
assert.strictEqual(testB.filter((c) => c.id === 3).length, 4);
assert.strictEqual(testB.filter((c) => c.id === 4).length, 8);
assert.strictEqual(testB.filter((c) => c.id === 5).length, 14);
assert.strictEqual(testB.filter((c) => c.id === 6).length, 1);
assert.strictEqual(testB.length, 30);

const resultB = await mainB("input.txt");
console.log("result B", resultB.length);
