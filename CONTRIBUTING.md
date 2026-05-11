# Contributing to FBI UFO Archive KR

This repository is an unofficial public archive and reader for FBI Vault UFO
documents. Contributions are welcome when they preserve source traceability and
avoid adding claims that are not present in the source documents.

## What to Report

- Korean translation errors or missing translation units.
- OCR/source text mistakes that can be checked against a source PDF page.
- Incorrect part/page/source-line mapping.
- Reader UI defects that make source comparison or reading difficult.
- Documentation errors in public dataset, license, or provenance notes.

## What Not to Submit

- Claims about UFO reality, intent, or conclusions not present in the source PDF.
- Reconstructed text for redacted, deleted, illegible, or damaged regions.
- Raw model logs, private review notes, crop evidence, or local pipeline output.
- Original FBI Vault PDFs. Source PDFs are intentionally not included in this repository.

## Issue Reports

Use the GitHub issue templates:

- Translation error: `.github/ISSUE_TEMPLATE/translation-error.yml`
- Source mismatch: `.github/ISSUE_TEMPLATE/source-mismatch.yml`

Include the smallest source reference you can provide:

```text
Part: 06
Page: 0004
Source line or unit ID: TU-p06-page-0004-u003
Evidence: quote the relevant OCR/source text and explain the mismatch
```

## Pull Requests

Before opening a pull request:

1. Keep changes narrowly scoped.
2. Do not modify `docs/*.pdf`.
3. Preserve part/page/source-line mappings in dataset changes.
4. Keep Korean translation tone documentary and restrained.
5. Run the relevant checks.

Recommended checks:

```sh
pnpm typecheck
pnpm check
pnpm content:verify
```

For app or reader changes, also run:

```sh
pnpm build
```

## Translation and OCR Standards

- Do not add facts, mood, or conclusions absent from the source document.
- Mark uncertainty explicitly instead of smoothing it away.
- Keep unresolved OCR lines separate from translated body text.
- Treat `reviewed` / `not_approved` as public review status, not final publication approval.

## License Expectations

By contributing, you agree that your contribution can be distributed under the
license terms documented in `LICENSE`, `dataset/LICENSE`, and `NOTICE.md`.
