#!/usr/bin/env node
// content:verify — source manifest, public dataset, and legacy app fixtures.

import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const REPO = process.cwd();
const DOCS = join(REPO, "docs");
const SOURCES = join(REPO, "data", "sources.json");
const DATASET = join(REPO, "dataset");
const PUBLIC_CACHE = join(REPO, "public", "source-cache");
const PARTS_DIR = join(REPO, "src", "content", "parts");
const UNITS_DIR = join(REPO, "src", "content", "units");

let errors = 0;
let warnings = 0;

function fail(msg) {
  console.error(`✗ ${msg}`);
  errors++;
}

function warn(msg) {
  console.warn(`! ${msg}`);
  warnings++;
}

function ok(msg) {
  console.log(`✓ ${msg}`);
}

function loadJson(path) {
  return JSON.parse(readFileSync(path, "utf-8"));
}

function sha256OfFile(path) {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

function hasSha256(value) {
  return typeof value === "string" && /^[a-f0-9]{64}$/.test(value);
}

function pageFile(page) {
  return `page_${String(page).padStart(4, "0")}.json`;
}

function readerImageFile(page) {
  return `page_${String(page).padStart(4, "0")}.reader.webp`;
}

if (!existsSync(SOURCES)) {
  fail("data/sources.json is missing");
  process.exit(1);
}

const sourceManifest = loadJson(SOURCES);
const sourceParts = Array.isArray(sourceManifest.parts) ? sourceManifest.parts : [];
const sourceByPart = new Map();

if (sourceParts.length === 16) {
  ok("data/sources.json: 16 source parts registered");
} else {
  fail(`data/sources.json: ${sourceParts.length} source parts registered, expected 16`);
}

for (const entry of sourceParts) {
  if (sourceByPart.has(entry.part)) {
    fail(`data/sources.json: duplicate part ${entry.part}`);
  }
  sourceByPart.set(entry.part, entry);
  if (!hasSha256(entry.expectedSha256)) {
    fail(`data/sources.json part ${entry.part}: invalid expectedSha256`);
  }
  if (!entry.sourceUrl || !entry.viewUrl) {
    fail(`data/sources.json part ${entry.part}: missing sourceUrl/viewUrl`);
  }
  if (!Number.isInteger(entry.pageCount) || entry.pageCount <= 0) {
    fail(`data/sources.json part ${entry.part}: invalid pageCount`);
  }
}

if (existsSync(DOCS)) {
  const pdfs = readdirSync(DOCS).filter((file) => /^ufo\d+\.pdf$/.test(file));
  if (pdfs.length === 16) {
    ok("docs/: 16 local PDFs present");
  } else {
    warn(`docs/: ${pdfs.length} local PDFs present; public dataset can still be verified without bundled PDFs`);
  }

  for (const entry of sourceParts) {
    const pdfPath = join(DOCS, entry.filename);
    if (!existsSync(pdfPath)) {
      warn(`docs/${entry.filename}: missing locally`);
      continue;
    }
    const actual = sha256OfFile(pdfPath);
    if (actual === entry.expectedSha256) {
      ok(`docs/${entry.filename}: SHA-256 matches data/sources.json`);
    } else {
      fail(`docs/${entry.filename}: SHA-256 mismatch. expected ${entry.expectedSha256}, actual ${actual}`);
    }
  }
}

if (!existsSync(DATASET)) {
  fail("dataset/: missing public dataset directory");
} else {
  const datasetDirs = readdirSync(DATASET).filter((entry) => /^part-\d{2}$/.test(entry)).sort();
  if (datasetDirs.length === sourceParts.length && sourceParts.length === 16) {
    ok("dataset/: all 16 source parts exported");
  } else {
    fail(`dataset/: ${datasetDirs.length} exported part directory/directories, expected ${sourceParts.length}`);
  }

  for (const dir of datasetDirs) {
    const datasetPart = Number(dir.slice(-2));
    const sourceEntry = sourceByPart.get(datasetPart);
    if (!sourceEntry) {
      fail(`dataset/${dir}: no matching data/sources.json entry`);
      continue;
    }

    const manifestPath = join(DATASET, dir, "manifest.json");
    if (!existsSync(manifestPath)) {
      fail(`dataset/${dir}: missing manifest.json`);
      continue;
    }
    const manifest = loadJson(manifestPath);
    if (manifest.part !== datasetPart) {
      fail(`dataset/${dir}/manifest.json: part mismatch`);
    }
    if (manifest.source?.sha256 !== sourceEntry.expectedSha256) {
      fail(`dataset/${dir}/manifest.json: source.sha256 does not match data/sources.json`);
    }
    if (manifest.source?.pageCount !== sourceEntry.pageCount) {
      fail(`dataset/${dir}/manifest.json: source.pageCount does not match data/sources.json`);
    }

    const sourcePagesDir = join(DATASET, dir, "pages");
    if (!existsSync(sourcePagesDir)) {
      fail(`dataset/${dir}: missing pages/ source page directory`);
    } else {
      const sourcePageFiles = readdirSync(sourcePagesDir).filter((file) => /^page_\d{4}\.json$/.test(file)).sort();
      if (sourcePageFiles.length === sourceEntry.pageCount) {
        ok(`dataset/${dir}: ${sourcePageFiles.length} source page records match manifest`);
      } else {
        fail(`dataset/${dir}: ${sourcePageFiles.length} source page records, expected ${sourceEntry.pageCount}`);
      }

      const seenSourcePages = new Set();
      for (const file of sourcePageFiles) {
        const sourcePage = loadJson(join(sourcePagesDir, file));
        const label = `dataset/${dir}/pages/${file}`;
        if (sourcePage.part !== datasetPart) fail(`${label}: part mismatch`);
        if (!Number.isInteger(sourcePage.page) || sourcePage.page < 1 || sourcePage.page > sourceEntry.pageCount) {
          fail(`${label}: page out of range`);
        }
        if (seenSourcePages.has(sourcePage.page)) fail(`${label}: duplicate source page ${sourcePage.page}`);
        seenSourcePages.add(sourcePage.page);
        if (sourcePage.source?.sha256 !== sourceEntry.expectedSha256) {
          fail(`${label}: source.sha256 mismatch`);
        }
        if (!Array.isArray(sourcePage.lines)) {
          fail(`${label}: lines must be an array`);
        }
      }
      ok(`dataset/${dir}: ${sourcePageFiles.length} source page records checked`);
    }

    const imageDir = join(PUBLIC_CACHE, sourceEntry.expectedSha256);
    if (!existsSync(imageDir)) {
      fail(`public/source-cache/${sourceEntry.expectedSha256}: missing reader image cache directory`);
    } else {
      let imageCount = 0;
      for (let page = 1; page <= sourceEntry.pageCount; page++) {
        if (existsSync(join(imageDir, readerImageFile(page)))) {
          imageCount++;
        } else {
          fail(`public/source-cache/${sourceEntry.expectedSha256}: missing ${readerImageFile(page)}`);
        }
      }
      ok(`public/source-cache/${sourceEntry.expectedSha256}: ${imageCount}/${sourceEntry.pageCount} reader images present`);
    }

    const summaryPath = join(DATASET, dir, "translations", "ko", "summary.json");
    if (!existsSync(summaryPath)) {
      warn(`dataset/${dir}: no Korean translation summary yet`);
      continue;
    }
    const summary = loadJson(summaryPath);
    if (summary.part !== datasetPart) {
      fail(`dataset/${dir}/translations/ko/summary.json: part mismatch`);
    }
    if (summary.source?.sha256 !== sourceEntry.expectedSha256) {
      fail(`dataset/${dir}/translations/ko/summary.json: source.sha256 mismatch`);
    }
    if (summary.status === "reviewed" && summary.approvalStatus === "not_approved") {
      ok(`dataset/${dir}: Korean translation is reviewed/not_approved`);
    } else if (summary.status === "approved" && summary.approvalStatus === "approved") {
      ok(`dataset/${dir}: Korean translation is approved`);
    } else {
      fail(`dataset/${dir}: unexpected translation status ${summary.status}/${summary.approvalStatus}`);
    }

    const unitsPath = join(DATASET, dir, "translations", "ko", "units.json");
    if (!existsSync(unitsPath)) {
      fail(`dataset/${dir}: missing translations/ko/units.json`);
      continue;
    }
    const unitsPayload = loadJson(unitsPath);
    const units = Array.isArray(unitsPayload.units) ? unitsPayload.units : [];
    if (units.length === summary.counts?.unitCount) {
      ok(`dataset/${dir}: ${units.length} translation units match summary`);
    } else {
      fail(`dataset/${dir}: units length ${units.length} does not match summary count ${summary.counts?.unitCount}`);
    }

    const unitIds = new Set();
    let validUnits = 0;
    for (const unit of units) {
      const label = `dataset/${dir} unit ${unit.id ?? "(missing id)"}`;
      if (!unit.id) fail(`${label}: missing id`);
      if (unit.id && unitIds.has(unit.id)) fail(`${label}: duplicate unit id`);
      if (unit.id) unitIds.add(unit.id);
      if (unit.part !== datasetPart) fail(`${label}: part mismatch`);
      if (!Number.isInteger(unit.page) || unit.page < 1 || unit.page > sourceEntry.pageCount) {
        fail(`${label}: page out of range`);
      }
      if (unit.source?.sha256 !== sourceEntry.expectedSha256) {
        fail(`${label}: source.sha256 mismatch`);
      }
      if (!unit.source?.text || !unit.translation?.text) {
        fail(`${label}: missing source or translation text`);
      }
      if (unit.status !== "reviewed" && unit.status !== "approved") {
        fail(`${label}: unexpected status ${unit.status}`);
      }
      if (unit.approvalStatus !== "not_approved" && unit.approvalStatus !== "approved") {
        fail(`${label}: unexpected approvalStatus ${unit.approvalStatus}`);
      }
      for (const ref of unit.source?.refs ?? []) {
        if (ref.part !== datasetPart || ref.page !== unit.page) {
          fail(`${label}: source ref part/page mismatch`);
        }
        if (ref.sourceSha256 !== sourceEntry.expectedSha256) {
          fail(`${label}: source ref sha mismatch`);
        }
      }
      validUnits++;
    }
    ok(`dataset/${dir}: ${validUnits}/${units.length} units checked for source mapping`);

    const pages = Array.isArray(summary.pages) ? summary.pages : [];
    if (pages.length === summary.counts?.pageCount) {
      ok(`dataset/${dir}: ${pages.length} translation page summaries match count`);
    } else {
      fail(`dataset/${dir}: summary pages length ${pages.length} does not match count ${summary.counts?.pageCount}`);
    }
    for (const page of pages) {
      const pagePath = join(DATASET, dir, "translations", "ko", "pages", pageFile(page.page));
      if (!existsSync(pagePath)) {
        fail(`dataset/${dir}: missing translation page ${pageFile(page.page)}`);
        continue;
      }
      const pagePayload = loadJson(pagePath);
      if (pagePayload.part !== datasetPart || pagePayload.page !== page.page) {
        fail(`dataset/${dir}/${pageFile(page.page)}: part/page mismatch`);
      }
      if (pagePayload.source?.sha256 !== sourceEntry.expectedSha256) {
        fail(`dataset/${dir}/${pageFile(page.page)}: source.sha256 mismatch`);
      }
      if (pagePayload.unitCount !== page.unitCount) {
        fail(`dataset/${dir}/${pageFile(page.page)}: unitCount mismatch`);
      }
      if (!Array.isArray(pagePayload.units) || pagePayload.units.length !== page.unitCount) {
        fail(`dataset/${dir}/${pageFile(page.page)}: units array length mismatch`);
      }
      for (const unit of pagePayload.units ?? []) {
        if (!unitIds.has(unit.id)) {
          fail(`dataset/${dir}/${pageFile(page.page)}: unit ${unit.id} missing from units.json`);
        }
      }
    }
    ok(`dataset/${dir}: ${pages.length} translation page records checked`);
  }
}

// Legacy Astro content fixtures are still checked while the app migrates to dataset/.
if (existsSync(PARTS_DIR)) {
  const partFiles = readdirSync(PARTS_DIR).filter((file) => file.endsWith(".json"));
  if (partFiles.length > 0) warn(`src/content/parts: ${partFiles.length} legacy fixture(s) remain`);
  for (const file of partFiles) {
    const data = loadJson(join(PARTS_DIR, file));
    const sourceEntry = sourceByPart.get(data.part);
    if (!sourceEntry) {
      fail(`${file}: source part not registered`);
      continue;
    }
    if (data.sha256 !== sourceEntry.expectedSha256) {
      fail(`${file}: sha256 differs from data/sources.json`);
    }
  }
}

if (existsSync(UNITS_DIR)) {
  const unitFiles = readdirSync(UNITS_DIR).filter((file) => file.endsWith(".json"));
  if (unitFiles.length > 0) warn(`src/content/units: ${unitFiles.length} legacy fixture(s) remain`);
  let unitOk = 0;
  for (const file of unitFiles) {
    const unit = loadJson(join(UNITS_DIR, file));
    const sourceEntry = sourceByPart.get(unit.sourceRef?.part);
    if (!sourceEntry) {
      fail(`${file}: sourceRef.part is not registered`);
      continue;
    }
    if (unit.sourceRef.sha256 !== sourceEntry.expectedSha256) {
      fail(`${file}: sourceRef.sha256 differs from data/sources.json`);
      continue;
    }
    if (unit.sourceRef.page < 1 || unit.sourceRef.page > sourceEntry.pageCount) {
      fail(`${file}: sourceRef.page out of range`);
      continue;
    }
    unitOk++;
  }
  ok(`src/content/units: ${unitOk}/${unitFiles.length} legacy fixture(s) pass sourceRef integrity`);
}

console.log(`\n${errors} error(s), ${warnings} warning(s)`);
if (errors > 0) process.exit(1);
