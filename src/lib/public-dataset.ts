import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const DATA_DIR = join(ROOT, "data");
const DATASET_DIR = join(ROOT, "dataset");
const PUBLIC_DIR = join(ROOT, "public");

export type ReaderExposureMode = "dataset_review" | "approved_public";

export type SourceManifestPart = {
  part: number;
  pdfId: string;
  filename: string;
  expectedSha256: string;
  byteSize?: number;
  pageCount: number;
  sourceUrl: string;
  viewUrl: string;
};

type SourceManifest = {
  schemaVersion: string;
  sourceCollectionUrl: string;
  parts: SourceManifestPart[];
};

export type PublicTranslationUnit = {
  id: string;
  unitVersion: number;
  part: number;
  page: number;
  pageId: string;
  status: "reviewed" | "approved" | string;
  approvalStatus: "not_approved" | "approved" | string;
  language: "ko" | string;
  source: {
    path: string;
    sha256: string;
    lineIds: string[];
    lineNumbers: number[];
    refs: Array<{
      part: number;
      page: number;
      pageId: string;
      lineId: string;
      lineNumber: number;
      sourcePath: string;
      sourceSha256: string;
    }>;
    text: string;
  };
  translation: {
    text: string;
    reviewedAt?: string;
    reviewer?: string;
    reviewMethod?: string;
    draftProvider?: string;
    draftModel?: string;
    promptVersion?: string;
    overrideApplied?: boolean;
    overrideReason?: string | null;
  };
};

export type PublicTranslationPage = {
  schemaVersion: string;
  language: "ko" | string;
  part: number;
  page: number;
  pageId: string;
  status: "reviewed" | "approved" | string;
  approvalStatus: "not_approved" | "approved" | string;
  sourceLineCount: number;
  excludedLineCount: number;
  unitCount: number;
  exportedAt: string;
  source: {
    pdfPath: string;
    sha256: string;
    pageCount: number;
    sourceUrl: string;
  };
  excludedLines?: unknown[];
  units: PublicTranslationUnit[];
};

export type PublicTranslationSummary = {
  schemaVersion: string;
  language: "ko" | string;
  part: number;
  pdfId: string;
  status: "reviewed" | "approved" | string;
  approvalStatus: "not_approved" | "approved" | string;
  exportedAt: string;
  sourceScope: string;
  source: {
    pdfPath: string;
    sha256: string;
    pageCount: number;
    sourceUrl: string;
  };
  counts: {
    pageCount: number;
    unitCount: number;
    sourceLineCount: number;
    excludedLineCount: number;
    reviewedUnitCount: number;
    overrideCount: number;
  };
  pages: Array<{
    page: number;
    pageId: string;
    status: "reviewed" | "approved" | string;
    approvalStatus: "not_approved" | "approved" | string;
    unitCount: number;
    sourceLineCount: number;
    excludedLineCount: number;
    jsonPath: string;
    txtPath: string;
  }>;
};

export type PublicSourcePage = {
  schemaVersion: string;
  part: number;
  page: number;
  pageId: string;
  source: {
    pdfPath: string;
    sha256: string;
  };
  sourceLayer?: string;
  translationReadiness?: "ready" | "not_ready" | string;
  pageType?: string | null;
  pageRecommendation?: string | null;
  pageReadinessNote?: string | null;
  excludedLineIds?: string[];
  lineCount: number;
  lines: Array<{
    lineNumber: number;
    status?: string;
    text?: string;
  }>;
  blockCount?: number;
};

export type ArchivePartSummary = {
  part: number;
  partLabel: string;
  slug: string;
  titleKo: string;
  source: SourceManifestPart;
  hasReader: boolean;
  datasetStatus: "pending" | "reviewed_not_approved" | "approved";
  translationSummary?: PublicTranslationSummary;
};

export type PageImageAsset = {
  url: string;
  sourceCachePath: string;
  alt: string;
  variant: "reader";
};

export type ReaderPageIndexEntry = {
  page: number;
  pageId: string;
  sourcePage: PublicSourcePage | undefined;
  translationPage: PublicTranslationSummary["pages"][number] | undefined;
  hasImage: boolean;
};

function readJson<T>(path: string): T {
  return JSON.parse(readFileSync(path, "utf-8")) as T;
}

export function formatPart(part: number): string {
  return String(part).padStart(2, "0");
}

export function formatPage(page: number): string {
  return String(page).padStart(4, "0");
}

export function partSlug(part: number): string {
  return `part-${formatPart(part)}`;
}

export function parsePartSlug(slug: string): number {
  const match = /^part-(\d{2})$/.exec(slug);
  if (!match) throw new Error(`Invalid part slug: ${slug}`);
  return Number(match[1]);
}

export function pageSlug(page: number): string {
  return `page-${formatPage(page)}`;
}

export function parsePageSlug(slug: string): number {
  const match = /^page-(\d{4})$/.exec(slug);
  if (!match) throw new Error(`Invalid page slug: ${slug}`);
  return Number(match[1]);
}

export function getSourceManifest(): SourceManifest {
  return readJson<SourceManifest>(join(DATA_DIR, "sources.json"));
}

export function getSourceParts(): SourceManifestPart[] {
  return [...getSourceManifest().parts].sort((a, b) => a.part - b.part);
}

export function getSourcePart(part: number): SourceManifestPart | undefined {
  return getSourceParts().find((entry) => entry.part === part);
}

export function getTranslationSummary(part: number): PublicTranslationSummary | undefined {
  const path = join(DATASET_DIR, partSlug(part), "translations", "ko", "summary.json");
  if (!existsSync(path)) return undefined;
  return readJson<PublicTranslationSummary>(path);
}

