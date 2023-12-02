// start 7:42
import { createReadStream } from "fs";
import assert from "node:assert";
import readline from "readline";

/**
 * @typedef {{sets: [number, string][][], id: number} } Game
 */

/**
 * @param {string} line (ex: `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green`)
 * @returns {Game}
 */
function parseGameLine(line) {
  const [idStr, setsStr] = line.split(": ");
  const id = Number(idStr.replace("Game ", ""));

  const sets =
    setsStr.split("; ").map((set) =>
      set.split(", ").map((c) => {
        const [qty, color] = c.split(" ");
        return [Number(qty), color];
      })
    ) ?? [];

  return {
    id,
    // @ts-ignore
    sets,
  };
}

assert.deepEqual(parseGameLine("Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green").id, 1);
assert.deepEqual(parseGameLine("Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green").sets, [
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
]);

/**
 * @param {string} file
 * @param {(line: string) => number} computeFn
 */
async function computeEachLine(file, computeFn) {
  let total = 0;

  for await (const line of readline.createInterface({ input: createReadStream(file) })) {
    console.log(computeFn(line));
    total += computeFn(line);
  }

  return total;
}

function getTooMuchId(line) {
  const game = parseGameLine(line);
  const overflow = game.sets.some((set) =>
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
    })
  );
  return overflow ? 0 : game.id;
}

const mainA = (file) => computeEachLine(file, getTooMuchId);
const mainB = (file) => computeEachLine(file, getTooMuchId);

async function main() {
  const testA = await mainA("./spec.txt");
  assert.strictEqual(testA, 8);

  const resultA = await mainA("input.txt");
  console.log("result A", resultA);

  // const testB = await mainB("spec.b.txt");
  // assert.strictEqual(testB, 281);

  // const resultB = await mainB("input.txt");
  // console.log("result B", resultB);
}

main().catch(console.error);
