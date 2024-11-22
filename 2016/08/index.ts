import assert from "node:assert";
import { createReadStream } from "node:fs";
import readline from "node:readline";

type Grid = string[][];

function getGrid(): Grid {
  return Array(6)
    .fill("")
    .map(() => Array(50).fill("."));
}
function printGrid(grid: Grid) {
  console.log(grid.map((row) => row.join("")).join("\n"));
}

function getLines(path: string) {
  const file = new URL(path, import.meta.url);
  return readline.createInterface({ input: createReadStream(file) });
}

function changeCell(grid: Grid, x: number, y: number, value: string) {
  const row = grid[x];
  if (row?.[y] === undefined) return;

  grid[x][y] = "#";
}

async function mainA(path: string) {
  const grid = getGrid();

  for await (const line of getLines(path)) {
    if (line.startsWith("rect ")) {
      const [width, height] = line.replace("rect ", "").split("x").map(Number);

      for (let y = 0; y < width; y++) {
        for (let x = 0; x < height; x++) {
          changeCell(grid, x, y, "#");
        }
      }
    } else if (line.startsWith("rotate column ")) {
      const match = /rotate column x=([0-9]+) by ([0-9]+)/.exec(line);
      if (!match) throw Error();
      const x = Number(match[1]);
      const qty = Number(match[2]);
    } else if (line.startsWith("rotate row ")) {
    }
  }
  printGrid(grid);
}

console.log(await mainA("./input.txt"));
