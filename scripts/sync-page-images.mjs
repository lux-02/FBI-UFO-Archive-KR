#!/usr/bin/env node
// Build public reader image cache from rendered source page PNGs.
// Input:  data/ocr/part-XX/images/page_NNNN.png
// Output: public/source-cache/{sha256}/page_NNNN.reader.webp

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const REPO = process.cwd();
const SOURCES = join(REPO, "data", "sources.json");
const DATASET = join(REPO, "dataset");
const OCR = join(REPO, "data", "ocr");
const OUT = join(REPO, "public", "source-cache");

const args = process.argv.slice(2);
const force = args.includes("--force");
const partFilter = new Set(
  args
    .filter((arg) => /^part-\d{2}$/.test(arg))
    .map((arg) => Number(arg.replace("part-", ""))),
);

if (!existsSync(SOURCES)) {
  console.error("✗ data/sources.json not found");
  process.exit(1);
}

if (!commandExists("magick")) {
  console.error("✗ ImageMagick `magick` not found. Install it or render public images another way.");
  process.exit(1);
}

const sources = JSON.parse(readFileSync(SOURCES, "utf-8"));
const sourceByPart = new Map(sources.parts.map((entry) => [entry.part, entry]));
const datasetParts = readdirSync(DATASET)
  .filter((entry) => /^part-\d{2}$/.test(entry))
  .map((entry) => Number(entry.slice(-2)))
  .filter((part) => partFilter.size === 0 || partFilter.has(part))
  .sort((a, b) => a - b);

let written = 0;
let skipped = 0;
let missing = 0;

for (const part of datasetParts) {
  const source = sourceByPart.get(part);
  if (!source) {
    console.warn(`! part ${part}: no source manifest entry`);
    continue;
  }

  const pages = Array.from({ length: source.pageCount }, (_, index) => index + 1);
  const sourceDir = join(OCR, `part-${pad2(part)}`, "images");
  const outDir = join(OUT, source.expectedSha256);
  mkdirSync(outDir, { recursive: true });

  for (const page of pages) {
    const pageName = `page_${pad4(page)}`;
    const input = join(sourceDir, `${pageName}.png`);
    const output = join(outDir, `${pageName}.reader.webp`);
    if (!existsSync(input)) {
      console.warn(`! missing image source: ${input}`);
      missing++;
      continue;
    }
    if (!force && existsSync(output) && statSync(output).mtimeMs >= statSync(input).mtimeMs) {
      skipped++;
      continue;
    }
    execFileSync(
      "magick",
      [
        input,
        "-auto-orient",
        "-resize",
        "1280x1280>",
        "-quality",
        "82",
        "-strip",
        output,
      ],
      { stdio: "ignore" },
    );
    written++;
  }
}

console.log(`✓ reader image cache synced: ${written} written, ${skipped} skipped, ${missing} missing`);
if (missing > 0) process.exit(1);

function pad2(value) {
  return String(value).padStart(2, "0");
}

function pad4(value) {
  return String(value).padStart(4, "0");
}

function commandExists(command) {
  try {
    execFileSync("which", [command], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}
