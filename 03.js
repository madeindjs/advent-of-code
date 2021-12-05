// @ts-check
const fs = require("fs");

/** @typedef {'0' | '1' | '?'} bit */

const rows = fs.readFileSync("./03.txt").toString().split("\n");

function getBit(binary, position) {
  const bit = binary[position];
  if (bit === undefined) {
    throw Error;
  }
  return bit;
}

/**
 * @param {number} position
 * @returns {bit}
 */
function findMostCommonBit(list, position) {
  const nbOfBit0 = list.filter((bit) => getBit(bit, position) === "0").length;
  const nbOfBit1 = list.filter((bit) => getBit(bit, position) === "1").length;

  if (nbOfBit0 === nbOfBit1) {
    return "?";
  }

  return nbOfBit0 > nbOfBit1 ? "0" : "1";
}

/**
 *
 * @param {bit} binary
 * @return {bit}
 */
function invertBit(binary) {
  return binary === "0" ? "1" : "0";
}

/**
 *
 * @param {string} binary
 * @returns {number}
 */
function binaryToNumber(binary) {
  return parseInt(binary, 2);
}

function partA() {
  console.group("part A");

  const gamma = new Array(12)
    .fill()
    .map((_, i) => findMostCommonBit(rows, i))
    .join("");
  const epsilon = new Array(12)
    .fill()
    // @ts-ignore
    .map((_, i) => invertBit(gamma[i]))
    .join("");

  console.log("gamma   %o => %s", gamma, binaryToNumber(gamma));
  console.log("epsilon %o => %s", epsilon, binaryToNumber(epsilon));

  console.log(binaryToNumber(gamma) * binaryToNumber(epsilon));
  console.groupEnd();
}

// -----------------

/**
 * @param {string[]} list
 * @param {number} position
 * @returns {string[]}
 */
function keepMost(list, position) {
  const bit = findMostCommonBit(list, position);
  const biteCriteria = bit === "?" ? "1" : bit;

  return list.filter((b) => getBit(b, position) === biteCriteria);
}

/**
 * @param {string[]} list
 * @param {number} position
 * @returns {string[]}
 */
function keepLess(list, position) {
  const bit = findMostCommonBit(list, position);
  const biteCriteria = bit === "?" ? "0" : invertBit(bit);

  return list.filter((b) => getBit(b, position) === biteCriteria);
}

/**
 * @returns {string}
 */
function filterBitesByShittyAlgo(callback) {
  let list = [...rows];
  let cursor = 0;

  while (list.length !== 1) {
    list = callback(list, cursor);

    if (list.length === 0) {
      throw Error;
    }

    cursor = cursor === 11 ? 0 : cursor + 1;
  }

  return list[0];
}

function partB() {
  console.group("part B");

  const oxygenBit = filterBitesByShittyAlgo(keepMost);
  console.log("oxygen   %o => %s", oxygenBit, binaryToNumber(oxygenBit));

  const co2Bit = filterBitesByShittyAlgo(keepLess);
  console.log("C02      %o => %s", co2Bit, binaryToNumber(co2Bit));

  console.log(binaryToNumber(oxygenBit) * binaryToNumber(co2Bit));

  console.groupEnd();
}

partA();
partB();
