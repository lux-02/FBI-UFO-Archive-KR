# FBI UFO Archive KR License Notice

This repository uses separate license terms for code, public dataset artifacts,
Korean translations, and source-derived scan images.

This project is not affiliated with the U.S. FBI or the U.S. government. It
does not represent any official position, interpretation, or conclusion.

## License Matrix

| Area | Paths | License / Policy |
|---|---|---|
| Reader app and project code | `src/`, `scripts/sync-page-images.mjs`, `scripts/verify-content.mjs`, `astro.config.mjs`, `package.json`, `tsconfig.json` | MIT License, see [`LICENSE`](LICENSE) |
| Source manifest and OCR/source metadata | `data/sources.json`, `dataset/part-*/manifest.json`, `dataset/part-*/pages/**`, `dataset/part-*/translations/ko/summary.json`, `dataset/part-*/translations/ko/excluded_source_lines.json` | CC0 1.0 Universal |
| Korean translation exports | `dataset/part-*/translations/ko/units.json`, `dataset/part-*/translations/ko/pages/**` | Creative Commons Attribution 4.0 International (CC BY 4.0) |
| Reader scan image cache | `public/source-cache/**` | No additional rights claimed; source-derived reading aids |
| Original FBI Vault PDFs | Not included in this repository | Verify directly at FBI Vault |

## Source PDFs

The original source PDFs are available from FBI Vault:

https://vault.fbi.gov/UFO

The original PDFs are not included in this repository. This project does not
make a final legal claim about copyright, public-domain status, or reuse terms
for the original PDFs, especially outside the United States or for any
third-party material embedded in those PDFs.

## Public Dataset

Dataset-specific license terms are documented in [`dataset/LICENSE`](dataset/LICENSE).

Use the following attribution for Korean translation exports under CC BY 4.0:

```text
FBI-UFO-Archive-KR Project. (2026). Korean translation exports from FBI UFO Archive KR.
Source documents: FBI Vault UFO documents (https://vault.fbi.gov/UFO).
```

## Reader Scan Image Cache

The WebP images under `public/source-cache/` are derived from source PDF page
images to make the public reader usable. The project claims no additional
copyright or exclusive rights in those source-derived scan images.

When reusing scan images, verify the corresponding source PDF and page through
FBI Vault and preserve source traceability.

## No Endorsement

Do not represent this project, dataset, translations, scan images, or reader app
as affiliated with, endorsed by, or published by the U.S. FBI or the U.S.
government.
