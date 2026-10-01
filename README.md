# 🔥 Ember Watch

A small Next.js app for wildfire preparedness. It has three pages:

| Page | What it does | Next.js / React idea it shows |
| --- | --- | --- |
| `/` **Risk** | Pulls live weather for your location (or a preset city) and scores fire risk from 0 to 100. Sliders let you try "what if" conditions. | API route (server), `fetch`, `useState`, browser geolocation |
| `/protect` **Protect** | Defensible-space checklist (CAL FIRE zones 0–2 + home hardening) with a readiness score. | Client component, derived state, `localStorage` |
| `/escape` **Escape Plan** | Meeting spot, two routes, out-of-area contact, go-bag checklist, "Ready, Set, Go". Printable. | Controlled form inputs, a custom hook, print CSS |

## Run it

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## How it's organized

```
src/
  app/
    layout.tsx              shared shell: nav + footer, wraps every page
    page.tsx                "/"        (home / risk)
    protect/page.tsx        "/protect"
    escape/page.tsx         "/escape"
    api/conditions/route.ts GET /api/conditions?lat=..&lon=..  (runs on the server)
  components/               interactive pieces ("use client")
  lib/
    risk.ts                 the scoring formula (plain TypeScript, no React)
    useSavedState.ts        useState that saves to localStorage
```

**Each folder in `app/` becomes a URL.** `app/protect/page.tsx` is `/protect`. That's file-based routing.

**Server vs client components.** Pages are server components by default. Anything with clicks, state or
browser APIs (`navigator.geolocation`, `localStorage`, `window.print`) lives in a file starting with
`"use client"`.

**The API route.** The browser calls `/api/conditions`, our own server code. That code calls the free
[Open-Meteo](https://open-meteo.com) weather API (no key needed), counts the dry days, and returns a score.

## The risk score

A simplified teaching model inspired by the Hot-Dry-Windy Index, **not** an official forecast:

- Heat: up to 25 points (50°F → 0, 100°F+ → 25)
- Dry air: up to 30 points (60% humidity → 0, 10% or less → 30)
- Wind: up to 30 points (0 → 0, 40 mph+ → 30)
- Dry streak: up to 15 points (two weeks without rain → 15)

A 🚩 Red Flag banner shows when humidity ≤ 15% and wind ≥ 25 mph, roughly the National Weather Service
criteria.

## Ideas to extend it

- Show active fires on a map with NASA FIRMS data (free API key) + Leaflet
- Use the 7-day forecast to warn about high-risk days ahead
- Send the escape plan to family as a shareable link
