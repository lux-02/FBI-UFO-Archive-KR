# FBI-UFO-Archive-KR Harness

> 목적: FBI Vault UFO PDF 16개를 한국어 번역 이북 웹앱으로 제작하기 전, 에이전트가 일관된 판단과 품질 기준으로 개발하도록 프로젝트 하네스를 고정한다.
> 버전: v0.2 Phase 0.8 (공개 데이터셋 + 리더 정합)
> 기준일: 2026-05-10 Asia/Seoul
> 공식 참조: https://vault.fbi.gov/UFO
> 확정 스택: Astro / Tailwind v4 / 하이브리드 PDF / Tesseract+Textract / Pagefind / JSON+MDX / Vercel Static Hosting / pnpm

---

## 1. Project Identity

이 프로젝트는 "스캔된 FBI UFO 기록물을 한국어 독자가 읽고 탐색할 수 있게 만드는 기록물형 이북 웹앱"이다.

핵심 매력은 다음 세 가지다.

1. 원본 스캔의 물성: 오래된 문서, 타자기 흔적, FBI 양식, 검열/블랙아웃을 독서 경험의 일부로 살린다.
2. 한국어 접근성: 원문을 숨기지 않고, 페이지 단위로 정확히 매핑된 자연스러운 한국어 번역을 제공한다.
3. 탐색 가능한 아카이브: 16개 PDF를 단순 나열하지 않고 사건, 인물/기관, 날짜, 문서 유형, 신뢰도/검수 상태로 탐색하게 한다.

이 앱은 UFO 진위를 주장하는 앱이 아니다. 공개 기록물을 읽기 좋은 한국어 아카이브로 재구성하는 앱이다.

---

## 2. Current Corpus

| 항목 | 상태 |
|---|---|
| 공식 목록 | FBI Vault `UFO` 페이지에서 16개 관련 문서 확인 |
| 로컬 파일 | `docs/ufo1.pdf` ~ `docs/ufo16.pdf` |
| 총 페이지 | 1,616 pages by macOS metadata |
| 원본 해시 | `.claude/content/source_manifest.md` 및 `data/sources.json` 참조 |
| OCR 텍스트 | Part 01-03 공개 export 완료 (`dataset/part-01` ~ `dataset/part-03`) |
| 한국어 번역 | Part 01-03 `reviewed/not_approved` 공개 export 완료 |
| 앱 코드 | Astro 정적 리더 PoC 존재, `dataset/` 직접 읽기 정합 진행 |

주의: 사용자가 "어제 공개"라고 표현했지만, 2026-05-09 현재 확인한 FBI Vault 목록 화면만으로 공개일은 확인되지 않았다. 공개일/업데이트일은 별도 검증 전까지 제품 카피에 쓰지 않는다.

---

## 3. Product Modules

| 모듈 | Prefix | 역할 | 룰 인덱스 |
|---|---|---|---|
| Source Archive | SRC- | PDF 출처, 해시, OCR, 페이지 매핑, 원문 보존 | `products/source-archive/rules/INDEX.md` |
| Translation | TRN- | 한국어 번역, 용어집, 검수, 스타일 가이드 | `products/translation/rules/INDEX.md` |
| Reader | RDR- | 이북 리더, PDF/번역 병렬 보기, 검색/북마크 | `products/reader/rules/INDEX.md` |
| Experience | EXP- | UFO 콘셉트 비주얼, 몰입감, 인터랙션 톤 | `products/experience/rules/INDEX.md` |

세부 문서는 `.claude/products/CLAUDE.md`와 각 모듈 `CLAUDE.md`/`rules/INDEX.md`/`schemas/INDEX.md`/`screens/INDEX.md`를 따른다.

---

## 4. Common Commands

### 4.1 현재 앱/데이터셋 정합 기준

```bash
pnpm install
pnpm dev               # astro dev
pnpm build             # astro build
pnpm preview           # astro preview
pnpm check             # astro check (TS + content collections)
pnpm typecheck         # tsc --noEmit
pnpm content:verify    # scripts/verify-content.mjs (source manifest + public dataset)
pnpm content:schemas   # scripts/verify-baseline-schemas.mjs
pnpm content:index     # pagefind --site dist
pnpm content:ocr       # scripts/extract-ocr.ts (Tesseract 기본)
pnpm content:images    # scripts/render-pages.ts (THUMB/READER 사전 생성)
```

