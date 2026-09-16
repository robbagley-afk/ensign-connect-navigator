#!/usr/bin/env python3
"""Ensign Connect Navigator - Zero-Dependency Backend.

Deterministic Python web application guiding Ensign College students through
signing up for Ensign Connect, joining major groups, setting up SMS notifications,
and connecting with alumni for informational interviews.
"""

import json
import os
import sys
from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, urlparse

# ==============================================================================
# 1. CONFIGURATION
# ==============================================================================

BASE_DIR = Path(__file__).resolve().parent
STATIC_DIR = BASE_DIR / "static"

# Load local .env if present
env_file = BASE_DIR / ".env"
if env_file.exists():
    for line in env_file.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if line and not line.startswith("#") and "=" in line:
            k, v = line.split("=", 1)
            os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))

PORT = int(os.environ.get("PORT", "5060"))
HOST = os.environ.get("HOST", "0.0.0.0")

# Authoritative Links & References
CONFIG_DATA = {
    "app_name": "Ensign Connect Navigator",
    "version": "1.0.0",
    "portal_web_url": "https://ces.peoplegrove.com/hub/ces/organizations/ensign-connect",
    "app_store_ios": "https://apps.apple.com/us/app/peoplegrove/id6737795408",
    "google_play_android": "https://play.google.com/store/apps/details?id=com.peoplegrove.mobile&hl=en",
    "ensign_groups_url": "https://ces.peoplegrove.com/hub/ces/groups?organization=19963",
    "notifications_preferences_url": "https://ces.peoplegrove.com/preferences/notifications",
    "community_directory_url": "https://ces.peoplegrove.com/hub/ces/person",
    "starter_video_id": "6398251412112",
    "starter_guide_page": "https://www.ensign.edu/ensign-connect-app",
    "major_groups": [
        {"id": "accounting", "name": "Accounting", "department": "Business & Accounting"},
        {"id": "business-mgmt", "name": "Business Management & Operations", "department": "Business & Accounting"},
        {"id": "cybersecurity", "name": "Cybersecurity", "department": "Information Technology"},
        {"id": "digital-marketing", "name": "Digital Marketing & Content Creation", "department": "Communications"},
        {"id": "info-tech", "name": "Information Technology & Systems Administration", "department": "Information Technology"},
        {"id": "interior-design", "name": "Interior Design", "department": "Design & Arts"},
        {"id": "medical-assistant", "name": "Medical Assistant & Healthcare Administration", "department": "Health Sciences"},
        {"id": "paralegal", "name": "Paralegal Studies", "department": "Legal Studies"},
        {"id": "software-dev", "name": "Software Development & Computer Science", "department": "Information Technology"},
        {"id": "communication", "name": "Communication & Professional Studies", "department": "Communications"},
        {"id": "hospitality", "name": "Hospitality & Tourism Management", "department": "Business & Accounting"}
    ],
    "interview_questions": [
        "How did your studies and projects at Ensign College prepare you for your current position?",
        "What does a typical day look like in your role, and what core responsibilities take most of your time?",
        "Which technical skills or certificates (e.g., CAR 201 or industry certs) are most valued in your workplace?",
        "What advice would you give to a current Ensign student preparing to apply for internships in this field?",
        "Are there specific professional organizations or industry meetups you recommend joining?"
    ]
}


