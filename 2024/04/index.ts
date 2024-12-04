import assert from "node:assert";
import { readFile } from "node:fs/promises";

type Grid = string[];

function* getLines(grid: Grid): Generator<string> {
  const xMax = grid[0]!.length - 1;
  const yMax = grid.length - 1;

  // rows
  for (const row of grid) {
    yield row;
  }
  // colums
  for (let x = 0; x <= xMax; x++) {
    yield grid.map((row) => row[x]!).join("");
  }
  // diag top-down
  for (let yStart = yMax; yStart >= 0; yStart--) {
    const text: string[] = [];
    let y = yStart;
    let x = 0;
    while (grid[x]?.[y] !== undefined) {
      text.push(grid[x]?.[y]);
      y++;
      y++;
    }
    yield text.join("");
  }
}
function countRegex(str: string, re: RegExp): number {
  return (str.match(re) ?? []).length;
}

async function mainA(path: string) {
  const inputFile = new URL(path, import.meta.url);
  const input = await readFile(inputFile, { encoding: "utf8" });

  const grid = input.split("\n") as Grid;
  return getLines(grid)
    .filter((line) => {
      // console.log(line.match(/xmas/));
      return true;
    })
    .map((line) => countRegex(line, /XMAS/g) + countRegex(line, /SAMX/g))
    .reduce((acc, v) => acc + v, 0);
}

assert.strictEqual(await mainA("./spec.txt"), 18);
