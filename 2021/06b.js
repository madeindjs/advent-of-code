// @ts-check
const fs = require("fs");

const buildFishes = () =>
  fs
    .readFileSync("06.txt")
    .toString()
    .split(",")
    .map(Number)
    .reduce((acc, fish) => {
      const qty = acc.get(fish);

      if (qty === undefined) {
        acc.set(fish, 1);
      } else {
        acc.set(fish, qty + 1);
      }

      return acc;
    }, new Map());

function partB() {
  console.group("Part B");
  let fishes = buildFishes();

  for (let day = 0; day < 256; day++) {
    let newFishes = new Map();

    for (let cursor = 8; cursor >= 0; cursor--) {
      const qty = fishes.get(cursor) ?? 0;

      if (cursor === 0) {
        newFishes.set(8, qty);
        newFishes.set(6, (newFishes.get(6) ?? 0) + qty);
      } else {
        newFishes.set(cursor - 1, qty);
      }
    }
    fishes = newFishes;
  }
  console.log(Array.from(fishes.values()).reduce((a, b) => a + b));
  console.groupEnd();
}

partB();
