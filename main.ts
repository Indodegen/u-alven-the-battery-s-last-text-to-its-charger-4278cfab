import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ENTRY = "I survived the whole day on 1% just to ghost you first. Bye.";
// Max entry length in characters; the gate and error below use this, not a magic number.
const MAX_CHARS = 200;

function fail(message: string): never {
  console.error(`error: ${message}`);
  process.exit(1);
}

const codePoints = [...ENTRY].length;
if (codePoints < 1 || codePoints > MAX_CHARS) {
  fail(`entry must be 1-${MAX_CHARS} characters, got ${codePoints}`);
}
if (ENTRY.includes("\n") || ENTRY.includes("\r")) {
  fail("entry must be a single line");
}
if (ENTRY.trim().length === 0) {
  fail("entry must not be whitespace only");
}
if (ENTRY !== ENTRY.trim()) {
  fail("entry must not have leading or trailing whitespace");
}
if (/[\u0000-\u001F\u007F]/.test(ENTRY)) {
  fail("entry must not contain control characters");
}

const here = dirname(fileURLToPath(import.meta.url));
const shipped = readFileSync(join(here, "entry.txt"), "utf8");
if (shipped !== ENTRY) {
  fail("entry.txt does not match the built-in entry");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, ENTRY, "utf8");

const written = readFileSync(outPath, "utf8");
if (written !== ENTRY) {
  fail("output does not match entry.txt");
}
if (Buffer.byteLength(written, "utf8") !== Buffer.byteLength(shipped, "utf8")) {
  fail("output byte length differs from entry.txt");
}

console.log(`wrote entry: ${codePoints} chars, ${Buffer.byteLength(ENTRY, "utf8")} bytes`);
