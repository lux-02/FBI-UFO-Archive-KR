# FBI UFO Archive KR — OCR, Korean Translation Dataset, and Web Reader

An unofficial public dataset containing OCR output and reviewed Korean translation exports derived from UFO-related PDFs published on the [FBI Vault](https://vault.fbi.gov/UFO).

It also includes a static Astro web reader for browsing the public dataset in Korean with source-page traceability.

Production reader app: [ufo.n2f.site](https://ufo.n2f.site)

This project is not affiliated with the U.S. FBI or the U.S. government, and it does not represent any official position or conclusion. The source PDFs are public materials available from FBI Vault. This dataset and reader are derivative reading and review aids; they do not add claims, tone, or conclusions that are not present in the source documents.

---

## Public Scope

| Area | Path | Status |
|---|---|---|
| Source manifest | `data/sources.json` | FBI Vault URL, SHA-256, and page count for 16 PDFs |
| Public OCR and translation dataset | `dataset/` | Part 01-12 OCR and Korean translation exports complete |
| Static web reader | `src/`, `public/` | Deployed at [ufo.n2f.site](https://ufo.n2f.site) |
| Source PDFs | Not included | Verify directly through FBI Vault |

The current public dataset includes OCR output and Korean translation exports for Part 01-12. Part 13-16 are pending.

---

## Current Status

| Part | Source PDF | Pages | Korean reviewed units | Approval |
|---:|---|---:|---:|---|
| 01 | `docs/ufo1.pdf` | 69 | 490 | `not_approved` |
| 02 | `docs/ufo2.pdf` | 79 | 722 | `not_approved` |
| 03 | `docs/ufo3.pdf` | 111 | 895 | `not_approved` |
| 04 | `docs/ufo4.pdf` | 77 | 708 | `not_approved` |
| 05 | `docs/ufo5.pdf` | 74 | 780 | `not_approved` |
| 06 | `docs/ufo6.pdf` | 129 | 1,178 | `not_approved` |
| 07 | `docs/ufo7.pdf` | 84 | 491 | `not_approved` |
| 08 | `docs/ufo8.pdf` | 66 | 585 | `not_approved` |
| 09 | `docs/ufo9.pdf` | 67 | 501 | `not_approved` |
| 10 | `docs/ufo10.pdf` | 56 | 409 | `not_approved` |
| 11 | `docs/ufo11.pdf` | 127 | 1,210 | `not_approved` |
| 12 | `docs/ufo12.pdf` | 142 | 941 | `not_approved` |

The dataset currently contains 8,910 Korean translation units available for public review.

`reviewed` means the unit has gone through source comparison and Korean translation review. `not_approved` means the text is not a final approved publication translation; it is a public review dataset artifact.

---

## Dataset Layout

```text
data/
  sources.json                       source URL, SHA-256, and page count for 16 PDFs

dataset/
  README.md                          detailed dataset notes
  LICENSE                            dataset license terms
  part-01/
    manifest.json                    part metadata, source SHA-256, export status
    pages/
      page_0001.txt                  page-level OCR text
      page_0001.json                 structured line-level OCR data
      ...
    translations/ko/
      summary.json                   Korean translation export summary
      units.json                     translation units with source mapping
      excluded_source_lines.json     unresolved OCR lines excluded from translation
      pages/page_NNNN.txt            page-level Korean translation
      pages/page_NNNN.json           structured page-level Korean translation
  part-02/
  part-03/
  part-04/
  part-05/
  part-06/
  part-07/
  part-08/
  part-09/
  part-10/
  part-11/
  part-12/
```

Each translation unit preserves part/page/source-line mappings. OCR lines that have not been confirmed are not mixed into the translated body text; they are retained separately in `excluded_source_lines.json`.

---

## How to Use

1. Open the web reader at [ufo.n2f.site](https://ufo.n2f.site).
2. Read [`dataset/README.md`](dataset/README.md) for detailed dataset status and conventions.
3. Check each part's `manifest.json` for source PDF hash, page count, and export status.
4. Read OCR source text in `dataset/part-XX/pages/page_NNNN.{txt,json}`.
5. Read Korean translations in `dataset/part-XX/translations/ko/`.
6. Compare against source page images by opening the PDFs directly from [FBI Vault UFO](https://vault.fbi.gov/UFO).

If you download the source PDFs locally, verify them against `data/sources.json`.

```sh
shasum -a 256 docs/ufo1.pdf
shasum -a 256 docs/ufo2.pdf
shasum -a 256 docs/ufo3.pdf
shasum -a 256 docs/ufo4.pdf
shasum -a 256 docs/ufo5.pdf
shasum -a 256 docs/ufo6.pdf
shasum -a 256 docs/ufo7.pdf
shasum -a 256 docs/ufo8.pdf
shasum -a 256 docs/ufo9.pdf
shasum -a 256 docs/ufo10.pdf
shasum -a 256 docs/ufo11.pdf
shasum -a 256 docs/ufo12.pdf
```

---

## Web Reader App

The web reader is a static Astro app that reads only the public dataset and source manifest checked into this repository.

| Route | Purpose |
|---|---|
| `/` | Archive shelf for the 16 FBI Vault UFO parts |
| `/archive/part-XX` | Part-level page list and translation progress |
| `/archive/part-XX/page-NNNN` | Page-level Korean translation with source metadata |
| `/search` | Client-side search over public Korean translation units |
| `/about` | Project, source, and dataset policy notes |

Reader data sources:

- `dataset/part-XX/manifest.json`
- `dataset/part-XX/pages/page_NNNN.{txt,json}`
- `dataset/part-XX/translations/ko/`
- `data/sources.json`
- `public/source-cache/{sha256}/page_NNNN.reader.webp` when a reader scan image is available

The app does not require source PDFs at runtime. Private OCR workspaces, raw model logs, crop evidence, `.env`, and original `docs/*.pdf` files are not part of the public reader deployment.

---

## Local Development

```sh
pnpm install
pnpm dev
pnpm check
pnpm build
pnpm preview
pnpm pdfs:download --dry-run
```

Useful commands:

| Command | Description |
|---|---|
| `pnpm dev` | Start the Astro development server |
| `pnpm check` | Run Astro/TypeScript diagnostics |
| `pnpm build` | Build the static reader into `dist/` |
| `pnpm preview` | Preview the built static reader locally |
| `pnpm pdfs:download --dry-run` | Verify local source PDF hashes against `data/sources.json` |

---

## Deployment

The production reader is deployed on Vercel as a static Astro site.

| Setting | Value |
|---|---|
| Production URL | [https://ufo.n2f.site](https://ufo.n2f.site) |
| Framework preset | Astro |
| Install command | `pnpm install` |
| Build command | `pnpm build` |
| Output directory | `dist` |

The deployment allow-list is controlled by `.vercelignore`. Public deploy inputs are limited to the app source, public static assets, `data/sources.json`, and `dataset/`.

Deploy inputs:

- `astro.config.mjs`, `package.json`, `pnpm-lock.yaml`, `tsconfig.json`
- `src/**`
- `public/**`
- `data/sources.json`
- `dataset/**`

Excluded from deployment:

- `docs/*.pdf`
- `.env`
- `.claude/`, `CLAUDE.md`, `AGENTS.md`
- `data/ocr/`, `data/translations/`
- OCR/translation automation scripts and raw review artifacts

---

## Data Principles

- Preserve traceability to the original PDF part and page.
- Do not add facts, mood, or conclusions that are absent from the source PDF.
- Do not reconstruct redacted, deleted, illegible, or physically damaged text by guesswork.
- Keep confirmed OCR lines separate from unresolved OCR lines.
- Keep Korean translation in a documentary record style, avoiding sensational or clickbait wording.
- Do not publish raw model logs, private review notes, or operational crop evidence in the public dataset.

---

## License

| Area | License / Policy |
|---|---|
| Reader app and project code | MIT License, see [`LICENSE`](LICENSE) |
| Source manifest and OCR/source metadata | CC0 1.0 Universal, see [`dataset/LICENSE`](dataset/LICENSE) |
| Korean translation exports | CC BY 4.0, see [`dataset/LICENSE`](dataset/LICENSE) |
| Reader scan image cache (`public/source-cache/`) | No additional rights claimed; source-derived reading aids |
| Original FBI Vault PDFs | Not included; verify directly through FBI Vault |

See [`NOTICE.md`](NOTICE.md) for the full license matrix and source-document caveats. Source PDFs are not included in this repository. Check FBI Vault and any applicable legal terms before reusing the original documents.

---

## Citation

```text
FBI-UFO-Archive-KR Project. (2026). FBI UFO OCR + Korean Translation Dataset.
Source: FBI Vault UFO documents (https://vault.fbi.gov/UFO).
```

---

# FBI UFO Archive KR — OCR, Korean Translation Dataset, and Web Reader 한국어 안내

[FBI Vault](https://vault.fbi.gov/UFO)에 공개된 UFO 관련 PDF를 대상으로 OCR 추출본과 한국어 번역 검수본을 정리하는 비공식 공개 데이터셋입니다.

공개 데이터셋을 한국어로 탐색할 수 있는 Astro 기반 정적 웹 리더도 함께 제공합니다.

프로덕션 리더 앱: [ufo.n2f.site](https://ufo.n2f.site)

이 저장소는 미국 FBI 또는 미국 정부와 무관하며, 어떤 공식 입장이나 결론을 대변하지 않습니다. 원본 PDF는 FBI Vault에서 확인할 수 있는 공개 자료입니다. 이 데이터셋과 리더는 원본 문서를 읽고 검토하기 쉽게 만든 파생 산출물이며, 원문에 없는 사실, 분위기, 결론을 추가하지 않는 것을 원칙으로 합니다.

---

## 공개 범위

| 영역 | 위치 | 상태 |
|---|---|---|
| PDF 출처 매니페스트 | `data/sources.json` | 16개 PDF의 FBI Vault URL, SHA-256, 페이지 수 |
| 공개 OCR/번역 데이터셋 | `dataset/` | Part 01-06 OCR/한국어 번역 export 완료 |
| 정적 웹 리더 | `src/`, `public/` | [ufo.n2f.site](https://ufo.n2f.site)에 배포 |
| 원본 PDF | 저장소에 미포함 | FBI Vault에서 직접 확인 |

현재 공개 데이터셋에는 Part 01-12의 OCR 추출 결과와 한국어 번역 결과물이 포함되어 있습니다. Part 13-16은 아직 처리 전입니다.

---

## 현재 상태

| Part | Source PDF | Pages | Korean reviewed units | Approval |
|---:|---|---:|---:|---|
| 01 | `docs/ufo1.pdf` | 69 | 490 | `not_approved` |
| 02 | `docs/ufo2.pdf` | 79 | 722 | `not_approved` |
| 03 | `docs/ufo3.pdf` | 111 | 895 | `not_approved` |
| 04 | `docs/ufo4.pdf` | 77 | 708 | `not_approved` |
| 05 | `docs/ufo5.pdf` | 74 | 780 | `not_approved` |
| 06 | `docs/ufo6.pdf` | 129 | 1,178 | `not_approved` |
| 07 | `docs/ufo7.pdf` | 84 | 491 | `not_approved` |
| 08 | `docs/ufo8.pdf` | 66 | 585 | `not_approved` |
| 09 | `docs/ufo9.pdf` | 67 | 501 | `not_approved` |
| 10 | `docs/ufo10.pdf` | 56 | 409 | `not_approved` |
| 11 | `docs/ufo11.pdf` | 127 | 1,210 | `not_approved` |
| 12 | `docs/ufo12.pdf` | 142 | 941 | `not_approved` |

총 8,910개의 한국어 번역 unit이 공개 검토 가능한 상태로 export되어 있습니다.

`reviewed`는 OCR 원문 대조와 한국어 검수를 거친 상태를 뜻합니다. `not_approved`가 붙은 항목은 최종 승인 번역본이 아니며, 공개 검토와 재사용을 위한 데이터셋 상태입니다.

---

## 데이터 구조

```text
data/
  sources.json                       16개 PDF 출처, 해시, 페이지 수

dataset/
  README.md                          데이터셋 상세 설명
  LICENSE                            데이터셋 라이선스 조건
  part-01/
    manifest.json                    part 메타데이터, source SHA-256, export 상태
    pages/
      page_0001.txt                  페이지 단위 OCR 정리본
      page_0001.json                 라인 단위 구조화 OCR 데이터
      ...
    translations/ko/
      summary.json                   한국어 번역 export 요약
      units.json                     source mapping을 포함한 번역 unit
      excluded_source_lines.json     미확정 OCR 라인 목록
      pages/page_NNNN.txt            페이지 단위 한국어 번역
      pages/page_NNNN.json           페이지 단위 구조화 번역
  part-02/
  part-03/
  part-04/
  part-05/
  part-06/
  part-07/
  part-08/
  part-09/
  part-10/
  part-11/
  part-12/
```

각 번역 unit은 part/page/source line 매핑을 보존합니다. OCR이 확정되지 않은 라인은 번역 본문에 섞지 않고 `excluded_source_lines.json`에 따로 남깁니다.

---

## 사용 방법

1. 웹 리더는 [ufo.n2f.site](https://ufo.n2f.site)에서 확인합니다.
2. [`dataset/README.md`](dataset/README.md)에서 데이터셋 상태와 규칙을 확인합니다.
3. 각 part의 `manifest.json`에서 원본 PDF 해시, 페이지 수, 번역 export 상태를 확인합니다.
4. OCR 원문은 `dataset/part-XX/pages/page_NNNN.{txt,json}`에서 확인합니다.
5. 한국어 번역은 `dataset/part-XX/translations/ko/`에서 확인합니다.
6. 원본 이미지는 [FBI Vault UFO](https://vault.fbi.gov/UFO)에서 PDF를 직접 열어 대조합니다.

원본 PDF를 내려받아 로컬에서 검증하려면 `data/sources.json`의 URL과 SHA-256 값을 기준으로 확인하세요.

```sh
shasum -a 256 docs/ufo1.pdf
shasum -a 256 docs/ufo2.pdf
shasum -a 256 docs/ufo3.pdf
shasum -a 256 docs/ufo4.pdf
shasum -a 256 docs/ufo5.pdf
shasum -a 256 docs/ufo6.pdf
shasum -a 256 docs/ufo7.pdf
shasum -a 256 docs/ufo8.pdf
shasum -a 256 docs/ufo9.pdf
shasum -a 256 docs/ufo10.pdf
shasum -a 256 docs/ufo11.pdf
shasum -a 256 docs/ufo12.pdf
```

---

## 웹 리더 앱

웹 리더는 저장소에 공개된 dataset과 source manifest만 읽는 정적 Astro 앱입니다.

| Route | 역할 |
|---|---|
| `/` | 16개 FBI Vault UFO part를 보여주는 아카이브 홈 |
| `/archive/part-XX` | part별 페이지 목록과 번역 진행 상태 |
| `/archive/part-XX/page-NNNN` | 페이지별 한국어 번역과 source metadata |
| `/search` | 공개 한국어 번역 unit 대상 클라이언트 검색 |
| `/about` | 프로젝트, 출처, 데이터셋 정책 안내 |

리더 데이터 소스:

- `dataset/part-XX/manifest.json`
- `dataset/part-XX/pages/page_NNNN.{txt,json}`
- `dataset/part-XX/translations/ko/`
- `data/sources.json`
- 리더용 스캔 이미지가 있는 경우 `public/source-cache/{sha256}/page_NNNN.reader.webp`

앱은 런타임에 원본 PDF를 필요로 하지 않습니다. 비공개 OCR 작업 폴더, 모델 원본 로그, crop evidence, `.env`, 원본 `docs/*.pdf` 파일은 공개 리더 배포에 포함하지 않습니다.

---

## 로컬 개발

```sh
pnpm install
pnpm dev
pnpm check
pnpm build
pnpm preview
pnpm pdfs:download --dry-run
```

주요 명령:

| 명령 | 설명 |
|---|---|
| `pnpm dev` | Astro 개발 서버 실행 |
| `pnpm check` | Astro/TypeScript 진단 실행 |
| `pnpm build` | 정적 리더를 `dist/`로 빌드 |
| `pnpm preview` | 빌드 결과를 로컬에서 미리보기 |
| `pnpm pdfs:download --dry-run` | `data/sources.json` 기준으로 로컬 PDF 해시 검증 |

---

## 배포

프로덕션 리더는 Vercel의 정적 Astro 사이트로 배포합니다.

| 설정 | 값 |
|---|---|
| Production URL | [https://ufo.n2f.site](https://ufo.n2f.site) |
| Framework preset | Astro |
| Install command | `pnpm install` |
| Build command | `pnpm build` |
| Output directory | `dist` |

배포 allow-list는 `.vercelignore`에서 관리합니다. 공개 배포 입력은 앱 소스, 공개 static asset, `data/sources.json`, `dataset/`으로 제한합니다.

배포 포함:

- `astro.config.mjs`, `package.json`, `pnpm-lock.yaml`, `tsconfig.json`
- `src/**`
- `public/**`
- `data/sources.json`
- `dataset/**`

배포 제외:

- `docs/*.pdf`
- `.env`
- `.claude/`, `CLAUDE.md`, `AGENTS.md`
- `data/ocr/`, `data/translations/`
- OCR/번역 자동화 스크립트와 원본 검수 산출물

---

## 데이터 원칙

- 원본 PDF의 part/page 추적 가능성을 유지합니다.
- PDF 원문에 없는 사실, 분위기, 결론을 OCR/번역 데이터에 추가하지 않습니다.
- 검열, 삭제, 판독 불가, 물리적 훼손 영역은 추정으로 복원하지 않습니다.
- OCR 확정 라인과 미확정 라인을 분리합니다.
- 한국어 번역은 기록물 톤을 유지하며 과장된 해석이나 클릭베이트 표현을 피합니다.
- 공개 데이터에는 모델 원본 로그, 개인 검수 메모, 운영용 crop evidence를 포함하지 않습니다.

---

## 라이선스

| 영역 | 라이선스 / 정책 |
|---|---|
| 리더 앱 및 프로젝트 코드 | MIT License, [`LICENSE`](LICENSE) 참조 |
| 출처 매니페스트 및 OCR/source metadata | CC0 1.0 Universal, [`dataset/LICENSE`](dataset/LICENSE) 참조 |
| 한국어 번역 export | CC BY 4.0, [`dataset/LICENSE`](dataset/LICENSE) 참조 |
| 리더 스캔 이미지 캐시 (`public/source-cache/`) | 추가 권리 주장 없음, 원본 문서 파생 열람용 이미지 |
| 원본 FBI Vault PDF | 저장소에 미포함, FBI Vault에서 직접 확인 |

전체 라이선스 매트릭스와 원본 문서 관련 주의사항은 [`NOTICE.md`](NOTICE.md)를 확인하세요. 원본 PDF는 이 저장소에 포함하지 않습니다. 원문 재사용 전 FBI Vault와 관련 법적 조건을 직접 확인하세요.

---

## 인용

```text
FBI-UFO-Archive-KR Project. (2026). FBI UFO OCR + Korean Translation Dataset.
Source: FBI Vault UFO documents (https://vault.fbi.gov/UFO).
```
