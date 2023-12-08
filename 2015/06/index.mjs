import assert from "node:assert";
import { createReadStream } from "node:fs";
import readline from "readline";

class Action {
  static verbs = ["toggle", "turn on", "turn off"];

  constructor(line) {
    const action = Action.verbs.find((v) => line.startsWith(v));
    if (action === undefined) throw Error;
    this.action = action;

    const [origin, _, through] = line.replace(`${action} `, "").split(" ");

    this.origin = origin.split(",").map(Number);
    this.through = through.split(",").map(Number);
  }

  /**
   * @param {Set<string>} map
   */
  transform(map) {
    let transform = (p) => {};

    if (this.action === "turn on") {
      transform = (p) => map.add(p);
    } else if (this.action === "turn off") {
      transform = (p) => map.delete(p);
    } else {
      transform = (p) => (map.has(p) ? map.delete(p) : map.add(p));
    }

    for (const point of this.points()) {
      transform(point);
    }
  }

  /**
   * @param {Map<string, number>} map
   */
  transformB(map) {
    let transform = (p) => {};

    if (this.action === "turn on") {
      transform = (p) => map.set(p, (map.get(p) ?? 0) + 1);
    } else if (this.action === "turn off") {
      transform = (p) => {
        const b = (map.get(p) ?? 0) - 1;
        map.set(p, Math.max(b, 0));
      };
    } else {
      transform = (p) => map.set(p, (map.get(p) ?? 0) + 2);
    }

    for (const point of this.points()) {
      transform(point);
    }
  }

  *points() {
    const [x0, y0] = this.origin;
    const [xMax, yMax] = this.through;

    for (let x = x0; x <= xMax; x++) {
      for (let y = y0; y <= yMax; y++) {
        yield `${x},${y}`;
      }
    }
  }
}
const actionTest = new Action("turn on 0,0 through 1,1");
assert.strictEqual(actionTest.action, "turn on");
assert.deepEqual(actionTest.origin, [0, 0]);
assert.deepEqual(actionTest.through, [1, 1]);
assert.strictEqual(Array.from(actionTest.points()).length, 4);

async function mainA(file) {
  let map = new Set();

  for await (const line of readline.createInterface({ input: createReadStream(file) })) {
    new Action(line).transform(map);
  }

  return map.size;
}

const testA = new Set();
new Action("toggle 0,0 through 999,0").transform(testA);
assert.strictEqual(testA.size, 1000);

const rA = await mainA("./input.txt");
assert.strictEqual(rA, 543903);
console.log(rA);

async function mainB(file) {
  let map = new Map();

  for await (const line of readline.createInterface({ input: createReadStream(file) })) {
    new Action(line).transformB(map);
  }

  let total = 0;
  for (const v of map.values()) {
    total += v;
  }

  return total;
}

const rB = await mainB("./input.txt");
assert.strictEqual(rB, 14687245);

console.log(rB);
