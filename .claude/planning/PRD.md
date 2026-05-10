# PRD — FBI-UFO-Archive-KR

> 버전: v0.1 (Approved 2026-05-09)
> 작성일: 2026-05-09
> 승인 기록: § 10
> 다음 갱신 트리거: Pilot 1개 part end-to-end 완료 또는 스택 락인 변경

---

## 1. Objective

FBI Vault UFO PDF 16개를 한국어 독자가 이북처럼 읽고, 원본 스캔과 대조하며, 사건/날짜/기관/키워드로 탐색할 수 있는 웹앱을 만든다.

성공은 "한국어 번역이 자연스럽고, 원본 출처가 신뢰 가능하게 연결되며, UFO 콘셉트가 기능과 잘 맞물린다"로 정의한다.

---

## 2. Audience

| 사용자 | 목적 |
|---|---|
| 일반 독자 | UFO 관련 FBI 자료를 한국어로 흥미롭게 읽고 싶음 |
| 기록물/역사 관심자 | 원본 스캔과 번역을 대조하며 맥락을 확인하고 싶음 |
| 콘텐츠 제작자 | 문서별 주요 내용과 출처 page를 빠르게 찾고 싶음 |
| 번역/검수자 | OCR/번역 상태를 점검하고 품질을 올리고 싶음 |

---

## 3. Core Value Proposition

기존 PDF 묶음은 접근성이 낮다. 이 앱은 16개 스캔 PDF를 다음 형태로 바꾼다.

- 한국어 이북 독서 경험
- 원본 스캔과 번역 병렬 대조
- page-level citation
- 검색/태그/타임라인 탐색
- UFO 콘셉트가 살아 있는 아카이브 UI

---

## 4. MVP Scope

MVP에 포함:

- 16개 PDF manifest
- 1개 part end-to-end pilot: OCR -> 번역 -> 검수 -> reader
- Archive shelf
- Volume reader
- Parallel original/translation view
- Source badges
- Glossary baseline
- Basic search over approved content
- Visual system v0.1

MVP에서 제외:

- 계정/로그인
- 커뮤니티 댓글
- 결제
- 전체 자동 번역 무검수 공개
- 공식 FBI 제휴처럼 보이는 브랜딩
- UFO 진위 결론 제시

---

## 5. Key Features

### 5.1 Archive Shelf

16개 part를 파일/볼륨처럼 보여준다.

Acceptance:

- 각 part의 page count와 translation progress 표시
- part 클릭 시 reader 진입
- 공식 출처 링크 제공

### 5.2 Korean Reader

한국어 번역을 읽는 기본 화면.

Acceptance:

- body text가 긴 독서에 적합
- source badge 표시
- page 이동 가능
- font size/theme 설정 가능

### 5.3 Parallel View

원본 스캔과 한국어 번역을 대조한다.

Acceptance:

- 번역 블록에서 원본 page 열기
- 모바일은 toggle/tab
- scan loading state 제공

### 5.4 Search

한국어/영어 키워드로 승인된 콘텐츠를 찾는다.

Acceptance:

- 결과마다 part/page 표시
- source 없는 결과는 노출하지 않음
- 원문/번역 필터 가능 여부는 Phase 1에서 결정

### 5.5 Glossary and Notes

용어와 번역 주석을 제공한다.

Acceptance:

- 용어 클릭/hover로 설명 표시
- 주석은 본문과 구분
- 원문 불확실성 표기

---

## 6. Non-Functional Requirements

- 1,616페이지 전체를 한 번에 로드하지 않는다.
- 모바일에서 독서가 가능해야 한다.
- source manifest 검증 실패 시 빌드/콘텐츠 검증이 실패해야 한다.
- 공개 카피는 검증되지 않은 공개일/법적 상태를 단정하지 않는다.
- 원본 PDF/번역/요약의 관계가 audit 가능해야 한다.

---

## 7. Success Criteria

- Part 01 pilot이 원본 PDF page와 한국어 번역을 왕복 연결한다.
- 검수된 번역 단위만 공개 리더에 노출된다.
- 사용자 테스트에서 첫 화면에서 10초 안에 읽기 시작할 수 있다.
- 검색 결과 100%가 source ref를 가진다.
- build/typecheck/lint/content verify 명령이 정의되고 통과한다.

---

## 8. Resolved & Open Decisions

### 8.1 Resolved (락인 2026-05-09)

