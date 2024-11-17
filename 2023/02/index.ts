import { createReadStream } from "fs";
import assert from "node:assert";
import readline from "readline";

type Game = { sets: [number, string][][]; id: number };

function parseGameLine(line: string): Game {
  const [idStr, setsStr] = line.split(": ");
  const id = Number(idStr.replace("Game ", ""));

  const sets =
    setsStr.split("; ").map((set) =>
      set.split(", ").map((c) => {
        const [qty, color] = c.split(" ");
        return [Number(qty), color];
      }),
    ) ?? [];

  // @ts-ignore
  return { id, sets };
}

assert.deepEqual(
  parseGameLine("Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green").id,
  1,
);
assert.deepEqual(
  parseGameLine("Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green").sets,
  [
    [
      [3, "blue"],
      [4, "red"],
    ],
    [
      [1, "red"],
      [2, "green"],
      [6, "blue"],
    ],
    [[2, "green"]],
  ],
);

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

function isGamePossible(game: Game) {
  return !game.sets.some((set) =>
    set.some(([qty, color]) => {
      switch (color) {
        case "red":
          return qty > 12;
        case "green":
          return qty > 13;
        case "blue":
          return qty > 14;
        default:
          return false;
      }
    }),
  );
}

function mainACompute(line: string) {
  const game = parseGameLine(line);
  return isGamePossible(game) ? game.id : 0;
}
const mainA = (file: string) => computeEachLine(file, mainACompute);

function mainBCompute(line: string) {
  const game = parseGameLine(line);

  const max = { red: 0, blue: 0, green: 0 };

  for (const set of game.sets) {
    for (const [qty, color] of set) {
      if (max[color] < qty) max[color] = qty;
    }
  }

  return Object.values(max).reduce((acc, v) => acc * v, 1);
}
const mainB = (file: string) => computeEachLine(file, mainBCompute);

const testA = await mainA("./spec.txt");
assert.strictEqual(testA, 8);

const resultA = await mainA("input.txt");
console.log("result A", resultA);

const testB = await mainB("spec.txt");
assert.strictEqual(testB, 2286);

const resultB = await mainB("input.txt");
console.log("result B", resultB);
