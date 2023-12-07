import { readFileSync } from "fs";
import assert from "node:assert";

const COMBINAISONS = {
  SAME5: 6,
  SAME4: 5,
  FULL: 4,
  SAME3: 3,
  SAME2x2: 2,
  SAME2: 1,
  NONE: 0,
};

const CARD_VALUES = ["A", "K", "Q", "J", "T", "9", "8", "7", "6", "5", "4", "3", "2"].reverse();

const getCardValue = (c) => {
  const a = CARD_VALUES.findIndex((v) => v === c);
  if (a === -1) throw Error;
  return a;
};

/**
 * @param {string} hand
 * @returns {number}
 */
function getCardHandValue(hand) {
  /** @type {Record<number, number>} */
  const charCount = hand.split("").reduce((acc, card) => {
    const value = getCardValue(card);
    acc[value] ??= 0;
    acc[value] += 1;
    return acc;
  }, {});

  const counts = Object.values(charCount);
  if (counts.includes(5)) {
    return COMBINAISONS.SAME5;
  } else if (counts.includes(4)) {
    return COMBINAISONS.SAME4;
  } else if (counts.includes(3) && counts.includes(2)) {
    return COMBINAISONS.FULL;
  } else if (counts.includes(3)) {
    return COMBINAISONS.SAME3;
  } else if (counts.filter((v) => v === 2).length === 2) {
    return COMBINAISONS.SAME2x2;
  } else if (counts.includes(2)) {
    return COMBINAISONS.SAME2;
  } else {
    return COMBINAISONS.NONE;
  }
}
assert.strictEqual(getCardHandValue("KKKKK"), COMBINAISONS.SAME5);
assert.strictEqual(getCardHandValue("KKKK2"), COMBINAISONS.SAME4);
assert.strictEqual(getCardHandValue("KKTT2"), COMBINAISONS.SAME2x2);
assert.strictEqual(getCardHandValue("KQJT2"), COMBINAISONS.NONE);

/**
 * @param {Hand} a
 * @param {Hand} b
 */
function compareHands(a, b) {
  if (a.value !== b.value) return a.value > b.value ? -1 : 1;

  // samke rank, compare card
  for (let i = 0; i < a.hands.length; i++) {
    const aC = a.hands[i];
    const bC = b.hands[i];
    const aV = getCardValue(aC);
    const bV = getCardValue(bC);
    if (aV === bV) continue;
    return aV > bV ? -1 : 1;
  }
  return 0;
}
assert.strictEqual(compareHands(parseCard("32T3K 1"), parseCard("T55J5 1")), 1);
assert.strictEqual(compareHands(parseCard("KK677 1"), parseCard("KTJJT 1")), -1);
assert.strictEqual(compareHands(parseCard("23456 1"), parseCard("23457 1")), 1);
assert.strictEqual(compareHands(parseCard("JK938 1"), parseCard("JK6T5 1")), -1);
assert.strictEqual(compareHands(parseCard("TTTT2 1"), parseCard("TTTT3 1")), 1);
/**
 * @typedef {{hands: string, bid: number, value: number }} Hand
 * @param {*} line
 * @returns {Hand}
 */
function parseCard(line) {
  const [hands, bid] = line.split(" ");
  return { hands, bid: Number(bid), value: getCardHandValue(hands) };
}

/**
 * @param {string} file
 */
function mainA(file) {
  const hands = readFileSync(file).toString("utf-8").split("\n").map(parseCard).sort(compareHands).reverse();
  // console.log(hands);
  return hands.reduce((acc, v, i) => v.bid * (i + 1) + acc, 0);
}

/**
 * @param {string} file
 */
function mainB(file) {
  // @ts-ignore
  const lines = readFileSync(file).toString("utf-8").split("\n");

  return 0;
}

assert.strictEqual(mainA("spec.txt"), 6440);
const partA = mainA("input.txt");

console.log("part A", partA);
// too high 252663908
assert.strictEqual(partA, 252656917);

// assert.strictEqual(partA, 1770595);

// assert.strictEqual(mainB("spec.txt"), 24933642);
// const partB = mainB("input.txt");

// assert.strictEqual(partB, 2195372);
// console.log("part B", partB);
