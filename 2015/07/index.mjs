import { readFileSync } from "fs";
import assert from "node:assert";

function uint16(n) {
  return n & 0xffff;
}

class Operation {
  /** @type {Record<string, (a:number, b: number) => number>} */
  static OPERATORS = {
    AND: (a, b) => a & b,
    OR: (a, b) => a | b,
    LSHIFT: (a, b) => a << b,
    RSHIFT: (a, b) => a >> b,
  };
  /**
   * @param {string} line
   */
  constructor(line) {
    const [operation, result] = line.split(" -> ");

    this.result = result;
    this.operationStr = operation;

    if (this.operationStr.startsWith("NOT ")) {
      this.operator = "NOT";
      const k = this.operationStr.replace("NOT ", "");
      this.values = [this.#transformValue(k)];
      return;
    }

    const op = Object.entries(Operation.OPERATORS).find((o) => this.operationStr.includes(` ${o[0]} `));

    if (!op) {
      this.operator = "EQ";
      this.values = [this.#transformValue(this.operationStr)];
      return;
    }

    this.operator = op[0];
    this.values = this.operationStr.split(` ${op[0]} `).map((v) => this.#transformValue(v));
  }

  /**
   * @param {string} value
   */
  #transformValue(value) {
    const nb = Number(value);
    return Number.isNaN(nb) ? value : nb;
  }

  /**
   * @param {Map<string, number>} values
   * @returns {number}
   */
  compute(values) {
    switch (this.operator) {
      case "EQ":
        // @ts-ignore
        return this.#getValue(values, this.values[0]);
      case "NOT":
        // @ts-ignore
        return uint16(~this.#getValue(values, this.values[0]));
      default: {
        const [a, b] = this.values.map((v) => this.#getValue(values, v));
        // @ts-ignore
        return Operation.OPERATORS[this.operator](a, b);
      }
    }
  }

  /**
   * @param {Map<string, number>} values
   * @param {string | number} value
   */
  #getValue(values, value) {
    if (typeof value === "number") return uint16(value);
    return values.get(value);
  }
}

const specOp = new Operation("x LSHIFT 2 -> f");
assert.strictEqual(specOp.operator, "LSHIFT");
assert.deepEqual(specOp.values, ["x", 2]);
assert.deepEqual(specOp.compute(new Map([["x", 123]])), 492);

const specOp2 = new Operation("NOT x -> h");
assert.strictEqual(specOp2.operator, "NOT");
assert.deepEqual(specOp2.values, ["x"]);
assert.deepEqual(specOp2.compute(new Map([["x", 123]])), 65412);

class Circuit {
  /** @type {Map<string, Operation>} */
  #operatorMap = new Map();
  /** @type {Map<string, number>} */
  #values = new Map();

  constructor(file) {
    const operators = readFileSync(file)
      .toString("utf-8")
      .split("\n")
      .map((l) => new Operation(l));

    for (const operator of operators) {
      this.#operatorMap.set(operator.result, operator);
    }
  }

  /**
   * @param {string} key
   * @returns {number}
   */
  getValue(key) {
    const existingValue = this.#values.get(key);
    if (existingValue !== undefined) return uint16(existingValue);

    const op = this.#getOperatorByKey(key);

    if (op.values.length === 1 && typeof op.values[0] === "number") {
      const value = uint16(op.values[0]);
      this.#values.set(key, value);
      return value;
    }

    for (const dep of op.values) {
      if (typeof dep === "string") this.getValue(dep);
    }

    const value = op.compute(this.#values);
    this.#values.set(key, value);
    return value;
  }

  override(key, value) {
    this.#values.set(key, value);
  }

  #getOperatorByKey(key) {
    const op = this.#operatorMap.get(key);
    if (op === undefined) throw Error(`Cannot get operator for ${key}`);
    return op;
  }
}

/**
 * @param {string} file
 */
function mainA(file, key) {
  const circuit = new Circuit(file);
  return circuit.getValue(key);
}

/**
 * @param {string} file
 */
function mainB(file, key) {
  const circuit = new Circuit(file);
  circuit.override("b", 46065);
  return circuit.getValue(key);
}

// assert.strictEqual(mainA("spec.txt"), 95437);
const specA = new Circuit("spec.txt");
assert.strictEqual(specA.getValue("x"), 123);
assert.strictEqual(specA.getValue("y"), 456);
assert.strictEqual(specA.getValue("d"), 72);
assert.strictEqual(specA.getValue("h"), 65412);

const partA = mainA("input.txt", "a");
console.log(partA);

const partB = mainB("input.txt", "a");
console.log(partB);
