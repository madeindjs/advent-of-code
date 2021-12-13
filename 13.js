// @ts-check
const { readFileSync } = require("fs");
const { strictEqual } = require("assert");

/**
 * @typedef {{x: number, y: number}} Point
 * @typedef {string} Fold
 */

/**
 * @param {string} file
 * @returns {{coordinates: Point[], folds: Fold[]}}
 */
function parseFile(file) {
  const content = readFileSync(file).toString();
  const [coordinatesStr, foldStr] = content.split("\n\n");

  const folds = foldStr.split("\n").map((l) => l.replace("fold along ", ""));

  const coordinates = coordinatesStr.split("\n").map((line) => {
    const [x, y] = line.split(",");
    return { x: Number(x), y: Number(y) };
  });

  return { coordinates, folds };
}

function partA(file) {
  let { coordinates, folds } = parseFile(file);

  const fold = folds.shift();

  const axe = Number(fold.substring(2));

  if (fold.startsWith("x=")) {
    coordinates = coordinates.filter(({ x }) => x !== axe);

    for (const coordinate of coordinates) {
      if (coordinate.x > axe) {
        const move = (coordinate.x - axe) * 2;
        coordinate.x = coordinate.x - move;
      }
    }

    coordinates = coordinates.reduce((acc, point) => {
      if (acc.some(({ x, y }) => x === point.x && y === point.y)) {
        return acc;
      }
      return [...acc, point];
    }, []);
  } else if (fold.startsWith("y=")) {
    coordinates = coordinates.filter(({ y }) => y !== axe);

    for (const coordinate of coordinates) {
      if (coordinate.y > axe) {
        const move = (coordinate.y - axe) * 2;
        coordinate.y -= move;
        // coordinates[i] = coordinate;
      }
    }

    coordinates = coordinates.reduce((acc, point) => {
      if (acc.some(({ x, y }) => x === point.x && y === point.y)) {
        return acc;
      }
      return [...acc, point];
    }, []);
  }

  // const debugL = (l) =>
  //   console.log(
  //     `p on y=${l}`,
  //     coordinates.filter(({ y }) => y === l)
  //   );

  // debugL(0);
  // debugL(1);
  // debugL(2);
  // debugL(3);
  // debugL(4);

  return coordinates.length;
}

// partA();
strictEqual(partA("13.test.txt"), 17);
strictEqual(partA("13.txt"), 653);
console.log("Part A", partA("13.txt"));
