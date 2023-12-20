import { deepEqual, strictEqual } from "node:assert";
import { readFileSync } from "node:fs";
import { URL } from "node:url";

/**
 * @typedef {[value: string, operator: '>' | '<', target: number, destination: string]} Action
 * @typedef {{name: string, defaultDest: string, actions: Action[]}} Instruction
 * @typedef {Record<string, number>} Ratings
 */

/**
 * @param {string} str
 * @returns {Action}
 */
function parseAction(str) {
  const m = str.match(/([A-z]+)(<|>)([0-9]+):([A-z]+)/);
  if (!m) throw `can't parse action: ${str}`;
  const [_, value, operator, target, destination] = m;
  // @ts-ignore
  return [value, operator, Number(target), destination];
}

/**
 * @param {string} line
 * @returns {Instruction}
 */
function parseInstruction(line) {
  const match = line.match(/([A-z]+)\{(.*)\}/);
  if (!match) throw `can't parse instruction: ${line}`;
  const [_, name, bodyStr] = match;

  const bodyArr = bodyStr.split(",");
  const defaultDest = bodyArr.pop();
  if (defaultDest === undefined) throw `Don't have default: ${line}`;

  // @ts-ignore
  return { name, defaultDest, actions: bodyArr.map(parseAction) };
}
deepEqual(parseInstruction("px{a<2006:qkq,m>2090:A,rfg}"), {
  name: "px",
  actions: [
    ["a", "<", 2006, "qkq"],
    ["m", ">", 2090, "A"],
  ],
  defaultDest: "rfg",
});

/**
 * @param {string} line
 * @returns {Ratings}
 */
function parseRatings(line) {
  return line
    .slice(1, line.length - 1)
    .split(",")
    .reduce((acc, str) => {
      const [k, v] = str.split("=");
      acc[k] = Number(v);
      return acc;
    }, {});
}
deepEqual(parseRatings("{x=787,m=2655,a=1222,s=2876}"), { x: 787, m: 2655, a: 1222, s: 2876 });

/**
 *
 * @param {string} file
 * @returns {[instructions: Instruction[], ratings: Ratings[]]}
 */
function parseFile(file) {
  const [instructions, ratings] = readFileSync(new URL(file, import.meta.url), { encoding: "utf-8" })
    .split("\n\n")
    .map((raw) => raw.split("\n"));

  return [instructions.map(parseInstruction), ratings.map(parseRatings)];
}

/**
 * @param {Ratings} ratings
 * @param {Instruction[]} instructions
 */
function computeRatings(ratings, instructions) {
  let current = "in";

  while (current !== "R" && current !== "A") {
    const ins = instructions.find(({ name }) => name === current);
    if (ins === undefined) throw `Cannot find instruction for ${current}`;

    current =
      ins.actions.find(([value, operator, target]) =>
        operator === "<" ? ratings[value] < target : ratings[value] > target
      )?.[3] ?? ins.defaultDest;
  }

  return current;
}

function main(file) {
  const [instructions, ratings] = parseFile(file);
  let total = 0;

  for (const r of ratings) {
    const result = computeRatings(r, instructions);
    if (result !== "A") continue;
    total += Object.values(r).reduce((acc, v) => acc + v, 0);
  }
  return total;
}

strictEqual(main("./spec.txt"), 19114);
console.log(main("./input.txt"));

// const mainA = (file) => main(parseFile(file));
// assert.strictEqual(mainA("./spec.txt"), 62);
// const a = mainA("./input.txt");
// assert.strictEqual(a, 47045);
// console.log(a);

// const mainB = (file) => main(parseInstructionHex(file));
// assert.strictEqual(mainB("./spec.txt"), 952408144115);
// const b = mainB("input.txt");
// assert.strictEqual(b, 147839570293376);
// console.log(b);
