# TraderFundingIndex

The honest index of futures prop firms: real payouts, hidden rules, country restrictions and verified trader reviews. Forum and strategy sharing come in later phases.

Product plan: https://claude.ai/code/artifact/89762862-a503-4e3f-aba9-da25f7cbadfe

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- Prisma with MySQL (managed by CloudPanel; switch `provider` in `prisma/schema.prisma` to move to Postgres)

## Local setup

```bash
cp .env.example .env      # fill in DATABASE_URL
npm install
npm run db:push           # create tables
npm run db:seed           # add the seed firms
npm run db:payout-rules   # add payout rules for 23 futures firms (checked 7 Oct 2026)
npm run dev               # http://localhost:3000
```

## Editing site text

Everything visible is editable in the admin panel: firms, logos, offers, reviews, homepage text (/admin/homepage), logo, menu and footer (/admin/site) and content pages like About, Contact and the legal pages (/admin/pages). `src/content/site.ts` and `src/content/pages.ts` hold the default text used until something is edited.

## Payout rules

`prisma/data/payout-rules-2026-10-07.json` holds the funded-account and payout rules of 23 futures firms (PropFirmMatch, checked 7 Oct 2026). `npm run db:payout-rules` adds them, creating any missing firm at the bottom of the ranking. Firms that already have payout rules are left alone so admin edits survive; `node prisma/import-payout-rules.mjs --force` overwrites them. They show on each firm page, on `/payout-rules` (with a country check), and are edited under "Funded account and payout rules" in the admin firm editor.

## Admin panel

Go to `/admin` and log in with `ADMIN_PASSWORD` to add firms and edit their plans, rules and country restrictions.
Edits to an existing plan or rule are recorded in the change log. Set `ADMIN_PASSWORD` and `SESSION_SECRET` in `.env` (see `.env.example`).

## Deploying

The site runs on an OVH VPS with Ubuntu 24.04 and CloudPanel. See [DEPLOY.md](DEPLOY.md) for the full guide.

## Project layout

- `prisma/schema.prisma`: firms, plans, rules, rule changes, country rules, users, reviews, payout reports, proofs, forum, strategies, moderation reports
- `src/app/firms`: comparison table and firm profile pages
