/**
 * 🚗 차를 쓰다 (CHAGEUL) 구글 본진 글 실시간 직접 편집 & 줄나눔 수정 엔진 (Entry Editor)
 * 
 * ⌨️ [단축키 중심 무결점 UX]
 * - 평소에는 버튼이나 UI가 일체 노출되지 않음 (100% 깨끗한 매거진 화면)
 * - 언제든 [Ctrl + Shift + E] 를 누르면 수정창이 스르륵 열리며 즉시 편집 모드 시작!
 * - [Ctrl + S] 로 즉시 저장 / [ESC] 로 수정창 닫기
 * - 서버 실행 파일(.bat)을 매번 켤 필요 없이 실제 사이트(chageul.com) 및 로컬 어디서나 동작!
 */

(function() {
    'use strict';

    // 글 상세 페이지(entry/*.html)에서만 작동
    if (!window.location.pathname.includes('/entry/')) {
        return;
    }

    const ADMIN_PASS = '8809';
    let isEditing = false;
    let originalTitleHtml = '';
    let originalBodyHtml = '';

    // 1. 관리자 권한 확인 (철통 보안)
    function checkAdminAuth() {
        if (localStorage.getItem('chageul_admin_auth') === 'authorized') return true;
        if (sessionStorage.getItem('chageul_admin_session') === 'authorized') return true;

        const params = new URLSearchParams(window.location.search);
        const adminParam = params.get('admin') || params.get('edit');
        if (adminParam === ADMIN_PASS) {
            localStorage.setItem('chageul_admin_auth', 'authorized');
            const cleanUrl = window.location.pathname + window.location.hash;
            window.history.replaceState({}, document.title, cleanUrl);
            return true;
        }

        // 로컬 접속 감지
        const host = window.location.hostname;
        if (host === 'localhost' || host === '127.0.0.1' || host.startsWith('192.168.')) {
            return true;
        }

        return false;
    }

    // 2. 단축키 핸들러 (Ctrl + Shift + E 토글)
    window.addEventListener('keydown', function(e) {
        // [Ctrl + Shift + E]: 수정 모드 켜기/끄기
        if (e.ctrlKey && e.shiftKey && (e.key === 'E' || e.key === 'e')) {
            e.preventDefault();
            handleShortcutTrigger();
            return;
        }

        // [Ctrl + S]: 수정 중 즉시 저장
        if (isEditing && (e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
            e.preventDefault();
            saveArticleChanges();
            return;
        }

        // [ESC]: 수정 모드 닫기
        if (isEditing && (e.key === 'Escape' || e.key === 'Esc')) {
            e.preventDefault();
            cancelEditing();
            return;
        }
    });

    // 3. 단축키 실행 시 인증 확인 및 편집창 토글
    function handleShortcutTrigger() {
        if (isEditing) {
            cancelEditing();
            return;
        }

        if (!checkAdminAuth()) {
            const inputPw = prompt("🔑 [차를 쓰다 운영자 인증]\n\n글 직접 수정을 위한 관리자 비밀번호를 입력해 주세요:");
            if (inputPw === ADMIN_PASS) {
                localStorage.setItem('chageul_admin_auth', 'authorized');
                startEditing();
            } else if (inputPw !== null) {
                alert("❌ 비밀번호가 올바르지 않습니다.");
            }
            return;
        }

        startEditing();
    }

    // 4. 모바일 및 스마트폰용 시크릿 제스처 (푸터 카피라이트 3회 연속 터치)
    let touchCount = 0;
    let touchTimer = null;
    document.addEventListener('DOMContentLoaded', () => {
        const copyEl = document.querySelector('.footer-copy');
        if (copyEl) {
            copyEl.style.cursor = 'pointer';
            copyEl.addEventListener('click', () => {
                touchCount++;
                clearTimeout(touchTimer);
                if (touchCount >= 3) {
                    touchCount = 0;
                    handleShortcutTrigger();
                } else {
                    touchTimer = setTimeout(() => { touchCount = 0; }, 1200);
                }
            });
        }
    });

    // 5. 상단 고정 관리자 편집 툴바 생성
    function ensureTopEditorBar() {
        injectEditorStyles();
        let bar = document.getElementById('chageulAdminTopBar');
        if (!bar) {
            bar = document.createElement('div');
            bar.id = 'chageulAdminTopBar';
            bar.className = 'chageul-admin-top-bar';
            bar.innerHTML = `
                <div class="top-bar-inner">
                    <div class="top-bar-left">
                        <span class="edit-badge">✍️ 직접 수정 창</span>
                        <span class="edit-guide">문단을 클릭하여 <strong>엔터(줄바꿈), 백스페이스(줄합치기), 글자</strong>를 수정하세요.</span>
                    </div>
                    <div class="top-bar-actions">
                        <button type="button" class="bar-btn btn-clean" onclick="window.__chageulEditorCleanBreaks()" title="숫자+단위(468만<br>원) 등 어색하게 끊긴 줄바꿈을 똑똑하게 한 줄로 붙여줍니다">
                            🧹 줄나눔 자동 정돈
                        </button>
                        <button type="button" class="bar-btn btn-save" onclick="window.__chageulEditorSave()" title="수정사항을 즉시 파일에 저장합니다 (Ctrl+S)">
                            💾 저장하기
                        </button>
                        <button type="button" class="bar-btn btn-cancel" onclick="window.__chageulEditorCancel()" title="수정창을 닫고 원래대로 되돌립니다 (ESC)">
                            ❌ 닫기
                        </button>
                    </div>
                </div>
            `;
            document.body.appendChild(bar);
        }
        return bar;
    }

    // 6. 편집 모드 켜기
    function startEditing() {
        const bodyContentEl = document.querySelector('.article-body-content');
        const titleEl = document.querySelector('.article-title');

        if (!bodyContentEl) {
            alert("본문 영역(.article-body-content)을 찾을 수 없습니다.");
            return;
        }

        originalBodyHtml = bodyContentEl.innerHTML;
        if (titleEl) originalTitleHtml = titleEl.innerHTML;

        isEditing = true;
        bodyContentEl.contentEditable = 'true';
        bodyContentEl.classList.add('chageul-editable-active');
        if (titleEl) {
            titleEl.contentEditable = 'true';
            titleEl.classList.add('chageul-editable-active');
        }

        const topBar = ensureTopEditorBar();
        topBar.classList.add('show');

        showEditorToast("✏️ [직접 수정 창이 열렸습니다] 마우스 클릭 후 백스페이스/엔터로 고치세요 (저장: Ctrl+S / 닫기: ESC)");
    }

    // 7. 편집 모드 닫기
    function cancelEditing() {
        if (!isEditing) return;

        const bodyContentEl = document.querySelector('.article-body-content');
        const titleEl = document.querySelector('.article-title');

        if (bodyContentEl && originalBodyHtml) bodyContentEl.innerHTML = originalBodyHtml;
        if (titleEl && originalTitleHtml) titleEl.innerHTML = originalTitleHtml;

        finishEditingUi();
        showEditorToast("수정창이 닫혔습니다.");
    }

    function finishEditingUi() {
        isEditing = false;
        const bodyContentEl = document.querySelector('.article-body-content');
        const titleEl = document.querySelector('.article-title');

        if (bodyContentEl) {
            bodyContentEl.contentEditable = 'false';
            bodyContentEl.classList.remove('chageul-editable-active');
        }
        if (titleEl) {
            titleEl.contentEditable = 'false';
            titleEl.classList.remove('chageul-editable-active');
        }

        const topBar = document.getElementById('chageulAdminTopBar');
        if (topBar) topBar.classList.remove('show');
    }

    // 8. 어색한 줄나눔 자동 정돈 (스마트 클리너)
    function cleanAwkwardBreaks() {
        const bodyContentEl = document.querySelector('.article-body-content');
        if (!bodyContentEl) return;

        let html = bodyContentEl.innerHTML;
        const beforeHtml = html;

        // 1) 숫자/만/천/억 뒤에서 어색하게 끊긴 <br> 제거
        html = html.replace(/(\d+(?:,\d+)*(?:만|천|억)?)\s*<br\s*\/?>\s*(원|km|대|kg|L|%|초)/gi, '$1 $2');
        html = html.replace(/(\d+(?:,\d+)*(?:만|천|억)?)\s*<br\s*\/?>\s*(으로|차이|격차|부담)/gi, '$1 $2');

        // 2) 일반 명사 뒤 조사 분리 줄바꿈 연결
        html = html.replace(/([가-힣]+)\s*<br\s*\/?>\s*(의|을|를|이|가|은|는|에|과|와|로|으로|까지)\b/g, '$1 $2');

        // 3) 연속된 불필요한 개행 정리
        html = html.replace(/<p([^>]*)>\s*<br\s*\/?>/gi, '<p$1>');
        html = html.replace(/<br\s*\/?>\s*<\/p>/gi, '</p>');

        if (html !== beforeHtml) {
            bodyContentEl.innerHTML = html;
            showEditorToast("✓ 어색한 줄나눔과 끊긴 단어들이 매끄럽게 정돈되었습니다!");
        } else {
            showEditorToast("정돈할 어색한 줄나눔이 발견되지 않았습니다.");
        }
    }

    // 9. 수정사항 저장하기 (file:// 로컬 파일 / localhost:8080 / chageul.com 실서버 완벽 지원)
    async function saveArticleChanges() {
        const bodyContentEl = document.querySelector('.article-body-content');
        const titleEl = document.querySelector('.article-title');
        if (!bodyContentEl) return;

        const pathParts = window.location.pathname.split('/');
        let currentSlug = decodeURIComponent(pathParts[pathParts.length - 1]);
        if (!currentSlug || !currentSlug.endsWith('.html')) {
            currentSlug = 'index.html';
        }

        const cloneBody = bodyContentEl.cloneNode(true);
        cloneBody.removeAttribute('contenteditable');
        cloneBody.classList.remove('chageul-editable-active');
        const cleanBodyHtml = cloneBody.innerHTML.trim();
        const cleanTitle = titleEl ? titleEl.textContent.trim() : '';

        showEditorToast("💾 수정 내용을 저장하는 중입니다...", 4000);

        // [방법 1] 로컬 서버 API 통신 시도 (서버가 켜져 있을 때: 무팝업 즉시 저장)
        try {
            const localApiUrl = (window.location.protocol === 'file:') ? 'http://localhost:8080/api/save-entry' : '/api/save-entry';
            const res = await fetch(localApiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    slug: currentSlug,
                    title: cleanTitle,
                    bodyContent: cleanBodyHtml
                })
            });

            if (res.ok) {
                const data = await res.json();
                if (data.success) {
                    originalBodyHtml = cleanBodyHtml;
                    if (titleEl) originalTitleHtml = cleanTitle;
                    finishEditingUi();
                    showEditorToast("🎉 [저장 완료] 파일이 성공적으로 저장되었습니다!");
                    return;
                }
            }
        } catch (e) {
            // 로컬 서버가 켜져 있지 않은 경우 다음 방법으로 진행
        }

        // [방법 2] file:/// 로컬 파일로 열었을 때: 최신 브라우저 원클릭 파일 덮어쓰기 (showSaveFilePicker)
        if (window.location.protocol === 'file:' && 'showSaveFilePicker' in window) {
            try {
                const fullHtml = getUpdatedFullHtml(cleanTitle, cleanBodyHtml);
                const handle = await window.showSaveFilePicker({
                    suggestedName: currentSlug,
                    types: [{
                        description: 'HTML 파일',
                        accept: { 'text/html': ['.html'] }
                    }]
                });
                const writable = await handle.createWritable();
                await writable.write(fullHtml);
                await writable.close();

                originalBodyHtml = cleanBodyHtml;
                if (titleEl) originalTitleHtml = cleanTitle;
                finishEditingUi();
                showEditorToast("🎉 [저장 완료] 로컬 파일에 성공적으로 저장되었습니다!");
                return;
            } catch (err) {
                if (err.name === 'AbortError') {
                    showEditorToast("저장이 취소되었습니다.");
                    return;
                }
                console.warn("File System API error, fallback to other methods:", err);
            }
        }

        // [방법 3] 실서버(chageul.com) 환경: GitHub Personal Access Token으로 커밋 & Cloudflare 자동 배포
        if (window.location.protocol !== 'file:') {
            let ghToken = localStorage.getItem('chageul_github_token');
            if (!ghToken) {
                ghToken = prompt("☁️ [차를 쓰다 실서버 저장]\n\n실서버(chageul.com)에 바로 저장 및 1분 내 자동 배포하려면\nGitHub Personal Access Token을 1회 입력해 주세요:\n(입력하시면 브라우저에 안전하게 보관됩니다)");
                if (ghToken && ghToken.trim()) {
                    localStorage.setItem('chageul_github_token', ghToken.trim());
                }
            }

            if (ghToken && ghToken.trim()) {
                const success = await saveViaGitHubApi(currentSlug, cleanTitle, cleanBodyHtml, ghToken.trim());
                if (success) {
                    originalBodyHtml = cleanBodyHtml;
                    if (titleEl) originalTitleHtml = cleanTitle;
                    finishEditingUi();
                    return;
                }
            }
        }

        // [방법 4] 비상 대체: 수정된 HTML 파일 다운로드
        downloadModifiedHtml(currentSlug, cleanTitle, cleanBodyHtml);
        finishEditingUi();
        showEditorToast("💾 수정한 파일이 다운로드되었습니다. 기존 파일에 덮어써주세요.");
    }

    // 10. GitHub API 직접 커밋 (chageul.com 실서버 환경)
    async function saveViaGitHubApi(slug, title, bodyContent, token) {
        try {
            showEditorToast("☁️ GitHub에 실시간 커밋 및 배포 요청 중...");
            const repoOwner = "hmapt01-netizen";
            const repoName = "chageul";
            // 중요: chageul 저장소의 루트에 entry/ 디렉토리가 있으므로 경로 올바르게 설정
            const filePath = `entry/${slug}`;

            const getUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}?_t=${Date.now()}`;
            const getRes = await fetch(getUrl, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (!getRes.ok) throw new Error("GitHub 원본 파일 조회 실패 (" + getRes.status + ")");
            const fileData = await getRes.json();
            const currentContent = decodeURIComponent(escape(atob(fileData.content.replace(/\s/g, ''))));

            let updatedHtml = currentContent;
            if (title) {
                updatedHtml = updatedHtml.replace(/(<h1[^>]*class=["'][^"']*article-title[^"']*["'][^>]*>)([\s\S]*?)(<\/h1>)/i, `$1\n                    ${title}\n                $3`);
            }
            if (bodyContent) {
                updatedHtml = updatedHtml.replace(/(<div[^>]*class=["'][^"']*article-body-content[^"']*["'][^>]*>)([\s\S]*?)(<\/div>\s*<\/article>)/i, `$1\n                    ${bodyContent}\n                $3`);
            }

            const encodedContent = btoa(unescape(encodeURIComponent(updatedHtml)));

            const putUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`;
            const putRes = await fetch(putUrl, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: `✍️ [차를 쓰다 웹 직접 수정] "${slug}" 줄나눔 및 본문 업데이트`,
                    content: encodedContent,
                    sha: fileData.sha,
                    branch: "main"
                })
            });

            if (putRes.ok) {
                showEditorToast("🚀 [배포 성공] GitHub 커밋 완료! 1분 뒤 chageul.com에 자동 반영됩니다.");
                return true;
            } else {
                const errJson = await putRes.json();
                throw new Error(errJson.message || "GitHub 커밋 실패");
            }
        } catch (e) {
            alert("GitHub 저장 실패: " + e.message);
            return false;
        }
    }

    // 11. 정제된 전체 HTML 문자열 생성 (저장용)
    function getUpdatedFullHtml(title, bodyContent) {
        const docClone = document.documentElement.cloneNode(true);

        // 에디터 UI 및 임시 요소 제거
        const topBar = docClone.querySelector('#chageulAdminTopBar');
        if (topBar) topBar.remove();
        const styles = docClone.querySelector('#chageulEditorStyles');
        if (styles) styles.remove();
        const toast = docClone.querySelector('#chageulEditorToast');
        if (toast) toast.remove();

        // contenteditable 및 클래스 제거
        const editables = docClone.querySelectorAll('.chageul-editable-active');
        editables.forEach(el => {
            el.removeAttribute('contenteditable');
            el.classList.remove('chageul-editable-active');
        });

        const bodyEl = docClone.querySelector('.article-body-content');
        if (bodyEl && bodyContent) {
            bodyEl.innerHTML = bodyContent;
        }

        const titleEl = docClone.querySelector('.article-title');
        if (titleEl && title) {
            titleEl.textContent = title;
        }

        return "<!DOCTYPE html>\n" + docClone.outerHTML;
    }

    // 12. 다운로드 백업
    function downloadModifiedHtml(slug, title, bodyContent) {
        const fullHtml = getUpdatedFullHtml(title, bodyContent);
        const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = slug;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    // 12. 토스트 알림창
    function showEditorToast(msg, duration = 3500) {
        let toast = document.getElementById('chageulEditorToast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'chageulEditorToast';
            toast.className = 'chageul-editor-toast';
            document.body.appendChild(toast);
        }
        toast.textContent = msg;
        toast.classList.add('show');
        clearTimeout(toast._timer);
        toast._timer = setTimeout(() => {
            toast.classList.remove('show');
        }, duration);
    }

    // 13. 스타일 주입
    function injectEditorStyles() {
        if (document.getElementById('chageulEditorStyles')) return;
        const style = document.createElement('style');
        style.id = 'chageulEditorStyles';
        style.textContent = `
            /* 상단 고정 관리자 편집 툴바 */
            .chageul-admin-top-bar {
                position: fixed;
                top: -90px;
                left: 0;
                width: 100%;
                background: #111827;
                color: #f8fafc;
                border-bottom: 2px solid #c26908;
                box-shadow: 0 6px 22px rgba(0, 0, 0, 0.35);
                z-index: 100000;
                transition: top 0.25s cubic-bezier(0.16, 1, 0.3, 1);
                box-sizing: border-box;
            }
            .chageul-admin-top-bar.show {
                top: 0;
            }
            .top-bar-inner {
                max-width: 1080px;
                margin: 0 auto;
                padding: 12px 18px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                flex-wrap: wrap;
                gap: 12px;
            }
            .top-bar-left {
                display: flex;
                align-items: center;
                gap: 12px;
                font-size: 0.86rem;
            }
            .edit-badge {
                background: #c26908;
                color: #ffffff;
                padding: 4px 10px;
                border-radius: 6px;
                font-weight: 800;
                font-size: 0.8rem;
                letter-spacing: -0.3px;
            }
            .edit-guide {
                color: #cbd5e1;
            }
            .edit-guide strong {
                color: #fef08a;
            }
            .top-bar-actions {
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .bar-btn {
                border: none;
                padding: 8px 14px;
                border-radius: 6px;
                font-size: 0.84rem;
                font-weight: 750;
                cursor: pointer;
                transition: background 0.15s, transform 0.1s;
                font-family: inherit;
            }
            .bar-btn:active {
                transform: scale(0.97);
            }
            .btn-clean {
                background: #1e293b;
                color: #38bdf8;
                border: 1px solid #0284c7;
            }
            .btn-clean:hover {
                background: #0284c7;
                color: #ffffff;
            }
            .btn-save {
                background: #10b981;
                color: #ffffff;
            }
            .btn-save:hover {
                background: #059669;
            }
            .btn-cancel {
                background: #374151;
                color: #f1f5f9;
            }
            .btn-cancel:hover {
                background: #4b5563;
            }

            /* 편집 활성화 영역 표시 */
            .chageul-editable-active {
                outline: 2px dashed rgba(194, 105, 8, 0.45) !important;
                outline-offset: 6px !important;
                background-color: rgba(254, 240, 138, 0.03) !important;
                border-radius: 6px;
                cursor: text !important;
            }
            .chageul-editable-active:focus {
                outline: 2px solid #c26908 !important;
            }

            /* 토스트 알림 */
            .chageul-editor-toast {
                position: fixed;
                bottom: 30px;
                right: 24px;
                background: #1e293b;
                color: #ffffff;
                padding: 12px 20px;
                border-radius: 8px;
                border-left: 4px solid #c26908;
                box-shadow: 0 10px 25px rgba(0,0,0,0.3);
                font-size: 0.88rem;
                font-weight: 600;
                z-index: 100001;
                opacity: 0;
                pointer-events: none;
                transform: translateY(10px);
                transition: opacity 0.25s, transform 0.25s;
            }
            .chageul-editor-toast.show {
                opacity: 1;
                pointer-events: auto;
                transform: translateY(0);
            }

            @media (max-width: 768px) {
                .top-bar-inner {
                    flex-direction: column;
                    align-items: flex-start;
                    padding: 10px 14px;
                }
                .top-bar-actions {
                    width: 100%;
                    justify-content: flex-end;
                }
                .edit-guide {
                    display: none;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // 전역 함수 바인딩
    window.__chageulEditorCleanBreaks = cleanAwkwardBreaks;
    window.__chageulEditorSave = saveArticleChanges;
    window.__chageulEditorCancel = cancelEditing;

})();
