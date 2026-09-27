# -*- coding: utf-8 -*-
"""
🚗 차를 쓰다 (CHAGEUL) 로컬 전용 실시간 개발 & 미리보기 서버
- 정적 파일 고속 서빙 (UTF-8, 무캐시, 모바일 LAN 바인딩)
- [API] POST /api/save-entry: 글 본문 및 줄나눔 실시간 파일 덮어쓰기 저장
- [API] POST /api/auth-check: 관리자 비밀번호 검증
"""
import os
import sys
import json
import re
import shutil
from http.server import HTTPServer, SimpleHTTPRequestHandler
import urllib.parse
import socket

# Windows 콘솔 UTF-8 출력 보장
if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

PORT = 8080
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(BASE_DIR)
ENTRY_DIR = os.path.join(BASE_DIR, 'entry')
DATA_DIR = os.path.join(PROJECT_ROOT, 'data')
POSTS_DB_PATH = os.path.join(DATA_DIR, 'posts_db.json')

TOOLS_DIR = os.path.join(PROJECT_ROOT, 'tools')
if TOOLS_DIR not in sys.path:
    sys.path.insert(0, TOOLS_DIR)
try:
    from paragraph_splitter import format_body_readability
except ImportError:
    format_body_readability = lambda x, **kw: x

