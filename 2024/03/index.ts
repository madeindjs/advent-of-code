import assert from "node:assert";
import { createReadStream } from "node:fs";
import readline from "node:readline";

function getLines(path: string) {
  const file = new URL(path, import.meta.url);
  return readline.createInterface({ input: createReadStream(file) });
}

function evaluate(line: string) {
  let total = 0;
  for (const match of line.matchAll(/mul\(([0-9]{1,3}),([0-9]{1,3})\)/g)) {
    total += Number(match[1]) * Number(match[2]);
  }
  return total;
}

// function evaluate(line: string) {
//   let total = 0;
//
//   const isValid = /mul\(([0-9]{1,3}),([0-9]{1,3})\)/;
//   while (true) {
//     // console.log(line);
//     const start = line.indexOf("mul(");
//
//     if (start === -1) return total;
//
//     line = line.substring(start);
//     const end = line.indexOf(")");
//
//     if (end === -1) return total;
//
//     const part = line.substring(0, end + 1);
//     // console.log("Part __", part);
//
//     const match = isValid.exec(part);
//
//     if (match) {
//       const a = Number(match[1]);
//       const b = Number(match[2]);
//       // console.log(a, b);
//       total += a * b;
//       line = line.substring(end + 1);
//     } else {
//       console.log("skip", part);
//       line = line.substring(start + 4);
//     }
//   }
// }
// assert.strictEqual(
//   evaluate(
//     "xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))",
//   ),
//   161,
// );
// assert.strictEqual(evaluate("xmul(100,100)"), 10000);
// assert.strictEqual(evaluate("mul(100,2)mul(2,1)"), 202);
// assert.strictEqual(
//   evaluate("y()mul(386,104)[from()];mul(208,918))){"),
//   386 * 104 + 208 * 918,
// );
// assert.strictEqual(
//   evaluate("mul(99,24)(*!@]]mul(490,150)~"),
//   99 * 24 + 490 * 150,
// );

async function mainA() {
  let total = 0;
  for await (const line of getLines("./input.txt")) {
    total += evaluate(line);
  }
  return total;
}

assert.strictEqual(await mainA(), 173529487);
// 4681153 too low
// 7346089 too low
// 171324593 too low
