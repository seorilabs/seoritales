# Apple Books 2–10권 링크 검증

- 기존 main에서 Apple Books 2권 링크가 없는 것을 새 회귀 검사로 먼저 확인했다. 나머지 기존 결과는 15건 통과다.
- 수정한 9개 Apple 유통 객체로 기존 exporter를 재실행했다. 10권의 생성 JSON을 기존 main과 대조하니 2–10권 `storeLinks` 외 필드는 모두 같다. 원본 패치를 별도 복사본에 재적용한 9개 파일도 바이트가 같다. 원고와 이미지는 바꾸지 않았다.
- `npm run check` 오류·경고 0건, `npm run lint` 통과, `npm run build`의 정적 페이지 23개와 회귀 16건 통과. 정적 결과에서 Apple 10권, Google 1권, 기존 Amazon 링크, 첫 장면과 삽화 1장 및 사이트맵을 확인했다.
- 브라우저 실행: 이 Mac 세션의 기본 Playwright 브라우저 버전이 없고, 설치된 Chromium은 macOS Mach 포트 등록 권한 오류로 시작하지 못했다. 브라우저 검수 통과로 기록하지 않는다. 실제 구매·정산·지역 가용성은 확인 범위 밖이다.
