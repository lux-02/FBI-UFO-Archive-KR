# RULE_PATCHES — v0.4-vercel-static-hosting

## Affected Rules

- `.claude/CLAUDE.md` § 6, § 10
- `.claude/rules/implementation_boundaries.md` § 2
- `.claude/planning/PRD.md` § 8
- `.claude/planning/OPEN_QUESTIONS.md` Engineering
- `.gitignore`

## Patch Summary

- Hosting lock-in을 Vercel Static Hosting으로 변경.
- Astro 앱 소스와 `public/source-cache/` reader WebP assets를 정적 배포 입력으로 포함.
- 원본 PDF, OCR working data, translation working data, secrets는 계속 git/deploy 제외.

## Backward Compat Impact

콘텐츠 스키마 변경 없음. 기존 `dataset/`과 `public/source-cache/{sha256}` URL 구조를 유지하므로 reader route 호환성은 유지된다.
