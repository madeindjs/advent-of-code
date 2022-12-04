import { createHash } from "node:crypto";

function getMd5(text) {
  return createHash("md5").update(text).digest("hex");
}

console.time("a");

/**
 *
 * @param {string} text
 * @return {number}
 */
function partA(text) {
  let current = 1;

  do {
    const hash = getMd5(`${text}${current}`);
    console.timeLog("a", current);
    if (hash.startsWith("00000")) {
      return current;
    }
    current++;
  } while (true);

  const hash = createHash("md5").update(text).digest("hex");

  console.log(hash);
  return 1;
}

// partA("abcdef609043");

// assert.strictEqual(partA("abcdef"), 609043);

const input = "iwrupvqb";

console.log("partA", partA(input));
