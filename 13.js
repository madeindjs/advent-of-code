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

/**
 * @param {Point[]} points
 * @returns {Point[]}
 */
function uniqPoints(points) {
  return points.reduce((acc, point) => {
    if (acc.some(({ x, y }) => x === point.x && y === point.y)) {
      return acc;
    }
    return [...acc, point];
  }, []);
}

/**
 * @param {Point[]} coordinates
 * @param {string} fold
 * @returns {Point[]}
 */
function makeFold(coordinates, fold) {
  const axe = Number(fold.substring(2));

  if (fold.startsWith("x=")) {
    coordinates = coordinates.filter(({ x }) => x !== axe);

    for (const coordinate of coordinates) {
      if (coordinate.x > axe) {
        const move = (coordinate.x - axe) * 2;
        coordinate.x = coordinate.x - move;
      }
    }

    coordinates = uniqPoints(coordinates);
  } else if (fold.startsWith("y=")) {
    coordinates = coordinates.filter(({ y }) => y !== axe);

    for (const coordinate of coordinates) {
      if (coordinate.y > axe) {
        const move = (coordinate.y - axe) * 2;
        coordinate.y -= move;
      }
    }

    coordinates = uniqPoints(coordinates);
  }

  return coordinates;
}

function partA(file) {
  let { coordinates, folds } = parseFile(file);

  const fold = folds.shift();
  coordinates = makeFold(coordinates, fold);

  return coordinates.length;
}

function partB(file) {
  let { coordinates, folds } = parseFile(file);

  for (const fold of folds) {
    coordinates = makeFold(coordinates, fold);
  }

  const maxX = Math.max(...coordinates.map(({ x }) => x));
  const maxY = Math.max(...coordinates.map(({ y }) => y));

  for (let y = 0; y <= maxY; y++) {
    let line = "";
    for (let x = 0; x <= maxX; x++) {
      if (coordinates.some((p) => p.x === x && p.y === y)) {
        line = `${line}#`;
      } else {
        line = `${line} `;
      }
    }
    console.log(line);
  }

  return coordinates;
}

strictEqual(partA("13.test.txt"), 17);
strictEqual(partA("13.txt"), 653);
console.log("Part A", partA("13.txt"));

partB("13.txt");
// LKREBPRK