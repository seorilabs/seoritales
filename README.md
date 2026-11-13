# seoritales.com

Seori Tales 그림책 시리즈의 영어 이야기와 도서 안내 사이트다. SvelteKit과
`adapter-static`으로 빌드하고 GitHub Pages로 공개한다.

## 콘텐츠와 출간 상태

10편의 이야기와 출간 판본 안내를 제공한다. 『The Sun and the Moon』은 Apple·Google 판매 파일럿을 위해 첫 장면만 공개한다. 후속 9권은 양쪽 파일럿 완료 뒤 순서대로 전환한다. KDP Live와 지역별 실제 구매 가능 상태는 별도로 확인한다. 사이트는 검증되지 않은 가격·재고 Offer를 생성하지 않는다.

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
`source-export.patch`에 기록했다. 2026-11-10 원본 매핑과 판본 상태 갱신은 `docs/design/2026-11-10-catalog-update/source-export.patch`에 기록했다. 원본 또는 격리 복사본에 `git apply --unidiff-zero`로 패치를 적용한 뒤 내보낸다. 생성 데이터에는 판형별 상태를 담는다.

- `statusEbook`, `asinEbook`: 전자책 출간 상태와 상품 식별자.
- `statusPaperback`, `asinPaperback`, `isbn13Paperback`: 종이책 정보.
- `kdpSelect`: 확인된 독점 등록 상태. 등록 중이면 exporter가 첫 장면만 내보낸다.
- `webPublication.mode`: 원본 `meta.web_publication.mode`에서 생성한 `full` 또는 `preview`. Select 해제만으로 `preview`가 전문으로 바뀌지 않는다.
- `storeLinks`: 권별 원장의 `buyable`, `purchase_verified: true`, 확인 시각, 공식 상품 URL이 모두 확인된 Apple·Google 링크만 포함한다.
- `readAloudMinutes`: 미리보기 제한 전 전체 원본의 읽기 시간.

2026-11-13 공개 정책 변경은 `docs/design/2026-11-13-wide-preview/source-export.patch`에 기록했다. 이전 원본 패치를 먼저 적용한 상태에서 새 패치를 적용한다. 생성 뒤 사이트 이미지 폴더에도 비공개로 바뀐 삽화가 남지 않게 삭제한다. 출판 EPUB과 표지는 다시 만들지 않는다.

1~~9권은 2026-11-10 Bookshelf에서 Select 등록 표시가 없었다. 10권은 전체 제목 목록에 없었다. 날짜만 보고 등록을
해제하지 않는다. 등록 중인 책에는 exporter에서 발췌 모드를 적용한다. 기존 1~~4권 전자책의
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

`main` 병합은 공개 배포를 시작하지 않는다. 최종 main SHA의 개발 근거를 등록하고 중앙 `before-deploy` 검증을 통과한 뒤 `.github/workflows/deploy.yaml`을 명시적으로 실행해 GitHub Pages에 배포한다.
코드 변경은 Ready PR과 로컬 코드 리뷰, 필수 검사를 거친다. 공개 후에는 변경 주소와
본문, Amazon 링크, 사이트맵을 다시 읽어 확인한다.

승인 설계와 L1 개발 환경 테스트 계획은 `docs/design/2026-10-28-books-seo/`에 있다.
검색 유입과 순위의 변화는 별도 지표다. 이번 작업에서는 Search Console 지표를
확인하지 않았으며 신규 분석 도구를 추가하지 않는다.
