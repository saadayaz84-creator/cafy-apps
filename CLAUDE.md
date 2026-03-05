# CAFY Workflow-to-App

## Purpose

Connect n8n automation workflows to a production frontend. The first workflow is **CAFY Content Audit**: a form on the website sends data to an n8n webhook, n8n orchestrates scraping + AI analysis, and the result is returned and displayed to the user.

## Tech Stack

| Layer              | Technology                                    |
|--------------------|-----------------------------------------------|
| Frontend           | Next.js 14+ (App Router), React, Tailwind CSS |
| Automation backend | n8n Cloud (`https://saadix.app.n8n.cloud`)    |
| Deployment         | Vercel (project: `cafy-eight`)                |
| Repository         | GitHub → `cafy-apps` (create if not exists)   |
| Live URL           | `https://cafy-eight.vercel.app`               |

## MCP Servers & Skills

### MCP Servers (configured in `.mcp.json`)

| Server   | Purpose                             | Transport |
|----------|-------------------------------------|-----------|
| `n8n`    | Read/create/edit n8n workflows      | stdio     |

### Skills

| Skill                | Source                                        | Purpose                          |
|----------------------|-----------------------------------------------|----------------------------------|
| n8n Skills           | `czlonkowski/n8n-skills`                      | n8n node config, patterns, validation |
| Frontend Designer    | `anthropics/claude-code` (built-in plugin)    | Production-grade UI design       |

| `github` | Create repo, commit, push, PRs      | http      |

## Environment Variables

All secrets go in `.env.local` (gitignored). **Never hardcode credentials.**

| Variable                          | Source            | Used By    | Notes                                      |
|-----------------------------------|-------------------|------------|--------------------------------------------|
| `NEXT_PUBLIC_N8N_AUDIT_WEBHOOK`   | n8n workflow      | Frontend   | Webhook URL — fill after creating workflow |
| `APIFY_API_TOKEN`                 | Apify dashboard   | n8n        | Scrapes TikTok, YouTube, Instagram, X      |
| `ANTHROPIC_API_KEY`               | Anthropic console | n8n        | Claude AI analyzes scraped content         |
| `N8N_API_KEY`                     | n8n settings/API  | MCP server | Connects Claude Code to n8n instance       |
| `N8N_API_URL`                     | —                 | MCP server | `https://saadix.app.n8n.cloud`             |
| `GMAIL_ACCOUNT`                   | —                 | n8n        | `cafyaudit@gmail.com` — sends reports      |
| `GOOGLE_SHEET_ID`                 | Google Sheets     | n8n        | Logs every audit — create sheet first      |

### Vercel Environment Variables

Add these in Vercel Dashboard → Settings → Environment Variables:
- `NEXT_PUBLIC_N8N_AUDIT_WEBHOOK` (all environments)

All other keys live inside n8n credentials, not in the frontend.

## n8n Workflow: CAFY Content Audit

### Status: LIVE

- **Name:** CAFY — Free Content Audit Pipeline
- **ID:** `ZW5gaomGLVB70O3J`
- **Active:** Yes
- **Webhook path:** `/cafy-audit` (POST)
- **Production URL:** `https://saadix.app.n8n.cloud/webhook/cafy-audit`
- **Test URL:** `https://saadix.app.n8n.cloud/webhook-test/cafy-audit`

### Workflow Architecture (18 nodes)

```
Receive Audit Form (webhook POST /cafy-audit)
  ├→ Respond to Website (immediate JSON — non-blocking)
  └→ Extract Form Fields (Set node)
       → Route by Platform (Switch: linkedin|instagram|tiktok|youtube|facebook|twitter)
           ├→ Scrape LinkedIn (Apify HTTP)
           ├→ Scrape Instagram (Apify HTTP)
           ├→ Scrape TikTok (Apify HTTP)
           ├→ Scrape YouTube (Apify HTTP)
           ├→ Scrape Facebook (Apify HTTP) — NOT wired in Switch
           └→ Scrape Twitter (Apify HTTP) — NOT wired in Switch
       → Wait for Scraping (90 seconds)
       → Fetch Scraped Data (Apify dataset)
       → Normalize Data (Function — multi-platform normalizer)
       → Claude AI Analysis (HTTP → Anthropic API)
       → Format Audit Email (Function → HTML email builder)
           ├→ Send Report to Client (Gmail)
           ├→ Notify Saad (Gmail → owner notification)
           └→ Save to Google Sheets (append to Leads!A:N)
       → Wait 24 Hours
       → Send Follow-up Email (Gmail)
```

### Webhook Input Fields (REAL — from n8n Extract Form Fields node)

The webhook expects a JSON POST body. These field names **must match exactly**:

| Field            | Type   | Required | Description                              |
|------------------|--------|----------|------------------------------------------|
| `name`           | string | yes      | Client's full name                       |
| `email`          | string | yes      | Client's email (report delivered here)   |
| `platform`       | string | yes      | One of: `linkedin`, `instagram`, `tiktok`, `youtube`, `facebook`, `twitter` |
| `profile_url`    | string | yes      | Full profile URL (not just handle)       |
| `niche`          | string | yes      | Client's niche/industry                  |
| `content_goal`   | string | yes      | What they want to achieve with content   |
| `frustration`    | string | yes      | Their biggest content frustration        |
| `submitted_at`   | string | auto     | ISO timestamp (frontend sets this)       |

### Webhook Response (REAL — immediate, async processing)

