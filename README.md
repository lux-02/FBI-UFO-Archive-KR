# FBI UFO OCR + Korean Translation Dataset

FBI Vault에 공개된 UFO 관련 PDF를 대상으로 OCR 추출본과 한국어 번역 검수본을 정리하는 비공식 공개 데이터셋입니다.

이 저장소는 미국 FBI 또는 미국 정부와 무관하며, 어떤 공식 입장이나 결론을 대변하지 않습니다. 원본 PDF는 [FBI Vault](https://vault.fbi.gov/UFO)의 공개 자료입니다. 이 저장소의 OCR/번역 데이터는 원본 문서를 읽고 검토하기 쉽게 만든 파생 데이터이며, 원문에 없는 사실이나 해석을 추가하지 않는 것을 원칙으로 합니다.

This is an unofficial OCR and Korean translation dataset derived from FBI Vault UFO documents. It is not affiliated with the U.S. FBI or the U.S. government.

---

## 공개 범위

| 영역 | 위치 | 상태 |
|---|---|---|
| PDF 출처 매니페스트 | `data/sources.json` | 16개 PDF의 FBI Vault URL, SHA-256, 페이지 수 |
| 공개 OCR/번역 데이터셋 | `dataset/` | Part 01-03 OCR/한국어 번역 export 완료 |
| 원본 PDF | 저장소에 미포함 | FBI Vault에서 직접 확인 |

현재 공개 데이터셋에는 Part 01-03의 OCR 추출 결과와 한국어 번역 결과물이 포함되어 있습니다. Part 04-16은 아직 처리 전입니다.

---

## 현재 상태

| Part | Source PDF | Pages | Korean reviewed units | Approval |
|---:|---|---:|---:|---|
| 01 | `docs/ufo1.pdf` | 69 | 110 | `not_approved` |
| 02 | `docs/ufo2.pdf` | 79 | 722 | `not_approved` |
| 03 | `docs/ufo3.pdf` | 111 | 895 | `not_approved` |

총 1,727개의 한국어 번역 unit이 공개 검토 가능한 상태로 export되어 있습니다.

`reviewed`는 OCR 원문 대조와 한국어 검수를 거친 상태를 뜻합니다. 다만 `not_approved`가 붙은 항목은 최종 승인 번역본이 아니며, 공개 검토와 재사용을 위한 데이터셋 상태입니다.

---

## 데이터 구조

```text
data/
  sources.json                       16개 PDF 출처, 해시, 페이지 수

dataset/
  README.md                          데이터셋 상세 설명
  LICENSE                            데이터셋 라이선스/임시 정책
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
```

각 번역 unit은 part/page/source line 매핑을 보존합니다. OCR이 확정되지 않은 라인은 번역 본문에 섞지 않고 `excluded_source_lines.json`에 따로 남깁니다.

---

## 사용 방법

1. [`dataset/README.md`](dataset/README.md)에서 데이터셋 상태와 규칙을 확인합니다.
2. 각 part의 `manifest.json`에서 원본 PDF 해시, 페이지 수, 번역 export 상태를 확인합니다.
3. OCR 원문은 `dataset/part-XX/pages/page_NNNN.{txt,json}`에서 확인합니다.
4. 한국어 번역은 `dataset/part-XX/translations/ko/`에서 확인합니다.
5. 원본 이미지는 [FBI Vault UFO](https://vault.fbi.gov/UFO)에서 PDF를 직접 열어 대조합니다.

원본 PDF를 내려받아 로컬에서 검증하려면 `data/sources.json`의 URL과 SHA-256 값을 기준으로 확인하세요.

```sh
shasum -a 256 docs/ufo1.pdf
shasum -a 256 docs/ufo2.pdf
shasum -a 256 docs/ufo3.pdf
```

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

| 영역 | 라이선스/정책 |
|---|---|
| 공개 데이터셋 (`dataset/`) | [`dataset/LICENSE`](dataset/LICENSE) 참조 |
| 한국어 번역 export | `dataset/` 공개 정책과 동일하게 적용, 최종 라이선스 검토 중 |
| 원본 PDF | 본 저장소가 저작권/공개 상태를 단정하지 않음 |

원본 PDF는 이 저장소에 포함하지 않습니다. 원본 문서의 이용 조건은 FBI Vault 및 관련 법적 조건을 별도로 확인해야 합니다.

---

## 인용

```text
FBI-UFO-Archive-KR Project. (2026). FBI UFO OCR + Korean Translation Dataset.
Source: FBI Vault UFO documents (https://vault.fbi.gov/UFO).
```
