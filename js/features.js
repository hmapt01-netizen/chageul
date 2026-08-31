﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿/**
 * 🚗 차를 쓰다 (CHAGEUL) 통합 기능 & 실시간 라이브 검색 및 인기글 TOP 10 랭킹 엔진
 */

var ABACUS_BASE = window.ABACUS_BASE || "https://abacus.jasoncameron.dev";
var ABACUS_NS = window.ABACUS_NS || "chageul_auto";

// 📚 차를 쓰다 94대 칼럼 공식 레지스트리
const CHAGEUL_POSTS_REGISTRY = [
    {
        slug: "lifestyle-car-buying-guide-2026.html",
        slugKey: "lifestyle_car_buying_guide_2026",
        title: "2026 신차 구매 가이드: 나에게 맞는 차급 선택과",
        fullTitle: "2026 신차 구매 가이드: 나에게 맞는 차급 선택과 하이브리드·전기차 실구매가",
        thumb: "images/posts/lifestyle-car-buying-guide-2026/thumb.jpg",
        cat: "포커스",
        baseWeight: 150
    },
    {
        slug: "2026-avante-price-hike-korean-compact-car-market.html",
        slugKey: "2026-avante-price-hike-korean-compact-car-market",
        title: "“국민 첫차의 배신?” 2026 아반떼 풀옵션 4,20",
        fullTitle: "“국민 첫차의 배신?” 2026 아반떼 풀옵션 4,200만원 돌파 실체와 국산 엔트리카의 종말, 쏘나타·수입차·BYD 셈법",
        thumb: "images/posts/2026-avante-price-surge-korean-car-market/thumb.jpg",
        cat: "포커스",
        baseWeight: 150
    },
    {
        slug: "2026-lexus-es-fullchange-ev-specs-price.html",
        slugKey: "2026-lexus-es-fullchange-ev-specs-price",
        title: "“하이브리드 장인마저 전기차로?” 2026 8세대 렉서",
        fullTitle: "“하이브리드 장인마저 전기차로?” 2026 8세대 렉서스 ES 풀체인지, 5,140mm K9급 차체와 478km 항속 실출고가 실체",
        thumb: "images/posts/2026-lexus-es-fullchange-ev/thumb.jpg",
        cat: "신차소식",
        baseWeight: 150
    },
    {
        slug: "2026-toyota-rav4-hybrid-e-four-specs-price.html",
        slugKey: "2026-toyota-rav4-hybrid-e-four-specs-price",
        title: "2026 토요타 라브4 하이브리드 E-Four, 5,8",
        fullTitle: "2026 토요타 라브4 하이브리드 E-Four, 5,820만 원 출고액과 실연비 20km/L 제원 유지비 실체",
        thumb: "images/posts/2026-toyota-rav4-hybrid/thumb.jpg",
        cat: "신차소식",
        baseWeight: 150
    },
    {
        slug: "used-ev-maintenance-cost.html",
        slugKey: "used-ev-maintenance-cost",
        title: "중고 전기차 5년 타면 정말 1,400만원 아낄까? 아",
        fullTitle: "중고 전기차 5년 타면 정말 1,400만원 아낄까? 아이오닉5·EV6 유지비 비교",
        thumb: "https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2F0DbP4%2FdJMcahyBbPp%2FAAAAAAAAAAAAAAAAAAAAABEASfsT1Ah5DbzM7TTFXv5aIBtRk42iXZkYxBV6n3tn%2Fimg.jpg%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1788188399%26allow_ip%3D%26allow_referer%3D%26signature%3DMOVRcWGoJQ7wQT9jY6SAWDvU15w%253D",
        cat: "포커스",
        baseWeight: 150
    },
    {
        slug: "benz-gla-ev-price-specs-residual-value.html",
        slugKey: "benz-gla-ev-price-specs-residual-value",
        title: "\"전장 14cm 키우고 800V 올렸다!\" 2026 풀",
        fullTitle: "\"전장 14cm 키우고 800V 올렸다!\" 2026 풀체인지 벤츠 GLA 전기차 5년 잔존가치와 실출고가 셈법",
        thumb: "https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2Fna7TL%2FdJMcaaM0Zsp%2FAAAAAAAAAAAAAAAAAAAAAHM8VosoPyQZsfISdgbQXetpd7r5SInOkk-3yqDhlAEO%2Fimg.jpg%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1788188399%26allow_ip%3D%26allow_referer%3D%26signature%3D5YWoyI5kPYWL2j4qZCFtKqEhDcE%253D",
        cat: "신차소식",
        baseWeight: 150
    },
    {
        slug: "genesis-gv60-magma-track-taxi-price-specs.html",
        slugKey: "genesis-gv60-magma-track-taxi-price-specs",
        title: "\"제네시스 택시 나온다?\" 2026 신형 GV60 마그",
        fullTitle: "\"제네시스 택시 나온다?\" 2026 신형 GV60 마그마 실구매가 연비표 제원 총정리 '트랙 택시 1회 체험' 과연 타볼 만할까?\"",
        thumb: "https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2Fdfl39k%2FdJMcab6ciPU%2FAAAAAAAAAAAAAAAAAAAAAEAXk3yi4AL3udxD_9cHXPIJG7sKzH1hKnrtiRmExUXO%2Fimg.jpg%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1788188399%26allow_ip%3D%26allow_referer%3D%26signature%3D592CA0SzYErSRlGdB9zzCJl0JUs%253D",
        cat: "신차소식",
        baseWeight: 150
    },
    {
        slug: "2027-renault-espace-e-tech-hybrid-review.html",
        slugKey: "2027-renault-espace-e-tech-hybrid-review",
        title: "\"리터당 26km 실화일까?\" 2027 르노 에스파스 ",
        fullTitle: "\"리터당 26km 실화일까?\" 2027 르노 에스파스 E-Tech 하이브리드 공개, 7인승 패밀리 SUV 시장의 격돌과 가치 분석\"",
        thumb: "https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FZXGoD%2FdJMcaf8u1RJ%2FAAAAAAAAAAAAAAAAAAAAAB86KZnaLzS7MDc5TaEDBV5M_tk5q1QnQO4TFg0EiKYl%2Fimg.jpg%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1788188399%26allow_ip%3D%26allow_referer%3D%26signature%3DnpT1vi2RoEeEy11a0j2MURnhSFY%253D",
        cat: "신차소식",
        baseWeight: 150
    },
    {
        slug: "volvo-es90-ev-sedan-price-specs.html",
        slugKey: "volvo-es90-ev-sedan-price-specs",
        title: "\"해외보다 5천만 원 싸다?\" 2026 볼보 ES90 ",
        fullTitle: "\"해외보다 5천만 원 싸다?\" 2026 볼보 ES90 전기 세단 공개, 106kWh 배터리와 중국 생산 관세 파장의 실체 분석",
        thumb: "https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2Fbx9kAI%2FdJMcafgtGxW%2FAAAAAAAAAAAAAAAAAAAAABiSHQQ68pUAFb3ZCrsapVEhGiDJnx-pAg01T1UpQmia%2Fimg.jpg%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1788188399%26allow_ip%3D%26allow_referer%3D%26signature%3Dd8F5rgQcoO%252F5GSpKXp6A%252BTp3Tfs%253D",
        cat: "신차소식",
        baseWeight: 150
    },
    {
        slug: "2026-hyundai-ioniq9-specs-price-ev9-comparison.html",
        slugKey: "2026-hyundai-ioniq9-specs-price-ev9-comparison",
        title: "\"장의차 조롱을 넘어섰다?\" 2026 현대 아이오닉9의",
        fullTitle: "\"장의차 조롱을 넘어섰다?\" 2026 현대 아이오닉9의 EV9 5배 역전 독주, 대형 전기 SUV 시장의 공간 가치와 패밀리카 실용주의 분석",
        thumb: "https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FIHyEk%2FdJMcabZspTX%2FAAAAAAAAAAAAAAAAAAAAADAlm_kE1UFd3rYITLPZO2gMT1P7IVyMRu860tAv1tLC%2Fimg.jpg%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1788188399%26allow_ip%3D%26allow_referer%3D%26signature%3D7eQo%252FSVcSgCHsbi4y%252BzEafg9CfA%253D",
        cat: "신차소식",
        baseWeight: 150
    },
    {
        slug: "2027-kgm-torres-aisin-8at-facelift.html",
        slugKey: "2027-kgm-torres-aisin-8at-facelift",
        title: "\"투싼·스포티지 잡으러 왔다?\" 2027 KGM 뉴 토",
        fullTitle: "\"투싼·스포티지 잡으러 왔다?\" 2027 KGM 뉴 토레스 아이신 8단 변속기 탑재, 준중형 SUV 시장의 실속 가치 분석",
        thumb: "https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FHgnum%2FdJMcaa0sTMq%2FAAAAAAAAAAAAAAAAAAAAAINXrq9_giGpQXMd6JAonHTXVpsyD1lA9sF2sFh2WrNX%2Fimg.jpg%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1788188399%26allow_ip%3D%26allow_referer%3D%26signature%3DLSomSRe55lNS5oGb3FFyy5oVayE%253D",
        cat: "신차소식",
        baseWeight: 150
    },
    {
        slug: "xiaomi-su7-yu7-korea-launch-2028.html",
        slugKey: "xiaomi-su7-yu7-korea-launch-2028",
        title: "\"690마력이 5천만 원대?\" 2028 샤오미 SU7·",
        fullTitle: "\"690마력이 5천만 원대?\" 2028 샤오미 SU7·YU7 한국 진출 선언, 수입 전기차 시장의 파격과 영향 분석",
        thumb: "https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FMKsVU%2FdJMcagfjddu%2FAAAAAAAAAAAAAAAAAAAAAMgF0DBQH_w0nhfELPQv1txKTMPkF3WmR6lVtvz9AgMh%2Fimg.jpg%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1788188399%26allow_ip%3D%26allow_referer%3D%26signature%3DEsmpR4QnAQzvss3mBcwC0p2hqCw%253D",
        cat: "신차소식",
        baseWeight: 150
    },
    {
        slug: "bmw-7-series-black-trim-2026.html",
        slugKey: "bmw-7-series-black-trim-2026",
        title: "\"벤츠 S클래스 꺾을까?\" 2026 BMW 7시리즈 블",
        fullTitle: "\"벤츠 S클래스 꺾을까?\" 2026 BMW 7시리즈 블랙 트림 & M 스포츠 프로 공개, 수입 플래그십 시장의 지각변동과 가치 분석",
        thumb: "https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2Fbb0iWy%2FdJMcaccTmiO%2FAAAAAAAAAAAAAAAAAAAAAJe0t9OPQfibr4oY5IfgeJBnRAz_Bh56qdIIh0gI6UNq%2Fimg.jpg%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1788188399%26allow_ip%3D%26allow_referer%3D%26signature%3DGdsB4aINaCciUxclxZwHIc0p4yg%253D",
        cat: "신차소식",
        baseWeight: 150
    },
    {
        slug: "2027-hyundai-casper-ev-delivery-delay.html",
        slugKey: "2027-hyundai-casper-ev-delivery-delay",
        title: "\"아들 전역이 더 빠르겠다?\" 2027 현대 캐스퍼 일",
        fullTitle: "\"아들 전역이 더 빠르겠다?\" 2027 현대 캐스퍼 일렉트릭, 보조금 반영 2천만 원대에 사는데 출고 대기만 28개월 걸리는 이유",
        thumb: "https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FqBuAq%2FdJMcafAIaBI%2FAAAAAAAAAAAAAAAAAAAAAKyaD_v-YFTQaFvaRe1tyqmdBunfVq1z2BRRsumZiHGR%2Fimg.jpg%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1788188399%26allow_ip%3D%26allow_referer%3D%26signature%3DB7MjaRwpPhxufoCI37W2DyPCUDY%253D",
        cat: "신차소식",
        baseWeight: 150
    },
    {
        slug: "highway-phantom-traffic-jam.html",
        slugKey: "highway-phantom-traffic-jam",
        title: "\"사고 없어도 멈추는 미스터리?\" 2026 고속도로 유",
        fullTitle: "\"사고 없어도 멈추는 미스터리?\" 2026 고속도로 유령 정체의 진짜 이유, 여름 휴가철 100m 안전거리와 지퍼 합류의 실속 가치 분석",
        thumb: "https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FcTZWYL%2FdJMcadbHRgf%2FAAAAAAAAAAAAAAAAAAAAABSray-nVlA1R7sqfLgpzJc8gWgugJRurKHFjrd_PATr%2Fimg.jpg%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1788188399%26allow_ip%3D%26allow_referer%3D%26signature%3DSYOBJ0jYR9v99Ig0f84mmeD56Ak%253D",
        cat: "포커스",
        baseWeight: 150
    },
    {
        slug: "grandeur-1-6-hybrid-price-value.html",
        slugKey: "grandeur-1-6-hybrid-price-value",
        title: "그랜저 2.5 가솔린 대신 500만 원 더 투자할 가치",
        fullTitle: "그랜저 2.5 가솔린 대신 500만 원 더 투자할 가치가 있을까?",
        thumb: "https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2Frlcfw%2FdJMb99UJ0RM%2FAAAAAAAAAAAAAAAAAAAAAPmlV5uvGEZfjYMtfBvEGrVX3oXyC_z-Sl1qcP4vczRo%2Fimg.jpg%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1788188399%26allow_ip%3D%26allow_referer%3D%26signature%3DjcLtsbtg6CQEZZDXW2wMye8mWVo%253D",
        cat: "신차소식",
        baseWeight: 150
    },
    {
        slug: "hyundai-ioniq5-660000km-battery-health-test.html",
        slugKey: "hyundai-ioniq5-660000km-battery-health-test",
        title: "\"66만km 달리고도 멀쩡하다?\" 2026 현대 아이오",
        fullTitle: "\"66만km 달리고도 멀쩡하다?\" 2026 현대 아이오닉 5 배터리 잔존 수명 측정, K-배터리 열관리 기술의 시장 충격 분석\"",
        thumb: "https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FbfK7Uf%2FdJMcabEYSwb%2FAAAAAAAAAAAAAAAAAAAAADGmBafT_D_xSXOg6bCgzaojtgM81eI1Z5zkRl92JZNk%2Fimg.jpg%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1788188399%26allow_ip%3D%26allow_referer%3D%26signature%3DLWQPAg5GYo7U6wZV1tMDBR3jHks%253D",
        cat: "포커스",
        baseWeight: 150
    },
    {
        slug: "hyundai-autonomous-driving-tech-shift-2026.html",
        slugKey: "hyundai-autonomous-driving-tech-shift-2026",
        title: "\"이럴 거면 수조 원 왜 썼나?\" 2026 현대차그룹 ",
        fullTitle: "\"이럴 거면 수조 원 왜 썼나?\" 2026 현대차그룹 자율주행 자체 개발 전면 포기선언, 테슬라 FSD 초격차와 구글·엔비디아 동맹 턴어라운드 분석\"",
        thumb: "https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FdiLGuu%2FdJMcacRn5BN%2FAAAAAAAAAAAAAAAAAAAAAAQTnJuhRT0k6fvBLDKcnNeSEWHdlF8h1nnbaSkp10JP%2Fimg.jpg%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1788188399%26allow_ip%3D%26allow_referer%3D%26signature%3DIwslbr7u8RsBKIyT0Prdt4XppmM%253D",
        cat: "포커스",
        baseWeight: 150
    },
    {
        slug: "hyundai-hmgma-georgia-factory-conflict.html",
        slugKey: "hyundai-hmgma-georgia-factory-conflict",
        title: "\"전부 덫이었다\" 현대자동차 조지아 HMGMA 내부 갈",
        fullTitle: "\"전부 덫이었다\" 현대자동차 조지아 HMGMA 내부 갈등의 실체, 한국 제조업계의 생존 전략 분석",
        thumb: "https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FdMV7eV%2FdJMcacKJNaP%2FAAAAAAAAAAAAAAAAAAAAANgX3wnbxQeu4WL-nJ9_oLZZAIZEaLKR2S-PeVz26_5e%2Fimg.jpg%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1788188399%26allow_ip%3D%26allow_referer%3D%26signature%3DJxg8BGmV697VC4NSt0YsY0%252BmN1Q%253D",
        cat: "포커스",
        baseWeight: 150
    },
    {
        slug: "volvo-ex30-price-cut.html",
        slugKey: "volvo-ex30-price-cut",
        title: "\"국산 전기차 넘어설까?\" 2027년식 볼보 EX30 ",
        fullTitle: "\"국산 전기차 넘어설까?\" 2027년식 볼보 EX30 파격 가격 인하 선언, 국내 3천만 원대 전기차 격전지의 판도 변화와 가치 분석\"",
        thumb: "https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2Fb48Gou%2FdJMcagfdr2g%2FAAAAAAAAAAAAAAAAAAAAAGmH67dU8d0t7top4CLcnad22Xn6K15TSeWd05He90qM%2Fimg.jpg%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1788188399%26allow_ip%3D%26allow_referer%3D%26signature%3DxruXJFa8ymgG3xCxjRd7Kv6THQQ%253D",
        cat: "신차소식",
        baseWeight: 150
    },
    {
        slug: "staria-electric-11-seater-benefits.html",
        slugKey: "staria-electric-11-seater-benefits",
        title: "\"카니발 이탈 속출?\" 2026 현대 스타리아 일렉트릭",
        fullTitle: "\"카니발 이탈 속출?\" 2026 현대 스타리아 일렉트릭 11인승 출시, 대형 MPV 시장의 세제 혜택과 가격 파괴 임팩트 분석\"",
        thumb: "https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FbeMqgv%2FdJMcahSEk0D%2FAAAAAAAAAAAAAAAAAAAAANDSydwAN8R4MFLQ72oGqmxSeeGF5xlj8bYSgAuZp_jG%2Fimg.webp%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1788188399%26allow_ip%3D%26allow_referer%3D%26signature%3DPlAEjBBr2T3uCcyVCSe5%252BSBwN%252BY%253D",
        cat: "신차소식",
        baseWeight: 150
    },
    {
        slug: "avante-8th-generation-unveiled.html",
        slugKey: "avante-8th-generation-unveiled",
        title: "\"아방이 이름 떼야 하나?\" 현대차 2026 디 올 뉴",
        fullTitle: "\"아방이 이름 떼야 하나?\" 현대차 2026 디 올 뉴 아반떼 최초 공개, 준중형 세단 시장의 대변혁과 모빌리티 비전 분석\"",
        thumb: "https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FmS4jH%2FdJMcajpl1wZ%2FAAAAAAAAAAAAAAAAAAAAAFAp8q7jqR4peY_lDe0wClvAF1L-q7kvNdkewY2jysBy%2Fimg.jpg%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1788188399%26allow_ip%3D%26allow_referer%3D%26signature%3DxwSs5a%252B5Fl64SWVeLXSH%252B4YtT9k%253D",
        cat: "신차소식",
        baseWeight: 150
    },
    {
        slug: "why-drivers-return-to-gasoline-cars.html",
        slugKey: "why-drivers-return-to-gasoline-cars",
        title: "\"연비만 믿었다가 낭패?\" 2026 현대 그랜저 하이브",
        fullTitle: "\"연비만 믿었다가 낭패?\" 2026 현대 그랜저 하이브리드 vs 가솔린 직접 비교, 스마트 컨슈머의 실리 선택과 경제성 분석",
        thumb: "https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FNtPya%2FdJMcacRlluW%2FAAAAAAAAAAAAAAAAAAAAAPBULU5tHFbFUK51f5rXKpWhJuuPfAw_wPBEcHlSfUII%2Fimg.jpg%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1788188399%26allow_ip%3D%26allow_referer%3D%26signature%3DKV9kwyp%252BIG0vmCuE4r91FAnWMX4%253D",
        cat: "포커스",
        baseWeight: 150
    },
    {
        slug: "volkswagen-crisis-restructuring-2026.html",
        slugKey: "volkswagen-crisis-restructuring-2026",
        title: "\"10만명 감원 선언?\" 2026 폭스바겐 대규모 구조",
        fullTitle: "\"10만명 감원 선언?\" 2026 폭스바겐 대규모 구조조정 검토, 글로벌 자동차 시장의 대전환과 시사점 분석\"",
        thumb: "https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FbaDAmM%2FdJMcadvSVqT%2FAAAAAAAAAAAAAAAAAAAAAJLrSiI9KoNcUq6cSrFgDOLYgGoXt9UVyCcHzpjzGVoY%2Fimg.jpg%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1788188399%26allow_ip%3D%26allow_referer%3D%26signature%3DDhpwXTnmAaF41IaDuEoQn9Audew%253D",
        cat: "포커스",
        baseWeight: 150
    },
    {
        slug: "2027-renault-scenic-lfp-battery.html",
        slugKey: "2027-renault-scenic-lfp-battery",
        title: "\"진작 이렇게 나오지?\" 2027 르노 세닉 E-Tec",
        fullTitle: "\"진작 이렇게 나오지?\" 2027 르노 세닉 E-Tech 일렉트릭 부분변경 공개, 중국산 가격 공세에 맞선 글로벌 모빌리티의 변동과 전략 분석",
        thumb: "https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FAgJXs%2FdJMcabZh1gW%2FAAAAAAAAAAAAAAAAAAAAAAxtVqCkgR7ycF2C9811PmYJZl4zYhd1-O0tPfiVm29l%2Fimg.jpg%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1788188399%26allow_ip%3D%26allow_referer%3D%26signature%3D2LW%252Ft%252BYZ1F5kE56AkkrheNXhh1Y%253D",
        cat: "신차소식",
        baseWeight: 150
    },
    {
        slug: "byd-sealion-6-phev-suv.html",
        slugKey: "byd-sealion-6-phev-suv",
        title: "\"너 같으면 사겠냐?\" 2026 BYD 씨라이언 6 국",
        fullTitle: "\"너 같으면 사겠냐?\" 2026 BYD 씨라이언 6 국내 하이브리드 시장 상륙, 국내 친환경 SUV 지형에 미칠 파장 분석\"",
        thumb: "https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FecZlQv%2FdJMcacqluwk%2FAAAAAAAAAAAAAAAAAAAAAAd9a-IbIBpDtau9lym90S6-nd6WHHCDVQjQOTfWTjj_%2Fimg.jpg%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1788188399%26allow_ip%3D%26allow_referer%3D%26signature%3D0E1R9LFdl4WfPoF2DID8dB%252Bz%252B8o%253D",
        cat: "신차소식",
        baseWeight: 150
    },
    {
        slug: "2026-hyundai-grandeur-hybrid-delivery.html",
        slugKey: "2026-hyundai-grandeur-hybrid-delivery",
        title: "\"시동 진동 51% 줄였다?\" 2026 현대 더 뉴 그",
        fullTitle: "\"시동 진동 51% 줄였다?\" 2026 현대 더 뉴 그랜저 하이브리드 본격 출고, 준대형 친환경 세단 시장의 기술 진보와 가치 분석",
        thumb: "https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FlYo0O%2FdJMcajbMrQT%2FAAAAAAAAAAAAAAAAAAAAAPzIUXConPqx7Mim6EQEBfu-sBxZgVd3YQZr5et4CdLB%2Fimg.jpg%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1788188399%26allow_ip%3D%26allow_referer%3D%26signature%3DTu5c33i%252FvfrBa7H4Bi2vjAI8zZI%253D",
        cat: "신차소식",
        baseWeight: 150
    },
    {
        slug: "kia-k4-sportswagon-review.html",
        slugKey: "kia-k4-sportswagon-review",
        title: "\"SUV 살 이유가 없네?\" 2026 기아 K4 스포츠",
        fullTitle: "\"SUV 살 이유가 없네?\" 2026 기아 K4 스포츠왜건 공개, 역대급 디자인의 왜건 실물과 국내 미출시 아쉬움 분석\"",
        thumb: "https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2Fz354W%2FdJMcaic1k4W%2FAAAAAAAAAAAAAAAAAAAAAEazFMBPzxymBKeJVDRIemr_R-w5I_5xfQ-ne5v1D1bs%2Fimg.jpg%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1788188399%26allow_ip%3D%26allow_referer%3D%26signature%3D70%252Bk4WXIdMpIB31QPnPeE2t9blc%253D",
        cat: "신차소식",
        baseWeight: 150
    },
    {
        slug: "kia-seltos-hybrid-review-2026.html",
        slugKey: "kia-seltos-hybrid-review-2026",
        title: "\"경쟁 차종들 장난감 같네?\" 2026 기아 디 올 뉴",
        fullTitle: "\"경쟁 차종들 장난감 같네?\" 2026 기아 디 올 뉴 셀토스 하이브리드 공개, 소형 SUV 시장 격돌과 국내 사양 분석",
        thumb: "https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FzZcwH%2FdJMcabERkdt%2FAAAAAAAAAAAAAAAAAAAAALFH_FOUKpO4xt-pOAu5YHVIE4WB348j8xH-mJXG-Neg%2Fimg.jpg%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1788188399%26allow_ip%3D%26allow_referer%3D%26signature%3DxwSrCopgcB8GlB6obGTBXdq7jus%253D",
        cat: "신차소식",
        baseWeight: 150
    },
    {
        slug: "2027-volkswagen-atlas-reveal.html",
        slugKey: "2027-volkswagen-atlas-reveal",
        title: "\"팰리세이드 위협할까?\" 2027 폭스바겐 아틀라스 풀",
        fullTitle: "\"팰리세이드 위협할까?\" 2027 폭스바겐 아틀라스 풀체인지 공개",
        thumb: "https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FKu6ZD%2FdJMcaa0gsfv%2FAAAAAAAAAAAAAAAAAAAAAFxuAfGuNSpaifO1eXyB-sAp30cQDjd_mI9XvSnhbOgV%2Fimg.jpg%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1788188399%26allow_ip%3D%26allow_referer%3D%26signature%3DPwgAEFw%252B16UkUUBPpjaNCie0f9M%253D",
        cat: "신차소식",
        baseWeight: 150
    },
    {
        slug: "tesla-fsd-lite-korea-model-y-used.html",
        slugKey: "tesla-fsd-lite-korea-model-y-used",
        title: "\"미국도 안 풀렸는데 한국 먼저?\" 2026 테슬라 모",
        fullTitle: "\"미국도 안 풀렸는데 한국 먼저?\" 2026 테슬라 모델Y FSD 라이트 기습 배포, 국내 중고차 시장의 지각변동과 가치 분석",
        thumb: "https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FbFlYFQ%2FdJMcabx4FPa%2FAAAAAAAAAAAAAAAAAAAAADVa4FeHMlEfoNW9rS-4CF_vRM01ARunxvbfQCQyKGKT%2Fimg.jpg%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1788188399%26allow_ip%3D%26allow_referer%3D%26signature%3DflNS1%252FBTdZnfcHyArQtY9ZtQT1U%253D",
        cat: "포커스",
        baseWeight: 150
    },
    {
        slug: "genesis-gv70-ev-family-suv.html",
        slugKey: "genesis-gv70-ev-family-suv",
        title: "\"아내 눈치 안 보고 질렀다\" 3040 아빠들이 패밀리",
        fullTitle: "\"아내 눈치 안 보고 질렀다\" 3040 아빠들이 패밀리카로 제네시스 GV70 전기차 고른 진짜 이유",
        thumb: "https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FGEtG9%2FdJMcado4mNW%2FAAAAAAAAAAAAAAAAAAAAANWPexL9Vv8Xn5Nb60k9DHugiWohgU55mh_af8gbnVOk%2Fimg.jpg%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1788188399%26allow_ip%3D%26allow_referer%3D%26signature%3DWZo1j3yXG%252Ffz59V7s72NElg960Q%253D",
        cat: "신차소식",
        baseWeight: 150
    },
    {
        slug: "toyota-camry-hybrid-price-comparison.html",
        slugKey: "toyota-camry-hybrid-price-comparison",
        title: "\"수입 세단이 더 저렴하다?\" 2026 토요타 캠리 하",
        fullTitle: "\"수입 세단이 더 저렴하다?\" 2026 토요타 캠리 하이브리드 가격 포지셔닝, 국산 준대형 및 SUV 패밀리카 라인업과의 경제성 비교 분석",
        thumb: "https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FcEAnAb%2FdJMcajpet0n%2FAAAAAAAAAAAAAAAAAAAAANYjkkIPEcZb22BnrKvtUFUAkyJaLu00wusqn3lVZRNc%2Fimg.jpg%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1788188399%26allow_ip%3D%26allow_referer%3D%26signature%3DYgp10Lz5ya2CdWJ%252BYHYRPORcfAo%253D",
        cat: "신차소식",
        baseWeight: 150
    },
    {
        slug: "zeekr-7x-korea-launch-success.html",
        slugKey: "zeekr-7x-korea-launch-success",
        title: "\"중국차가 이 가격에 팔린다고?\" 2026 지커 7X ",
        fullTitle: "\"중국차가 이 가격에 팔린다고?\" 2026 지커 7X 국내 사전계약 1,000대 돌파, 전기차 시장의 대반전과 국산 브랜드의 과제 분석",
        thumb: "https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FVTQSP%2FdJMcafgc4fp%2FAAAAAAAAAAAAAAAAAAAAAI5MTTfMIHrxFneSUM7HAU3z2Cq2lr9Sq9Qwlwd9OzP6%2Fimg.jpg%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1788188399%26allow_ip%3D%26allow_referer%3D%26signature%3DCKHcP9cDffLIZ4vITS2aYTO5WDk%253D",
        cat: "신차소식",
        baseWeight: 150
    },
    {
        slug: "kia-niro-facelift-2027.html",
        slugKey: "kia-niro-facelift-2027",
        title: "\"하이브리드 올인?\" 2027 기아 니로 페이스리프트 ",
        fullTitle: "\"하이브리드 올인?\" 2027 기아 니로 페이스리프트 북미 깜짝 공개, 친환경 소형 SUV 시장의 새로운 지각변동 분석",
        thumb: "https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FcgDEC3%2FdJMcad3DTRH%2FAAAAAAAAAAAAAAAAAAAAANQF45x04nh0aPAHazD5bdRK2XmytvL05bgqZG6wFXBq%2Fimg.jpg%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1788188399%26allow_ip%3D%26allow_referer%3D%26signature%3DdSlZPkXvjTfhRsPNapTVA%252BalMLc%253D",
        cat: "신차소식",
        baseWeight: 150
    },
    {
        slug: "hyundai-us-hybrid-success-hmgma.html",
        slugKey: "hyundai-us-hybrid-success-hmgma",
        title: "\"비웃을 땐 언제고?\" 2026 현대차그룹 하이브리드 ",
        fullTitle: "\"비웃을 땐 언제고?\" 2026 현대차그룹 하이브리드 북미 시장 공략, 조지아 공장 라인 기습 변경과 스포티지 HEV의 가치 분석",
        thumb: "https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FbxUd5g%2FdJMcafga51u%2FAAAAAAAAAAAAAAAAAAAAAOudZQzJK8XSo8ez2NQ-TLArN2JJu9BEmWlig_x1IJiZ%2Fimg.jpg%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1788188399%26allow_ip%3D%26allow_referer%3D%26signature%3D4u%252F7O7aZL446Gjn%252BQfYrRtnSTUE%253D",
        cat: "포커스",
        baseWeight: 150
    },
    {
        slug: "polestar-3-korea-launch-price.html",
        slugKey: "polestar-3-korea-launch-price",
        title: "\"진짜 전세계 최저가?\" 2026 폴스타 폴스타3 국내",
        fullTitle: "\"진짜 전세계 최저가?\" 2026 폴스타 폴스타3 국내 파격 출시, 수입 전기 SUV 시장의 지각변동과 가치 분석",
        thumb: "https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FsDj3m%2FdJMcafAqNq8%2FAAAAAAAAAAAAAAAAAAAAAOdJ1mvUCkqw2gl2hXQEO4LxImodj0XLMXTJWHV9yu8K%2Fimg.jpg%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1788188399%26allow_ip%3D%26allow_referer%3D%26signature%3DlFVuISI5WXT40O2UHWdDD6siUpc%253D",
        cat: "신차소식",
        baseWeight: 150
    },
    {
        slug: "2026-kia-ev9-light-price-sales.html",
        slugKey: "2026-kia-ev9-light-price-sales",
        title: "\"국내는 351대, 미국은 폭증?\" 2026 기아 EV",
        fullTitle: "\"국내는 351대, 미국은 폭증?\" 2026 기아 EV9 라이트 트림의 가격 승부수, 글로벌 대형 SUV 전기차 시장의 지각변동 총정리",
        thumb: "https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FvIV3I%2FdJMcaiDUg2S%2FAAAAAAAAAAAAAAAAAAAAAEv48vn7Gd7p7sOi6oXS5jBvMH6AAYbiXznPIkPbEIXB%2Fimg.jpg%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1788188399%26allow_ip%3D%26allow_referer%3D%26signature%3DGYm37726K75%252BlWmBT1iQNRZccwM%253D",
        cat: "신차소식",
        baseWeight: 150
    },
    {
        slug: "byd-sealion-6-vs-kia-sportage-hybrid.html",
        slugKey: "byd-sealion-6-vs-kia-sportage-hybrid",
        title: "\"로고 떼면 국산차 긴장할까?\" 2026 BYD 씨라이",
        fullTitle: "\"로고 떼면 국산차 긴장할까?\" 2026 BYD 씨라이언6 PHEV 국내 공개, 수입 친환경 SUV 시장의 파격적 지각변동과 소비자 가치 분석",
        thumb: "https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FnmAO7%2FdJMcagMTFBD%2FAAAAAAAAAAAAAAAAAAAAADLYCLxJGNy3bqlhjP3CIKeClEDr0peccS4PIrQDHQaV%2Fimg.jpg%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1788188399%26allow_ip%3D%26allow_referer%3D%26signature%3D61UDbXnF7WAGnl0J%252Fpt7EpfmUHs%253D",
        cat: "신차소식",
        baseWeight: 150
    },
    {
        slug: "tesla-cybercab-epa-conformity.html",
        slugKey: "tesla-cybercab-epa-conformity",
        title: "\"운전대·페달 아예 없다?\" 2026 테슬라 사이버캡 ",
        fullTitle: "\"운전대·페달 아예 없다?\" 2026 테슬라 사이버캡 미국 EPA 공식 판매 인증, 무인 로보택시가 가져올 미래 모빌리티 시장의 지각변동 분석",
        thumb: "https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2Fbx2L8Q%2FdJMcaiRoME9%2FAAAAAAAAAAAAAAAAAAAAADGXtGSbGtKOmmhnpJyNZhtNLbUHdxj_C0cIaq44cX5F%2Fimg.jpg%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1788188399%26allow_ip%3D%26allow_referer%3D%26signature%3DSGQpcxQUMQuFhDT2Pzbu8SNqU2g%253D",
        cat: "신차소식",
        baseWeight: 150
    },
    {
        slug: "polestar-4-us-ban.html",
        slugKey: "polestar-4-us-ban",
        title: "\"한국서 만들었는데 수입 금지?\" 2027 폴스타 4 ",
        fullTitle: "\"한국서 만들었는데 수입 금지?\" 2027 폴스타 4 미국 규제 퇴출 선언, 부산공장 타격과 모빌리티 공급망 지각변동 분석",
        thumb: "https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FXv7to%2FdJMcaff6zPC%2FAAAAAAAAAAAAAAAAAAAAAD8fijez5IXVRtdJhqdgeRI1GPykCCCXmw0vc_C6sF56%2Fimg.jpg%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1788188399%26allow_ip%3D%26allow_referer%3D%26signature%3DoF6T%252FfTHTrv6QvOtlQZ7qyOsZQk%253D",
        cat: "포커스",
        baseWeight: 150
    },
    {
        slug: "2026-ferrari-luce-ev-china-sellout.html",
        slugKey: "2026-ferrari-luce-ev-china-sellout",
        title: "\"디자인 폭망했다더니 완판?\" 2026 페라리 루체 전",
        fullTitle: "\"디자인 폭망했다더니 완판?\" 2026 페라리 루체 전격 공개, K-배터리와 디스플레이 동맹의 가치 분석",
        thumb: "https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FdFVgVJ%2FdJMcag0hjcv%2FAAAAAAAAAAAAAAAAAAAAAGVrQ8A5si49_0AciNgcH88Rm6KxyEct0tpRLRHdOBVX%2Fimg.jpg%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1788188399%26allow_ip%3D%26allow_referer%3D%26signature%3D%252FQHLv4T0Rt5AzVN2QuqUz525qJE%253D",
        cat: "포커스",
        baseWeight: 150
    },
    {
        slug: "byd-sealion6-dmi-price.html",
        slugKey: "byd-sealion6-dmi-price",
        title: "\"3,750만원에 PHEV를?\" 2026 BYD 시라이",
        fullTitle: "\"3,750만원에 PHEV를?\" 2026 BYD 시라이언 6 DM-i 국내 출시 선언 국산 하이브리드 시장의 지각변동과 가치 분석",
        thumb: "https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FchS7Ve%2FdJMcajbAKrL%2FAAAAAAAAAAAAAAAAAAAAALC4PZaEgOb_AWHzBn3YYdNsTtlkpMSWm9R4Je8EMci3%2Fimg.jpg%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1788188399%26allow_ip%3D%26allow_referer%3D%26signature%3DZ6%252BOakXmqK%252Fikw%252Bl3HqneJSPdW0%253D",
        cat: "신차소식",
        baseWeight: 150
    },
    {
        slug: "2026-hyundai-avante-cn8-reveal.html",
        slugKey: "2026-hyundai-avante-cn8-reveal",
        title: "\"1.6 엔진 폐기?\" 2026 현대 디 올 뉴 아반떼",
        fullTitle: "\"1.6 엔진 폐기?\" 2026 현대 디 올 뉴 아반떼 8세대 전격 공개, 준중형 시장의 지각변동과 가치 분석",
        thumb: "https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FdEJ6eM%2FdJMcaaZ5kgH%2FAAAAAAAAAAAAAAAAAAAAAC_DktkPnZgS2fHW_jI2NS_2mhCPanXoCxT7f9HmN3iU%2Fimg.jpg%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1788188399%26allow_ip%3D%26allow_referer%3D%26signature%3Dvv9zkcAbwNT8NSwuVd3d60RgJDM%253D",
        cat: "신차소식",
        baseWeight: 150
    },
    {
        slug: "bmw-7-series-black-trim.html",
        slugKey: "bmw-7-series-black-trim",
        title: "\"올 블랙의 압도적 존재감?\" 2026 BMW 7시리즈",
        fullTitle: "\"올 블랙의 압도적 존재감?\" 2026 BMW 7시리즈 740i 740d 블랙 트림 공식 출시, 수입 대형 세단 시장의 새로운 기준과 가치 분석",
        thumb: "https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FbyPllg%2FdJMcabSbWR6%2FAAAAAAAAAAAAAAAAAAAAAIjF5gFTSDglHEBsyUreNXLh7hT2ERMJkmovBGGQ0ltJ%2Fimg.jpg%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1788188399%26allow_ip%3D%26allow_referer%3D%26signature%3DKxueXOFjsMmYnjtExzbMO%252Bs4pk4%253D",
        cat: "신차소식",
        baseWeight: 150
    },
    {
        slug: "FSD.html",
        slugKey: "FSD",
        title: "\"FSD가 미국선 이미 병원 이송?\" 2026 신형 테",
        fullTitle: "\"FSD가 미국선 이미 병원 이송?\" 2026 신형 테슬라 모델Y 모델3 감독형 자율주행 락 해제, 한국 규제 조율의 현실적 변수와 가치 전망",
        thumb: "https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2F2nvGJ%2FdJMcaalqJAJ%2FAAAAAAAAAAAAAAAAAAAAAAjDbPUUJlB33n8LkZZSWwiXKF-Rp2ANwve63MOiFJNm%2Fimg.jpg%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1788188399%26allow_ip%3D%26allow_referer%3D%26signature%3DOa5y5C3lFZ2zLAT5SwG4iosYM%252F8%253D",
        cat: "포커스",
        baseWeight: 150
    },
    {
        slug: "2026-기아-EV3-롱레인지.html",
        slugKey: "2026-기아-EV3-롱레인지",
        title: "2026 기아 EV3 롱레인지 스펙 유지비 셀토스 풀옵",
        fullTitle: "2026 기아 EV3 롱레인지 스펙 유지비 셀토스 풀옵션 가격 비교 분석 총정리",
        thumb: "https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FcmOQTh%2FdJMcaicL1LB%2FAAAAAAAAAAAAAAAAAAAAAAp3XWh_H1b2fRJV0cBkXjO6Y2MuawIpEp4dPHIjG7_H%2Fimg.jpg%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1788188399%26allow_ip%3D%26allow_referer%3D%26signature%3DEdzP2aLT2irOVH%252Bu0ZI6lkfxOfg%253D",
        cat: "신차소식",
        baseWeight: 150
    },
    {
        slug: "E-Tech.html",
        slugKey: "E-Tech",
        title: "\"구글 제미나이 AI 통합?\" 2026 르노 메간 E ",
        fullTitle: "\"구글 제미나이 AI 통합?\" 2026 르노 메간 E Tech 일렉트릭의 스마트 디지털 콕핏 혁신, 국내 예비 오너들의 출시 요구 동향 분석",
        thumb: "https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FMoG1H%2FdJMcaaTiyhh%2FAAAAAAAAAAAAAAAAAAAAAKnRtkLmD3EqNCL9dXnPaTEu3t0P7iJLyz5H2HLtyZPe%2Fimg.jpg%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1788188399%26allow_ip%3D%26allow_referer%3D%26signature%3Dx3EKxrWw1LIj7Xpv70cKIi8ILiM%253D",
        cat: "신차소식",
        baseWeight: 150
    },
    {
        slug: "N-e-Shift.html",
        slugKey: "N-e-Shift",
        title: "\"포르쉐·BMW도 베꼈다?\" 전기차 가상 변속 동향과 ",
        fullTitle: "\"포르쉐·BMW도 베꼈다?\" 전기차 가상 변속 동향과 현대 N e-Shift 가치 분석",
        thumb: "https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FbuwuR3%2FdJMcaf748SH%2FAAAAAAAAAAAAAAAAAAAAAF4ruZmJLs6CFSufZCeBuA5XYsD3kWqSLK6PHLpiSUiM%2Fimg.jpg%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1788188399%26allow_ip%3D%26allow_referer%3D%26signature%3DBYlorHP3nTvyT3ygrUVCi1trejA%253D",
        cat: "신차소식",
        baseWeight: 150
    },
    {
        slug: "2026-BMW-신형-iX3.html",
        slugKey: "2026-BMW-신형-iX3",
        title: "\"중국산 배터리 탑재해도 안전할까?\" 2026 BMW ",
        fullTitle: "\"중국산 배터리 탑재해도 안전할까?\" 2026 BMW 신형 iX3 스펙 공개, 한국인 선호 옵션의 충돌과 시장 가치 총정리",
        thumb: "https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FPDtMf%2FdJMcadWKMCp%2FAAAAAAAAAAAAAAAAAAAAAFiQtHgDH_qD38yp5Hs-oXm5i6DTS21_8VVYb6FzPreX%2Fimg.jpg%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1788188399%26allow_ip%3D%26allow_referer%3D%26signature%3DMCB35T9S5xg11sBs94lJLjfByss%253D",
        cat: "신차소식",
        baseWeight: 150
    },
    {
        slug: "결함-아닌-부족함입니다.html",
        slugKey: "결함-아닌-부족함입니다",
        title: "\"고객님 결함 아닌 부족함입니다?\" 2026 토요타·닛",
        fullTitle: "\"고객님 결함 아닌 부족함입니다?\" 2026 토요타·닛산 미국산 품질 고지 파문, 글로벌 제조 완성도 격차가 던진 메시지 분석",
        thumb: "https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FBbyMh%2FdJMcacDBvxN%2FAAAAAAAAAAAAAAAAAAAAAEaO77nDgJS0RBSdxC0Aeakqk5FNzn5YGV6Sp-bBPck-%2Fimg.jpg%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1788188399%26allow_ip%3D%26allow_referer%3D%26signature%3DgTRwmw9bAOUrwNtVOZHX47A7Bro%253D",
        cat: "신차소식",
        baseWeight: 150
    },
    {
        slug: "보보금-조기-소진.html",
        slugKey: "보보금-조기-소진",
        title: "\"8월이면 동난다? \"2026년 전기차 보조금 조기 소",
        fullTitle: "\"8월이면 동난다? \"2026년 전기차 보조금 조기 소진 위기와 시장 분석",
        thumb: "https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2Fd2mjml%2FdJMcaaloSkJ%2FAAAAAAAAAAAAAAAAAAAAAJkLuLs_adImJv1CvF4kcTpvsnzS4h7ITwKJ65h7qRn0%2Fimg.jpg%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1788188399%26allow_ip%3D%26allow_referer%3D%26signature%3Dnt%252FWBJpmw6nR7AYs0xLRXbi2goI%253D",
        cat: "신차소식",
        baseWeight: 150
    },
    {
        slug: "자동차도-한일전-이다.html",
        slugKey: "자동차도-한일전-이다",
        title: "\"자동차도 한일전 이다?\" 2026 현대 그랜저 하이브",
        fullTitle: "\"자동차도 한일전 이다?\" 2026 현대 그랜저 하이브리드 가격 상승과, 렉서스 ES300h 패권 경쟁의 흐름 분석",
        thumb: "https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2Fdambay%2FdJMcaalnVoH%2FAAAAAAAAAAAAAAAAAAAAACgj80pgkvHfE0XY3yIqY02QVW2vRt3rhV8YYZK6yLCQ%2Fimg.jpg%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1788188399%26allow_ip%3D%26allow_referer%3D%26signature%3DehRMvnwBNP%252Bu1F4Iqbg6VWSDMIY%253D",
        cat: "신차소식",
        baseWeight: 150
    },
    {
        slug: "하이브리드-전성시대.html",
        slugKey: "하이브리드-전성시대",
        title: "\"하이브리드 전성 시대\" 국내 점유율 30.3% 돌파한",
        fullTitle: "\"하이브리드 전성 시대\" 국내 점유율 30.3% 돌파한 '하이브리드 자동차' 어떤 하이브리드를 선택해야 할까?",
        thumb: "https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FbiLoGW%2FdJMcafNR7q2%2FAAAAAAAAAAAAAAAAAAAAAAZcd7eQcOAF41Sj3umdnooig2XZ5ome5Y3VKG4Oas-s%2Fimg.jpg%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1788188399%26allow_ip%3D%26allow_referer%3D%26signature%3DE9cqsLl8pQlUx6gfkVJ8tUTpuOE%253D",
        cat: "신차소식",
        baseWeight: 150
    },
    {
        slug: "2026-BMW-iX3-50-xDrive.html",
        slugKey: "2026-BMW-iX3-50-xDrive",
        title: "\"611km 달리는 BMW SUV?\" 2026 BMW ",
        fullTitle: "\"611km 달리는 BMW SUV?\" 2026 BMW iX3 50 xDrive 국내 공식 출시 선언, 수입 전기차 시장의 지각변동과 가치 분석",
        thumb: "https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FJDFae%2FdJMcafUBkba%2FAAAAAAAAAAAAAAAAAAAAAInSfhAxWfhbMNUubtdVM9TdH53cQQdxqcm_V3t92qcG%2Fimg.jpg%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1788188399%26allow_ip%3D%26allow_referer%3D%26signature%3D0QEBKpOhKEuLTv%252BcS43kB1rwkuU%253D",
        cat: "신차소식",
        baseWeight: 150
    },
    {
        slug: "2027-볼보-EX30의-파격-가격-인하.html",
        slugKey: "2027-볼보-EX30의-파격-가격-인하",
        title: "\"테슬라가 불을 지폈다?\" 2027 볼보 EX30의 파",
        fullTitle: "\"테슬라가 불을 지폈다?\" 2027 볼보 EX30의 파격 가격 인하 선언, 국내 수입 전기차 시장의 지각변동과 가치 분석",
        thumb: "https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FletHa%2FdJMcafG4AMf%2FAAAAAAAAAAAAAAAAAAAAAPjemoISuL6WWtCHt93uBroD_xLCyotnqmqSkwzK8-cP%2Fimg.jpg%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1788188399%26allow_ip%3D%26allow_referer%3D%26signature%3D9igpF0vAzjZlnsl9e9cBpy7TNA0%253D",
        cat: "신차소식",
        baseWeight: 150
    },
    {
        slug: "2026-현대-아반떼-풀체인지.html",
        slugKey: "2026-현대-아반떼-풀체인지",
        title: "아반떼 500만원 인상설? 2026 현대 아반떼 풀체인",
        fullTitle: "아반떼 500만원 인상설? 2026 현대 아반떼 풀체인지 가격 유출 논란, 국내 가성비 세단 시장의 지각변동과 가치 분석",
        thumb: "https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2Fvixut%2FdJMcaiXX8jp%2FAAAAAAAAAAAAAAAAAAAAADoM6JLBozY_FizmP_WjkkZ6ATcoFEQsb1MORraqbFNy%2Fimg.jpg%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1788188399%26allow_ip%3D%26allow_referer%3D%26signature%3DEBSJ0A04TKhQgFtAIEZK5lowfS0%253D",
        cat: "신차소식",
        baseWeight: 150
    },
    {
        slug: "FSD-글로벌-개방.html",
        slugKey: "FSD-글로벌-개방",
        title: "\"일본·대만 다 여는데 한국만 빗장?\" 2026 테슬라",
        fullTitle: "\"일본·대만 다 여는데 한국만 빗장?\" 2026 테슬라 모델3·사이버캡 FSD 글로벌 개방 선언, 한국 자율주행 시장의 규제 갈라파고스화와 대응 분석",
        thumb: "https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FkL7Wu%2FdJMcajikZvc%2FAAAAAAAAAAAAAAAAAAAAAJoEwxBbQ7-Dpw6lzNU36Ao98nouingoSftXl1M-tUmr%2Fimg.jpg%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1788188399%26allow_ip%3D%26allow_referer%3D%26signature%3Ddn2%252FbEU2WUu6m5p8P30fnV6QkLU%253D",
        cat: "신차소식",
        baseWeight: 150
    },
    {
        slug: "갤럭시-크루저-700.html",
        slugKey: "갤럭시-크루저-700",
        title: "\"1128마력과 게걸음?\" 2026 지리 갤럭시 크루저",
        fullTitle: "\"1128마력과 게걸음?\" 2026 지리 갤럭시 크루저 700 양산형 공개, 글로벌 오프로더 시장의 지각변동과 가치 분석",
        thumb: "https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FrqZ6A%2FdJMcacKktNo%2FAAAAAAAAAAAAAAAAAAAAAL2SaHHmqCRm3nnA1zERtPqGG6zyKXkJiKUau0QhNtRB%2Fimg.jpg%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1788188399%26allow_ip%3D%26allow_referer%3D%26signature%3DU%252FyI66tm3jxZMlxcMyztfILqKk0%253D",
        cat: "신차소식",
        baseWeight: 150
    },
    {
        slug: "뷰익-일렉트라-E7.html",
        slugKey: "뷰익-일렉트라-E7",
        title: "\"GM의 뷰익 일렉트라 E7 PHEV 국내 포착!\" 예",
        fullTitle: "\"GM의 뷰익 일렉트라 E7 PHEV 국내 포착!\" 예상 가격 및 주행거리 제원 분석",
        thumb: "https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FGsGxm%2FdJMcaf1gq7e%2FAAAAAAAAAAAAAAAAAAAAAMI99Pc5LVMEJB8V3Ukkm7tY60sB5Ycxp5q3FvGMlTyl%2Fimg.jpg%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1788188399%26allow_ip%3D%26allow_referer%3D%26signature%3Do0ulaYDt%252Fpc4wkVO0wqZNHNiR6s%253D",
        cat: "신차소식",
        baseWeight: 150
    },
    {
        slug: "2026-폭스바겐-ID5.html",
        slugKey: "2026-폭스바겐-ID5",
        title: "\"현대·기아 긴장할까?\" 2026 폭스바겐 ID5 파격",
        fullTitle: "\"현대·기아 긴장할까?\" 2026 폭스바겐 ID5 파격 가격 선언, 국내 전기차 시장의 지각변동과 가치 분석",
        thumb: "https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FbeGOdv%2FdJMcaalkW1J%2FAAAAAAAAAAAAAAAAAAAAAO_PxvErcqYX73k6ouMjWYdjFCgSn2YrepPT1da2GKO8%2Fimg.jpg%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1788188399%26allow_ip%3D%26allow_referer%3D%26signature%3D82c2VOgwI6GrsHrX9XMtRVYsaeA%253D",
        cat: "신차소식",
        baseWeight: 150
    },
    {
        slug: "라브4-출시.html",
        slugKey: "라브4-출시",
        title: "\"현대·기아도 긴장할 만하네?\" 하이브리드 명가 202",
        fullTitle: "\"현대·기아도 긴장할 만하네?\" 하이브리드 명가 2026 토요타 올 뉴 RAV4 출시, 국산 SUV 위협하는 지각변동과 가치 분석",
        thumb: "https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FdhvPwL%2FdJMcaijpS9x%2FAAAAAAAAAAAAAAAAAAAAAC1KyeNttcaVmfHKQVajCGODzval9eobpjr2jLVy3kQ6%2Fimg.jpg%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1788188399%26allow_ip%3D%26allow_referer%3D%26signature%3DF9opQGWUFMllmn85pTC3S4BfqsU%253D",
        cat: "신차소식",
        baseWeight: 150
    },
    {
        slug: "카니발-하이루프-출시.html",
        slugKey: "카니발-하이루프-출시",
        title: "\"기아가 미쳤나?\" 카니발 하이루프 출시가 몰고 올 미",
        fullTitle: "\"기아가 미쳤나?\" 카니발 하이루프 출시가 몰고 올 미니밴 시장의 지각변동 분석",
        thumb: "https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2Fbbzr2M%2FdJMcadbeO4E%2FAAAAAAAAAAAAAAAAAAAAAI9vDJDbVjtWcoVTM7THp7ygn2PVpfCkqktSsalBNA3e%2Fimg.jpg%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1788188399%26allow_ip%3D%26allow_referer%3D%26signature%3Dig%252B4vR%252F%252BKDX4vo7CNCxRhkOeUzw%253D",
        cat: "신차소식",
        baseWeight: 150
    },
    {
        slug: "현대-싼타페-EREV해외생산.html",
        slugKey: "현대-싼타페-EREV해외생산",
        title: "\"이걸 왜 우리만 안 팔아?\" 현대 싼타페 EREV 해",
        fullTitle: "\"이걸 왜 우리만 안 팔아?\" 현대 싼타페 EREV 해외 생산 고수, 중국 BYD 공습에 맞선 이중 헷징 분석",
        thumb: "https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FnLbac%2FdJMcaaMpQWw%2FAAAAAAAAAAAAAAAAAAAAAN2tZORUXAm4GxTUteFUIV46LFKZYDtkB1-76a9JTkn_%2Fimg.jpg%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1788188399%26allow_ip%3D%26allow_referer%3D%26signature%3D%252FLSVyhNOc1aPHnDdsd8u0gcrsuY%253D",
        cat: "신차소식",
        baseWeight: 150
    },
    {
        slug: "은퇴-자동차.html",
        slugKey: "은퇴-자동차",
        title: "\"은퇴 준비 중이라면 이차가 정답!\"  5060 은퇴 ",
        fullTitle: "\"은퇴 준비 중이라면 이차가 정답!\"  5060 은퇴 세대의 전동화 대이동, 국산 프리미엄 전기차 3종의 초격차 생태계 분석",
        thumb: "https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FVQ5US%2FdJMcaaFHmk6%2FAAAAAAAAAAAAAAAAAAAAAB_VQdYdSX5Xo6aRliR6nwRJRlD5QMmOO1Gz0GPE42I-%2Fimg.jpg%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1788188399%26allow_ip%3D%26allow_referer%3D%26signature%3DZMF73cpDAlFgmCrtfa%252B4iwxrbps%253D",
        cat: "신차소식",
        baseWeight: 150
    },
    {
        slug: "유럽의-비웃음과-정면승부.html",
        slugKey: "유럽의-비웃음과-정면승부",
        title: "\"유럽의 비웃음과 정면 승부?\" 제네시스가 수천억 원을",
        fullTitle: "\"유럽의 비웃음과 정면 승부?\" 제네시스가 수천억 원을 던져 르망 24시로 간 이유, 마그마 브랜드의 거시적 퍼포먼스 전략 분석",
        thumb: "https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FbwPDBN%2FdJMcagsjAvD%2FAAAAAAAAAAAAAAAAAAAAAMRptTGXhQMLABQHyHFeBUqqRfgA5Td0uD93MjQYuc1o%2Fimg.jpg%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1788188399%26allow_ip%3D%26allow_referer%3D%26signature%3Dr2SCR38FGTq4TX7wAVxk7h5So9Y%253D",
        cat: "신차소식",
        baseWeight: 150
    },
    {
        slug: "캐스퍼-일렉트릭-수출-쏠림.html",
        slugKey: "캐스퍼-일렉트릭-수출-쏠림",
        title: "\"국내 소비자는 2년 대기?\" 캐스퍼 일렉트릭 수출 쏠",
        fullTitle: "\"국내 소비자는 2년 대기?\" 캐스퍼 일렉트릭 수출 쏠림의 구조적 역설, GGM 공장 가동 지연의 실체 분석",
        thumb: "https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FblqKUX%2FdJMcabq1RRp%2FAAAAAAAAAAAAAAAAAAAAAMGwkqME_k22WTMI0XuUJi9QjkPrUTmGG1wa4SWc58lS%2Fimg.jpg%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1788188399%26allow_ip%3D%26allow_referer%3D%26signature%3Dk0N2f4oQuXvpL9F5kxDK8yHCC7Q%253D",
        cat: "신차소식",
        baseWeight: 150
    },
    {
        slug: "캐스퍼-일렉트릭.html",
        slugKey: "캐스퍼-일렉트릭",
        title: "\"국산 전기차가 2,100만 원대?\" 고전압 NCM 배",
        fullTitle: "\"국산 전기차가 2,100만 원대?\" 고전압 NCM 배터리와 취득세 감면 혜택이 이끄는 2026 캐스퍼 일렉트릭 공학적·재정적 가치 분석",
        thumb: "https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FcnJ4qf%2FdJMcaar7bZK%2FAAAAAAAAAAAAAAAAAAAAANWRVJnWifCgzuROUjYvlHtKnrVANCkgKIfDOWw5q2Qz%2Fimg.jpg%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1788188399%26allow_ip%3D%26allow_referer%3D%26signature%3D5C6jIrlemFZl1KxyuWBsv3PAsu8%253D",
        cat: "신차소식",
        baseWeight: 150
    },
    {
        slug: "코나-풀체인지.html",
        slugKey: "코나-풀체인지",
        title: "\"페이스리프트도 없이 바로 풀체인지?\" 현대차의 초강수",
        fullTitle: "\"페이스리프트도 없이 바로 풀체인지?\" 현대차의 초강수 세대교체 전략, 소형 SUV 시장 판도 흔들 비책 분석",
        thumb: "https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FkHUKL%2FdJMcaiKmAr3%2FAAAAAAAAAAAAAAAAAAAAAEO8CtYHh8mHQGs-mCNUxQffbmCNy3C418dIRe5HyKL0%2Fimg.jpg%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1788188399%26allow_ip%3D%26allow_referer%3D%26signature%3DRgLYb55bsir2IH54xKwmN4SWbGg%253D",
        cat: "신차소식",
        baseWeight: 150
    },
    {
        slug: "폴스타4-연식변경.html",
        slugKey: "폴스타4-연식변경",
        title: "\"가격 내린 수입 프리미엄?\" 폴스타 4의 승부수, 수",
        fullTitle: "\"가격 내린 수입 프리미엄?\" 폴스타 4의 승부수, 수입 전기차 시장의 지각 변동 분석",
        thumb: "https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FLQXjz%2FdJMcagFSeeB%2FAAAAAAAAAAAAAAAAAAAAAPbqg9LXXxwcBCZwtP_Vl4C8QCLeNRE3LPnBJwG0YK_z%2Fimg.jpg%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1788188399%26allow_ip%3D%26allow_referer%3D%26signature%3Dc4vyeSbe7DYYicXRVUwtY2ldzQs%253D",
        cat: "신차소식",
        baseWeight: 150
    },
    {
        slug: "중국산벤츠논란.html",
        slugKey: "중국산벤츠논란",
        title: "\"중국산 벤츠 논란?\" 미국의 판매 금지 법안 추진, ",
        fullTitle: "\"중국산 벤츠 논란?\" 미국의 판매 금지 법안 추진, 현대차 제네시스 GLE GLS 프리미엄 SUV 시장 반사이익 분석",
        thumb: "https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FlNdap%2FdJMb9901sw8%2FAAAAAAAAAAAAAAAAAAAAACklU57mHIUtN3PV497jygYvVA5BetwWl19qKkqyijFu%2Fimg.jpg%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1788188399%26allow_ip%3D%26allow_referer%3D%26signature%3D419VLt4VzzpfYIJLT4dAqDaa4NY%253D",
        cat: "신차소식",
        baseWeight: 150
    },
    {
        slug: "아이오닉9.html",
        slugKey: "아이오닉9",
        title: "“수입 럭셔리 전멸했다” BMW·볼보 꺾고 해외 비교 ",
        fullTitle: "“수입 럭셔리 전멸했다” BMW·볼보 꺾고 해외 비교 평가 1위 차지한 아이오닉 9 분석",
        thumb: "https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FbxlG8X%2FdJMcahrcSa7%2FAAAAAAAAAAAAAAAAAAAAAKq2nZ1mMQ8dYf51YrNnuZaueZWGz4Ifn4guEsqRajee%2Fimg.jpg%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1788188399%26allow_ip%3D%26allow_referer%3D%26signature%3DYq%252BX%252Bj64wzuFBNpL3VV%252Bu8%252BjjjI%253D",
        cat: "신차소식",
        baseWeight: 150
    },
    {
        slug: "2026-신형-그랜저-풀옵션-벤츠-E클래스-E200.html",
        slugKey: "2026-신형-그랜저-풀옵션-벤츠-E클래스-E200",
        title: "\"비교가 되나?\"2026 신형 그랜저 풀옵션 벤츠 E클",
        fullTitle: "\"비교가 되나?\"2026 신형 그랜저 풀옵션 벤츠 E클래스 E200 기본형 가격 옵션 비교 분석",
        thumb: "https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2Fc9dB9I%2FdJMcadvrhkW%2FAAAAAAAAAAAAAAAAAAAAAKmGBTscc4GGTZq0qbGpUyHZSjOr_dq8W197nZf03Gf8%2Fimg.jpg%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1788188399%26allow_ip%3D%26allow_referer%3D%26signature%3DESval7%252FFbwx4vnUxG2F7UqYvxkk%253D",
        cat: "신차소식",
        baseWeight: 150
    },
    {
        slug: "2026-아우디-A3.html",
        slugKey: "2026-아우디-A3",
        title: "\"쏘나타 대신 독일차?\" 2026 아우디 A3 가격표 ",
        fullTitle: "\"쏘나타 대신 독일차?\" 2026 아우디 A3 가격표 및 1,050만 원 할인 프로모션 실구매가 분석",
        thumb: "https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2Fbj7fES%2FdJMcafz69uq%2FAAAAAAAAAAAAAAAAAAAAANAIVYvLTcWb0XMrl-7Pc_nK2Xhd5CB9mt2tiJabniru%2Fimg.jpg%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1788188399%26allow_ip%3D%26allow_referer%3D%26signature%3DljMRyuvrqQUd%252BCsLgB7ThkVQhPI%253D",
        cat: "신차소식",
        baseWeight: 150
    },
    {
        slug: "한국용-지커-7X.html",
        slugKey: "한국용-지커-7X",
        title: "\"라이다·오린X 칩 빼고 풀옵 7,909만원?\" 한국용",
        fullTitle: "\"라이다·오린X 칩 빼고 풀옵 7,909만원?\" 한국용 지커 7X 공개에 쏠리는 시장의 시선",
        thumb: "https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FexK9cx%2FdJMcabYNxFK%2FAAAAAAAAAAAAAAAAAAAAAMokfvAG6GuQihbdmhsou22MlV4ME1SXewwYdyXY4W65%2Fimg.jpg%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1788188399%26allow_ip%3D%26allow_referer%3D%26signature%3DXiJ2gCNWat0410AbmRGyGe0yPTM%253D",
        cat: "신차소식",
        baseWeight: 150
    },
    {
        slug: "모델Y-국내판매-1위.html",
        slugKey: "모델Y-국내판매-1위",
        title: "“현대차 비상” 국산차 제치고 판매 1위…5월 한 달 ",
        fullTitle: "“현대차 비상” 국산차 제치고 판매 1위…5월 한 달 8천 대 폭주한 테슬라 모델 Y의 위력 (분석",
        thumb: "https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FbsDLqO%2FdJMcabqWd38%2FAAAAAAAAAAAAAAAAAAAAADBuKR54NFna0VBlosdmqkWkeXD-7yKRArjN3B4IniVZ%2Fimg.jpg%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1788188399%26allow_ip%3D%26allow_referer%3D%26signature%3D9r6j4BFBWUCj%252FNKcelh55gTrvvY%253D",
        cat: "신차소식",
        baseWeight: 150
    },
    {
        slug: "혼다-철수-할인.html",
        slugKey: "혼다-철수-할인",
        title: "“진짜 30% 폭풍 할인?” 혼다 한국 철수 소식에 어",
        fullTitle: "“진짜 30% 폭풍 할인?” 혼다 한국 철수 소식에 어코드·CR-V ‘희망고문’ 시작된 이유 (분석)",
        thumb: "https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2F2mX4s%2FdJMcabkbKWl%2FAAAAAAAAAAAAAAAAAAAAAFesfD659RIKPdVhLCkRYXnlm797wuYJHlvH-02xJLh8%2Fimg.jpg%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1788188399%26allow_ip%3D%26allow_referer%3D%26signature%3DiuB%252FHYIrKPz2hR2BqegP%252F6PmQBY%253D",
        cat: "신차소식",
        baseWeight: 150
    },
    {
        slug: "EV9-라이트-스탠다드.html",
        slugKey: "EV9-라이트-스탠다드",
        title: "\"결국 남는 건 공간이었다\"  기아 EV9 라이트 스탠",
        fullTitle: "\"결국 남는 건 공간이었다\"  기아 EV9 라이트 스탠다드 출시가 불러온 시장의 반전 분석",
        thumb: "https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FKoIaM%2FdJMcadoDABR%2FAAAAAAAAAAAAAAAAAAAAAAWlV2IS-oLnxM3C2rwzHf5wZElarK9oTFxJoItrdtjW%2Fimg.jpg%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1788188399%26allow_ip%3D%26allow_referer%3D%26signature%3D5NYV0qf%252F1K5rsUHJPZwew9YGUww%253D",
        cat: "신차소식",
        baseWeight: 150
    },
    {
        slug: "모델-x-중고.html",
        slugKey: "모델-x-중고",
        title: "“마이바흐·모델 Y 정리하고 단 한 대로”… 박명수가 ",
        fullTitle: "“마이바흐·모델 Y 정리하고 단 한 대로”… 박명수가 선택한 테슬라 모델 X 중고의 가치",
        thumb: "https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FbobRht%2FdJMcaaS4rYl%2FAAAAAAAAAAAAAAAAAAAAALORAomSZ9z3yx2Cfkm3VfA2brrmQrdcgne4yNEKEI_J%2Fimg.jpg%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1788188399%26allow_ip%3D%26allow_referer%3D%26signature%3Dkdbfpjlqwq6cgq9r6WcY0q3%252BQDM%253D",
        cat: "신차소식",
        baseWeight: 150
    },
    {
        slug: "스팅어-부활.html",
        slugKey: "스팅어-부활",
        title: "“기아가 미쳤나?” 스팅어 부활 콘셉트카 공개되자 “양",
        fullTitle: "“기아가 미쳤나?” 스팅어 부활 콘셉트카 공개되자 “양산 출시” 청원 폭주 분석",
        thumb: "https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FblBnD2%2FdJMcaiQ4ZiI%2FAAAAAAAAAAAAAAAAAAAAAJwKmUcwrT_rMnoaRYUKYLqz0co5tKIK1a_o_7L37AQm%2Fimg.jpg%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1788188399%26allow_ip%3D%26allow_referer%3D%26signature%3DO1lqBdD0P662F6RikVnk7rZKEAw%253D",
        cat: "신차소식",
        baseWeight: 150
    },
    {
        slug: "미니-컨트리맨-딜러-에디션.html",
        slugKey: "미니-컨트리맨-딜러-에디션",
        title: "\"수입 SUV가 딜러 커스텀을?\" MINI 코리아 공식",
        fullTitle: "\"수입 SUV가 딜러 커스텀을?\" MINI 코리아 공식 딜러 4사의 독자 한정 에디션, 한국 컴팩트 프리미엄 SUV 시장 재편 분석",
        thumb: "https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2Ftwtt7%2FdJMcadoDiyz%2FAAAAAAAAAAAAAAAAAAAAAAuA5uaV48BS4Muq864dHew8lyY-dNQDBzXTOXgitKAR%2Fimg.jpg%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1788188399%26allow_ip%3D%26allow_referer%3D%26signature%3Dm1vrqf0Kp57EFakimdJBBWDhtXw%253D",
        cat: "신차소식",
        baseWeight: 150
    },
    {
        slug: "벤츠-e200-익스클루시브.html",
        slugKey: "벤츠-e200-익스클루시브",
        title: "\"오버스펙 대신 편안함 택했다\" 벤츠 오너들이 E 30",
        fullTitle: "\"오버스펙 대신 편안함 택했다\" 벤츠 오너들이 E 300 대신 E 200 익스클루시브를 선택한 진짜 이유",
        thumb: "https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FbFfKFP%2FdJMcaiQ36hz%2FAAAAAAAAAAAAAAAAAAAAAF_YqzyFq_ayGXaACCVIa89LG1ix5sQklJH7T9UQlp5U%2Fimg.jpg%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1788188399%26allow_ip%3D%26allow_referer%3D%26signature%3D12QLSywXs1MZmeN1buDpKq%252BnyjY%253D",
        cat: "신차소식",
        baseWeight: 150
    },
    {
        slug: "테슬라-모델-y-스탠다드.html",
        slugKey: "테슬라-모델-y-스탠다드",
        title: "\"옵션 다이어트와 효율성의 반전\" 테슬라 모델 Y 스탠",
        fullTitle: "\"옵션 다이어트와 효율성의 반전\" 테슬라 모델 Y 스탠다드 국내 인증 완료와 FSD 플랫폼 전략",
        thumb: "https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2F3p1yb%2FdJMcaar0J59%2FAAAAAAAAAAAAAAAAAAAAAIO_ZCV-XzNEKLzZpf1gO7X0sTLSVMS5eAlYxZGKQLaF%2Fimg.jpg%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1788188399%26allow_ip%3D%26allow_referer%3D%26signature%3D9Ue5col5x2oelNW6bfwCLxjIj%252Fw%253D",
        cat: "신차소식",
        baseWeight: 150
    },
    {
        slug: "스펙만-프리미엄인-중국산의-공습-지커-7X.html",
        slugKey: "스펙만-프리미엄인-중국산의-공습-지커-7X",
        title: "\"스펙만 프리미엄인 중국산의 공습\" 지커 7X 가격 논",
        fullTitle: "\"스펙만 프리미엄인 중국산의 공습\" 지커 7X 가격 논란, 프리미엄 브랜드는 어떻게 정해질까?",
        thumb: "https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2F5l5wN%2FdJMcafUncOR%2FAAAAAAAAAAAAAAAAAAAAAEzkwZ7_T3YcOK3n_HV9oKsipsePwkHm0BAxzV7IJwHu%2Fimg.jpg%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1788188399%26allow_ip%3D%26allow_referer%3D%26signature%3DagSp0cTlEBAz8lXbQkYB4cvw7RA%253D",
        cat: "신차소식",
        baseWeight: 150
    },
    {
        slug: "웨이모-오하이-무인택시.html",
        slugKey: "웨이모-오하이-무인택시",
        title: "\"3천만원에 무인택시를?\" 미국 규제 우회하는 구글 웨",
        fullTitle: "\"3천만원에 무인택시를?\" 미국 규제 우회하는 구글 웨이모의 묘수! 테슬라 긴장 하는 이유",
        thumb: "https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2Fmjxf6%2FdJMcacXB7Uq%2FAAAAAAAAAAAAAAAAAAAAAFe1X_s88jELlQ--ZFO7KBNj70-LJcD-Em_oCUzn2CHW%2Fimg.jpg%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1788188399%26allow_ip%3D%26allow_referer%3D%26signature%3DL9K2bdToSlyU7b%252FbLwhcO7f0e3I%253D",
        cat: "신차소식",
        baseWeight: 150
    },
    {
        slug: "그랜저-페이스리프트-이돈이면.html",
        slugKey: "그랜저-페이스리프트-이돈이면",
        title: "\"이 돈이면 수입차 간다?\" 현대차 그랜저 페이스리프트",
        fullTitle: "\"이 돈이면 수입차 간다?\" 현대차 그랜저 페이스리프트의 초고가 전략, 국산 패밀리카가 마주한 가격 저항선 분석",
        thumb: "https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FCBtk4%2FdJMcabdhNnD%2FAAAAAAAAAAAAAAAAAAAAALLOMKRfguzLtiinh5LW3osH3qf1opm-2dkWHLuRvPC4%2Fimg.jpg%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1788188399%26allow_ip%3D%26allow_referer%3D%26signature%3DsvrAw%252FhXjHuhUFtLtLymfah6lRI%253D",
        cat: "신차소식",
        baseWeight: 150
    },
    {
        slug: "신형-그랜저-vs-기아-K8-정면승부.html",
        slugKey: "신형-그랜저-vs-기아-K8-정면승부",
        title: "\"진짜 돈값 할까?\" 신형 그랜저 vs 기아 K8 정면",
        fullTitle: "\"진짜 돈값 할까?\" 신형 그랜저 vs 기아 K8 정면승부, 이 정도 가격 차이가 만든 시장 파장 분석",
        thumb: "https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FqNaXB%2FdJMcagTgxp1%2FAAAAAAAAAAAAAAAAAAAAAEpUctEKjk2PE9mlZUxifY0vR46FtGffq3OwJKo6SP0Y%2Fimg.jpg%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1788188399%26allow_ip%3D%26allow_referer%3D%26signature%3DuwkOakqLhTj6yDCAdI0tLT8VOvo%253D",
        cat: "신차소식",
        baseWeight: 150
    },
    {
        slug: "BYD-돌핀-G-DM-i.html",
        slugKey: "BYD-돌핀-G-DM-i",
        title: "\"중국산 관세 폭탄도 피한다?\" BYD 돌핀 G DM-",
        fullTitle: "\"중국산 관세 폭탄도 피한다?\" BYD 돌핀 G DM-i 헝가리 공장의 현지화 승부수, 글로벌 소형차 시장에 던진 충격 분석",
        thumb: "https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FC4tDx%2FdJMcajbf3c9%2FAAAAAAAAAAAAAAAAAAAAAGSVfOevxW-j5Tu2_xlNKVhkf6TClnsVmUE4MNTFsw5l%2Fimg.jpg%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1788188399%26allow_ip%3D%26allow_referer%3D%26signature%3DESx06QzoqgJ2hp%252FM%252FDxvgApb57A%253D",
        cat: "신차소식",
        baseWeight: 150
    },
    {
        slug: "뇌이징도-한계가-있다.html",
        slugKey: "뇌이징도-한계가-있다",
        title: "\"뇌이징도 한계가 있다\" 요즘 수입차가 '못생긴 디자인",
        fullTitle: "\"뇌이징도 한계가 있다\" 요즘 수입차가 '못생긴 디자인'을 고집하는 진짜 이유와 대중의 저항",
        thumb: "https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FCd8aw%2FdJMcaayJKUI%2FAAAAAAAAAAAAAAAAAAAAAObEsgqIoEAgIX-brfenxy-8g9rbs9LDYwQw7KQVfE-F%2Fimg.jpg%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1788188399%26allow_ip%3D%26allow_referer%3D%26signature%3DqOx3A1EhLUUoWgl3FRFxDdItTSo%253D",
        cat: "신차소식",
        baseWeight: 150
    },
    {
        slug: "르노-필랑트.html",
        slugKey: "르노-필랑트",
        title: "\"중국산 플랫폼의 역습?\" 르노 필랑트 하이브리드, 실",
        fullTitle: "\"중국산 플랫폼의 역습?\" 르노 필랑트 하이브리드, 실제 차주들이 밝힌 진짜 가치와 한국 시장의 과제 분석",
        thumb: "https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FwONNg%2FdJMcaiXKHhQ%2FAAAAAAAAAAAAAAAAAAAAAEMW8wCxKj2NkcomrBU38gZHPMEFFlUGM0ZY0f72qh9f%2Fimg.jpg%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1788188399%26allow_ip%3D%26allow_referer%3D%26signature%3DZl%252BITUwHL9an6S3m8ISNBRBsFWk%253D",
        cat: "신차소식",
        baseWeight: 150
    },
    {
        slug: "지커7x-국내-인증-완료.html",
        slugKey: "지커7x-국내-인증-완료",
        title: "\"국내 인증 완료에 보조금 0원?\" 중국 지커 7X의 ",
        fullTitle: "\"국내 인증 완료에 보조금 0원?\" 중국 지커 7X의 한국 상륙 선언, 수입 전기차 시장의 지각변동과 보이지 않는 장벽 분석",
        thumb: "https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FD7AL0%2FdJMcadIRzT2%2FAAAAAAAAAAAAAAAAAAAAABapZVb4hoqKU2ZVO0HoiGpVrxH4kZq46EJ_vhP2QKFw%2Fimg.jpg%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1788188399%26allow_ip%3D%26allow_referer%3D%26signature%3DG%252B%252F%252B4EOEQpBgkb3WL9cWyCIBbqU%253D",
        cat: "신차소식",
        baseWeight: 150
    },
    {
        slug: "토요타-랜드크루저-FJ-글로벌-런칭.html",
        slugKey: "토요타-랜드크루저-FJ-글로벌-런칭",
        title: "\"가격 파괴 정통 오프로더의 습격?\" 토요타 랜드크루저",
        fullTitle: "\"가격 파괴 정통 오프로더의 습격?\" 토요타 랜드크루저 FJ 글로벌 런칭, 아시아·신흥국 시장에 몰고 올 지각변동 분석",
        thumb: "https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FbjKKpg%2FdJMcadozH31%2FAAAAAAAAAAAAAAAAAAAAAMGNV7gd5RoknvJQ4sz1i0INiTnSG8Fq7Y8ClF6xKqpd%2Fimg.jpg%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1788188399%26allow_ip%3D%26allow_referer%3D%26signature%3DuiBi%252BLdsAfboSbSkzAh9Klgl12g%253D",
        cat: "신차소식",
        baseWeight: 150
    },
    {
        slug: "충전기-뒷돈.html",
        slugKey: "충전기-뒷돈",
        title: "\"충전기 깔면 뒷돈 수백만 원?\" 보조금 사냥터가 된 ",
        fullTitle: "\"충전기 깔면 뒷돈 수백만 원?\" 보조금 사냥터가 된 아파트 주차장, 전기차 요금 폭등을 부른 독점 구조의 실체 분석",
        thumb: "https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FbBPniX%2FdJMcahLlSvc%2FAAAAAAAAAAAAAAAAAAAAAHfF0d_n_azymM2DXkJOLes4W8vK4JsNUNHBO1Qep0NR%2Fimg.jpg%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1788188399%26allow_ip%3D%26allow_referer%3D%26signature%3DVfiChpXPjHTGDTa6OeXwVO7egLA%253D",
        cat: "신차소식",
        baseWeight: 150
    },
    {
        slug: "토요타-시에나-캠핑.html",
        slugKey: "토요타-시에나-캠핑",
        title: "\"인생의 절정기에 타는 차?\" 토요타 시에나 하이브리드",
        fullTitle: "\"인생의 절정기에 타는 차?\" 토요타 시에나 하이브리드, 결국 선택하게 되는 미니밴의 승차감과 단점 분석",
        thumb: "https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FbGxSxf%2FdJMcagyS4q1%2FAAAAAAAAAAAAAAAAAAAAAOPMpxWMb8YuficDpRk5AuKxygxxzLmNOrCFkT5Cg-HX%2Fimg.jpg%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1788188399%26allow_ip%3D%26allow_referer%3D%26signature%3DPAjLja4kyti8GOtdn8vsJk%252Fwh%252BE%253D",
        cat: "신차소식",
        baseWeight: 150
    },
    {
        slug: "페라리-루체.html",
        slugKey: "페라리-루체",
        title: "\"중국차도 안 베낄 디자인?\" 페라리 전 회장의 독설과",
        fullTitle: "\"중국차도 안 베낄 디자인?\" 페라리 전 회장의 독설과 주가 폭락, 슈퍼카 전동화가 직면한 거대한 시험대 분석",
        thumb: "https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FsxLqi%2FdJMcahR4CbQ%2FAAAAAAAAAAAAAAAAAAAAAK2YqXJcKW8OO2zvaGq2u_0PYdpUrHtd_Zw6BAEzFoG3%2Fimg.jpg%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1788188399%26allow_ip%3D%26allow_referer%3D%26signature%3DqrY6eSLEdhPRW2qmPXRdGaepRpM%253D",
        cat: "신차소식",
        baseWeight: 150
    },
    {
        slug: "하반기-수입-전기-suv.html",
        slugKey: "하반기-수입-전기-suv",
        title: "\"독일 플랫폼 vs 중국 가성비?\" 2026 하반기 프",
        fullTitle: "\"독일 플랫폼 vs 중국 가성비?\" 2026 하반기 프리미엄 전기 SUV 대격돌, 한국 시장이 마주한 구조적 변화 분석",
        thumb: "https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FcgMJHk%2FdJMcaiwIpem%2FAAAAAAAAAAAAAAAAAAAAAF8_tUcf1eE37B8T51p7a9F1aV2hszAFq_K1E68sbkos%2Fimg.jpg%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1788188399%26allow_ip%3D%26allow_referer%3D%26signature%3DKCIOtkVex95stx7fGcu28cHYiy4%253D",
        cat: "신차소식",
        baseWeight: 150
    },
    {
        slug: "샤오펑-p7.html",
        slugKey: "샤오펑-p7",
        title: "4,900만 원대에 에어서스·820km·자율주행까지? ",
        fullTitle: "4,900만 원대에 에어서스·820km·자율주행까지? 샤오펑 P7 한국 출시 가격과 스펙 비교",
        thumb: "https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FbVDGbl%2FdJMcaak5FvA%2FAAAAAAAAAAAAAAAAAAAAAP1v__ncypLsX-DneMro25zYDTgDjNdbBw2r6M-OWLZW%2Fimg.jpg%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1788188399%26allow_ip%3D%26allow_referer%3D%26signature%3D%252FjMbIc73rVqKs7TC1WsTQFejH00%253D",
        cat: "신차소식",
        baseWeight: 150
    },
    {
        slug: "현대-베르나-한국-미출시-이유-—-1660만원짜리-가성비-세단-왜-안방엔-없나.html",
        slugKey: "현대-베르나-한국-미출시-이유-—-1660만원짜리-가성비-세단-왜-안방엔-없나",
        title: "현대 베르나 한국 미출시 이유 — 1,660만원짜리 가",
        fullTitle: "현대 베르나 한국 미출시 이유 — 1,660만원짜리 가성비 세단, 왜 안방엔 없나",
        thumb: "https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2F9jB31%2FdJMcagldo2B%2FAAAAAAAAAAAAAAAAAAAAAJvPpAzE48xs_dlP5I4WOZHAnKOjKTNtm1aTKzf8YAqh%2Fimg.jpg%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1788188399%26allow_ip%3D%26allow_referer%3D%26signature%3D7lBzSZRsiehxCjRF9K7HCMEgqf0%253D",
        cat: "신차소식",
        baseWeight: 150
    }
];

