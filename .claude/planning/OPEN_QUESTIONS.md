# Open Questions

> 버전: v0.1

---

## Product

1. 첫 공개는 Part 01 전체인가, 아니면 대표 샘플/큐레이션인가?
2. 전체 16개 번역 완료 전에도 progressive release를 허용할 것인가?
3. 독자에게 AI 사용 여부를 공개 UI에서 어떻게 설명할 것인가?
4. "어제 공개" 주장의 공식 근거를 어디서 확인할 것인가?

## Content

1. OCR 도구는 로컬 우선인가, 외부 API 허용인가?
2. 판독 불가/검열 구간의 한국어 표기 규칙을 어느 정도로 상세화할 것인가?
3. 요약과 번역을 같은 화면에 둘 것인가, 별도 탭으로 분리할 것인가?
4. 고유명사 영문 병기 기준은 무엇인가?

## UX

1. 모바일에서 원본 스캔을 어떤 방식으로 보여줄 것인가?
2. timeline/signal map은 MVP에 포함할 것인가?
3. 북마크를 로컬 저장으로 시작할 것인가?
4. 검색은 승인된 번역만 대상으로 할 것인가, OCR 원문도 포함할 것인가?

## Engineering

1. Next.js/React/Vite 중 무엇을 사용할 것인가?
2. PDF는 브라우저에서 렌더링할 것인가, 사전 이미지화할 것인가?
3. 콘텐츠는 JSON/MDX/SQLite 중 무엇으로 관리할 것인가?
4. ~~배포 타깃은 어디인가?~~ → Vercel Static Hosting. Astro 정적 빌드(`dist/`)와 커밋된 `public/source-cache/` reader 이미지를 배포한다.
5. content verification을 CI에 포함할 것인가?
