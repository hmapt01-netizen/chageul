﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿/**
 * 🚗 차를 쓰다 (CHAGEUL) 통합 기능 & 실시간 라이브 검색 및 인기글 TOP 10 랭킹 엔진
 */

var ABACUS_BASE = window.ABACUS_BASE || "https://abacus.jasoncameron.dev";
var ABACUS_NS = window.ABACUS_NS || "chageul_auto";

var CHAGEUL_POSTS_REGISTRY = window.CHAGEUL_POSTS_REGISTRY;

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
        const localPickSlug = localStorage.getItem('chageul_editor_pick_slug');
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

            if (heroA && heroA.getAttribute('href') !== postHref) heroA.setAttribute('href', postHref);
            if (heroImg && heroImg.getAttribute('src') !== postThumb) {
                heroImg.setAttribute('src', postThumb);
                heroImg.setAttribute('alt', postTitle);
            }
            if (heroCat && heroCat.textContent !== postCat) heroCat.textContent = postCat;
            if (heroH2A && heroH2A.textContent !== postTitle) {
                heroH2A.setAttribute('href', postHref);
                heroH2A.textContent = postTitle;
            }
            if (heroDesc && heroDesc.textContent !== `"${postDesc}"`) heroDesc.textContent = `"${postDesc}"`;
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

            if (mobImg && mobImg.getAttribute('src') !== postThumb) {
                mobImg.setAttribute('src', postThumb);
                mobImg.setAttribute('alt', postTitle);
            }
            if (mobH3 && mobH3.textContent !== postTitle) mobH3.textContent = postTitle;
            if (mobP && mobP.textContent !== `"${postDesc}"`) mobP.textContent = `"${postDesc}"`;
            if (mobDate) mobDate.textContent = `차를 쓰다 · ${postDate}`;
        }
    }
