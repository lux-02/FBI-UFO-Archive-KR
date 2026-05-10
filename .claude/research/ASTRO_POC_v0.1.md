# Astro Scaffolding PoC — v0.1

> **수행일**: 2026-05-09 Asia/Seoul
> **목적**: 락인 스택(Astro + Tailwind v4 + Pagefind + Zod + JSON Content Collections)으로 1개 part 샘플이 dev/build/check/verify 모두 통과하는지 확인

---

## 1. 결과 요약

| 검증 | 결과 |
|---|---|
| `pnpm install` | ✅ 363 packages, 10s |
| `pnpm dev` | ✅ http://localhost:4321 200 |
| `pnpm check` (astro check + TS) | ✅ 0 errors / 0 warnings / 0 hints (15 files) |
| `pnpm build` | ✅ 5 페이지 정적 빌드, 1.14s |
| `pnpm content:verify` | ✅ docs/ 16 PDFs / SHA-256 일치 / units 2/2 |
| 라우트 응답 (5개) | ✅ `/`, `/archive/part-01`, `/about`, `/search`, `/bookmarks` 모두 200 |
| 미존재 part | ✅ `/archive/part-02` → 404 (의도된 동작) |
| 한국어 본문 렌더 | ✅ "본 메모", "회보 제42호" 등 확인 |

**판정**: Phase 1 진입 가능. 락인 스택이 실제로 작동.

---

## 2. 의존성 (실측)

```
astro              5.18.1   (latest 6.3.1, upgrade는 v0.1 후 별도 결정)
@astrojs/check     0.9.9
@tailwindcss/vite  4.3.0
tailwindcss        4.3.0
typescript         5.9.3
zod                3.25.76
pagefind           1.5.2
```

`onlyBuiltDependencies` 미설정 — pnpm이 esbuild/sharp의 build script를 ignore. dev에는 영향 없음. Phase 1에서 이미지 처리(SRC-400) 구현 시 `pnpm approve-builds`로 sharp 활성 필요.

---

## 3. 디렉터리 구조 (생성됨)

```text
.
├── docs/                        # 원본 PDFs (immutable, 16개)
├── src/
│   ├── components/
│   │   ├── CitationBadge.astro  # RDR-410 compact citation
│   │   └── Layout.astro         # 헤더/푸터 + 무관 명시 카피 (EXP-060)
│   ├── content/
│   │   ├── config.ts            # Zod schema (parts, units)
│   │   ├── parts/
│   │   │   └── part-01.json     # SourceDocument 샘플
│   │   └── units/
│   │       ├── part01-p17-b001.json  # TranslationUnit 샘플 1
│   │       └── part01-p17-b002.json  # TranslationUnit 샘플 2
│   ├── lib/                     # (Phase 1+ 비즈니스 로직)
│   ├── pages/
│   │   ├── about.astro
│   │   ├── archive/part-[part].astro    # RDR-010
│   │   ├── bookmarks.astro      # RDR-040 stub
│   │   ├── index.astro          # RDR-001 shelf
│   │   └── search.astro         # RDR-030 stub
│   └── styles/global.css        # CSS variable 토큰 + reduced-motion + KO 가독성
├── scripts/
│   └── verify-content.mjs       # content:verify 1차 구현
├── public/                      # (정적 자산, 비어있음)
├── tests/                       # (Phase 1+ vitest)
├── e2e/                         # (Phase 1+ playwright)
├── astro.config.mjs
├── tsconfig.json                # strict + noUncheckedIndexedAccess + paths
└── package.json
```

---

## 4. 룰 정합성 검증