// Backward compatibility alias
const HONEYJAR_POSTS_REGISTRY = CHAGEUL_POSTS_REGISTRY;


// 1. 전역 검색 함수
function searchArticles(keyword) {
    if (!keyword) return [];
    const q = keyword.toLowerCase().trim();
    return CHAGEUL_POSTS_REGISTRY.filter(post => 
        post.fullTitle.toLowerCase().includes(q) || 
        post.cat.toLowerCase().includes(q)
    );
}

// 2. 📈 실시간 조회수 기반 사이드바 인기글 TOP 10 랭킹 엔진
function initDynamicPopularRanking() {
    const isPostPage = window.location.pathname.includes('/entry/') || window.location.pathname.includes('/posts/');
    
    let hiddenSlugs = [];
    try {
        hiddenSlugs = JSON.parse(localStorage.getItem('chageul_hidden_slugs') || localStorage.getItem('honeyjar_hidden_slugs') || '[]');
        const saved = localStorage.getItem('chageul_admin_posts') || localStorage.getItem('honeyjar_admin_posts');
        if (saved) {
            const adminPosts = JSON.parse(saved);
            const legacyHidden = adminPosts.filter(p => p.isHidden).map(p => p.slug);
            hiddenSlugs = Array.from(new Set([...hiddenSlugs, ...legacyHidden]));
        }
    } catch(e) {}

    // 1) 숨김 글 제외 및 점수 계산
    const rankedPosts = CHAGEUL_POSTS_REGISTRY
        .filter(post => !hiddenSlugs.some(s => post.slug.includes(String(s).replace('.html', ''))))
        .map(post => {
            let liveHits = 0;
            try {
                const localHits = parseInt(localStorage.getItem("chageul_views_" + post.slugKey) || localStorage.getItem("honeyjar_views_" + post.slugKey), 10);
                if (!isNaN(localHits)) liveHits = localHits;
            } catch(e) {}
            
            const baseW = (typeof post.baseWeight === "number" && !isNaN(post.baseWeight)) ? post.baseWeight : 100;
            const totalScore = baseW + (liveHits * 3);
            return {
                ...post,
                score: totalScore,
                linkUrl: isPostPage ? post.slug : `entry/${post.slug}`
            };
        });

    // 2) 점수 내림차순 정렬 후 상위 10개 추출
    rankedPosts.sort((a, b) => b.score - a.score);
    const top10 = rankedPosts.slice(0, 10);

        // 3) PC 상단 히어로 인기글 TOP 10 동적 렌더링
    const heroList = document.getElementById('mainHeroPopularList');
    if (heroList) {
        let html = '';
        top10.forEach((item, idx) => {
            const rankNum = idx + 1;
            const rankColor = rankNum <= 3 ? '#c26908' : (rankNum <= 5 ? '#ea580c' : '#94a3b8');
            html += `
                <li style="display:flex; align-items:center; gap:10px; padding:3px 0; border-bottom:1px solid #f8fafc;">
                    <span style="font-size:0.95rem; font-weight:900; color:${rankColor}; width:20px; text-align:center; flex-shrink:0;">${rankNum}</span>
                    <a href="${item.linkUrl}" style="font-size:0.88rem; font-weight:${rankNum <= 3 ? '700' : '650'}; color:${rankNum <= 3 ? '#1e293b' : '#334155'}; text-decoration:none; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; flex:1;" title="${item.fullTitle}">${item.fullTitle}</a>
                </li>
            `;
        });
        heroList.innerHTML = html;
    }

    // 4) 모바일 메인 피드 인기글 TOP 5 동적 렌더링
    const mobTop5Container = document.getElementById('mobilePopularTop5List');
    if (mobTop5Container) {
        let html = '';
        top10.slice(0, 5).forEach((item, idx) => {
            const rankNum = idx + 1;
            const rankColor = rankNum <= 3 ? '#c26908' : '#94a3b8';
            html += `
                <div style="display:flex; justify-content:space-between; align-items:center; padding:11px 0; border-bottom:1px solid #f1f5f9; cursor:pointer;" onclick="location.href='${item.linkUrl}'">
                    <div style="flex:1; padding-right:12px; min-width:0;">
                        <h4 style="font-size:0.90rem; font-weight:800; color:#111827; margin:0 0 4px 0; line-height:1.35; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">
                            ${item.fullTitle}
                        </h4>
                        <div style="display:flex; align-items:center; font-size:0.75rem;">
                            <span style="font-weight:800; color:${rankColor}; margin-right:8px;">TOP ${rankNum}</span>
                            <span style="color:#64748b;">${item.cat || '신차소식'}</span>
                        </div>
                    </div>
                    <img src="${item.thumb}" alt="${item.fullTitle}" style="width:60px; height:60px; border-radius:10px; object-fit:cover; flex-shrink:0;">
                </div>
            `;
        });
        mobTop5Container.innerHTML = html;
    }

    // 5) 본문 페이지 사이드바 위젯 렌더링
    const sidebarLists = document.querySelectorAll('.popular-list, #popularPostsWidgetList');
    sidebarLists.forEach(listEl => {
        let html = '';
        top10.forEach((item, idx) => {
            const rankNum = idx + 1;
            const rankColor = rankNum <= 3 ? '#c26908' : (rankNum <= 5 ? '#ea580c' : '#94a3b8');
            html += `
                <li class="popular-item" style="display:flex; align-items:center; gap:10px; padding:7px 0; border-bottom:1px solid #f8fafc;">
                    <span class="popular-rank" style="font-size:0.95rem; font-weight:900; color:${rankColor}; width:20px; text-align:center; flex-shrink:0;">${rankNum}</span>
                    <a href="${item.linkUrl}" class="popular-link" style="font-size:0.86rem; font-weight:${rankNum <= 3 ? '700' : '650'}; color:${rankNum <= 3 ? '#1e293b' : '#334155'}; text-decoration:none; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; flex:1;" title="${item.fullTitle}">${item.fullTitle}</a>
                </li>
            `;
        });
        listEl.innerHTML = html;
    });
}