| 결정 | 값 | 출처 |
|---|---|---|
| Web framework | Astro | `.claude/CLAUDE.md` § 6 |
| Styling | Tailwind v4 + CSS variables | `.claude/CLAUDE.md` § 6 |
| PDF render | 하이브리드(빌드 WebP/AVIF + pdf.js for FACSIMILE) | `.claude/CLAUDE.md` § 6 |
| OCR engine | Tesseract local 기본 + Textract block-level 옵션 | `.claude/CLAUDE.md` § 6 |
| Search | Pagefind 메인 + MiniSearch (admin) | `.claude/CLAUDE.md` § 6 |
| Content storage | JSON (Schema 검증) + MDX (요약/노트) | `.claude/CLAUDE.md` § 6 |
| Hosting | Vercel Static Hosting | `.claude/CLAUDE.md` § 6 |
| Package manager | pnpm | `.claude/CLAUDE.md` § 6 |
| AI 번역 사용 정책 | feature flag 기반(`translation.ai.*`), 기본 OFF, 사용 시 메타 추적 의무 | `products/translation/rules/draft.md` TRN-110 |
| 검수 워크플로 | 2인 원칙(`translation.review.require_two_person = ON`), DRAFT→REVIEWED→APPROVED 일방향 | `products/translation/rules/review.md` TRN-200~280 |
| 공개 노출 정책 | 기본 `APPROVED`만, 토글로 REVIEWED 노출 가능 | `products/translation/rules/feature_flags.md` |

### 8.2 Open (Phase 1 진입 전 결정 필요)

- **번역 공개 단위**: part 단위 공개 vs page/section progressive release
  - 권장(잠정): part 단위 공개 (탐색성과 검수 부담의 균형)
  - 결정 트리거: Pilot 1개 part 완료 후 검수 부담 측정
- **공개 도메인/저작권 고지 문구**: 푸터 한국어 카피 확정
  - 권장(잠정): "이 프로젝트는 미국 FBI 또는 미국 정부와 무관한 한국어 아카이브 프로젝트입니다. 원본 PDF는 FBI Vault 공개 자료를 기반으로 합니다." (EXP-060 정합)
  - 결정 트리거: 법적 자문 또는 공식 출처 라이선스 재확인
- **AI 모델 제공자/모델**: `translation.ai.*` ON 시점에 결정
- **분석 옵트인 도구**: Plausible/Umami/자체 중 선택 (Phase 1 후반)

---

## 9. Out of Bounds

- 자료 조작 또는 결론 조작
- 공식 FBI 앱/제휴로 오인될 UI
- 검수 없는 대량 공개
- 계정 기반 커뮤니티 기능
- "외계인 증거" 같은 단정형 마케팅
- PDF 원본의 외부 모델 일괄 업로드 (`security_privacy.md` § 3, SRC-160)
- 본문 평문의 외부 분석 서비스 전송 (`security_privacy.md` § 4, RDR-360)

---

## 10. Sign-off — v0.1 Approved (2026-05-09)

본 PRD v0.1는 다음 조건이 모두 충족되어 승인된다.

- [x] 16개 PDF가 `docs/`에 존재 (Phase 0 검증 명령 통과 가정)
- [x] 모듈 정체성과 책임이 4개 모듈 CLAUDE.md/rules/INDEX에 정합
- [x] 스택 락인 7항목 완료 (`.claude/CLAUDE.md` § 6, § 9)
- [x] 글로벌 룰 7개 + 모듈 룰 27개가 충돌 없음 (`v0.1-baseline/RULE_PATCHES.md` § 3 정합성 점검 완료)
- [x] AI 사용/검수/공개 정책이 명시됨 (§ 8.1)
- [x] Out of Bounds가 보안/개인정보 룰과 정합 (§ 9)

### 10.1 잔여 의존 작업 (Phase 1 진입 전)

§ 8.2 Open Decisions + 다음.

- OCR pilot 20페이지 정확도 측정 (`.claude/research/OCR_PILOT_*` 작성)
- 용어집 v0.1 승인
- Reader IA 와이어프레임 확정
- Astro 스캐폴딩 PoC 1회 통과
- v0.1-baseline 스키마 동결

### 10.2 변경 절차

PRD를 v0.2로 올리려면 다음 중 하나가 트리거다.

- MVP 범위(§ 4) 변경
- 락인된 스택 항목(§ 8.1) 중 어느 것이라도 교체
- 새 모듈 추가 또는 기존 모듈 책임 재할당
- Out of Bounds(§ 9)에 신규 항목 추가/삭제

변경 시 `.claude/CLAUDE.md`, 모듈 CLAUDE.md, 영향 받는 룰을 함께 갱신.
