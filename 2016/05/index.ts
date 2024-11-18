import assert from "node:assert";
import crypto from "node:crypto";

function mainA(doorId: string) {
  let i = 0;
  let password = "";

  while (password.length < 8) {
    const text = `${doorId}${i}`;
    const res = crypto.hash("md5", text, "hex");

    if (res.startsWith("00000")) {
      console.log(res, i);
      password += res.replace(/^00000/, "").at(0);
    }

    i++;
  }
  return password;
}

assert.strictEqual(mainA("abc"), "18f47a30");
console.log(mainA("wtnhxymk"));
