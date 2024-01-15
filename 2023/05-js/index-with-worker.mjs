import { readFileSync } from "node:fs";
import { Worker, isMainThread, parentPort, workerData } from "node:worker_threads";
import { fileURLToPath } from "url";

function extractNubersFromStr(str) {
  return Array.from(str.matchAll(/ ?([0-9]+)/g)).map((match) => Number(match[1]));
}

/**
 * @param {number} nb
 * @param {number} start
 * @param {number} to
 */
function isInRange(nb, start, to) {
  return nb >= start && nb <= to;
}

/**
 * @param {number} nb
 * @param {number[][]} trans
 * @returns {number}
 */
function applyTransforms(nb, trans) {
  for (const [dest, from, to] of trans) {
    if (!isInRange(nb, from, to)) continue;
    const offset = dest - from;
    return nb + offset;
  }
  return nb;
}

/** @param {string} lineGroup */
function parseInstruction(lineGroup) {
  const [titleStr, ...transformationLines] = lineGroup.split("\n");
  const [from, to] = titleStr.replace(" map:", "").split("-to-");

  const trans = transformationLines
    .map(extractNubersFromStr)
    .map(([dest, from, length]) => [dest, from, from + length - 1]);

  return { from, to, trans };
}

function* createRangesFromTuple(from, length) {
  const to = length + from - 1;

  for (let i = from; i <= to; i++) {
    yield i;
  }
}

async function mainBThreaded(file) {
  const [seedsStr] = readFileSync(file, { encoding: "utf-8" }).split("\n\n");
  const seedsNbs = extractNubersFromStr(seedsStr);

  function buildWorker(from, length) {
    return new Promise((resolve, reject) => {
      const worker = new Worker(fileURLToPath(import.meta.url), {
        workerData: [file, from, length],
      });
      worker.on("message", resolve);
      worker.on("error", reject);
      worker.on("exit", (code) => {
        if (code !== 0) reject(new Error(`Worker stopped with exit code ${code}`));
      });
    });
  }

  const tuples = [];
  for (let i = 0; i < seedsNbs.length; i += 2) {
    tuples.push([seedsNbs[i], seedsNbs[i + 1]]);
  }

  const mins = await Promise.all(tuples.map(([from, length]) => buildWorker(from, length)));

  return Math.min(...mins);
}

function mainBWorker(file, from, length) {
  console.log(`[thread ${from}-${length}] Start`);
  const [_, ...linesGroups] = readFileSync(file, { encoding: "utf-8" }).split("\n\n");
  const instructions = linesGroups.map(parseInstruction);
  let min = Infinity;

  for (const start of createRangesFromTuple(from, length)) {
    let type = "seed";
    let qty = start;

    for (const { from, to, trans } of instructions) {
      if (from !== type) continue;
      type = to;
      qty = applyTransforms(qty, trans);
    }
    if (qty < min && type === "location") min = qty;
  }
  parentPort?.postMessage(min);
  console.log(`[thread ${from}-${length}] finished`);
}

if (isMainThread) {
  console.log(await mainBThreaded("./input.txt"));
} else {
  mainBWorker(...workerData);
}
