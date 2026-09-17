"""Vercel serverless handler for Ensign Connect Navigator API.

Handles:
  GET  /api/config         → returns app configuration JSON
  POST /api/outreach-draft → generates an outreach message draft

Static files (index.html, app.js, styles.css) are served by Vercel CDN
from the /public directory and never reach this function.
"""

import json
import sys
import os
from http.server import BaseHTTPRequestHandler
from urllib.parse import urlparse

# Pull shared logic from the parent app module
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from app import CONFIG_DATA, generate_outreach_message


class handler(BaseHTTPRequestHandler):
    """Vercel Python serverless entry point — class must be named 'handler'."""

    def log_message(self, format, *args):  # suppress access log noise in Vercel
        pass

    def log_request(self, code='-', size='-'):
        pass

    def _json(self, data: dict, status: int = 200):
        body = json.dumps(data, indent=2).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self):
        path = urlparse(self.path).path
        if path in ("/api/config", "/api/config/"):
            self._json(CONFIG_DATA)
        elif path == "/healthz":
            self._json({"status": "ok", "app": CONFIG_DATA["app_name"]})
        else:
            self._json({"error": "Not found"}, 404)

    def do_POST(self):
        path = urlparse(self.path).path
        if path not in ("/api/outreach-draft", "/api/outreach-draft/"):
            self._json({"error": "Not found"}, 404)
            return

        content_len = int(self.headers.get("Content-Length", 0))
        if content_len == 0 or content_len > 10_000:
            self._json({"error": "Invalid request payload size"}, 400)
            return

        try:
            body = json.loads(self.rfile.read(content_len).decode("utf-8"))
        except Exception as e:
            self._json({"error": f"JSON parse error: {e}"}, 400)
            return

        message = generate_outreach_message(
            student_name=body.get("student_name", "Student"),
            alumnus_name=body.get("alumnus_name", ""),
            major=body.get("major", "my program"),
            career_interest=body.get("career_interest", "your field"),
            tone=body.get("tone", "standard"),
        )
        self._json({
            "ok": True,
            "message": message,
            "tips": [
                "Send via Ensign Connect messaging or LinkedIn InMail.",
                "Keep it brief — ask for 15 minutes only.",
                "One polite follow-up after 7–10 business days is appropriate.",
            ],
        })
