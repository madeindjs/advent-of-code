// @ts-check
const assert = require("assert");
const { readFileSync } = require("fs");

const one = "tr,br".split(",");
const four = "tl,tr,m,br".split(",");
const seven = "t,tr,br".split(",");
const eight = "t,tl,tr,m,bl,br,b".split(",");

const partA = readFileSync("08.txt")
  .toString()
  .split("\n")
  .map((line) => line.split(" | ")[1])
  .flatMap((line) => line.split(" "))
  .filter((chunk) => [one.length, four.length, seven.length, eight.length].includes(chunk.length)).length;
console.log("Part A", partA);

const partB = readFileSync("08.txt")
  .toString()
  .split("\n")
  .map(getDigits)
  .map(Number)
  .reduce((a, b) => a + b, 0);

console.log("Part B", partB);

/**
 * @param {string} line
 * @returns {string}
 */
function getDigits(line) {
  let [paterns, digits] = line.split(" | ").map((s) => s.split(" "));

  digits = digits.map((c) => c.split("").sort().join(""));

  const mapping = getMapping(paterns);

  return digits.map((d) => mapping.findIndex((v) => v === d).toString()).join("");
}

function sortStr(str) {
  return str.split("").sort().join("");
}

/**
 * @param {string[]} paterns
 */
function getMapping(paterns) {
  paterns = paterns.map((patern) => patern.split("").sort().join(""));

  const onePatern = paterns.find((patern) => patern.length === one.length);
  const fourPatern = paterns.find((patern) => patern.length === four.length);

  const sevenPatern = paterns.find((patern) => patern.length === seven.length);
  const eightPatern = paterns.find((patern) => patern.length === eight.length);

  const t = sevenPatern.split("").find((c) => !onePatern.includes(c));

  const ninePatern = paterns
    .filter((patern) => patern.length === 6)
    .find((patern) => fourPatern.split("").every((c) => patern.includes(c)))
    .split("")
    .sort()
    .join("");

  const b = ninePatern
    .split("")
    .filter((c) => !fourPatern.includes(c) && c !== t)
    .pop();

  const bl = eightPatern.split("").find((c) => !ninePatern.includes(c));
  const twoPatern = paterns
    .find((p) => p.length === 5 && p.includes(bl))
    .split("")
    .sort()
    .join("");

  const tr = onePatern.split("").find((c) => twoPatern.includes(c));

  const sixPatern = paterns.find((p) => p.length === 6 && !p.includes(tr));
  const fivePatern = sixPatern.replace(bl, "");

  const zeroPatern = paterns.find((p) => p.length === 6 && p !== ninePatern && p !== sixPatern);
  const threePatern = paterns.find((p) => p.length === 5 && p !== twoPatern && p !== fivePatern);

  return [
    sortStr(zeroPatern),
    sortStr(onePatern),
    sortStr(twoPatern),
    sortStr(threePatern),
    sortStr(fourPatern),
    sortStr(fivePatern),
    sortStr(sixPatern),
    sortStr(sevenPatern),
    sortStr(eightPatern),
    sortStr(ninePatern),
  ];
}

assert.strictEqual(
  getDigits("acedgfb cdfbe gcdfa fbcad dab cefabd cdfgeb eafb cagedb ab | cdfeb fcadb cdfeb cdbaf"),
  "5353"
);
