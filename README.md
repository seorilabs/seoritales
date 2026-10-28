# seoritales.com

Seori Tales 그림책 시리즈의 영어 이야기와 도서 안내 사이트다. SvelteKit과
`adapter-static`으로 빌드하고 GitHub Pages로 공개한다.

## 콘텐츠와 출간 상태

2026-10-28 KDP 조회 기준으로 이야기 9편과 출간된 책 소개 8권, 안내 페이지 3개를
제공한다. 1~7권은 전자책과 종이책이 Live이며, 8권은 종이책만 Live다. 8권 전자책은
Draft이며 9권은 아직 등록되지 않았다. KDP Live와 지역별 실제 구매 가능 여부는
별도로 확인해야 한다. 사이트는 소매 재고나 가격을 단정하는 Offer를 생성하지 않는다.

| 경로                         | 역할                                |
| ---------------------------- | ----------------------------------- |
| `/`                          | 전체 이야기 목록                    |
| `/stories/<slug>/`           | 이야기, 문화 노트와 토론 질문       |
| `/books/<slug>/`             | 출간된 판본 안내와 Amazon 상품 링크 |
| `/for-parents-and-teachers/` | 주제와 읽기 시간별 안내, 토론 질문  |
| `/about/`                    | 제작 방식과 연락처                  |

이야기 페이지는 읽을거리, 책 페이지는 출간된 그림책 정보를 제공한다. 미출간 책의
이야기도 제공하며 책 페이지와 구매 링크는 판형별 Live 상태와 ASIN이 있을 때만 만든다.

## 원본 가져오기

원본은 `Workspace/folktales`의 `books/`와 `pipeline/export_web.py`다.
`src/lib/tales/tales.json`은 생성물이므로 직접 편집하지 않는다.

```bash
python3 ../folktales/pipeline/export_web.py --out /tmp/seoritales-web
cp /tmp/seoritales-web/tales.json src/lib/tales/tales.json
cp -R /tmp/seoritales-web/images/. static/images/
```

이야기가 추가되면 원본 exporter에 원전 제목을 등록하고 사이트의 `teaching.ts`에
주제, 추천 이유, 질문과 관련 이야기를 추가한다. 원본 exporter 변경분은 승인 설계의
`source-export.patch`에 기록했다. 생성 데이터에는 판형별 상태를 담는다.

- `statusEbook`, `asinEbook`: 전자책 출간 상태와 상품 식별자.
- `statusPaperback`, `asinPaperback`, `isbn13Paperback`: 종이책 정보.
- `kdpSelect`: 전문 공개 여부를 판단하는 확인된 등록 상태.

1, 2권의 Select 미등록은 2026-10-27 확인 기록을 반영했다. 날짜만 보고 등록을
해제하지 않는다. 등록 중인 책에는 기존 발췌 모드를 적용한다. 기존 1~4권 전자책의
Amazon Attribution 링크는 보존하며, 그 외 판본은 일반 상품 링크를 사용한다.

## 검색 정보와 검증

사이트의 실제 주요 수정일은 `src/lib/seo/updates.json`에서 페이지별로 관리한다.
출간일이나 빌드 시각을 수정일로 사용하지 않는다. 새 페이지를 추가하거나 본문,
검색 정보, 주요 링크를 바꿀 때 해당 날짜를 함께 수정한다. 여러 페이지를 실제로
같은 날 고쳤다면 날짜가 같아도 된다.

```bash
npm run dev
npm run check
npm run build
npm test
npm run lint
```

`npm run build`는 정적 산출물을 검사하고 회귀 테스트를 실행한다. 검사는 canonical,
제목, 설명, 본문 이미지와 내부 링크, JSON-LD의 판본 정보, 사이트맵의 누락과 실제
수정일을 확인한다. `npm test`는 먼저 생성한 `build/`를 사용한다.

작품의 전자책과 종이책은 `Book.workExample`으로 구분하고, 종이책 ISBN은 해당
판본에만 표기한다. JSON-LD의 판본 정보와 화면에 보이는 Amazon 링크가 일치해야 한다.

## 배포와 승인

`main` 병합 후 기존 `.github/workflows/deploy.yaml`이 GitHub Pages에 배포한다.
코드 변경은 Ready PR과 로컬 코드 리뷰, 필수 검사를 거친다. 공개 후에는 변경 주소와
본문, Amazon 링크, 사이트맵을 다시 읽어 확인한다.

승인 설계와 L1 개발 환경 테스트 계획은 `docs/design/2026-10-28-books-seo/`에 있다.
검색 유입과 순위의 변화는 별도 지표다. 이번 작업에서는 Search Console 지표를
확인하지 않았으며 신규 분석 도구를 추가하지 않는다.
