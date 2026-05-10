# FBI UFO Archive KR — Public OCR + Translation Dataset

This directory contains public-facing OCR and Korean translation datasets derived from the FBI Vault UFO PDFs. It is an artifact of the [FBI-UFO-Archive-KR](../) Korean translation project.

## Status

- **part-01** (`ufo1.pdf`, 69 pages) — pilot, line-audit closure complete (2026-05-10).
  - 95.7% of source-bearing lines closed against image evidence.
  - 19 lines marked permanent_unresolved (physical obstruction, cropping, stamps).
  - Page-level breakdown: 5 READY · 11 PARTIAL_READY (line audit), with the remaining pages available as page-level review records.
  - Korean translation export: 110 reviewed units across 16 line-audit pages, not final owner-approved.
- **part-02** (`ufo2.pdf`, 79 pages) — OCR + translation export complete (2026-05-10).
  - 2,859 source-bearing lines promoted through conservative image-match closure.
  - 721 lines marked permanent_unresolved and excluded from translation body text.
  - Page-level breakdown: 5 READY · 72 PARTIAL_READY · 2 NOT_READY.
  - Korean translation export: 722 reviewed units across 77 pages, not final owner-approved.
- **part-03** (`ufo3.pdf`, 111 pages) — OCR + translation export complete (2026-05-10).
  - 2,570 source-bearing lines promoted through conservative image-match closure.
  - 893 lines marked permanent_unresolved and excluded from translation body text.
  - Page-level breakdown: 7 READY · 102 PARTIAL_READY · 2 NOT_READY.
  - Korean translation export: 895 reviewed units across 109 pages, not final owner-approved.
- **part-04** (`ufo4.pdf`, 77 pages) — OCR + translation export complete (2026-05-10).
  - 1,637 source-bearing lines promoted through conservative image-match closure.
  - 786 lines marked permanent_unresolved and excluded from translation body text.
  - Page-level breakdown: 2 READY · 74 PARTIAL_READY · 1 NOT_READY.
  - Korean translation export: 708 reviewed units across 76 pages, not final owner-approved.
- **part-05** (`ufo5.pdf`, 74 pages) — OCR + translation export complete (2026-05-10).
  - 1,577 source-bearing lines promoted through conservative image-match closure.
  - 860 lines marked permanent_unresolved and excluded from translation body text.
  - Page-level breakdown: 3 READY · 66 PARTIAL_READY · 5 NOT_READY.
  - Korean translation export: 780 reviewed units across 69 pages, not final owner-approved.
- **part-06** (`ufo6.pdf`, 129 pages) — OCR + translation export complete (2026-05-10).
  - 3,543 source-bearing lines promoted through conservative image-match closure.
  - 852 lines marked permanent_unresolved and excluded from translation body text.
  - Page-level breakdown: 8 READY · 120 PARTIAL_READY · 1 NOT_READY.
  - Korean translation export: 1,178 reviewed units across 128 pages, not final owner-approved.

Other parts (07–16) are pending.

## Disclaimer

