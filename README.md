# seoritales.com

Seori Tales 그림책 시리즈의 마케팅·SEO 사이트. SvelteKit + `adapter-static` 정적 빌드,
GitHub Pages 배포. 구조와 SEO 컴포넌트는 `seorilabs/seorilabs-official`의 패턴을 따른다.

## 왜 있는가

Seori Tales는 아마존 밖에서 검색에 전혀 잡히지 않는다. 미국 학부모·교사는 책 제목이 아니라
`Korean folktales for kids` 같은 **읽을거리**를 검색한다. 그래서 이 사이트의 주력은 상품
소개가 아니라 **이야기 전문 무료 공개**(`/stories/`)다.

## 페이지 (14개)

| 경로                         | 역할                                          |
| ---------------------------- | --------------------------------------------- |
| `/`                          | 시리즈 허브                                   |
| `/stories/<slug>/` × 7       | 이야기 전문 무료 공개. 검색 유입의 주력       |
| `/books/<slug>/` × 7         | 상품 페이지. 구매 링크와 `Book` 구조화 데이터 |
| `/for-parents-and-teachers/` | 주제·길이별 목록과 토론 질문                  |
| `/about/`                    | 제작 방식과 연락처                            |

`/stories/`(읽을거리)와 `/books/`(상품)를 나눈 이유는 검색 의도가 다르기 때문이다.
한 페이지에 섞으면 어느 쪽으로도 명확히 랭킹되지 않는다.

## 콘텐츠는 어디서 오는가

원본은 `Workspace/folktales` 저장소다. 이 레포는 **생성물만** 커밋한다.

```bash
# folktales 저장소에서
python3 pipeline/export_web.py
cp web/tales.json   ../seoritales/src/lib/tales/tales.json
cp -R web/images/*  ../seoritales/static/images/
```

- `src/lib/tales/tales.json` — 7권의 메타데이터와 이야기 전문. **직접 수정하지 않는다.**
- `static/images/<slug>/` — 표지 1장, 미리보기 스프레드 3장, OG 이미지 1장
- `src/lib/tales/teaching.ts` — 이 사이트에서만 쓰는 편집 원고(주제·토론 질문). 유일한 예외

## 명령

```bash
npm run dev      # 개발 서버
npm run check    # svelte-check
npm run build    # 정적 빌드 + postbuild 게이트
npm run lint     # prettier 검사
npm run format   # prettier 적용
```

`npm run build`는 `scripts/check-build.mjs`를 자동 실행한다. prerender 크롤러는 루트 상대
링크만 따라가므로 canonical·og:image·sitemap이 404여도 빌드는 조용히 통과한다. 이 게이트가
그 사각지대를 메운다 — `<html lang>`, canonical, og:image 실존, meta description 길이,
sitemap의 `lastmod` 날짜 형식과 `loc` 실존을 검사한다.

## 배포

`main` push → `.github/workflows/deploy.yaml` → GitHub Pages.
커스텀 도메인은 Settings → Pages에서 지정한다. GitHub Actions 배포이므로 `CNAME` 파일은 두지 않는다.

## KDP Select 와 본문 공개

1·2권은 KDP Select(디지털 독점)에 등록돼 있다. KDP 공식 문구는 "you cannot distribute
your book digitally anywhere else, including on your website" 이므로, 등록 기간에는
본문을 전문 공개할 수 없다.

사이트는 `tales.json` 의 `kdpSelect.enrolled` 를 보고 자동으로 발췌 모드로 내려간다.

- 본문은 1스프레드만 (`EXCERPT_SPREADS`, `src/lib/tales/data.ts`)
- eBook 안에 든 문화 노트와 용어 풀이도 싣지 않는다
- 대신 `teaching.ts` 의 자체 원고(주제·토론 질문)와 복귀 예정일을 보여준다

등록이 끝나면 원본 `book.json` 의 `kdp_select` 를 `false` 로 바꾸고 export 를 다시
돌리는 것만으로 전문이 돌아온다. 코드 수정은 필요 없다.

| 권 | Select | 만료 |
|---|---|---|
| 1 The Sun and the Moon | 등록됨 | 2026-10-04 |
| 2 The Rabbit and the Dragon King | 등록됨 | 2026-10-05 |
| 3 Heungbu and Nolbu | 미등록 | — |
| 4 The Fairy and the Woodcutter | 미등록 | — |

## 아직 남은 것

- **1·2권 KDP Select 자동갱신을 끄지 않으면** 90일이 자동 연장되어 전문 공개가 계속 막힌다.
  마감은 각각 2026-10-04, 2026-10-05.
- `src/lib/site.ts` 의 `amazonAttributionTag` 가 비어 있다. advertising.amazon.com 에
  KDP 계정으로 로그인해 발급받아 채우면 외부 유입 추적과 Brand Referral Bonus 가 적용된다.
  비어 있어도 링크는 정상 동작한다.
- 5~7권(콩쥐팥쥐·금도끼·호랑이와 곶감)은 제작은 끝났지만 아직 업로드되지 않았다.
  이야기 페이지는 있고 상품 페이지는 만들지 않는다. 업로드 후 `book.json` 에 ASIN 을
  적고 export 를 다시 돌리면 상품 페이지가 생긴다.
