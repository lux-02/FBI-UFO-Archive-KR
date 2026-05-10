# v0.4 — Vercel Static Hosting Decision

> 상태: DECISION
> 결정일: 2026-05-10
> 영향: deployment harness / git packaging

---

## 1. Intent

Hosting lock-in을 Cloudflare Pages에서 Vercel Static Hosting으로 변경한다.

앱은 Astro `output: "static"`으로 `dist/`를 생성한다. 리더 페이지의 스캔 이미지는 빌드 시 생성되는 runtime asset이 아니라, 커밋된 `public/source-cache/{sha256}/page_NNNN.reader.webp` 정적 파일을 직접 참조한다.

---

## 2. Content Schema Impact

콘텐츠 스키마 변경 없음.

`data/sources.json`, `dataset/`, 번역 단위, OCR line mapping 구조는 유지한다. 변경 범위는 배포 입력 파일의 git 포함 정책과 Hosting 결정 문구다.

---

## 3. Deploy Inputs

Vercel 정적 배포에 필요한 최소 입력:

- `package.json`
- `pnpm-lock.yaml`
- `astro.config.mjs`
- `tsconfig.json`
- `src/`
- `dataset/`
- `data/sources.json`
- `public/favicon.svg`
- `public/source-cache/`

운영 파이프라인 입력과 원본 PDF는 계속 배포 입력에서 제외한다.

- `docs/*.pdf`
- `data/ocr/`
- `data/translations/`
- OCR/translation pipeline scripts
- `.env*`

---

## 4. Rollback

Cloudflare Pages로 되돌릴 경우:

1. `.claude/CLAUDE.md` § 6, § 10의 Hosting 값을 갱신한다.
2. `.claude/rules/implementation_boundaries.md` § 2의 Hosting 값을 갱신한다.
3. `.gitignore`에서 정적 배포 입력 포함 정책이 해당 hosting의 배포 방식과 맞는지 다시 확인한다.
4. `pnpm build`와 주요 reader page 브라우저 확인을 다시 수행한다.