// 3. 모바일 하단바 공감 & 링크 복사
function toggleBottomHeart(btn) {
    const heartCountEl = btn.querySelector('.heart-count');
    const isLiked = btn.classList.contains('liked');
    let count = parseInt(heartCountEl.innerText, 10) || 0;

    if (isLiked) {
        btn.classList.remove('liked');
        heartCountEl.innerText = Math.max(0, count - 1);
        btn.querySelector('svg').style.fill = 'none';
        btn.querySelector('svg').style.stroke = '#475569';
    } else {
        btn.classList.add('liked');
        heartCountEl.innerText = count + 1;
        btn.querySelector('svg').style.fill = '#e11d48';
        btn.querySelector('svg').style.stroke = '#e11d48';
        showToast('공감해 주셔서 감사합니다! ❤️');
    }
}

function syncBottomCommentCount(count) {
    const commentCountEl = document.querySelector('.naver-bottom-btn[onclick*="scrollToComments"] .comment-count');
    if (commentCountEl) {
        commentCountEl.innerText = count;
    }
}

function scrollToComments() {
    const commentSection = document.getElementById('commentSectionWrapper') || document.querySelector('.comment-section');
    if (commentSection) {
        commentSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}





// 4. 자동 초기화
document.addEventListener('DOMContentLoaded', () => {
    renderEditorPickCard();
    initDynamicPopularRanking();
    });




// 🔗 모바일 OS 공유창 & 클립보드 복사 토스트 완벽 지원
function showToast(message) {
    let toast = document.getElementById('chageulBottomToast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'chageulBottomToast';
        toast.className = 'chageul-toast';
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
        toast.classList.remove('show');
    }, 2500);
}

