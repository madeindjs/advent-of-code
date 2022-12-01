// @ts-check
const fs = require('fs');

const numbers = fs.readFileSync('./01.txt').toString().split('\n').map(Number);

let result = 0;

for (let i = 0; i < numbers.length ; i ++) {

  if (i === 0) {
    continue
  }

  const prev = numbers[i - 1];
  const curr = numbers[i];

  if (curr > prev) {
    result += 1;
  }

}

console.log(result)