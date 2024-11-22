import assert from "node:assert";
import { createReadStream } from "node:fs";
import readline from "node:readline";

class Grid {
  #grid: string[][];

  constructor(width: number, height: number, initialValue: string) {
    this.#grid = Array(height)
      .fill("")
      .map(() => Array(width).fill(initialValue));
  }

  *getAllPoints() {
    for (const row of this.#grid) {
      for (const cell of row) yield cell;
    }
  }

  setCell(x: number, y: number, value: string) {
    const row = this.#grid[y];
    if (row?.[x] === undefined) return;
    this.#grid[y][x] = value;
  }

  #getColumnAsString(x: number) {
    return this.#grid.reduce((acc, row) => acc + row.at(x) ?? "", "");
  }

  rotateRow(y: number) {
    this.#grid[y] = this.#rotateString(this.#grid[y].join("")).split("");
  }

  #rotateString(str: string) {
    const oldColum = str.split("");
    const lastCell = oldColum.pop();
    oldColum.splice(0, 0, lastCell!);
    return oldColum.join("");
  }

  rotateColumn(x: number) {
    const column = this.#rotateString(this.#getColumnAsString(x));

    for (let y = 0; y < this.#grid.length; y++) {
      this.setCell(x, y, column.at(y)!);
    }
  }

  drawRect(width: number, height: number, startX = 0, startY = 0) {
    for (let y = startY; y < height + startY; y++) {
      for (let x = startX; x < width + startX; x++) this.setCell(x, y, "#");
    }
  }

  toString() {
    return this.#grid.map((row) => row.join("")).join("\n");
  }
}

{
  const grid = new Grid(2, 2, ".");
  grid.setCell(0, 0, "#");
  grid.rotateColumn(0);
  assert.strictEqual(grid.toString(), "..\n#.");
}

function getLines(path: string) {
  const file = new URL(path, import.meta.url);
  return readline.createInterface({ input: createReadStream(file) });
}

async function mainA(path: string) {
  const grid = new Grid(50, 6, ".");

  for await (const line of getLines(path)) {
    if (line.startsWith("rect ")) {
      const [width, height] = line.replace("rect ", "").split("x").map(Number);
      grid.drawRect(width, height);
    } else if (line.startsWith("rotate column ")) {
      const match = /rotate column x=([0-9]+) by ([0-9]+)/.exec(line);
      if (!match) throw Error();
      const x = Number(match[1]);
      const qty = Number(match[2]);
      for (let i = 0; i < qty; i++) grid.rotateColumn(x);
    } else if (line.startsWith("rotate row ")) {
      const match = /rotate row y=([0-9]+) by ([0-9]+)/.exec(line);
      if (!match) throw Error();
      const y = Number(match[1]);
      const qty = Number(match[2]);
      for (let i = 0; i < qty; i++) grid.rotateRow(y);
    }

    console.log("---", line);
    console.log(grid.toString());
  }

  let count = 0;

  for (const point of grid.getAllPoints()) {
    if (point === "#") count++;
  }

  return count;
}

assert.strictEqual(await mainA("./input.txt"), 115);