`lint`, `test`, `test:e2e`, `content:ocr`, `content:images`는 하네스 목표 명령으로 남아 있으며,
실제 npm script 연결은 해당 기능 구현 시 추가한다.

### 4.2 Phase 0 (현재) — 검증 전용

```bash
find docs -maxdepth 1 -type f -name 'ufo*.pdf' | sort
for f in docs/*.pdf; do shasum -a 256 "$f"; done
for f in docs/*.pdf; do mdls -raw -name kMDItemNumberOfPages "$f"; done
```

상세는 `rules/implementation_boundaries.md` § 4.

---

## 5. Non-Negotiable Rules

1. 원본 PDF는 변경하지 않는다.
2. 모든 번역 문단은 `part`, `page`, 가능하면 `block_id`로 원문에 역추적 가능해야 한다.
3. 원문에 없는 사실/정서를 추가하지 않는다.
4. OCR 신뢰도가 낮은 영역은 번역 확정 상태로 표시하지 않는다.
5. 검열/삭제/불명확한 스캔은 추정으로 메우지 않는다.
6. "AI가 쓴 듯한" 일반론, 과한 서문, 근거 없는 요약을 UI와 번역문에서 제거한다.
7. UFO 콘셉트는 자료를 읽기 쉽게 만드는 데만 사용한다.
8. 공개일, 저작권, 공문서 지위, 법적 해석은 공식 근거 확인 전 단정하지 않는다.

---

## 6. Confirmed Stack (v0.1, 락인 2026-05-09)

| 영역 | 선택 |
|---|---|
| Language | TypeScript (strict) + Zod |
| Web framework | **Astro** (Content Collections + Islands) |
| Styling | **Tailwind v4 + CSS variables** (토큰 단일 출처) |
| PDF render | **하이브리드** — 빌드 시 WebP/AVIF (THUMB/READER) + pdf.js (FACSIMILE) |
| OCR engine | **Tesseract local 기본 + Textract block-level 옵션** |
| Search | **Pagefind 메인 + MiniSearch (검수 큐/admin)** |
| Content storage | **JSON (Schema 검증) + MDX (요약/노트)** |
| Hosting | **Vercel Static Hosting** |
| Package manager | **pnpm** |
| Image format | AVIF + WebP fallback |
| Korean font | Pretendard Variable (self-host) + system fallback |
| Admin tools | 같은 Astro 앱의 client-only `/admin/*` route |

상세 근거와 평가 매트릭스: 본 락인 결정 세션 로그.
변경 절차: `rules/implementation_boundaries.md` § 2 "결정 동결 범위" 참조.

---

## 7. Context Loading

작업별로 필요한 문서만 읽는다.

| 작업 | 읽을 문서 |
|---|---|
| PDF/OCR/원문 추출 (개념) | `products/source-archive/{CLAUDE,rules/INDEX,schemas/INDEX}.md`, `rules/source_integrity.md`, `rules/data_model.md`, `boilerplate/01`, `boilerplate/02` |
| OCR 파이프라인 (운영) | `data/ocr/OCR_WORKFLOW.md` v0.6 (Stage 0~8 + 7B Gemini advisory + 7C Codex/manual closure), `data/ocr/OCR_RULESET.md` v1.2 (Pilot Quality Gates), `products/source-archive/rules/{page_review,block_accuracy,second_pass,line_audit}.md` (SRC-500~895 / page readiness gate 포함) |
| OCR advisory layer (Gemini) | `products/source-archive/rules/line_audit.md` SRC-891~895, `content/migrations/v0.3-crop-audit/`, `data/ocr/part-XX/crop_audit/` |
| 번역/검수 | `products/translation/{CLAUDE,rules/INDEX,schemas/INDEX}.md`, `rules/translation_editorial.md`, `rules/ai_authenticity.md`, `boilerplate/03`, `boilerplate/04` |
| 이북 UI | `products/reader/{CLAUDE,rules/INDEX,schemas/INDEX,screens/INDEX}.md`, `rules/reader_ux.md`, `boilerplate/05`, `boilerplate/06` |
| UFO 콘셉트/디자인 | `products/experience/{CLAUDE,rules/INDEX,schemas/INDEX,screens/INDEX}.md`, `rules/ai_authenticity.md`, `rules/reader_ux.md`, `boilerplate/06` |
| 콘텐츠 모델/스키마 변경 | `rules/data_model.md`, 해당 모듈 `schemas/INDEX.md`, `content/migrations/INDEX.md`, `content/migrations/v0.{1-baseline,2-ocr-pipeline,3-crop-audit}/` |
| 배포/SEO | `rules/source_integrity.md`, `rules/security_privacy.md`, `boilerplate/08` |

