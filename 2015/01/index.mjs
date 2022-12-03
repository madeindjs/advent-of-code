import fs from "fs";

const content = fs.readFileSync("input.txt").toString("utf-8");

let chars = content.split("");

let level = 0;

for (const char of chars) {
  if (char === "(") level++;
  if (char === ")") level--;
}

console.log("part A", level);

for (const char of chars) {
  if (char === "(") level++;
  if (char === ")") level--;
}

level = 0;

for (let index = 0; index < chars.length; index++) {
  const char = chars[index];

  if (char === "(") level++;
  if (char === ")") level--;

  if (level === -1) console.log("part B", index + 1);
}
