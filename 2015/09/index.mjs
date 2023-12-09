import { readFileSync } from "fs";
import assert from "node:assert";

/**
 * @typedef {{distance: number, to: string}} Path
 */

class Country {
  // /** @type {Map<string, >} */
  // #towns = new Map()

  /** @type {Map<string, Path[]>} */
  #paths = new Map();
  /** @type {Set<string>} */
  #towns = new Set();

  constructor(file) {
    for (const line of readFileSync(file).toString("utf-8").split("\n")) {
      this.addPath(line);
    }
  }

  /**
   * @param {string} line
   */
  addPath(line) {
    const [townsStr, distance] = line.split(" = ");
    const [from, to] = townsStr.split(" to ");
    this.#insertPath(from, to, distance);
    this.#insertPath(to, from, distance);
    this.#towns.add(from);
    this.#towns.add(to);
  }

  /**
   * @param {string} from
   * @param {string} to
   * @param {number | string} distance
   */
  #insertPath(from, to, distance) {
    const paths = this.#paths.get(from) ?? [];
    this.#paths.set(from, [...paths, { to, distance: Number(distance) }]);
  }

  /**
   * @returns {number}
   */
  computeMinDistance() {
    let min = Infinity;
    for (const town of this.#paths.keys()) {
      for (const paths of this.#computePath([town])) {
        if (paths.distance < min) min = paths.distance;
      }
    }
    return min;
  }

  /**
   * @returns {number}
   */
  computeMaxDistance() {
    let max = -Infinity;
    for (const town of this.#paths.keys()) {
      for (const paths of this.#computePath([town])) {
        if (paths.distance > max) max = paths.distance;
      }
    }
    return max;
  }

  /**
   * @typedef {{towns: string[], distance: number}} Visit
   * @param {string[]} towns
   * @param {number} distance
   * @returns {Generator<Visit, any, unknown>}
   */
  *#computePath(towns, distance = 0) {
    const from = towns[towns.length - 1];
    const paths = this.#paths.get(from);

    for (const path of paths ?? []) {
      if (towns.includes(path.to)) continue;

      const newTowns = [...towns, path.to];
      const newDistance = distance + path.distance;

      if (this.#hasEveryTowns(newTowns)) {
        yield { towns: newTowns, distance: newDistance };
      } else {
        yield* this.#computePath(newTowns, newDistance);
      }
    }
  }

  /**
   * @param {string[]} towns
   */
  #hasEveryTowns(towns) {
    for (const town of this.#towns) {
      if (!towns.includes(town)) return false;
    }
    return true;
  }
}

/**
 * @param {string} file
 */
function main(file) {
  const country = new Country(file);

  return {
    min: country.computeMinDistance(),
    max: country.computeMaxDistance(),
  };
}

{
  const { min, max } = main("spec.txt");
  assert.strictEqual(min, 605);
  assert.strictEqual(max, 982);
}
{
  const { min, max } = main("input.txt");
  assert.strictEqual(min, 141);
  assert.strictEqual(max, 736);
  console.log("part A", min);
  console.log("part B", max);
}
