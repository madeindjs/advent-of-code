import assert from "node:assert";
import { readFile } from "node:fs/promises";

type Rule = [before: number, after: number];
type Page = number[];
type Input = { rules: Rule[]; pages: Page[] };

async function getInput(path: string) {
  const inputFile = new URL(path, import.meta.url);
  const content = await readFile(inputFile, { encoding: "utf8" });
  const [rulesStr, pagesStr] = content.split("\n\n");

  const input: Input = {
    rules: rulesStr
      .split("\n")
      .map((r) => r.split("|").map(Number) as [number, number]),
    pages: pagesStr.split("\n").map((r) => r.split(",").map(Number)),
  };
  return input;
}

function getMiddleArray<T>(arr: T[]): T | undefined {
  return arr.at(Math.floor(arr.length / 2));
}

async function mainA(path: string) {
  const input = await getInput(path);

  let total = 0;

  for (const page of input.pages) {
    const sorted = page.toSorted((a, b) => {
      const rule = input.rules.find(
        (rule) => rule.includes(a) && rule.includes(b),
      );
      if (rule === undefined) return 0;
      return a === rule[0] ? -1 : 1;
    });

    if (sorted.join() === page.join()) {
      total += Number(getMiddleArray(sorted));
    }
  }
  return total;
}

assert.strictEqual(await mainA("./spec.txt"), 143);
assert.strictEqual(await mainA("./input.txt"), 6242);
