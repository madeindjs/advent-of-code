// @ts-check
const fs = require("fs");

const numbers = fs.readFileSync("./01.txt").toString().split("\n").map(Number);

let result = 0;

for (let i = 0; i < numbers.length; i++) {
  if (i < 3) {
    continue;
  }

  const a1 = numbers[i - 3];
  const a2 = numbers[i - 2];
  const a3 = numbers[i - 1];

  const b1 = numbers[i - 2];
  const b2 = numbers[i - 1];
  const b3 = numbers[i];

  const prev = a1 + a2 + a3;
  const curr = b1 + b2 + b3;

  if (curr > prev) {
    result += 1;
  }
}

console.log(result);