The "Respond to Website" node fires immediately before scraping starts:

```json
{
  "success": true,
  "message": "Audit received. Check your email in 10 minutes."
}
```

The frontend should show a success/confirmation screen after receiving this. The actual audit report is delivered via email — **not** returned in the webhook response.

### Workflow Issues Status

1. ~~Apify tokens~~ — **FIXED** (all 7 nodes patched via API)
2. ~~Claude AI node~~ — **FIXED** (Anthropic headers + prompt configured)
3. ~~Switch node gaps~~ — **FIXED** (Facebook output 4 + Twitter output 5 wired)
4. ~~Google Sheets~~ — **FIXED** (Sheet ID: `10C6Q6bRDDNlZWW_ZOXKBSsy2T-nUnmOV4JNH7Kz4YJk`)
5. ~~Gmail~~ — **FIXED** (OAuth credentials attached manually)
6. ~~Activate~~ — **DONE** (workflow published and live)

## Build Order

Follow this sequence exactly:

### Phase 1: Infrastructure
1. Create GitHub repo `cafy-apps` (via GitHub MCP or CLI)
2. Scaffold Next.js app: `npx create-next-app@latest . --typescript --tailwind --app --src-dir --eslint`
3. Create `.env.local` from template (done — already exists)
4. Create `launch.json` for dev server
5. Initial commit and push

### Phase 2: n8n Workflow (exists — configure it)
6. Update all 6 Apify scraper nodes with real `APIFY_API_TOKEN`
7. Configure Claude AI Analysis node (headers: `x-api-key`, `anthropic-version`; body: prompt + scraped data)
8. Wire Facebook and Twitter outputs in the Switch node
9. Create Google Sheet with `Leads` tab, set sheet ID in node
10. Attach Gmail OAuth credentials to all 3 Gmail nodes
11. Activate workflow → production webhook goes live
12. Set `NEXT_PUBLIC_N8N_AUDIT_WEBHOOK=https://saadix.app.n8n.cloud/webhook/cafy-audit` in `.env.local` and Vercel

### Phase 3: Frontend
13. Build the audit form page at `/audit`
14. Form fields must match webhook input fields exactly (see table above)
15. Submit form via `fetch(NEXT_PUBLIC_N8N_AUDIT_WEBHOOK, { method: 'POST', body: JSON.stringify(formData) })`
16. Show success/confirmation screen after immediate response (audit is emailed, not returned in response)
17. Add loading states, error handling, and success animations

### Phase 4: Polish & Deploy
18. Apply CAFY brand guidelines (see below)
19. Test end-to-end: form → n8n → scrape → analyze → email arrives
20. Push to `main` → auto-deploys to Vercel
21. Verify at `https://cafy-eight.vercel.app/audit`

## CAFY Brand Guidelines

| Property        | Value                                          |
|-----------------|------------------------------------------------|
| Background      | `#0a0a0a` (near-black)                         |
| Accent color    | `#06b6d4` (cyan-500)                           |
| Accent hover    | `#22d3ee` (cyan-400)                           |
| Text primary    | `#f5f5f5`                                      |
| Text secondary  | `#a3a3a3`                                      |
| Font heading    | Plus Jakarta Sans (Google Fonts)               |
| Font body       | Inter (Google Fonts)                           |
| Style           | Dark SaaS — minimal, clean, professional       |
| Border radius   | `0.75rem` (cards), `0.5rem` (inputs/buttons)   |
| Card background | `#171717` with `1px solid #262626` border      |

### Tailwind Config Additions

```js
colors: {
  cafy: {
    bg: '#0a0a0a',
    card: '#171717',
    border: '#262626',
    cyan: '#06b6d4',
    'cyan-hover': '#22d3ee',
  }
}
fontFamily: {
  heading: ['Plus Jakarta Sans', 'sans-serif'],
  body: ['Inter', 'sans-serif'],
}
```

## Routing Rules

- **One route per workflow.** The Content Audit lives at `/audit`.
- Future workflows get their own routes (e.g., `/strategy`, `/report`).
- Landing page at `/` shows overview of all available CAFY tools.

## Project Structure

```
src/
  app/
    page.tsx              # Landing — list of CAFY tools
    audit/
      page.tsx            # Content Audit form + results
    layout.tsx            # Root layout — fonts, metadata, global styles
    globals.css           # Tailwind + CAFY custom styles
  components/
    ui/                   # Reusable UI components (Button, Input, Card, etc.)
    audit/                # Audit-specific components (Form, Results, ScoreCard)
  lib/
    api.ts                # Fetch helpers for n8n webhooks
    types.ts              # TypeScript interfaces for webhook I/O
    constants.ts          # Platform options, score labels, etc.
```

## Rules

1. **Never hardcode credentials** — all secrets in `.env.local`, referenced via `process.env`
2. **Always inspect n8n before building forms** — field names must match webhook exactly
3. **One route per workflow** — keep routing clean and predictable
4. **Frontend only sends to webhook** — no server-side API routes needed unless proxying
5. **Validate on both sides** — client-side validation + n8n input validation
6. **`.mcp.json` is gitignored** — it contains the n8n API key
7. **Test end-to-end before marking done** — form submit → n8n processes → result displays
8. **Commit often, push to main** — Vercel auto-deploys on push
9. **Use TypeScript strictly** — no `any` types, define interfaces for all webhook data
10. **Respect the brand** — every page follows CAFY dark theme, no exceptions
