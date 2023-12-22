import { deepEqual, strictEqual } from "node:assert";
import { readFileSync } from "node:fs";
import { URL } from "node:url";

/**
 * @typedef {{value: string, operator: string, target: number, destination: string}} Action
 * @typedef {{name: string, defaultDest: string, actions: Action[]}} Instruction
 * @typedef {Record<string, Instruction>} Instructions
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
  return { value, operator, target: Number(target), destination };
}

/**
 * @param {string} line
 * @returns {[name: string, Instruction]}
 */
function parseInstruction(line) {
  const match = line.match(/([A-z]+)\{(.*)\}/);
  if (!match) throw `can't parse instruction: ${line}`;
  const [_, name, bodyStr] = match;

  const bodyArr = bodyStr.split(",");
  const defaultDest = bodyArr.pop();
  if (defaultDest === undefined) throw `Don't have default: ${line}`;

  return [name, { name, defaultDest, actions: bodyArr.map(parseAction) }];
}
deepEqual(parseInstruction("px{a<2006:qkq,m>2090:A,rfg}"), [
  "px",
  {
    name: "px",
    actions: [
      { value: "a", operator: "<", target: 2006, destination: "qkq" },
      { value: "m", operator: ">", target: 2090, destination: "A" },
    ],
    defaultDest: "rfg",
  },
]);

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
 * @returns {[instructions: Map<string, Instruction>, ratings: Ratings[]]}
 */
function parseFile(file) {
  const [instructions, ratings] = readFileSync(new URL(file, import.meta.url), { encoding: "utf-8" })
    .split("\n\n")
    .map((raw) => raw.split("\n"));

  return [new Map(instructions.map(parseInstruction)), ratings.map(parseRatings)];
}

/**
 * @param {Ratings} ratings
 * @param {Map<string, Instruction>} instructions
 */
function computeRatings(ratings, instructions) {
  let current = "in";

  while (current !== "R" && current !== "A") {
    const ins = instructions.get(current);
    if (ins === undefined) throw `Cannot find instruction for ${current}`;

    current =
      ins.actions.find(({ value, operator, target }) =>
        operator === "<" ? ratings[value] < target : ratings[value] > target
      )?.destination ?? ins.defaultDest;
  }

  return current;
}

function mainA(file) {
  const [instructions, ratings] = parseFile(file);
  let total = 0;

  for (const r of ratings) {
    const result = computeRatings(r, instructions);
    if (result !== "A") continue;
    total += Object.values(r).reduce((acc, v) => acc + v, 0);
  }
  return total;
}

strictEqual(mainA("./spec.txt"), 19114);
strictEqual(mainA("./input.txt"), 376008);

// part B

/**
 * @typedef {Record<string, number[]>} Xmas
 */

function* getNumbers(from, to) {
  for (let i = from; i <= to; i++) yield i;
}

/**
 * @param {Map<string, Instruction>} instructions
 * @param {string} goal
 * @param {Xmas} xmas
 */
function filterCombinaisons(instructions, goal, xmas = buildXmas()) {
  const possibilities = Array.from(instructions.values()).filter(
    (i) => i.defaultDest === goal || i.actions.some((a) => a.destination === goal)
  );

  for (const poss of possibilities) {
    if (poss.defaultDest === goal) {
      filterDefaultDest(xmas, poss.actions);
    } else {
      filterTarget(xmas, poss.actions, goal);
    }
    if (poss.name !== "in") filterCombinaisons(instructions, poss.name, xmas);
  }

  return xmas;
}

/**
 * @param {number[]} arr
 */
function removeNumbers(arr, from, to) {
  for (const n of getNumbers(from, to)) {
    const i = arr.findIndex((a) => a === n);
    if (i !== -1) arr.splice(i, 1);
  }
  return arr;
}
deepEqual(removeNumbers([1, 2, 3, 4], 2, 3), [1, 4]);

/**
 * @returns {Xmas}
 */
function buildXmas() {
  let k4 = Array.from(getNumbers(1, 4000));
  return {
    x: [...k4],
    m: [...k4],
    a: [...k4],
    s: [...k4],
  };
}

/**
 *
 * @param {Xmas} xmas
 * @param {Action[]} actions
 */
function filterDefaultDest(xmas, actions) {
  for (const { value, operator, target } of actions) {
    const range = operator === ">" ? [target, 4000] : [0, target - 1];
    // @ts-ignore
    removeNumbers(xmas[value], ...range);
  }
}

/**
 *
 * @param {Xmas} xmas
 * @param {Action[]} actions
 */
function filterTarget(xmas, actions, goal) {
  for (const { value, operator, target } of actions.filter((a) => a.destination === goal)) {
    const range = operator === "<" ? [target, 4000] : [0, target];
    // @ts-ignore
    console.log(range);
    removeNumbers(xmas[value], ...range);
  }
}

function mainB(file) {
  const [instructions] = parseFile(file);

  const stack = [{ point: "in", xmas: buildXmas() }];

  const results = [];

  while (stack.length) {
    const current = stack.pop();
    if (!current) throw `can't happens`;

    const ins = instructions.get(current.point);
    if (ins === undefined) throw `Cannot find instruction for ${current}`;

    let isDefault = true;
    for (const { destination, operator, target, value } of ins.actions) {
      operator === "<" ? ratings[value] < target : ratings[value] > target;
    }
  }
}

strictEqual(mainB("./spec2.txt"), 1);
strictEqual(mainB("./spec3.txt"), 1 * 4000 * 4000 * 4000);
strictEqual(mainB("./spec4.txt"), 1 * 1 * 4000 * 4000);
strictEqual(mainB("./spec4b.txt"), 1 * 1 * 4000 * 4000);
strictEqual(mainB("./spec5.txt"), 1);
strictEqual(mainB("./spec.txt"), 167409079868000);
strictEqual(mainB("./spec.txt"), 167409079868000);

// const mainB = (file) => main(parseInstructionHex(file));
// assert.strictEqual(mainB("./spec.txt"), 952408144115);
// const b = mainB("input.txt");
// assert.strictEqual(b, 147839570293376);
// console.log(b);
