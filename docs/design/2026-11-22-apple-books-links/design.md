# Apple Books 2–10권 구매 링크 연결

11월 17일에 정한 첫 10권의 구매 안내 범위에서, Apple Books 미국 공개 유료 상품이 확인된 2–10권을 연결한다. 2026-11-22 사용자 승인 후 진행한다. [기존 구매 안내 설계](../2026-11-17-purchase-previews/design.md)의 첫 장면·그림 1장, 기존 Amazon 링크와 Google Play Books 1권 링크를 유지한다. 11권 이후, 미확인 Google 링크, 결제 및 지역 확대는 범위 밖이다.

- 2–10권의 Apple 상품 ID와 공개 가격을 `apple-books-readback.json`에 남긴다. 공개 상품의 표시 상태는 실제 결제나 정산이 아니다. 웹 페이지에 가격을 새로 표시하지 않는다.
- `source-storefront.patch`는 원본 `books/*/book.json` 중 9개 Apple 유통 객체의 변경만 담는다. 원본 상태와 비교한 뒤 `git apply --unidiff-zero`로 격리 복사본에 적용한다. 기존 `../2026-11-17-purchase-previews/source-export.patch`가 필요한 exporter에는 그 패치도 적용한다. 승인 범위인 1–10권만 복사해 생성하며, 미리보기·삽화·원고·Amazon·Google 데이터는 변경하지 않는다.
- 생성 전후 다른 필드가 같고, 책 화면과 JSON-LD가 같은 링크를 가지는지 확인한다. 변경된 9개 책 페이지의 사이트맵 수정일만 갱신하고 정적 검사, 회귀 및 개발 브라우저 테스트를 실행한다.
- 최종 main의 정확한 후보를 중앙 검증에 연결한 뒤 기존 Pages workflow로 공개하고 9개 책과 미리보기 링크를 재확인한다. 문제가 있으면 이 링크 변경만 되돌린다.
