# Content Migrations — 인덱스

> **상위**: `../INDEX.md`
> **버전**: v0.1 Phase 0
> **참조**: `../../rules/data_model.md` § 12, `../../rules/source_integrity.md`

---

## 0. 스코프

이 디렉터리는 **콘텐츠 산출물(OCR, 번역, 요약, 검색 색인, 매니페스트)의 스키마 진화 이력**을 관리한다.

원본 PDF는 immutable이므로 마이그레이션 대상이 아니다. 마이그레이션 대상은 다음.

- `SourceDocument` 매니페스트 형식
- `OcrBlock` / `RedactionBlock` 형식
- `TranslationUnit` / `Summary` / `TimelineEntry` 형식
- `GlossaryEntry` 형식
- 검색 색인 shard 형식
- 사용자 데이터(`Bookmark`, `LastReadPosition`, `ReaderState`)는 별도(L4 tier)

이 카탈로그는 **콘텐츠 파이프라인 전용**이며 DB DDL 마이그레이션이 아니다.

---

## 1. 디렉터리 규칙

```text
.claude/content/migrations/
  INDEX.md
  v{N}-{slug}/
    INDEX.md           # 의도, 영향 범위, 롤백 가이드
    {NN}_{description}.md  # 변환 룰 (인간 가독)
    transform.ts        # (Phase 1+) 실행 가능한 변환 (옵션)
    verify.md           # 검증 절차
    RULE_PATCHES.md     # 영향 받은 룰 파일 패치 요약
```

`v{N}` 형식: `v0.1`, `v0.2`, `v1.0` (semver-ish).

---

## 2. 적용 정책

- 마이그레이션은 **append-only** 디렉터리. 한 번 추가된 파일은 삭제하지 않는다.
- 실행되면 매니페스트의 `schemaVersion`을 업데이트하고 derived 산출물 `verifiedAt`을 갱신.
- 같은 버전을 여러 번 실행해도 idempotent여야 한다 (스크립트 작성 시).
- 마이그레이션 실패 시 derived 산출물을 stale로 표시하고 빌드 fail.

---

## 3. 변경 분류

| 분류 | 정의 | 새 버전 필요 |
|---|---|---|
| **additive** | 옵셔널 필드 추가, 새 ENUM 값 추가 | minor |
| **breaking** | 필수 필드 추가/제거, 타입 변경, ID 형식 변경 | major |
| **rename** | 필드/엔티티 이름 변경 | major (변환 룰 의무) |
| **constraint** | 기존 데이터 일부가 fail하는 제약 추가 | major |

---

## 4. 마이그레이션 작성 체크리스트

- [ ] 영향 받는 엔티티 목록
- [ ] before/after JSON Schema 또는 TypeScript 타입
- [ ] 변환 룰 (필드 매핑/디폴트)
- [ ] 영향 받는 derived 산출물 목록
- [ ] verify 단계 (체크 항목)
- [ ] 룰 파일 패치 요약 (`RULE_PATCHES.md`)
- [ ] 롤백 가이드 (가능한 경우)

---

## 5. 마이그레이션 일람

| 버전 | 디렉터리 | 상태 | 주제 |
|---|---|---|---|
| `v0.1-baseline` | `v0.1-baseline/` | **FROZEN 2026-05-09** — 22 schema 파일 + INDEX/RULE_PATCHES/verify 모두 작성됨 | 첫 machine-readable 매니페스트와 OCR/번역/리더/경험 스키마 동결 |
| `v0.2-ocr-pipeline` | `v0.2-ocr-pipeline/` | **FROZEN 2026-05-09** — 12 schema 파일 추가 + INDEX/RULE_PATCHES/verify 작성됨 | OCR 파이프라인 5 layer (PageReview / BlockAccuracyDecision / SecondPassRun / GeminiVisionCandidate / LineAudit) + SourceDocument/SourceRef additive |
| `v0.3-crop-audit` | `v0.3-crop-audit/` | **FROZEN 2026-05-09** — 6 schema 파일 추가 + INDEX/RULE_PATCHES/verify 작성됨 | Gemini advisory layer (GeminiLineAuditSummary/Page, CropAuditApplicationSummary, CorrectionRecheckSummary/Page/ApplicationSummary) + SRC-891~895 페이지 readiness gate |
| `v0.4-vercel-static-hosting` | `v0.4-vercel-static-hosting/` | **DECISION 2026-05-10** — schema transform 없음 | Hosting lock-in을 Vercel Static Hosting으로 변경하고 `public/source-cache/`를 정적 배포 입력으로 포함 |

`v0.1-baseline/schemas/`에 22개, `v0.2-ocr-pipeline/schemas/source/`에 12개, `v0.3-crop-audit/schemas/source/`에 6개 JSON Schema(Draft 2020-12)가 동결되었다 (총 40개). 검증은 `scripts/verify-baseline-schemas.mjs`로 ajv 2020-12 + ajv-formats 기반. 추가 변경은 § 3 Change Classification에 따라 새 디렉터리(`v0.4-{slug}` 또는 major 변경 시 `v1.0-{slug}`)에 생성한다.

---

## 6. 사용자 데이터 (L4) 정책

L4 tier(Bookmark, LastReadPosition, ReaderState)는 이 디렉터리의 마이그레이션 대상이 **아니다**. 다음 별도 정책을 둔다.

- 디바이스 로컬 저장은 forward-compatible 변환을 앱이 직접 수행
- 서버 동기화 시(`reader.bookmark.server_sync` ON) 별도 API 버전으로 처리
- 본문 평문은 서버 저장 금지 (`security_privacy.md` § 4)

---

## 7. RULE_PATCHES 작성 가이드

각 마이그레이션은 `RULE_PATCHES.md`에 다음을 기록한다.

```markdown
# RULE_PATCHES — v{N}-{slug}

## Affected Rules
- `.claude/products/source-archive/rules/manifest.md` § X
- `.claude/products/translation/rules/draft.md` § Y

## Patch Summary
- (한 줄 변경 요약)

## Backward Compat Impact
- (이전 derived 산출물이 어떻게 처리되는지)
```

---

## 8. 참조

- 데이터 모델: `../../rules/data_model.md`
- 출처/무결성: `../../rules/source_integrity.md`
- 매니페스트: `../source_manifest.md`
- 글로벌 룰 인덱스: `../../rules/INDEX.md`
