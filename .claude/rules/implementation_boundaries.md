# Implementation Boundaries

> 버전: v0.1
> 적용: all future code changes

---

## 1. Current State

현재 저장소는 문서/PDF 중심이며 앱 스캐폴딩이 없다. 스택은 v0.1로 확정(아래 § 2)했으며, Phase 1 시작 시 이 스택으로 스캐폴딩한다.

---

## 2. Confirmed Stack (v0.1, 2026-05-09)

| 영역 | 선택 | 비고 |
|---|---|---|
| Language | TypeScript (strict) | Zod로 런타임 가드 |
| Web framework | **Astro** (Content Collections + Islands) | React 컴포넌트 혼합 가능 |
| Styling | **Tailwind v4 + CSS variables** | 토큰은 CSS variable 단일 출처 |
| PDF render | **하이브리드** (빌드 시 WebP/AVIF + pdf.js for FACSIMILE) | SRC-400 variant 분기 |
| OCR engine | **Tesseract local 기본 + Textract block-level 옵션** | SRC-160 외부 일괄 업로드 금지 준수 |
| Search | **Pagefind 메인 + MiniSearch (검수 큐/admin)** | RDR-110 빌드 색인 |
| Content storage | **JSON (Schema 검증) + MDX (요약/노트)** | data_model § 3 권위와 일치 |
| Hosting | **Vercel Static Hosting** | Astro static `dist/` + committed `public/source-cache` reader assets |
| Package manager | **pnpm** | workspace 호환 |
| Image format | AVIF + WebP fallback (`<picture>`) | THUMB/READER variant |
| Korean font | Pretendard Variable (self-host) + system fallback | RDR-560 |
| Admin tools | 같은 Astro 앱의 client-only `/admin/*` route | TRN-010, SRC-110 등 |

### 결정 동결 범위

다음을 다른 옵션으로 바꾸려면 본 § 2와 함께 `.claude/CLAUDE.md` § 6, § 9, `content/migrations/`에 변경 이유를 동반해야 한다.

- Astro → 다른 framework
- Tailwind → 다른 styling 시스템
- Vercel Static Hosting → 다른 hosting

PDF render / OCR / Search / Content storage는 Phase 1 pilot 검증에서 합리적 사유가 있으면 일부 교체 가능 (단 § 2 표 갱신 의무).

---

## 3. Directory Direction

권장 구조:

```text
docs/                    # original PDFs, immutable inputs
src/                     # app code after scaffolding
scripts/                 # content/OCR/verification scripts
content/                 # generated machine-readable content
public/                  # public assets generated from sources
tests/                   # unit/integration tests
e2e/                     # browser tests
.claude/                 # planning/rules/harness
```

---

## 4. Commands (Phase 1 Scaffold 기준)

```bash
pnpm install
pnpm dev               # astro dev
pnpm build             # astro build
pnpm preview           # astro preview
pnpm check             # astro check (TS + content collections)
pnpm typecheck         # tsc --noEmit
pnpm lint              # eslint
pnpm test              # vitest run
pnpm test:e2e          # playwright test
pnpm content:verify    # scripts/verify-content.ts (manifest + schemas)
pnpm content:ocr       # scripts/extract-ocr.ts (Tesseract 기본)
pnpm content:images    # scripts/render-pages.ts (THUMB/READER 사전 생성)
pnpm content:index     # pagefind 빌드
```

Phase 0(현재) 검증 명령은 § 4.1.

### 4.1 Phase 0 verification

```bash
find docs -maxdepth 1 -type f -name 'ufo*.pdf' | sort
for f in docs/*.pdf; do shasum -a 256 "$f"; done
for f in docs/*.pdf; do mdls -raw -name kMDItemNumberOfPages "$f"; done
```

---

## 5. Ask First

- 원본 PDF 삭제/변경/재압축
- FBI 공식 자산 로고/인장 사용
- 외부 AI API로 전체 PDF 업로드
- analytics/user tracking 추가
- 인증/계정 기능 추가
- 공개 카피에서 공개일/법적 상태 단정

---

## 6. Always Do

- 변경 전 관련 `.claude/rules`를 읽는다.
- 콘텐츠 파이프라인은 manifest 기반으로 만든다.
- 번역/요약에는 source reference를 둔다.
- 앱 구현 후 build/typecheck/lint를 실행한다.
- 프론트엔드 변경 후 브라우저로 주요 화면을 확인한다.

---

## 7. Never Do

- 출처 없는 요약을 공개한다.
- OCR 오류를 조용히 번역 확정으로 만든다.
- 원본 문서의 불확실성을 극적인 문장으로 메운다.
- secret을 커밋한다.
- 실패하는 테스트를 삭제해서 통과시킨다.
- 사용자 변경을 되돌린다.