def get_local_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(('8.8.8.8', 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return '127.0.0.1'

class ChageulServerHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=BASE_DIR, **kwargs)

    def end_headers(self):
        # 개발 모드 캐시 방지 헤더
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_POST(self):
        url_path = urllib.parse.urlparse(self.path).path

        if url_path == '/api/save-entry':
            self.handle_save_entry()
        elif url_path == '/api/auth-check':
            self.handle_auth_check()
        else:
            self.send_response(404)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.end_headers()
            self.wfile.write(json.dumps({'error': 'Not Found'}).encode('utf-8'))

    def handle_auth_check(self):
        try:
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length).decode('utf-8')
            data = json.loads(body)
            pw = str(data.get('pw', '')).strip()

            if pw == '8809':
                res = {'success': True, 'token': 'chageul_authorized_8809'}
            else:
                res = {'success': False, 'message': '비밀번호가 올바르지 않습니다.'}

            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.end_headers()
            self.wfile.write(json.dumps(res, ensure_ascii=False).encode('utf-8'))
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.end_headers()
            self.wfile.write(json.dumps({'success': False, 'error': str(e)}).encode('utf-8'))

    def handle_save_entry(self):
        try:
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length).decode('utf-8')
            data = json.loads(body)

            slug = data.get('slug', '').strip()
            title = data.get('title', '').strip()
            body_content = data.get('bodyContent', '').strip()
            if body_content:
                body_content = format_body_readability(body_content, max_chars=220)

            if not slug:
                raise ValueError("슬러그(파일명)가 누락되었습니다.")

            # .html 확장자 확인
            if not slug.endswith('.html'):
                slug += '.html'

            target_file = os.path.join(ENTRY_DIR, slug)
            html_text = ""
            if not os.path.exists(target_file):
                # slug가 파일명과 다를 경우 대비해 검색
                matched = None
                for fname in os.listdir(ENTRY_DIR):
                    if fname.lower() == slug.lower() or fname.lower().endswith(slug.lower()):
                        matched = os.path.join(ENTRY_DIR, fname)
                        break
                if matched:
                    target_file = matched
                else:
                    # 신규 포스트 자동 생성 모드: 마스터 템플릿으로부터 신규 HTML 파일 생성
                    tpl_path = os.path.join(BASE_DIR, 'templates', 'master_template.html')
                    if os.path.exists(tpl_path):
                        with open(tpl_path, 'r', encoding='utf-8-sig') as f_tpl:
                            html_text = f_tpl.read()
                    else:
                        html_text = "<!DOCTYPE html><html lang='ko'><head><meta charset='utf-8'><title>{{META_TITLE}}</title></head><body><main><article><h1 class='article-title'>{{H1_TITLE}}</h1><div class='article-body-content'>{{BODY_CONTENT_HTML}}</div></article></main></body></html>"
                    
                    category = data.get('category', '신차소식')
                    thumb = data.get('thumb', 'images/logo.png')
                    desc = data.get('desc', title)
                    now_date = time.strftime('%Y.%m.%d')
                    
                    html_text = html_text.replace("{{META_TITLE}}", title or slug)
                    html_text = html_text.replace("{{H1_TITLE}}", title or slug)
                    html_text = html_text.replace("{{META_DESCRIPTION}}", desc)
                    html_text = html_text.replace("{{SHORT_TITLE}}", title or slug)
                    html_text = html_text.replace("{{CATEGORY_TITLE}}", category)
                    html_text = html_text.replace("{{PUBLISHED_DATE}}", now_date)
                    html_text = html_text.replace("{{LATEST_BADGE_HTML}}", "")
                    html_text = html_text.replace("{{ACADEMIC_SOURCE}}", "자동차공학·제조사 공식 제원 기반")
                    html_text = html_text.replace("{{FEATURED_IMAGE_HTML}}", "")
                    html_text = html_text.replace("{{BODY_CONTENT_HTML}}", body_content if body_content.startswith("<") else f"<p>{body_content}</p>")
                    html_text = html_text.replace("{{FAQ_SECTION_HTML}}", "")
                    html_text = html_text.replace("{{ACADEMIC_REFERENCES_HTML}}", "")
                    html_text = html_text.replace("{{RELATED_ARTICLES_HTML}}", "")
                    html_text = html_text.replace("{{JSON_LD_ARTICLE}}", "{}")
                    html_text = html_text.replace("{{JSON_LD_FAQ_SCRIPT}}", "")
                    html_text = html_text.replace("{{REGISTRY_JSON_INLINE}}", "[]")

            if os.path.exists(target_file):
                # 1. 파일 백업
                bak_file = target_file + '.bak'
                shutil.copy2(target_file, bak_file)

                # 2. 기존 HTML 읽기
                with open(target_file, 'r', encoding='utf-8') as f:
                    html_text = f.read()

            # 3. 제목 업데이트 (title이 제공된 경우)
            if title:
                # <h1 class="article-title"[^>]*>...</h1>
                title_pattern = re.compile(r'(<h1[^>]*class=["\'][^"\']*article-title[^"\']*["\'][^>]*>)([\s\S]*?)(</h1>)', re.IGNORECASE)
                if title_pattern.search(html_text):
                    html_text = title_pattern.sub(rf'\g<1>\n                    {title}\n                \g<3>', html_text, count=1)

            # 4. 본문 내용 업데이트
            if body_content:
                # <div class="article-body-content">...</div>
                body_pattern = re.compile(r'(<div[^>]*class=["\'][^"\']*article-body-content[^"\']*["\'][^>]*>)([\s\S]*?)(</div>\s*</article>)', re.IGNORECASE)
                if body_pattern.search(html_text):
                    html_text = body_pattern.sub(rf'\g<1>\n                    {body_content}\n                \g<3>', html_text, count=1)
                else:
                    # 보조 패턴
                    alt_pattern = re.compile(r'(<div[^>]*class=["\'][^"\']*article-body-content[^"\']*["\'][^>]*>)([\s\S]*?)(</div>)', re.IGNORECASE)
                    if alt_pattern.search(html_text):
                        html_text = alt_pattern.sub(rf'\g<1>\n                    {body_content}\n                \g<3>', html_text, count=1)

            # 5. 파일 저장 (UTF-8)
            with open(target_file, 'w', encoding='utf-8') as f:
                f.write(html_text)

            # 6. posts_db.json 동기화 (존재 시)
            self.sync_posts_db(slug, title, body_content, data)

            print(f"[OK] Entry saved successfully: {os.path.basename(target_file)}")

            res = {
                'success': True,
                'message': f"'{os.path.basename(target_file)}' 파일이 성공적으로 저장되었습니다!",
                'slug': os.path.basename(target_file)
            }
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.end_headers()
            self.wfile.write(json.dumps(res, ensure_ascii=False).encode('utf-8'))

        except Exception as e:
            print(f"[ERROR] Save failed: {e}")
            self.send_response(500)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.end_headers()
            self.wfile.write(json.dumps({'success': False, 'error': str(e)}, ensure_ascii=False).encode('utf-8'))

    def extract_pure_body_html(self, body_content):
        if not body_content:
            return ""
        markers = ['id="faq"', "id='faq'", 'class="ref-box"', "class='ref-box'", 'class="related-articles-section"', "class='related-articles-section'", 'class="comment-section"', "class='comment-section'", 'id="commentSectionWrapper"', "id='commentSectionWrapper'"]
        cuts = [body_content.find(m) for m in markers if body_content.find(m) != -1]
        if cuts:
            first_cut = min(cuts)
            tag_open = body_content.rfind('<', 0, first_cut)
            return body_content[:tag_open if tag_open != -1 else first_cut].strip()
        return body_content.strip()

    def sync_posts_db(self, slug, title, body_content, data=None):
        try:
            target_db_paths = [
                POSTS_DB_PATH,
                os.path.join(BASE_DIR, 'data', 'posts_db.json')
            ]
            clean_body = self.extract_pure_body_html(body_content)
            slug_base = os.path.basename(slug)

            for db_p in target_db_paths:
                if not os.path.exists(db_p):
                    continue
                with open(db_p, 'r', encoding='utf-8-sig') as f:
                    db_data = json.load(f)

                changed = False
                matched = False
                for item in db_data:
                    item_slug = item.get('slug', '')
                    if item_slug == slug_base or item_slug.replace('.html', '') == slug_base.replace('.html', ''):
                        matched = True
                        if title:
                            item['fullTitle'] = title
                            item['title'] = title
                        if clean_body and len(clean_body) >= 500:
                            item['bodyHtml'] = clean_body
                        changed = True
                        break

                if not matched and data:
                    new_slug = slug_base if slug_base.endswith('.html') else slug_base + '.html'
                    new_item = {
                        "id": len(db_data) + 1,
                        "slug": new_slug,
                        "title": title or data.get('title', ''),
                        "fullTitle": title or data.get('title', ''),
                        "category": data.get('category', '신차소식'),
                        "author": data.get('author', '차를 쓰다'),
                        "date": time.strftime('%Y. %m. %d.'),
                        "views": "0",
                        "thumb": data.get('thumb', 'images/logo.png'),
                        "link": "entry/" + new_slug,
                        "desc": data.get('desc', title),
                        "bodyHtml": clean_body,
                        "isHidden": False
                    }
                    db_data.insert(0, new_item)
                    changed = True

                if changed:
                    with open(db_p, 'w', encoding='utf-8-sig') as f:
                        json.dump(db_data, f, ensure_ascii=False, indent=2)
                    print(f"[OK] {os.path.basename(db_p)} synchronized for {slug_base}")
        except Exception as e:
            print(f"[WARN] DB sync error: {e}")

def run_server():
    local_ip = get_local_ip()
    server_address = ('0.0.0.0', PORT)
    httpd = HTTPServer(server_address, ChageulServerHandler)

    print("=" * 64)
    print("   🚗 차를 쓰다 (CHAGEUL) 개발 & 실시간 글 수정 로컬 서버")
    print("=" * 64)
    print(f" [PC 접속 주소]       : http://localhost:{PORT}/")
    print(f" [관리자 대시보드]    : http://localhost:{PORT}/admin.html (비번: 8809)")
    print(f" [스마트폰(LAN) 접속] : http://{local_ip}:{PORT}/")
    print("=" * 64)
    print(" 💡 [글 직접 수정 기능 탑재 완료]")
    print("  - 글 페이지에서 [✏️ 글 수정] 버튼을 눌러 줄나눔/문구를 실시간 수정 후")
    print("  - [💾 저장] 버튼을 누르면 파일에 100% 즉시 반영 저장됩니다.")
    print("=" * 64)
    print(" (종료하려면 Ctrl+C 또는 창을 닫으세요)\n")

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n서버를 종료합니다.")
        httpd.server_close()

if __name__ == '__main__':
    run_server()
