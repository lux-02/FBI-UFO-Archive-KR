import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const sourceRefSchema = z.object({
  part: z.number().int().min(1).max(16),
  page: z.number().int().min(1),
  blockId: z.string().optional(),
  sourcePath: z.string(),
  sha256: z.string().regex(/^[a-f0-9]{64}$/),
});

export const sourceRefSchemaPublic = sourceRefSchema;

const partsCollection = defineCollection({
  loader: glob({ pattern: "*.json", base: "./src/content/parts" }),
  schema: z.object({
    part: z.number().int().min(1).max(16),
    titleKo: z.string(),
    pageCount: z.number().int().positive(),
    sha256: z.string().regex(/^[a-f0-9]{64}$/),
    sourceUrl: z.string().url().optional(),
    status: z.enum(["REGISTERED", "VERIFIED", "STALE", "MISSING"]),
    redactionRatio: z.number().min(0).max(1).optional(),
  }),
});

const unitsCollection = defineCollection({
  loader: glob({ pattern: "*.json", base: "./src/content/units" }),
  schema: z.object({
    id: z.string(),
    unitVersion: z.number().int().min(1).default(1),
    sourceRef: sourceRefSchema,
    sourceText: z.string(),
    koreanText: z.string(),
    status: z.enum([
      "OCR_PENDING",
      "DRAFT",
      "REVIEWED",
      "APPROVED",
      "NEEDS_ORIGINAL_CHECK",
      "REJECTED",
    ]),
    ocrConfidence: z.number().min(0).max(1).optional(),
    glossaryHits: z.array(z.string()).default([]),
    reviewerId: z.string().optional(),
    reviewedAt: z.string().datetime().optional(),
    aiAssist: z
      .object({
        kind: z.enum(["NONE", "DRAFT", "SUGGEST", "TERMINOLOGY", "SUMMARY"]),
        model: z.string(),
        modelVersion: z.string(),
        promptVersion: z.string(),
        runId: z.string(),
        createdAt: z.string().datetime(),
      })
      .optional(),
  }),
});

export const collections = {
  parts: partsCollection,
  units: unitsCollection,
};