본 데이터셋은 미국 FBI 또는 미국 정부와 무관한 비공식 한국어 아카이브 프로젝트의 OCR 산출물입니다. 원본 PDF는 [FBI Vault](https://vault.fbi.gov/UFO) 공개 자료에서 가져왔습니다. 본 프로젝트는 어떤 공식 입장이나 결론을 대변하지 않습니다.

This dataset is an unofficial Korean-archive OCR derivative. Not affiliated with the U.S. FBI or the U.S. government. Source PDFs come from the public [FBI Vault](https://vault.fbi.gov/UFO).

## Layout

```text
dataset/
  README.md                                  this file
  LICENSE                                    license terms
  part-01/
    manifest.json                            part-level metadata, source SHA-256, page list
    pages/                                  public English source text
      page_0001.txt                          plain text (with structural markers)
      page_0001.json                         structured page (lineNumber, text, status)
      page_0002.txt
      ...
    translations/
      ko/
        summary.json                         Korean translation export summary
        units.json                           reviewed translation units with source mapping
        excluded_source_lines.json           unresolved OCR lines excluded from translation
        pages/page_0002.{txt,json}           page-level Korean translation export
  part-02/
    manifest.json
    pages/
    translations/ko/
  part-03/
    manifest.json
    pages/
    translations/ko/
  part-04/
    manifest.json
    pages/
    translations/ko/
  part-05/
    manifest.json
    pages/
    translations/ko/
  part-06/
    manifest.json
    pages/
    translations/ko/
```

## Content Conventions

- `IMAGE_MATCHED` lines are included verbatim (vision OCR + image audit closure).
- `permanent_unresolved` lines render as `[unclear: <reason>]` in source records and are excluded from Korean body translation. Reasons follow the `unresolved_reason` enum:
  `physical_obstruction`, `torn_or_cropped`, `stamp_or_envelope_artifact`, `handwritten_or_signature_partial`, `form_field_partial`, `other_documented`.
- `STRUCTURE_BLANK` lines render as a blank line.
- Pages where review is incomplete render `[needs review — page status <STATUS>]`. Body text is intentionally excluded until image-level audit closes the page.
- Page-level `NORMALIZED` review renders the manually approved transcription as a single block.
- `NO_TRANSCRIBABLE_TEXT` pages render `[no transcribable text]`.
- Korean translation files preserve source unit IDs and line mappings. They expose reviewed translation text only, not Gemini raw logs or operational crop evidence.
- Translation status `reviewed` means Gemini first draft plus Codex source-faithfulness review. It does not mean final owner approval.

## Source Layer Breakdown

| Part | `line_audit` | `manual_review` | `no_text` | `draft_only` | Translation source policy |
|---:|---:|---:|---:|---:|---|
| 01 | 16 | 8 | 3 | 42 | Line-audit/manual reviewed pages only |
| 02 | 79 | 0 | 0 | 0 | `IMAGE_MATCHED` lines only |
| 03 | 111 | 0 | 0 | 0 | `IMAGE_MATCHED` lines only |
| 04 | 77 | 0 | 0 | 0 | `IMAGE_MATCHED` lines only |
| 05 | 74 | 0 | 0 | 0 | `IMAGE_MATCHED` lines only |
| 06 | 129 | 0 | 0 | 0 | `IMAGE_MATCHED` lines only |

Parts 02-06 use line-level closure for every page. Only `IMAGE_MATCHED` lines are translation source; unresolved lines are retained as excluded source-line records.

## Korean Translation Status

This export now includes reviewed Korean translation data for:

- `dataset/part-01/translations/ko/summary.json`
- `dataset/part-01/translations/ko/units.json`
- `dataset/part-01/translations/ko/pages/page_NNNN.{txt,json}`
- `dataset/part-02/translations/ko/summary.json`
- `dataset/part-02/translations/ko/units.json`
- `dataset/part-02/translations/ko/pages/page_NNNN.{txt,json}`
- `dataset/part-03/translations/ko/summary.json`
- `dataset/part-03/translations/ko/units.json`
- `dataset/part-03/translations/ko/pages/page_NNNN.{txt,json}`
- `dataset/part-04/translations/ko/summary.json`
- `dataset/part-04/translations/ko/units.json`
- `dataset/part-04/translations/ko/pages/page_NNNN.{txt,json}`
- `dataset/part-05/translations/ko/summary.json`
- `dataset/part-05/translations/ko/units.json`
- `dataset/part-05/translations/ko/pages/page_NNNN.{txt,json}`
- `dataset/part-06/translations/ko/summary.json`
- `dataset/part-06/translations/ko/units.json`
- `dataset/part-06/translations/ko/pages/page_NNNN.{txt,json}`

The translation input is limited to `IMAGE_MATCHED` source lines. Unresolved OCR lines are listed in each part's `excluded_source_lines.json` and are intentionally not translated as confirmed body text.

The current Korean export is `reviewed` / `not_approved`: suitable for public inspection and dataset review, but not labeled as final approved publication text.

## How to Cite

```text
FBI-UFO-Archive-KR Project. (2026). FBI UFO Archive KR — Public OCR + Translation Dataset, part-01.
Source: FBI Vault UFO documents (https://vault.fbi.gov/UFO).

FBI-UFO-Archive-KR Project. (2026). FBI UFO Archive KR — Public OCR + Translation Dataset, part-02.
Source: FBI Vault UFO documents (https://vault.fbi.gov/UFO).

FBI-UFO-Archive-KR Project. (2026). FBI UFO Archive KR — Public OCR + Translation Dataset, part-03.
Source: FBI Vault UFO documents (https://vault.fbi.gov/UFO).

FBI-UFO-Archive-KR Project. (2026). FBI UFO Archive KR — Public OCR + Translation Dataset, part-04.
Source: FBI Vault UFO documents (https://vault.fbi.gov/UFO).

FBI-UFO-Archive-KR Project. (2026). FBI UFO Archive KR — Public OCR + Translation Dataset, part-05.
Source: FBI Vault UFO documents (https://vault.fbi.gov/UFO).

FBI-UFO-Archive-KR Project. (2026). FBI UFO Archive KR — Public OCR + Translation Dataset, part-06.
Source: FBI Vault UFO documents (https://vault.fbi.gov/UFO).
```

## How to Verify Integrity

```sh
cd <repo>
shasum -a 256 docs/ufo1.pdf
# Should match dataset/part-01/manifest.json -> source.sha256

shasum -a 256 docs/ufo2.pdf
# Should match dataset/part-02/manifest.json -> source.sha256

shasum -a 256 docs/ufo3.pdf
# Should match dataset/part-03/manifest.json -> source.sha256

shasum -a 256 docs/ufo4.pdf
# Should match dataset/part-04/manifest.json -> source.sha256

shasum -a 256 docs/ufo5.pdf
# Should match dataset/part-05/manifest.json -> source.sha256

shasum -a 256 docs/ufo6.pdf
# Should match dataset/part-06/manifest.json -> source.sha256
```

## Regenerate

Public users do not need the private export pipeline to read or verify this dataset. Maintainers regenerate OCR and translation exports from ignored local pipeline artifacts before committing the public `dataset/` output.

## Authority and Rules

Maintainer-side OCR and translation workflows produce the exported files in this directory, but those operational logs and review workspaces are not part of the public dataset.

The maintainer-side workflow for each exported part is:

```text
OCR extraction -> OCR review -> Korean translation -> translation review -> public export
```

Public verification should rely on:

- `dataset/part-XX/manifest.json`
- source PDF SHA-256 values
- page/unit source mappings
- explicit unresolved/excluded-line records

Any text in this dataset that does not match the source PDF page image is a defect and should be reported as an issue.
