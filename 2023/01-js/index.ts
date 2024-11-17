import { createReadStream } from "fs";
import assert from "node:assert";
import readline from "readline";

function constructFinalNumber(numbers: number[]) {
  if (numbers.length === 1) return Number(numbers[0].toString().repeat(2));

  const first = numbers.shift();
  const last = numbers.pop();

  return Number(`${first}${last}`);
}

function extractFirstAndLastNumer(line: string) {
  const numbers: number[] = [];

  for (const char of line) {
    const n = Number(char);
    if (!Number.isNaN(n)) numbers.push(n);
  }

  return constructFinalNumber(numbers);
}
assert.strictEqual(extractFirstAndLastNumer("1abc2"), 12);
assert.strictEqual(extractFirstAndLastNumer("a1b2c3d4e5f"), 15);

function extractFirstAndLastNumerWithWords(line: string) {
  const words = [
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
  ];
  const numbers: number[] = [];

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    const n = Number(char);
    if (!Number.isNaN(n)) {
      numbers.push(n);
      continue;
    }

    for (let j = 0; j < words.length; j++) {
      const word = words[j];
      if (char !== word[0]) continue;
      const potentialWord = line.slice(i, word.length + i);

      if (potentialWord === word) {
        numbers.push(j + 1);
        break;
      }
    }
  }

  return constructFinalNumber(numbers);
}

assert.strictEqual(extractFirstAndLastNumerWithWords("two1nine"), 29);
assert.strictEqual(extractFirstAndLastNumerWithWords("eightwothree"), 83);

async function eachLinesAndCompute(
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

const mainA = (file: string) =>
  eachLinesAndCompute(file, extractFirstAndLastNumer);
const mainB = (file: string) =>
  eachLinesAndCompute(file, extractFirstAndLastNumerWithWords);

async function main() {
  const testA = await mainA("./spec.txt");
  assert.strictEqual(testA, 142);

  const resultA = await mainA("input.txt");
  console.log("result A", resultA);

  const testB = await mainB("spec.b.txt");
  assert.strictEqual(testB, 281);

  const resultB = await mainB("input.txt");
  console.log("result B", resultB);
}

main().catch(console.error);
