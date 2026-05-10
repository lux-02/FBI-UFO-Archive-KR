# RULE_PATCHES — v0.1-baseline

> **상위**: `./INDEX.md`
> **유형**: baseline (스키마 변경 패치 없음)

---

## 1. Schema Patches

baseline이므로 **이전 스키마가 없다**. 패치 대상이 없다.

---

## 2. Co-occurring Stack Lock-in (2026-05-09)

baseline 동결 작업과 함께 다음 룰/하네스 파일이 갱신되었다 (스키마 패치는 아니지만 같은 락인 시점에 발생했으므로 추적 목적으로 기록).

| 파일 | 변경 |
|---|---|
| `.claude/CLAUDE.md` | § 4 Common Commands를 pnpm/Astro 기준으로 교체. § 6 "Recommended Stack Direction"을 "Confirmed Stack"으로 교체. § 8 Phase Gate에 락인 항목 체크. § 9 Stack Decision Track을 락인 결과로 교체 + 변경 절차 § 9.1, 재평가 항목 § 9.2 추가. |
| `.claude/rules/implementation_boundaries.md` | § 1 Current State에 "스택은 v0.1로 확정" 명시. § 2 "Default Technical Direction"을 "Confirmed Stack (v0.1, 2026-05-09)" 표로 교체 + 결정 동결 범위 명시. § 4 Commands에 pnpm/Astro 명령 추가, Phase 0 검증 명령은 § 4.1로 보존. |

---

## 3. Affected Module Rules (정합성 확인 결과)

스택 락인이 영향 줄 수 있는 모듈 룰을 점검했고, 다음과 같은 정합성을 확인했다.

| 모듈 룰 | 락인된 스택과의 정합성 | 비고 |
|---|---|---|
| `source-archive/rules/page_image.md` SRC-400~470 | ✅ 일치 | 빌드 시 WebP/AVIF + lazy SOURCE_FULL은 하이브리드 결정과 정합 |
| `source-archive/rules/ocr.md` SRC-150~160 | ✅ 일치 | engine 메타 + 외부 일괄 업로드 금지 룰이 Tesseract 기본 + Textract block-level과 정합 |
| `translation/rules/draft.md` TRN-110~140 | ✅ 일치 | aiAssist 메타 + 입력 범위 제한이 어느 모델 제공자와도 호환 |
| `reader/rules/search.md` RDR-100~190 | ✅ 일치 | Pagefind의 chunked index가 RDR-110 빌드 트리거와 정합 |
| `reader/rules/parallel_view.md` RDR-200~290 | ✅ 일치 | 하이브리드 PDF render가 RDR-220 variant와 정합 |
| `reader/rules/feature_flags.md` `reader.facsimile_pdf_native` | ✅ 일치 | pdf.js for FACSIMILE 결정과 정합 |
| `experience/rules/palette.md` EXP-200~290 | ✅ 일치 | Tailwind + CSS variables가 토큰 단일 출처 룰과 정합 |
| `experience/rules/feature_flags.md` | ✅ 일치 | 모바일/reduced-motion 자동 OFF 룰이 Astro Islands와 충돌 없음 |
| `rules/data_model.md` § 3, § 12 | ✅ 일치 | JSON Schema 권위 + Astro Content Collections + Zod의 3중 표현 |
| `rules/security_privacy.md` § 3, § 4 | ✅ 일치 | Vercel 정적 배포는 빌드 산출물 외 사용자 데이터 저장을 요구하지 않음 |

별도 패치가 필요한 룰은 없다.

---

## 4. Backward Compat Impact

baseline이므로 backward compat 대상이 없다. 첫 schema 동결은 zero-state에서 시작.

---

## 5. Forward Compat Note

이 baseline 다음의 마이그레이션은 다음 형식으로 RULE_PATCHES를 작성한다.

```markdown
# RULE_PATCHES — v{N}-{slug}

## 1. Affected Rules
- `<rule-path>` § X — (변경 한 줄)

## 2. Patch Summary
- (어떤 ID/필드가 어떻게 바뀌는지)

## 3. Backward Compat Impact
- (이전 derived 산출물이 어떻게 처리되는지)

## 4. Verification
- (variant verify.md 의 항목)
```

---

## 6. References

- `./INDEX.md`
- `../INDEX.md` § 7 RULE_PATCHES 작성 가이드
- `.claude/CLAUDE.md` § 9 변경 절차
