// @ts-check
const fs = require("fs");

const position = { horizontal: 0, depth: 0, aim: 0 };

fs.readFileSync("./02.txt")
  .toString()
  .split("\n")
  .map((move) => {
    const [direction, qty] = move.split(" ");
    return { direction, qty: Number(qty) };
  })
  .forEach((move) => {
    console.log(move);
    switch (move.direction) {
      case "forward":
        position.horizontal += move.qty;
        position.depth += position.aim * move.qty;
        break;
      case "down":
        position.aim += move.qty;
        break;
      case "up":
        position.aim -= move.qty;
        break;
    }
    console.log(position);
  });

console.log(position);
console.log(position.horizontal * position.depth);
// to low 10572300
