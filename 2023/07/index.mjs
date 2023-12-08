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

const getCardValue = (c, useJoker = false) => {
  if (useJoker && c === "J") return -1;

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
    acc[card] ??= 0;
    acc[card] += 1;
    return acc;
  }, {});

  const counts = Object.values(charCount);
  if (counts.includes(5)) return COMBINAISONS.SAME5;
  if (counts.includes(4)) return COMBINAISONS.SAME4;
  if (counts.includes(3) && counts.includes(2)) return COMBINAISONS.FULL;
  if (counts.includes(3)) return COMBINAISONS.SAME3;
  if (counts.filter((v) => v === 2).length === 2) return COMBINAISONS.SAME2x2;
  if (counts.includes(2)) return COMBINAISONS.SAME2;
  return COMBINAISONS.NONE;
}
assert.strictEqual(getCardHandValue("KKKKK"), COMBINAISONS.SAME5);
assert.strictEqual(getCardHandValue("KKTT2"), COMBINAISONS.SAME2x2);
assert.strictEqual(getCardHandValue("KQJT2"), COMBINAISONS.NONE);

/**
 * @param {string} hand
 */
function* getPossibleHandsWithJoker(hand) {
  if (!hand.includes("J")) return yield hand;

  const indexes = Array.from(hand.matchAll(/J/g)).map((m) => Number(m.index));
  if (indexes.length === 5) return yield "AAAAA";

  const combinations = (arr, qty = 1) =>
    new Set(
      [...Array(qty).keys()]
        .reduce((result) => arr.concat(result.flatMap((val) => arr.map((char) => val + char))), [])
        .filter((val) => val.length >= qty)
    );

  const cards = hand.replace("J", "").split("");

  for (const comb of combinations(cards, indexes.length)) {
    const newHand = hand.split("");
    for (let i = 0; i < indexes.length; i++) newHand[indexes[i]] = comb[i];
    yield newHand.join("");
  }
}
assert.deepEqual(Array.from(getPossibleHandsWithJoker("KKKKJ")), ["KKKKK"]);
assert.deepEqual(Array.from(getPossibleHandsWithJoker("KKKJJ")), ["KKKKK", "KKKKJ", "KKKJK", "KKKJJ"]);
assert.deepEqual(Array.from(getPossibleHandsWithJoker("JJJJJ")), ["AAAAA"]);

/**
 * @param {string} hand
 * @returns {number}
 */
function getCardHandValueWithJoker(hand) {
  let bestValue = 0;
  for (const h of getPossibleHandsWithJoker(hand)) {
    if (h.length !== 5) throw Error();
    const v = getCardHandValue(h);
    if (v > bestValue) bestValue = v;
  }
  return bestValue;
}
assert.strictEqual(getCardHandValueWithJoker("JJJJ2"), COMBINAISONS.SAME5);
assert.strictEqual(getCardHandValueWithJoker("JJJ32"), COMBINAISONS.SAME4);
assert.strictEqual(getCardHandValueWithJoker("JJ432"), COMBINAISONS.SAME3);
assert.strictEqual(getCardHandValueWithJoker("JJ433"), COMBINAISONS.SAME4);
assert.strictEqual(getCardHandValueWithJoker("KKJQQ"), COMBINAISONS.FULL);

/**
 * @param {Hand} a
 * @param {Hand} b
 */
function compareHands(a, b, useJoker = false) {
  if (a.value !== b.value) return a.value > b.value ? -1 : 1;

  for (let i = 0; i < a.hands.length; i++) {
    const aV = getCardValue(a.hands[i], useJoker);
    const bV = getCardValue(b.hands[i], useJoker);
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
 * @param {string} line
 * @returns {Hand}
 */
function parseCard(line, joker = false) {
  const [hands, bid] = line.split(" ");
  return { hands, bid: Number(bid), value: joker ? getCardHandValueWithJoker(hands) : getCardHandValue(hands) };
}

function compute(file, joker = false) {
  return readFileSync(file)
    .toString("utf-8")
    .split("\n")
    .map((s) => parseCard(s, joker))
    .sort((a, b) => compareHands(a, b, joker))
    .reverse()
    .reduce((acc, v, i) => v.bid * (i + 1) + acc, 0);
}

const mainA = (file) => compute(file, false);
const mainB = (file) => compute(file, true);

assert.strictEqual(mainA("spec.txt"), 6440);
const partA = mainA("input.txt");
console.log("part A", partA);
assert.strictEqual(partA, 252656917);

const partB = mainB("input.txt");
console.log("part B", partB);
assert.ok(253080797 < partB);
assert.strictEqual(partB, 253499763);
