# Ensign Connect Navigator

A dedicated student-facing web application guiding Ensign College students through the complete Ensign Connect sign-up and onboarding journey.

It incorporates the official guidance from [Ensign Connect App Info](https://www.ensign.edu/ensign-connect-app) and Task 2 Step 2 of the ENS 101 Mentor Desk App (Stage 2: Ensign Connect).

## Features

- **5-Stage Onboarding Journey**:
  1. **Choose Your Platform**: Web browser vs iOS vs Android (PeopleGrove app).
  2. **Sign Up & SSO**: Recommending CES School ID SSO to bypass manual approval queues.
  3. **Join Major Groups**: Searchable directory of Ensign College major groups linking directly to `ces.peoplegrove.com`.
  4. **SMS Notifications Setup**: Visual 3-step walkthrough ensuring students enable SMS text alerts for messages.
  5. **Alumni & Informational Interviews**: Guidance on alumni exploration and an interactive informational interview outreach generator.
- **Persistent Progress Tracking**: Checklist items saved in `localStorage`.
- **Zero-Dependency Deterministic Python**: Runs with standard library `ThreadingHTTPServer` on Python 3.10+.
- **Health Check Endpoint**: `/healthz` for health monitoring and integration with AI Project Suite Hub.

## Running Locally

```bash
cd ensign-connect-navigator
python3 app.py
```

Open [http://127.0.0.1:5060](http://127.0.0.1:5060) in your browser.

## Configuration

Set environment variables in `.env` or in your shell:

```bash
PORT=5060
HOST=0.0.0.0
```

## Running on Mac Studio

The app is built to run on the Mac Studio local app stack, bind to `127.0.0.1` or `0.0.0.0`, and integrate with the AI Project Suite Hub (`http://127.0.0.1:8092`) and Tailscale Funnel.
