import { readFileSync } from "fs";
import assert from "node:assert";

/**
 * @param {string} file
 */
function main(file) {
  const lines = readFileSync(file).toString("utf-8").split("\n");

  let cycle = 0;
  let value = 1;

  let checkpoints = [];

  let points = [];

  let draw = [];

  const drawPosition = (position) => {
    points = [0, 1, 2].map((i) => position + i);
  };

  drawPosition(value - 1);

  for (let index = 0; index < lines.length; index++) {
    const line = lines[index];
    const [verb, qtyStr] = line.split(" ");

    const wait = verb === "noop" ? 1 : 2;

    for (let index = 0; index < wait; index++) {
      cycle++;

      let sprite = Math.ceil(cycle / 40);
      let position = cycle % 40;

      draw[sprite] += points.includes(position) ? "#" : ".";

      if ([20, 60, 100, 140, 180, 220].includes(cycle)) {
        checkpoints.push(value * cycle);
        console.log("##", { cycle, value, qtyStr, line });
      }

      if (verb === "addx" && index === wait - 1) {
        value += Number(qtyStr);
        drawPosition(value);
      }
    }
  }

  for (const line of draw) {
    console.log(line);
  }

  // for (let index = 0; index < 6; index++) {
  //   console.log(draw.slice(index * 40, index * 40 + 40));
  // }

  // console.log(draw);

  return checkpoints.reduce((acc, v) => acc + v, 0);
}

assert.strictEqual(main("spec.txt"), 13140);
const partA = main("input.txt");
assert.ok(partA < 14560);
