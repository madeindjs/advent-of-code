import { createReadStream } from "fs";
import readline from "readline";

/**
 * @typedef {{ nbPlayer: number[]; nbWin: number[]; id: string; }} Card
 * @param {string} line (ex: `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green`)
 * @returns {Card}
 */
function parseCard(line) {
  const [title, numbers] = line.split(": ");

  const extractNumbers = (str) => Array.from(str.matchAll(/ ?([0-9]+)/g)).map((match) => Number(match[1]));
  const [nbPlayer, nbWin] = numbers.split(" | ").map(extractNumbers);

  return { nbPlayer, nbWin: nbWin, id: title };
}
// assert.deepEqual(parseCard("Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53"), { id: 1 });

/**
 * @param {Card} card
 */
function computeCardPoints(card) {
  const wins = card.nbPlayer.filter((n) => card.nbWin.includes(n));
  console.log("debug", card.nbPlayer.length, card.nbWin.length);
  if (card.nbPlayer.length !== 10) debugger;
  return wins.reduce((acc) => (acc === 0 ? 1 : acc * 2), 0);
  if (wins.length === 0) return 0;
  if (wins.length === 1) return 1;
  return Math.pow(2, wins.length - 1);
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
  return computeCardPoints(card);
}
// assert.strictEqual(mainACompute("Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53"), 8);

const mainA = (file) => computeEachLine(file, mainACompute);

// function mainBCompute(line) {
//   const game = parseGameLine(line);

//   const max = { red: 0, blue: 0, green: 0 };

//   for (const set of game.sets) {
//     for (const [qty, color] of set) {
//       if (max[color] < qty) max[color] = qty;
//     }
//   }

//   return Object.values(max).reduce((acc, v) => acc * v, 1);
// }
// const mainB = (file) => computeEachLine(file, mainBCompute);

// const testA = await mainA("./spec.txt");
// assert.strictEqual(testA, 13);

const resultA = await mainA("input.txt");
console.log("result A", resultA);

// const testB = await mainB("spec.txt");
// assert.strictEqual(testB, 2286);

// const resultB = await mainB("input.txt");
// console.log("result B", resultB);
