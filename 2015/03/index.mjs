import { readFileSync } from "fs";
import assert from "node:assert";

const content = readFileSync("input.txt").toString("utf-8");

function getHomes(path) {
  let current = [0, 0];
  const points = new Set();
  points.add(`${current[0]}x${current[1]}`);

  for (const position of path.split("")) {
    switch (position) {
      case ">":
        current[1]++;
        break;
      case "v":
        current[0]--;
        break;
      case "<":
        current[1]--;
        break;
      case "^":
        current[0]++;
        break;
    }
    points.add(`${current[0]}x${current[1]}`);
  }
  // console.log(points.values());
  return points.size;
}

assert.strictEqual(getHomes("^>v<"), 4);
assert.strictEqual(getHomes("^v^v^v^v^v"), 2);

console.log("Part A", getHomes(content));
