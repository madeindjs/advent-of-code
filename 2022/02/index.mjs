import { createReadStream } from "fs";
import assert from "node:assert";
import readline from "readline";

const signMap = {
  A: "Rock",
  B: "Paper",
  C: "Scissors",
  X: "Rock",
  Y: "Paper",
  Z: "Scissors",
};

const signPoint = {
  Rock: 1,
  Paper: 2,
  Scissors: 3,
};

/**
 * @param {string} me
 * @param {string} other
 * @returns {number}
 */
function getPoints(me, other) {
  let score = 3;

  if (me === other) return score + signPoint[me];

  switch (me) {
    case "Rock":
      score = other === "Scissors" ? 6 : 0;
      break;
    case "Paper":
      score = other === "Rock" ? 6 : 0;
      break;
    case "Scissors":
      score = other === "Paper" ? 6 : 0;
      break;
  }

  return score + signPoint[me];
}

/**
 * @param {string} file
 * @returns {Promise<number>}
 */
async function mainA(file) {
  const lines = readline.createInterface({ input: createReadStream(file) });

  let score = 0;

  for await (const line of lines) {
    const [other, me] = line.split(" ");
    score += getPoints(signMap[me], signMap[other]);
    // console.log(score, signMap[me], signMap[other]);
  }

  return score;
}

/**
 * @param {string} other
 * @param {string} end
 * @returns {number}
 */
function guessPoint(other, end) {
  if (end === "Y") {
    return getPoints(other, other);
  }

  const possibilites = Object.values(signMap).map((me) => getPoints(me, other));

  return end === "X" ? Math.min(...possibilites) : Math.max(...possibilites);
}

/**
 * @param {string} file
 * @returns {Promise<number>}
 */
async function mainB(file) {
  const lines = readline.createInterface({ input: createReadStream(file) });

  let score = 0;

  for await (const line of lines) {
    const [other, end] = line.split(" ");
    score += guessPoint(signMap[other], end);
    // console.log(score, signMap[other], end);
  }

  return score;
}

async function main() {
  assert.strictEqual(await mainA("spec.txt"), 15);
  console.log("result A", await mainA("input.txt"));

  assert.strictEqual(await mainB("spec.txt"), 12);
  console.log("result B", await mainB("input.txt"));
}

main().catch(console.error);
