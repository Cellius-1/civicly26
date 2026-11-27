# Civicly

**Your local government, in plain English.**

Enter a ZIP code or county and Civicly shows every proposal, vote, meeting agenda and budget line from the local governments that serve that address. Each one is rewritten at an eighth-grade reading level, with its deadline and a way to write back.

Built for Bridgewater, NJ, and entered in the 2026 Congressional App Challenge (NJ-7).

> **Status:** The Bridgewater records in this repo are realistic demonstration data that show the format and features. Officials' contact addresses end in `.example`. Don't cite anything here as an official record.

## The problem

Local governments already publish almost everything. It just arrives as scanned PDFs, sorted by department, written for lawyers, and posted a few days before the vote. A resident who wants to know "is my road getting repaved?" has to read five different bodies' agenda packets to find out. Civicly does that reading so residents can do the deciding.

## What it does

| Feature | What a resident gets |
|---|---|
| **Topics instead of departments** | Items are filed under eight parts of daily life: getting around, where I live, staying safe, water and waste, learning, parks, health, and money. |
| **Agenda decoder** | Each agenda item is split out, classified (vote, public hearing, first reading, consent, briefing) and rewritten in plain English. Government terms are explained inline, and the official wording stays on the page. |
| **Tax receipt** | Enter an assessed value and see where your property tax goes. Each taxing body's share is split across its budget lines, then turned into units of service, like feet of repaved road. |
| **Budget explorer** | Adopted budgets by line, with year-over-year change. |
| **Meetings** | Estimated time for each agenda item, the written-comment deadline, and the clerk's address. You can add a meeting to your calendar (`.ics`). |
| **Write back** | Pick support, oppose or question, and Civicly drafts a message to the right official or clerk for that item. |
| **Follow** | Follow topics or neighborhoods and get a per-place RSS feed filtered to just those topics. |
| **Works like an app** | Installable PWA with offline support, and no account or app-store download. |

Five public bodies are modeled for Bridgewater: Bridgewater Township Council, the Somerset County Board of Commissioners, the Bridgewater-Raritan Regional Board of Education, Bridgewater Fire Districts 1–4, and the Somerset County Library System.

## How it reads the records

1. **Collect.** Download agenda packets, minutes, ordinance listings, adopted budgets and the county tax-rate table on a schedule from the websites where governments already post them. No town has to sign up.
2. **Split and file.** Break each document into items. Match each item to the body that controls it and file it under a daily-life topic (`lib/ingest/agenda-parser.ts`).
3. **Rewrite.** Turn titles and summaries into plain English, with a glossary of the terms it translates (`lib/glossary.ts`).
4. **Connect.** Link each proposal to the budget lines it changes, the meeting where it will be decided, and the people voting on it. A new link or date becomes an alert for followers.

The method and its limits are on the in-app About page (`/about`).

## Tech

- Next.js 16 (App Router), React 19 and TypeScript, with no other runtime dependencies
- Server-rendered pages, generated Open Graph images, a sitemap, JSON-LD and `llms.txt`
- RSS (`/api/feed/[placeId]`) and iCalendar (`/api/calendar/[placeId]/[meetingId]`) endpoints
- A service worker and web manifest for install and offline use

```
app/            routes: /lookup, /place/[placeId]/{measures,meetings,budget,receipt,officials,follow,feed,sources}
components/     UI (AgendaDecoder, BudgetExplorer, ReceiptBuilder, ContactPanel, ...)
lib/            data model, agenda parser, glossary, tax receipt math, letter drafting
lib/data/       demonstration data (Bridgewater, Somerset County)
```

## Run it locally

```bash
npm install
npm run dev        # http://localhost:3000
npm run typecheck
```

Set `NEXT_PUBLIC_SITE_URL` to your deployed URL so canonical links and feeds point to the right place.

## What's next

- Replace the demonstration data with live ingestion of Bridgewater and Somerset County postings
- Add more towns, in the order residents ask for them
- Propose it to the county as a public resource

## Author

Tharun Naguleswaran, Bridgewater-Raritan High School
