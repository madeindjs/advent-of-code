// @ts-check
const fs = require("fs");

const position = { horizontal: 0, depth: 0 };

fs.readFileSync("./02.txt")
  .toString()
  .split("\n")
  .map((move) => {
    const [direction, qty] = move.split(" ");
    return { direction, qty: Number(qty) };
  })
  .forEach((move) => {
    console.log(move)
    switch (move.direction) {
      case "forward":
        position.horizontal += move.qty;
        break;
      case "down":
        position.depth += move.qty;
        break;
      case "up":
        position.depth -= move.qty;
        break;
    }
    // console.log(position)
  });

// console.log(position);
console.log(position.horizontal * position.depth)