def generate_outreach_message(student_name: str, alumnus_name: str, major: str, career_interest: str, tone: str = "standard") -> str:
    """Generate a clean, deterministic informational interview outreach message."""
    s_name = (student_name or "a fellow student").strip()
    a_name = (alumnus_name or "there").strip()
    m_name = (major or "my degree").strip()
    c_role = (career_interest or "the industry").strip()

    greeting = f"Hi {a_name}," if a_name.lower() != "there" else "Hello,"

    if tone == "focused":
        return (
            f"{greeting}\n\n"
            f"I am {s_name}, currently studying {m_name} at Ensign College. I saw your profile on Ensign Connect "
            f"and noticed your background in {c_role}. Your career path is inspiring, and I would love to learn from your experience.\n\n"
            f"Would you be open to a brief 15-minute informational interview or phone chat in the coming weeks? "
            f"I have a few targeted questions about how you broke into the field and what skills employers prioritize.\n\n"
            f"Thank you for your time and for being part of the Ensign network!\n\n"
            f"Best regards,\n{s_name}"
        )
    elif tone == "casual":
        return (
            f"{greeting}\n\n"
            f"My name is {s_name}, and I'm currently working on my {m_name} at Ensign College. I came across your profile "
            f"on Ensign Connect and was excited to see your work in {c_role}.\n\n"
            f"If your schedule allows, I would love to connect for 15 minutes to ask a few questions about your career journey "
            f"and any advice you might have for an Ensign student.\n\n"
            f"Thanks so much,\n{s_name}"
        )
    else:  # standard
        return (
            f"{greeting}\n\n"
            f"My name is {s_name} and I am an Ensign College student majoring in {m_name}. As part of my career planning, "
            f"I am reaching out to alumni through Ensign Connect to learn about different career paths.\n\n"
            f"I noticed your experience in {c_role} and would greatly appreciate the opportunity to connect for a quick "
            f"15-minute informational interview via phone or Zoom at your convenience. I would love to hear your insights "
            f"on the industry and how to best prepare for upcoming internship opportunities.\n\n"
            f"Thank you for your support of Ensign College students!\n\n"
            f"Warm regards,\n{s_name}"
        )


# ==============================================================================
# 2. HTTP REQUEST HANDLER
# ==============================================================================

class EnsignConnectHandler(SimpleHTTPRequestHandler):
    """Custom request handler with deterministic endpoints and static serving."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(STATIC_DIR), **kwargs)

    def end_headers(self):
        # Security & hygiene headers
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("X-Frame-Options", "SAMEORIGIN")
        self.send_header("Referrer-Policy", "strict-origin-when-cross-origin")
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        super().end_headers()

    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path

        if path == "/healthz":
            self._send_json({"status": "ok", "app": CONFIG_DATA["app_name"], "port": PORT, "version": CONFIG_DATA["version"]})
            return

        if path == "/api/config":
            self._send_json(CONFIG_DATA)
            return

        # Default static file routing
        if path == "/" or not (STATIC_DIR / path.lstrip("/")).exists():
            self.path = "/index.html"

        super().do_GET()

    def do_POST(self):
        parsed = urlparse(self.path)
        path = parsed.path

        if path == "/api/outreach-draft":
            content_len = int(self.headers.get("Content-Length", 0))
            if content_len == 0 or content_len > 10000:
                self._send_json({"error": "Invalid request payload size"}, status=HTTPStatus.BAD_REQUEST)
                return

            try:
                body = json.loads(self.rfile.read(content_len).decode("utf-8"))
            except Exception as e:
                self._send_json({"error": f"JSON parsing failed: {str(e)}"}, status=HTTPStatus.BAD_REQUEST)
                return

            student_name = body.get("student_name", "Student")
            alumnus_name = body.get("alumnus_name", "")
            major = body.get("major", "my program")
            career_interest = body.get("career_interest", "your field")
            tone = body.get("tone", "standard")

            message = generate_outreach_message(student_name, alumnus_name, major, career_interest, tone)
            self._send_json({
                "ok": True,
                "message": message,
                "tips": [
                    "Send message via Ensign Connect messaging or InMail.",
                    "Keep initial outreach brief and respectful of their schedule (15 minutes).",
                    "If they don't reply within 7-10 business days, a polite single follow-up is appropriate."
                ]
            })
            return

        self._send_json({"error": "Endpoint not found"}, status=HTTPStatus.NOT_FOUND)

    def _send_json(self, data: dict, status: HTTPStatus = HTTPStatus.OK):
        body = json.dumps(data, indent=2).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)


# ==============================================================================
# 3. SERVER ENTRYPOINT
# ==============================================================================

def run_server():
    server_address = (HOST, PORT)
    httpd = ThreadingHTTPServer(server_address, EnsignConnectHandler)
    print(f"=== {CONFIG_DATA['app_name']} v{CONFIG_DATA['version']} ===")
    print(f"Listening on http://{HOST}:{PORT}")
    print(f"Serving static assets from {STATIC_DIR}")
    print("Press Ctrl+C to stop.")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down gracefully...")
        httpd.server_close()


if __name__ == "__main__":
    run_server()
