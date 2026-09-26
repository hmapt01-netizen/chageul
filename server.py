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

            if not slug:
                raise ValueError("슬러그(파일명)가 누락되었습니다.")

            # .html 확장자 확인
            if not slug.endswith('.html'):
                slug += '.html'

            target_file = os.path.join(ENTRY_DIR, slug)
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
                    raise FileNotFoundError(f"파일을 찾을 수 없습니다: {slug}")

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
            self.sync_posts_db(slug, title, body_content)

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

    def sync_posts_db(self, slug, title, body_content):
        try:
            if not os.path.exists(POSTS_DB_PATH):
                return
            with open(POSTS_DB_PATH, 'r', encoding='utf-8') as f:
                db_data = json.load(f)

            slug_base = os.path.basename(slug)
            changed = False
            for item in db_data:
                item_slug = item.get('slug', '')
                if item_slug == slug_base or item_slug.replace('.html', '') == slug_base.replace('.html', ''):
                    if title:
                        item['fullTitle'] = title
                        item['title'] = title[:35]
                    changed = True
                    break

            if changed:
                with open(POSTS_DB_PATH, 'w', encoding='utf-8') as f:
                    json.dump(db_data, f, ensure_ascii=False, indent=2)
                print(f"[OK] posts_db.json synchronized for {slug_base}")
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
