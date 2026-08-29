# 차를 쓰다 (CHAGEUL) - 완전 자동 고품질 SEO 콘텐츠 작성 및 발행 영구 표준 가이드

## 1. 단일 마스터 엔진 강제 사용 철칙 (Zero Hand-Coding & Zero Ad-hoc Scripts)
모든 새 글은 오직 `tools/publish_article.py`의 `publish_post(...)` 함수 단 1회 호출로 다음 6대 작업이 100% 기계적으로 동시 완결되어야 함:
1. `templates/master_template.html` 기반 본문 HTML 생성 (목차, 비교분석표, 체크리스트, FAQ 5선, 출처박스, 추천칼럼)
2. `js/features.js` 데이터 레지스트리 안전 갱신 (실행 JS 랭킹 로직은 절대 건드리지 않음)
3. `index.html` 상단 에디터픽 보존 + 하단 3열 그리드 1번에 새 글 안착 + 날짜 옆에만 `(최신)` 부착 (제목 삽입 절대 금지) + 이전 글 `(최신)` 전수 삭제
4. `sitemap.xml` 및 `rss.xml` 자동 갱신
5. 구글 공식 Indexing API 자동 호출 (`200 OK`)
6. 글로벌 IndexNow API 자동 호출 (`200 OK`)

## 2. 랭킹 및 UI 실시간 자동화 철칙
1. PC 메인 인기글 TOP 10 (`#mainHeroPopularList`), 모바일 TOP 5 (`#mobilePopularTop5List`), 본문 우측 사이드바 TOP 10 (`.popular-list`)은 `features.js`가 조회수+가중치를 계산하여 100% 실시간으로 자동 렌더링함.
2. 새 글 작성 시 `features.js`, `style.css` 등 실행 소스코드는 1줄도 임의 수정하지 않음.

## 3. 사전 검수 및 절대 임의 발행 금지 철칙
1. 글 작성이 완료되면 로컬 컴퓨터에서 완벽한 상태(2열 레이아웃, 1번 최신 뱃지, 사이드바 TOP 10)를 먼저 확인하고 사용자에게 브리핑함.
2. 사용자의 명시적인 '발행해줘' / '배포해줘' 승인 전에는 `upload.ps1`을 절대 가동하지 않음.