function getUnitsPayload(part: number): { units: PublicTranslationUnit[] } | undefined {
  const path = join(DATASET_DIR, partSlug(part), "translations", "ko", "units.json");
  if (!existsSync(path)) return undefined;
  return readJson<{ units: PublicTranslationUnit[] }>(path);
}

export function isUnitVisible(unit: PublicTranslationUnit, mode: ReaderExposureMode): boolean {
  if (mode === "approved_public") {
    return unit.status === "approved" && unit.approvalStatus === "approved";
  }
  return (
    (unit.status === "reviewed" && unit.approvalStatus === "not_approved") ||
    (unit.status === "approved" && unit.approvalStatus === "approved")
  );
}

export function getTranslationUnits(
  part: number,
  mode: ReaderExposureMode = "dataset_review",
): PublicTranslationUnit[] {
  const payload = getUnitsPayload(part);
  if (!payload) return [];
  return payload.units
    .filter((unit) => isUnitVisible(unit, mode))
    .sort((a, b) => a.page - b.page || a.id.localeCompare(b.id));
}

export function getAllTranslationUnits(
  mode: ReaderExposureMode = "dataset_review",
): PublicTranslationUnit[] {
  return getPublishedDatasetParts()
    .flatMap((part) => getTranslationUnits(part.part, mode))
    .sort((a, b) => a.part - b.part || a.page - b.page || a.id.localeCompare(b.id));
}

export function getTranslationPage(
  part: number,
  page: number,
  mode: ReaderExposureMode = "dataset_review",
): PublicTranslationPage | undefined {
  const path = join(
    DATASET_DIR,
    partSlug(part),
    "translations",
    "ko",
    "pages",
    `page_${formatPage(page)}.json`,
  );
  if (!existsSync(path)) return undefined;
  const translationPage = readJson<PublicTranslationPage>(path);
  return {
    ...translationPage,
    units: translationPage.units.filter((unit) => isUnitVisible(unit, mode)),
  };
}

export function getSourcePage(part: number, page: number): PublicSourcePage | undefined {
  const path = join(DATASET_DIR, partSlug(part), "pages", `page_${formatPage(page)}.json`);
  if (!existsSync(path)) return undefined;
  return readJson<PublicSourcePage>(path);
}

export function getSourcePagesForPart(part: number): PublicSourcePage[] {
  const pagesDir = join(DATASET_DIR, partSlug(part), "pages");
  if (!existsSync(pagesDir)) return [];
  return readdirSync(pagesDir)
    .filter((entry) => /^page_\d{4}\.json$/.test(entry))
    .map((entry) => readJson<PublicSourcePage>(join(pagesDir, entry)))
    .sort((a, b) => a.page - b.page);
}

export function getTranslationPagesForPart(
  part: number,
  mode: ReaderExposureMode = "dataset_review",
): PublicTranslationSummary["pages"] {
  const summary = getTranslationSummary(part);
  if (!summary) return [];
  if (mode === "approved_public") {
    return summary.pages.filter((page) => page.status === "approved" && page.approvalStatus === "approved");
  }
  return summary.pages.filter((page) => page.unitCount > 0);
}

export function getReaderPagesForPart(
  part: number,
  mode: ReaderExposureMode = "dataset_review",
): ReaderPageIndexEntry[] {
  const source = getSourcePart(part);
  if (!source) return [];

  const sourcePageByNumber = new Map(getSourcePagesForPart(part).map((page) => [page.page, page]));
  const translationPageByNumber = new Map(
    getTranslationPagesForPart(part, mode).map((page) => [page.page, page]),
  );

  return Array.from({ length: source.pageCount }, (_, index) => {
    const page = index + 1;
    return {
      page,
      pageId: pageSlug(page),
      sourcePage: sourcePageByNumber.get(page),
      translationPage: translationPageByNumber.get(page),
      hasImage: Boolean(getReaderPageImage(part, page)),
    };
  });
}

export function getPublishedDatasetParts(): ArchivePartSummary[] {
  const existingDatasetDirs = new Set(
    existsSync(DATASET_DIR)
      ? readdirSync(DATASET_DIR).filter((entry) => /^part-\d{2}$/.test(entry))
      : [],
  );

  return getSourceParts().map((source) => {
    const slug = partSlug(source.part);
    const translationSummary = existingDatasetDirs.has(slug)
      ? getTranslationSummary(source.part)
      : undefined;
    const hasReader = Boolean(translationSummary);
    const datasetStatus =
      translationSummary?.approvalStatus === "approved"
        ? "approved"
        : translationSummary
          ? "reviewed_not_approved"
          : "pending";
    return {
      part: source.part,
      partLabel: formatPart(source.part),
      slug,
      titleKo: `UFO Part ${formatPart(source.part)}`,
      source,
      hasReader,
      datasetStatus,
      ...(translationSummary ? { translationSummary } : {}),
    };
  });
}

export function getReaderPart(part: number): ArchivePartSummary | undefined {
  return getPublishedDatasetParts().find((entry) => entry.part === part && entry.hasReader);
}

export function getOfficialSourceUrl(part: number): string {
  return getSourcePart(part)?.viewUrl ?? getSourceManifest().sourceCollectionUrl;
}

export function getReaderPageImage(part: number, page: number): PageImageAsset | undefined {
  const source = getSourcePart(part);
  if (!source) return undefined;
  const file = `page_${formatPage(page)}.reader.webp`;
  const relativePath = join("source-cache", source.expectedSha256, file);
  const sourceCachePath = join(PUBLIC_DIR, relativePath);
  if (!existsSync(sourceCachePath)) return undefined;
  return {
    url: `/source-cache/${source.expectedSha256}/${file}`,
    sourceCachePath,
    alt: `FBI UFO 자료 Part ${formatPart(part)}, ${formatPage(page)}페이지 스캔 이미지`,
    variant: "reader",
  };
}
