// @ts-check
const assert = require("assert");
const fs = require("fs");

class Fish {
  /** @type {number} */
  life;
  constructor(life) {
    this.life = life;
  }

  /**
   * @returns {number} nb of child
   */
  addDay() {
    this.life--;

    if (this.life < 0) {
      this.life = 6;
      return 1;
    }

    return 0;
  }
}

const buildFishes = () =>
  fs
    .readFileSync("06.txt")
    .toString()
    .split(",")
    .map(Number)
    .map((n) => new Fish(n));

function partA() {
  console.group("Part A");
  const fishes = buildFishes();
  for (let day = 0; day < 80; day++) {
    const nbOfChild = fishes.map((fish) => fish.addDay()).reduce((a, b) => a + b, 0);
    const child = new Array(nbOfChild).fill().map(() => new Fish(8));
    fishes.push(...child);
  }
  console.log(fishes.length);
  console.groupEnd();
}
// function partB() {
//   console.group("Part B");
//   const fishes = buildFishes();
//   for (let day = 0; day < 256; day++) {
//     const nbOfChild = fishes.map((fish) => fish.addDay()).reduce((a, b) => a + b, 0);
//     new Array(nbOfChild).fill().forEach(() => fishes.push(new Fish(8)));
//     // fishes.push(...child);
//   }
//   console.log(fishes.length);
//   // => 555881 too high
//   // => 361169
//   console.groupEnd();
// }
// function partB() {
//   console.group("Part B");
//   const grid = new Grid();
//   grid.diagonal = true;
//   rows.forEach((row) => grid.addLine(row));
//   const count = Array.from(grid.points.values()).filter((v) => v > 1).length;
//   console.log(count);
//   console.groupEnd();
// }

partA();
// partB();