function copyCurrentUrl() {
    const url = window.location.href;
    const title = document.title || '차를 쓰다';

    // 1. 모바일 브라우저 Web Share API 지원 시 (카톡, 메시지 등 네이티브 공유창)
    if (navigator.share && /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)) {
        navigator.share({
            title: title,
            url: url
        }).catch((err) => {
            // 사용자가 공유창 취소한 경우는 무시
            if (err.name !== 'AbortError') {
                copyUrlFallback(url);
            }
        });
    } else {
        // 2. PC 또는 미지원 환경: 클립보드 즉시 복사 + 토스트 알림
        copyUrlFallback(url);
    }
}

function copyUrlFallback(url) {
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(url).then(() => {
            showToast('✓ 글 링크가 클립보드에 복사되었습니다.');
        }).catch(() => {
            legacyCopyText(url);
        });
    } else {
        legacyCopyText(url);
    }
}

function legacyCopyText(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    textArea.style.top = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            showToast('✓ 글 링크가 클립보드에 복사되었습니다.');
        } else {
            prompt('링크를 복사해주세요:', text);
        }
    } catch (err) {
        prompt('링크를 복사해주세요:', text);
    }
    document.body.removeChild(textArea);
}


    // 🌟 [에디터 PICK 전용 데이터 바인딩 엔진: 100% 무결점 자동 렌더링]
    function renderEditorPickCard() {
        if (typeof CHAGEUL_POSTS_REGISTRY === 'undefined' || !Array.isArray(CHAGEUL_POSTS_REGISTRY) || CHAGEUL_POSTS_REGISTRY.length === 0) return;
        
        // isEditorPick: true인 글 검색 (없으면 첫 번째 글)
        const localPickSlug = localStorage.getItem('chageul_editor_pick_slug') || localStorage.getItem('honeyjar_editor_pick_slug');
        let pickPost = null;
        if (localPickSlug) {
            pickPost = CHAGEUL_POSTS_REGISTRY.find(p => p.slug === localPickSlug || p.slug === localPickSlug + '.html' || p.slug.replace('.html','') === localPickSlug.replace('.html',''));
        }
        if (!pickPost) {
            pickPost = CHAGEUL_POSTS_REGISTRY.find(p => p.isEditorPick === true) || CHAGEUL_POSTS_REGISTRY[0];
        }
        if (!pickPost) return;

        const postHref = 'entry/' + pickPost.slug;
        const postTitle = pickPost.fullTitle || pickPost.title || '';
        const postThumb = pickPost.thumb || '';
        const postCat = pickPost.cat || '포커스';
        const postDate = pickPost.date || '2026. 8. 30.';
        const postDesc = pickPost.summary || `"${postTitle}"에 대한 상세 분석 및 가이드`;

        // 1. PC 좌측 히어로 대형 배너 업데이트
        const heroLeft = document.querySelector('.hero-master-left');
        if (heroLeft) {
            const heroA = heroLeft.querySelector('a');
            const heroImg = heroLeft.querySelector('img');
            const heroCat = heroLeft.querySelector('.hero-cat-tag');
            const heroH2A = heroLeft.querySelector('.hero-title-text a');
            const heroDesc = heroLeft.querySelector('.hero-desc-text');
            const heroMeta = heroLeft.querySelector('div[style*="border-top"] span');

            if (heroA) heroA.setAttribute('href', postHref);
            if (heroImg) {
                heroImg.setAttribute('src', postThumb);
                heroImg.setAttribute('alt', postTitle);
            }
            if (heroCat) heroCat.textContent = postCat;
            if (heroH2A) {
                heroH2A.setAttribute('href', postHref);
                heroH2A.textContent = postTitle;
            }
            if (heroDesc) heroDesc.textContent = `"${postDesc}"`;
            if (heroMeta) heroMeta.textContent = `차를 쓰다 · ${postDate}`;
        }

        // 2. 모바일 매거진 커버 배너 업데이트
        const mobPick = document.querySelector('.mobile-editor-pick-card');
        if (mobPick) {
            mobPick.setAttribute('onclick', `location.href='${postHref}'`);
            const mobImg = mobPick.querySelector('img');
            const mobH3 = mobPick.querySelector('h3');
            const mobP = mobPick.querySelector('p');
            const mobDate = mobPick.querySelector('div[style*="border-top"] span');

            if (mobImg) {
                mobImg.setAttribute('src', postThumb);
                mobImg.setAttribute('alt', postTitle);
            }
            if (mobH3) mobH3.textContent = postTitle;
            if (mobP) mobP.textContent = `"${postDesc}"`;
            if (mobDate) mobDate.textContent = `차를 쓰다 · ${postDate}`;
        }
    }