| 룰 | PoC 적용 |
|---|---|
| **SRC-001** PDF 위치 | `docs/ufoN.pdf` 보존 |
| **SRC-010** Manifest 필드 | `parts/part-01.json`에 sha256/pageCount/status |
| **SRC-020** 검증 절차 | `scripts/verify-content.mjs`가 SHA-256 재계산 후 비교 |
| **SRC-200** SourceRef 형식 | Zod schema 일치 |
| **TRN-200** 상태 그래프 | unit 샘플은 `DRAFT` (검수자 없음) |
| **TRN-220** 자동 검사 | `content:verify`에 ocrConfidence < 0.7 + status 검증 포함 |
| **TRN-460** 공개 노출 | RDR-010이 DRAFT/REVIEWED/APPROVED 모두 표시 (PoC 단계). Phase 1에서 `reader.public_show_*` 토글 적용 |
| **RDR-010** Volume Reader | `/archive/part-{NN}` 라우트 |
| **RDR-410** Citation 배지 | `CitationBadge.astro` 컴포넌트 |
| **RDR-590** 모바일 overflow | `word-break: keep-all` + `overflow-wrap: anywhere` 글로벌 |
| **EXP-060** 무관 명시 | 푸터에 한국어 카피 |
| **EXP-200** 토큰 단일 출처 | `@theme` block에 CSS variable 정의 |
| **EXP-100** reduced-motion | `@media (prefers-reduced-motion: reduce)` 글로벌 |

---

## 5. 미해결/Phase 1에서 다룰 항목

| 항목 | 상태 |
|---|---|
| `reader.public_show_*` 토글 적용 | DRAFT 임시 노출, Phase 1 토글 시스템 구현 후 APPROVED만 |
| 검수 워크벤치 (TRN-010) | 미구현, Phase 1 P1 |
| Pagefind 색인 빌드 | 의존성만 설치, 색인 미생성 |
| PDF → WebP/AVIF (SRC-400) | 미구현, Phase 1 P0 |
| 모듈별 entities/*.schema.json | 미작성, baseline 동결 작업에서 |
| FACSIMILE 모드 | stub, pdf.js 통합 미구현 |
| Parallel View | stub, 동기화 로직 미구현 |
| 검색 인덱스 fingerprint | 미구현 |
| Astro 6 업그레이드 | v0.1 락인 후 별도 결정 |
| `onlyBuiltDependencies` for sharp | Phase 1 이미지 처리 구현 시 |

---

## 6. 빌드 산출물

```
dist/
├── _astro/    (CSS/JS chunks)
├── about/index.html
├── archive/part-01/index.html
├── bookmarks/index.html
├── index.html
└── search/index.html
```

5 페이지 정적 HTML. Vercel Static Hosting 정적 배포 호환.

---

## 7. 명령 검증 결과

```bash
pnpm install         # ✅ 10s
pnpm dev             # ✅ ready in 1.7s, port 4321
pnpm check           # ✅ 0 errors
pnpm typecheck       # (별도 실행 불필요, check가 포함)
pnpm build           # ✅ 1.14s, 5 pages
pnpm content:verify  # ✅ 0 errors / 0 warnings
pnpm content:index   # (Pagefind, dist 빌드 후 실행 가능)
```

---

## 8. Phase 1 진입 권장

본 PoC는 다음을 입증한다.

1. 락인 스택이 함께 작동 (Astro 5 + Tailwind v4 + Zod + Content Collections)
2. 룰 정의(`data_model.md` + 모듈 INDEX)에서 코드(`config.ts` Zod)로 매핑이 손실 없음
3. 정적 빌드가 Vercel Static Hosting 배포 호환
4. 검증 스크립트(`content:verify`)가 매니페스트 SHA-256 무결성을 자동 보장

다음 단계: **v0.1-baseline 스키마 동결** (Task #16) 후 1개 part end-to-end pilot 시작.

---

## 9. 부산물

| 위치 | 의미 |
|---|---|
| `package.json`, `tsconfig.json`, `astro.config.mjs` | 락인 스택 설정 |
| `src/content/config.ts` | Zod 스키마 — Phase 1 schema 동결의 시작점 |
| `src/pages/`, `src/components/` | 핵심 화면 5개 스켈레톤 |
| `scripts/verify-content.mjs` | content:verify 1차 구현 |
| `dist/` | 정적 빌드 (.gitignore) |
| `node_modules/` | 의존성 (.gitignore) |

이 PoC 자체는 Phase 1 출발점이며 git commit 시점은 사용자 결정.

---

## 10. References

- 락인 스택: `.claude/CLAUDE.md` § 6, `.claude/rules/implementation_boundaries.md` § 2
- 룰 정합성: 본 문서 § 4
- 다음 작업: `.claude/content/migrations/v0.1-baseline/INDEX.md`
