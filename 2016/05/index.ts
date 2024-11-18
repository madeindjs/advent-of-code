import assert from "node:assert";
import crypto from "node:crypto";

function* getValidHash(doorId: string) {
  let i = 0;
  while (true) {
    const res = crypto.hash("md5", `${doorId}${i}`, "hex");
    if (res.startsWith("00000")) yield res.replace(/^00000/, "");
    i++;
  }
}

function mainA(doorId: string) {
  let password = "";

  for (const hash of getValidHash(doorId)) {
    password += hash.at(0);
    if (password.length === 8) return password;
  }
}
const spec = "abc";
const input = "wtnhxymk";

assert.strictEqual(mainA(spec), "18f47a30");
assert.strictEqual(mainA(input), "2414bc77");

function mainB(doorId: string) {
  let password = "________".split("");

  for (const hash of getValidHash(doorId)) {
    const pos = Number(hash.at(0));
    if (pos > 7 || password[pos] !== "_") continue;
    password[pos] = hash.at(1)!;
    if (!password.includes("_")) return password.join("");
  }
}
assert.strictEqual(mainB(spec), "05ace8e3");
assert.strictEqual(mainB(input), "437e60fc");
