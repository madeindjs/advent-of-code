// @ts-check
const { readFileSync } = require("fs");
const { strictEqual, deepEqual, ok } = require("assert");
/**
 * @typedef {{[key: string]: number}} Templates
 * @typedef {{[key: string]: string}} Couples
 *
 */

/**
 *
 * @param {string} file
 * @returns {{words: Templates, couples: Couples}}
 */
function parseFile(file) {
  const [template, couplesStr] = readFileSync(file).toString().split("\n\n");

  const couples = couplesStr.split("\n").reduce((acc, line) => {
    const [couple, char] = line.split(" -> ");
    acc[couple] = char;
    return acc;
  }, {});

  /** @type {Templates} */
  const words = {};

  for (let i = 1; i < template.length; i++) {
    const word = `${template[i - 1]}${template[i]}`;
    if (words[word] === undefined) {
      words[word] = 1;
    } else {
      words[word]++;
    }
  }

  return { words, couples };
}

/**
 *
 * @param {Templates} templates
 * @param {Couples} couples
 * @returns
 */
function replace(templates, couples) {
  const toInsert = [];
  const toRemove = [];

  for (const template of Object.keys(templates)) {
    const char = couples[template];

    if (char !== undefined) {
      const qty = templates[template];
      toInsert.push({ template: `${template[0]}${char}`, qty }, { template: `${char}${template[1]}`, qty });
      toRemove.push(template);
    }
  }

  toRemove.forEach((template) => {
    if (templates[template] > 0) {
      templates[template] = 0;
    }
  });

  toInsert.forEach(({ template, qty }) => {
    if (templates[template]) {
      templates[template] += qty;
    } else {
      templates[template] = qty;
    }
  });

  console.log(toInsert);

  return templates;
}

function count(file, loop) {
  let { words, couples } = parseFile(file);

  for (let i = 0; i < loop; i++) {
    // console.log(words);
    // console.log(`loop ${i} (length: ${template.length})`);
    words = replace(words, couples);
  }

  const counts = Object.keys(words).reduce((acc, word) => {
    for (const i of [0, 1]) {
      const char = word[i];

      if (acc[char] === undefined) {
        acc[char] = words[word];
      } else {
        acc[char] += words[word];
      }
    }

    return acc;
  }, {});

  const maxCount = Math.max(...Object.values(counts)) / 2;
  const minCount = Math.min(...Object.values(counts)) / 2;

  const result = Math.floor(maxCount - minCount);

  return [result - 1, result, result + 1];
}

function partA(file) {
  return count(file, 10);
}

// too long
function partB(file) {
  return count(file, 40);
}

// const testCouples = parseFile("14.test.txt").couples;

// strictEqual(replace("NNCB", testCouples), "NCNBCHB");
// strictEqual(replace("NCNBCHB", testCouples), "NBCCNBBBCBHCB");

deepEqual(replace({ AA: 1 }, { AA: "B" }), { AA: 0, AB: 1, BA: 1 });
deepEqual(replace({ AA: 5 }, { AA: "B" }), { AA: 0, AB: 5, BA: 5 });

ok(partA("14.test.txt").includes(1588));
ok(partB("14.test.txt").includes(2188189693529));

console.log("Part A", partA("14.txt"));
console.log("Part B", partB("14.txt"));
// not 2276644000112
