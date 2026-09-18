# Engineering Handoff: Ensign Connect Navigator & Cloudflare Migration

**Target Engineer:** Rodrigo  
**Project Lead:** Rob Bagley (Associate Director of Career Services, Ensign College)  
**Date:** September 18, 2026  
**Repository:** [https://github.com/robbagley-afk/ensign-connect-navigator](https://github.com/robbagley-afk/ensign-connect-navigator)  
**Current Live Edge URL:** [https://ensign-connect-navigator.vercel.app](https://ensign-connect-navigator.vercel.app)  

---

## 1. Executive Summary & Current State

The **Ensign Connect Navigator** is an interactive, responsive web application guiding Ensign College students through:
1. Understanding Ensign Connect via an embedded official Brightcove video.
2. Single Sign-On (SSO) authentication bypass using CES NetID.
3. Joining their specific degree major group (17 curated PeopleGrove groups with direct links).
4. Activating SMS notification preferences.
5. Conducting alumni outreach and informational interviews using official PDF tip guides and an automated outreach drafting generator.

### Current Hosting State
* **Public Cloud (Active & Live Right Now):** Hosted on Vercel at `https://ensign-connect-navigator.vercel.app`. It runs independently of any local hardware.
* **Local Mac Studio Host (Temporarily Offline):** The Mac Studio host (`mac-studio-2.tail299fc7.ts.net`) is currently offline/powered down. When brought online, it serves the app on port `5065` and proxies through the AI Career Tools Dashboard on port `8092`.
* **Strategic Target:** Transition to **Cloudflare Pages + Functions** as the permanent, cost-free, commercial-compliant standard for Ensign College, replacing Vercel.

---

## 2. Getting Everything Running ASAP (Local Restore)

When the Mac Studio is powered back on, restore the local services:

### Step 1: Verify Hardware & Tailscale Connectivity
```bash
# From client MacBook Pro or terminal
ping -c 2 100.68.219.45
ssh mac-studio-2 "uptime"
```

### Step 2: Start the Ensign Connect Navigator Daemon
The app lives on the Mac Studio at `~/CCowork-Local-Apps/ensign-connect-navigator` and synchronizes from OneDrive.
```bash
ssh mac-studio-2
cd ~/CCowork-Local-Apps/ensign-connect-navigator

# Check if already running
lsof -nP -i TCP:5065

# If not running, start in background
nohup /opt/homebrew/bin/python3 app.py > app.log 2>&1 &
echo "Started Ensign Connect Navigator on PID $!"

# Test local health endpoint
curl -s http://127.0.0.1:5065/healthz
```

### Step 3: Start / Restart the AI Career Tools Dashboard
The central dashboard proxies all campus AI tools through port `8092`:
```bash
cd "/Users/robbagley/CCowork-Local-Apps/AI AGENTS LOCAL LLM"

# Check if dashboard server is running
lsof -nP -i TCP:8092

# Restart if needed
kill $(lsof -ti :8092) 2>/dev/null
nohup /opt/homebrew/bin/python3 public_suite_server.py --host 127.0.0.1 --port 8092 > public_suite_server.log 2>&1 &

# Verify reverse proxy to Ensign Connect Navigator
curl -sI http://127.0.0.1:8092/ensign-connect/ | head -5
```
*Note: The reverse proxy mapping `"ensign-connect": ("127.0.0.1", 5065)` and the Student Facing card in `public_suite_dashboard.html` are already configured.*

---

## 3. Architecture & Codebase Structure

The application has **zero third-party Python dependencies** (pure Python standard library `http.server`). It is architected so that **Vercel and Cloudflare Pages can coexist in the same Git repo simultaneously** without conflict.

```
ensign-connect-navigator/
├── public/                     # Static CDN root (served by both Vercel & Cloudflare)
│   ├── index.html              # Responsive UI, Brightcove player, sidebar checklist
│   ├── styles.css              # Custom CSS with responsive breakpoints (up to 1560px)
│   └── app.js                  # Client logic, auto-scrolling sidebar, outreach generator
├── functions/                  # Cloudflare Pages Functions (Edge JavaScript)
│   ├── healthz.js              # GET /healthz
│   └── api/
│       ├── config.js           # GET /api/config (JSON data for 17 majors & PDFs)
│       └── outreach-draft.js   # POST /api/outreach-draft (Edge message generation)
├── api/                        # Vercel Serverless Function (Python)
│   └── index.py                # Handles /api/config and /api/outreach-draft
├── app.py                      # Local dev & Mac Studio server (ThreadingHTTPServer)
├── vercel.json                 # Vercel routing configuration
├── wrangler.toml               # Cloudflare Pages configuration
└── requirements.txt            # Empty (standard library only)
```

### Key UI Features Already Implemented
1. **Brightcove Video Embed:** Embedded in Stage 1 (Video ID: `6398251412112`, Account: `1699278547001`).
2. **Persistent Left-Sidebar Checklists:** Grouped by stage, capped at **maximum 2 tasks per stage**.
3. **Auto-Scrolling Sidebar:** When students click "Continue" or jump between stages, `app.js` automatically scrolls the sidebar so the active stage and its checkboxes are pinned to the top of the visible viewport.
4. **17 Curated Major Groups:** Deep-linked directly to PeopleGrove internal group pages (not the generic groups page).
5. **PDF Tip Guides:** 3 official Ensign/BYU informational interview PDF links embedded in Step 5 and the Quick Resources sidebar.

---

## 4. Phase 2: Deploying to Cloudflare Pages (Longer-Term Solution)

### Why We Are Leaving Vercel
* **Terms of Service Compliance:** Vercel's free Hobby tier is strictly non-commercial. Using it for institutional/university operations at Ensign College is a commercial violation (requires Vercel Pro at \$20/seat/month).
* **Cloudflare Advantage:** Cloudflare Pages is **100% free with no commercial restrictions**, provides **unlimited static bandwidth**, 100,000 free Worker requests/day, zero cold boots, and built-in edge SSL.

### Step-by-Step Cloudflare Pages Activation (Takes 2 Minutes)
All Cloudflare Pages adapter files (`functions/`, `wrangler.toml`) are **already written, tested locally, and pushed to `main`**.

1. Log into **[dash.cloudflare.com](https://dash.cloudflare.com/)**.
2. Navigate to **Workers & Pages** &rarr; **Create application** &rarr; **Pages** &rarr; **Connect to Git**.
3. Select GitHub repository: **`robbagley-afk/ensign-connect-navigator`**.
4. Configure build settings:
   * **Project name:** `ensign-connect-navigator`
   * **Production branch:** `main`
   * **Framework preset:** `None`
   * **Build command:** *(Leave empty)*
   * **Build output directory:** `public`
   * **Root directory:** `/`
5. Click **Save and Deploy**.

### Verification on Cloudflare
Once deployed, Cloudflare will assign a live URL (e.g., `https://ensign-connect-navigator.pages.dev`). Verify:
```bash
# 1. Test frontend
curl -sI https://ensign-connect-navigator.pages.dev | head -5

# 2. Test configuration endpoint
curl -s https://ensign-connect-navigator.pages.dev/api/config | head -15

# 3. Test outreach generator POST
curl -s -X POST https://ensign-connect-navigator.pages.dev/api/outreach-draft \
  -H "Content-Type: application/json" \
  -d '{"student_name":"Rodrigo","major":"Cybersecurity","career_interest":"Cloud Security","tone":"standard"}'
```

### Decommissioning Vercel
**Do NOT delete the Vercel site immediately.**  
Run both sites simultaneously for 3–5 days. Once Rob verifies that the Cloudflare URL is working perfectly:
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard) &rarr; `ensign-connect-navigator` &rarr; Settings &rarr; Delete Project.
2. Remove `api/index.py` and `vercel.json` from the Git repository if desired.

---

## 5. Strict Privacy & Security Boundary (MANDATORY)

> [!CAUTION]
> **Confidential Audio Boundary — Read Carefully:**
> Cloudflare Workers AI offers a free Whisper model (`@cf/openai/whisper`). 
> **NEVER use Cloudflare Workers AI Whisper for confidential meetings, staff 1:1s, student counseling, HR, or FERPA-scoped records.**
> 
> * **Why?** Cloudflare's free tier has no Business Associate Agreement (BAA) or institutional Student Data Protection Agreement with Ensign College. Audio leaves the device and transits public edge data centers.
> * **Where Confidential Audio Goes:** Keep all confidential transcription strictly **on-device on the Mac Studio** using Rob's existing `on-device-transcriber` pipeline (`Superwhisper` + local `qwen3.6-35b-a3b` in LM Studio). It is 100% airgapped and private.
> * **Where Cloudflare Whisper IS Permitted:** ONLY for public student-facing mock interview practice tools (e.g., *Interview Practice Coach*) where students record generic answers to practice questions ("Tell me about a time you solved a problem") with zero PII or student records.

---

## 6. Zero Data Retention (ZDR) Models via API & Subscription Guide

To keep Career Services AI applications functional when local inference (Mac Studio LM Studio) is unavailable—without risking student privacy or FERPA violations—the cloud architecture must route through **Zero Data Retention (ZDR)** API endpoints.

### What is ZDR and Why Is It Mandatory?
* **Standard Free Cloud APIs (Risk):** Free tiers (e.g., free Google AI Studio, public consumer ChatGPT) explicitly reserve the right to log prompts, store audio, and use submissions for model training or human evaluation. **This is unacceptable for any student, resume, or coaching data.**
* **Zero Data Retention (ZDR):** Prompts, completions, and audio streams are processed **in volatile RAM only** and discarded immediately upon response delivery. They are never written to disk, never reviewed by human contractors, and never used to train models.

---

### Approved ZDR Providers & Subscription Guide

| Provider | Model Family | ZDR Status | Pricing / Tier Required | Best Use Case |
| :--- | :--- | :--- | :--- | :--- |
| **Google Gemini API** | Gemini 2.5 Flash / Pro | ✅ **ZDR on Paid Tier**<br>❌ *Not ZDR on free tier* | **Pay-As-You-Go** via Google Cloud billing. Extremely inexpensive (~$0.075 / 1M tokens). | Primary coaching engine (Career Fair Coach, Resume Coach, Academic Advisor) |
| **Groq Cloud** | Llama 3.3 70B, Whisper-large-v3 | ✅ **Default ZDR** (RAM only) | Pay-as-you-go (~$0.03/hr for Whisper audio, ~$0.59/1M tokens text). | Ultra-low-latency voice transcription & pitch roleplay |
| **Cloudflare Workers AI** | `@cf/openai/whisper`, Llama 3.3 | ⚠️ **No Training**, but retains transient edge logs | Free tier (100k requests/day, 10k neurons/day). Enterprise tier offers full ZDR. | Public student mock interview practice |
| **Together AI / Fireworks** | Qwen 2.5, DeepSeek, Mistral | ✅ **ZDR on Paid API** | Pay-as-you-go with credit card. | Open-weights fallback matching Mac Studio local Qwen |

---

### How to Subscribe & Configure ZDR for Ensign College Apps

#### 1. Google Gemini API (Google AI Studio with Pay-As-You-Go)
1. Go to **[ai.google.dev](https://ai.google.dev/)** / **[aistudio.google.com](https://aistudio.google.com/)**.
2. Sign in with the department Google account.
3. Click **Get API key** &rarr; **Set up Billing** (links to a Google Cloud Project with a departmental credit card).
4. **Critical Policy Switch:** Attaching billing immediately transitions the project from the *Free Consumer Terms* to the *Paid Commercial API Terms*, activating **Zero Data Retention** (prompts and completions are not logged or used for training). Ref: [ai.google.dev/gemini-api/docs/zdr](https://ai.google.dev/gemini-api/docs/zdr).
5. Copy the API key and set it as an encrypted secret in Cloudflare Pages:
   - Cloudflare Dashboard &rarr; Pages Project &rarr; **Settings** &rarr; **Environment Variables** &rarr; Add `GEMINI_API_KEY` (Encrypt).

#### 2. Groq Cloud (Ultra-Fast Speech-to-Text & Text Inference)
1. Go to **[console.groq.com](https://console.groq.com/)** and create an account.
2. Navigate to **Billing** and add payment details.
3. Review Groq's data commitment: Groq does not retain input or output data; inference runs entirely in LPUs/memory and is purged on completion. Ref: [console.groq.com/docs/your-data](https://console.groq.com/docs/your-data).
4. Generate an API key &rarr; Set as `GROQ_API_KEY` in Cloudflare Pages environment variables.
5. In the Interview Practice Coach app, configure the audio transcription endpoint to use `https://api.groq.com/openai/v1/audio/transcriptions` with model `whisper-large-v3`.

---

### Developer Implementation Pattern (Fail-Closed Router)

In all future Cloudflare Workers/Pages Functions, implement the shared inference gateway following this pattern:

```javascript
// Example: functions/api/chat.js (Pages Function)
export async function onRequestPost(context) {
  const { request, env } = context;
  const body = await request.json();

  // 1. Pre-flight Privacy Gate (Client-side redaction check)
  if (containsSensitiveRecord(body.prompt)) {
    return new Response(JSON.stringify({ 
      error: "Data policy rejection: Potential student record detected. Routing to local on-device lane only." 
    }), { status: 403 });
  }

  // 2. Primary Lane: ZDR Cloud Provider (Gemini / Groq)
  if (env.GEMINI_API_KEY) {
    try {
      const response = await callGeminiZDR(body.prompt, env.GEMINI_API_KEY);
      return new Response(JSON.stringify(response), { headers: { "Content-Type": "application/json" } });
    } catch (err) {
      console.warn("Cloud ZDR provider failed, attempting fallback...", err);
    }
  }

  // 3. Fallback Lane: Deterministic / Socratic rule-based fallback
  return new Response(JSON.stringify(getDeterministicFallback(body)), { 
    headers: { "Content-Type": "application/json" } 
  });
}
```

---

## 7. Portfolio Fleet Migration Roadmap

Once Ensign Connect Navigator is verified on Cloudflare, migrate the remaining portfolio apps following this exact dual-hosting pattern:

1. **`ensign-career-fair-coach`** (Vercel &rarr; Cloudflare Pages + Gemini Paid ZDR API proxy)
2. **`gemini-coaching-agent-starter`** (Vercel &rarr; Cloudflare Pages template)
3. **`resume-coach-ai` / `resume-improver`** (Mac Studio local &rarr; Cloudflare Pages with de-identified/synthetic guardrails)
4. **`career-services-tools`** (Mac Studio dashboard &rarr; Central Cloudflare Pages Hub)

---

## 8. Authoritative Mem.ai Documentation Links

All architectural decisions, privacy boundaries, and logs are synchronized in Rob's Mem.ai workspace:
* **Privacy & ZDR Architecture Plan:** [`AI Career Services Apps — Cloud Hosting, Inference Fallback, and Privacy Implementation Plan`](https://mem.ai/notes/fbfa0abc-c220-4251-ad34-14f0f52986ce) *(Authored 2026-09-18)*
* **Hosting Master Project:** [`Project: Free Public Cloud Hosting for AI Portfolio Apps`](https://mem.ai/notes/398020bd-6faf-5429-8fd3-8d7d0622146a)
* **Navigator Hub Note:** [`Agent: Ensign Connect Navigator — Hub`](https://mem.ai/notes/a62b893d-e274-5143-9df1-216cd792c069)
* **Next Week Execution Task:** [`Task: AI Portfolio Cloudflare Migration & Vercel Decommissioning (Week of Sept 21, 2026)`](https://mem.ai/notes/9cc1f53f-601c-57ba-a498-174f7af1abb7)

