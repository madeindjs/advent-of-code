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
 * @returns {number[]}
 */
function getCardHandValue(hand) {
  /** @type {Record<number, number>} */
  const charCount = hand.split("").reduce((acc, card) => {
    const value = getCardValue(card);
    acc[value] ??= 0;
    acc[value] += 1;
    return acc;
  }, {});

  // @ts-ignore
  const findByCount = (c) => Number(Object.entries(charCount).find(([k, v]) => v === c)[0]);

  const counts = Object.values(charCount);
  if (counts.includes(5)) {
    return [COMBINAISONS.SAME5];
    return [COMBINAISONS.SAME5, findByCount(5)];
  } else if (counts.includes(4)) {
    return [COMBINAISONS.SAME4];
    return [COMBINAISONS.SAME4, findByCount(4)];
    // return [COMBINAISONS.SAME4, findByCount(4), findByCount(1)];
  } else if (counts.includes(3) && counts.includes(2)) {
    return [COMBINAISONS.FULL];
    return [COMBINAISONS.FULL, findByCount(3)];
    // return [COMBINAISONS.FULL, findByCount(3), findByCount(2)];
  } else if (counts.includes(3)) {
    const kicker = Math.max(
      ...Object.keys(charCount)
        .filter(([k, v]) => Number(v) !== 3)
        .map(([k, v]) => Number(k))
    );

    return [COMBINAISONS.SAME3];
    return [COMBINAISONS.SAME3, findByCount(3)];
    // return [COMBINAISONS.SAME3, findByCount(3), kicker];
  } else if (counts.filter((v) => v === 2).length === 2) {
    const [a, b] = Object.entries(charCount)
      .filter(([k, v]) => Number(v) === 2)
      .map(([k, v]) => k)
      .sort((a, b) => Number(a) - Number(b))
      .map(Number);
    return [COMBINAISONS.SAME2x2];
    return [COMBINAISONS.SAME2x2, Math.max(a, b)];
    return [COMBINAISONS.SAME2x2, Math.max(a, b), Math.min(a, b)];
    // return [COMBINAISONS.SAME2x2, Math.max(a, b), Math.min(a, b), findByCount(1)];
  } else if (counts.includes(2)) {
    const kicker = Math.max(
      ...Object.keys(charCount)
        .filter(([k, v]) => Number(v) !== 2)
        .map(([k, v]) => Number(k))
    );

    return [COMBINAISONS.SAME2];
    return [COMBINAISONS.SAME2, findByCount(2)];
    // return [COMBINAISONS.SAME2, kicker];
  } else {
    return [COMBINAISONS.NONE];
    return [COMBINAISONS.NONE, Math.max(...Object.keys(charCount).map(Number))];
  }
}
// assert.deepEqual(getCardHandValue("KKKKK"), [6, 11]);
// assert.deepEqual(getCardHandValue("KKKK2"), [5, 11]);
// assert.deepEqual(getCardHandValue("KKTT2"), [2, 11]);
// assert.deepEqual(getCardHandValue("KQJT2"), [0, 11]);
// assert.deepEqual(getCardHandValue("QQQJA"), [3, 10]);
// assert.deepEqual(getCardHandValue("JK5QK"), [1, 11]);

/**
 * @param {Hand} a
 * @param {Hand} b
 */
function compareHands(a, b) {
  const max = Math.max(a.value.length, b.value.length);
  for (let i = 0; i < max; i++) {
    const aa = a.value[i] ?? 0;
    const bb = b.value[i] ?? 0;
    if (aa === bb) continue;
    return aa > bb ? -1 : 1;
  }
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
 * @typedef {{hands: string, bid: number, value: number[] }} Hand
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
  console.log(hands);

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
assert.ok(252663908 > partA);
assert.ok(252916108 > partA);
assert.ok(252432368 < partA);
assert.ok(252655003 != partA);
assert.ok(252647010 != partA);
assert.ok(252662531 != partA);
assert.ok(252662752 != partA);

// assert.strictEqual(partA, 1770595);

// assert.strictEqual(mainB("spec.txt"), 24933642);
// const partB = mainB("input.txt");

// assert.strictEqual(partB, 2195372);
// console.log("part B", partB);
