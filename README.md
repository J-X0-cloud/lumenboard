# Lumenboard

AI-native business intelligence: ask your warehouse questions in plain English, on governed metric definitions.

**Live demo:** https://www.freelancerportfoliohub.com/jameslee/projects/lumenboard/index.html

![Preview](docs/preview.webp)

## Overview

Lumenboard sits between a company's data warehouse and the people who make decisions with it. Every metric has one
reviewed definition, an owner and a certification state in the semantic layer, and dashboards, scheduled reports and
AI answers all compile their queries from it. Every AI answer shows the certified metrics it used, its filters and the
generated SQL, so an analyst can check it in seconds.

This repository contains the marketing site (home, product tour, metrics catalog, pricing) and the live demo: a working
executive dashboard for Harbor & Pine Supply Co., a sample outdoor retailer, driven by a deterministic simulation so
every number reconciles across tiles, charts, tables and answers.

## Features

- **Executive dashboard** — four tabs (Overview, Revenue, Retention, Acquisition) and four date ranges (7D, 30D, 90D,
  12M), each compared with the prior period; tab and range are kept in the URL.
- **Hand-rolled charts** — SVG line/area charts with crosshair tooltips, stacked columns, ranked bars with prior-period
  ticks, a gross-to-net waterfall, a checkout funnel, sparklines and cohort heat maps. No chart library.
- **Ask Lumenboard** — `POST /api/ask` maps a question to an intent, builds a typed query plan on certified metrics,
  compiles SQL through the semantic layer and returns a chart spec plus a written explanation.
- **Semantic layer** — metric definitions with owners, certification, freshness and usage (`lib/semantic-layer.ts`),
  rendered as YAML, a catalog table, lineage and change history.
- **Accessible, responsive** — keyboard tabs, ARIA state on every control, tables and cohort grids that scroll inside
  their cards, and a layout that holds from 390px up.

## Tech stack

- [Next.js 15](https://nextjs.org) (App Router) and React 19
- TypeScript (strict)
- [zod](https://zod.dev) for request validation
- [date-fns](https://date-fns.org) for calendar bucketing
- Plain CSS (`app/globals.css`) with design tokens as custom properties

## Getting started

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000 for the site and http://localhost:3000/demo for the dashboard. No environment variables
are required: the demo workspace runs on the built-in sample data set.

Try the Ask API directly:

```bash
curl -s localhost:3000/api/ask \
  -H 'content-type: application/json' \
  -d '{"question":"Which channels grew fastest this quarter?"}' | jq '.answer.sql'
```

## Project structure

```
app/
  (marketing)/          home, product tour, metrics catalog and pricing pages
  demo/                 live dashboard
  api/ask/              question → query plan → SQL + chart spec
  globals.css
components/
  ask/                  Ask panel, answer card, SQL block
  charts/               AreaChart, BarChart, HBarList, Waterfall, Funnel, Sparkline, lineage, tooltip
  dashboard/            DashboardShell, Sidebar, Tabs, RangePicker, KpiTile, DataTable, CohortGrid, panels/
  marketing/            page sections (hero, feature splits, catalog, pricing, FAQ)
  site/                 header, footer, logo
  ui/                   icons, buttons, tags, cards
lib/
  data/                 sample-workspace simulation, dimensions, site copy, pricing, lineage
  ask.ts                question routing and answer assembly
  charts.ts             scales, ticks and chart geometry
  metrics.ts            ranges, bucketing, period comparisons and per-tab selectors
  semantic-layer.ts     metric definitions and SQL compiler
types/                  shared types (dashboard, charts, ask, metrics)
public/                 favicon and variable font
```

## Scripts

| Script           | Description                         |
| ---------------- | ----------------------------------- |
| `pnpm dev`       | Start the dev server with Turbopack |
| `pnpm build`     | Production build                    |
| `pnpm start`     | Serve the production build          |
| `pnpm lint`      | Lint with the Next.js ESLint config |
| `pnpm typecheck` | Type-check with `tsc --noEmit`      |
| `pnpm format`    | Format with Prettier                |