---

## 8. Phase Gate / Current Goal

현재 `/goal` 우선순위는 다음 순서로 정합한다.

1. 하네스 문서와 실제 저장소 상태 정합
2. 공개 `dataset/`을 웹앱의 주 콘텐츠 소스로 연결
3. Reader IA를 part/page URL과 source badge 중심으로 정리
4. 원본 대조 링크와 OCR 원문 패널 제공
5. 검색을 source-backed 결과만 노출하도록 정리
6. 공개 카피에서 `reviewed/not_approved`, 비제휴, 라이선스 미확정 상태를 명확히 표시

---

## 9. Phase Gate

Phase 1 앱 구현에 들어가기 전 최소 조건:

- [x] PDF manifest와 공식 출처 링크 검증 완료 (`data/sources.json`)
- [x] OCR 방식 결정 및 샘플/Part 01-03 공개 export 완료
- [ ] 번역 스타일/용어집 v0.1 승인
- [x] 콘텐츠 데이터 모델 baseline 동결 및 공개 dataset export 구조 적용
- [ ] 리더 핵심 화면 IA 확정 (`dataset/` 기반 part/page route 정합 진행)
- [ ] UFO 콘셉트 비주얼 원칙 확정
- [x] AI 사용/검수/표기 정책 확정 (`reviewed/not_approved`, raw logs 비공개)
- [x] dev/build/test/lint 명령 확정 (§ 4.1 락인)
- [x] 스택 7개 결정 락인 (§ 6)
- [x] `content/migrations/v0.1-baseline/` 의 baseline JSON Schema 동결 (22 파일, 2026-05-09)
- [x] 모듈별 schema 동결: 6 source + 7 translation + 7 reader + 2 experience = 22 (`.claude/content/migrations/v0.1-baseline/schemas/`)
- [x] Astro 스캐폴딩 + Tailwind/Pagefind 통합 PoC (`.claude/research/ASTRO_POC_v0.1.md`)

---

## 10. Stack Decision Track (락인 완료, 2026-05-09)

| 영역 | 결정 | 상태 |
|---|---|---|
| Web framework | Astro (Content Collections + Islands) | ✅ Locked |
| Styling | Tailwind v4 + CSS variables | ✅ Locked |
| PDF 렌더 | 하이브리드 (빌드 WebP/AVIF + pdf.js for FACSIMILE) | ✅ Locked, pilot 후 재평가 가능 |
| OCR engine | Tesseract local 기본 + Textract block-level 옵션 | ✅ Locked, pilot 후 재평가 가능 |
| Search | Pagefind + MiniSearch (admin) | ✅ Locked, fuzzy 요구 시 MiniSearch 확장 |
| Content storage | JSON + MDX | ✅ Locked |
| Hosting | Vercel Static Hosting | ✅ Locked |
| Package manager | pnpm | ✅ Locked |

### 10.1 변경 절차

스택 락인 항목을 변경하려면 다음을 동반한다.

1. 변경 사유 (성능 측정/룰 충돌/외부 제약 등)
2. `rules/implementation_boundaries.md` § 2 표 갱신
3. 본 § 6, § 10 표 갱신
4. 영향 받는 모듈 룰의 코드 정합성 섹션 갱신
5. `content/migrations/`에 변경 기록 (스키마 영향 시)

### 10.2 Phase 1 진입 후 재평가 가능한 항목

다음은 락인이지만 Phase 1 pilot에서 합리적 사유가 발견되면 § 10.1 절차로 교체 가능.

- PDF render: pilot 측정에서 모바일 부담 시 빌드 이미지화 100% 또는 pdf.js 단독 검토
- OCR engine: 정확도 < 95%면 Textract page-level (block 단위 유지) 비중 확대
- Search: 한국어 자모 fuzzy 요구가 강하면 MiniSearch 메인 전환

### 10.3 락인 외 항목

다음은 락인 없이 운영 결정 사항으로 남는다.

- 분석 옵트인 도구 (Plausible / Umami / 자체)
- AI 모델 제공자 (`translation.ai.*` 토글 ON 시점에)
- CMS/검수자 인증 (Phase 2 검토)
