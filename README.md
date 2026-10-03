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
npm run dev               # http://localhost:3000
```

## Editing site text

All homepage, header and footer text (hero, FAQ, newsletter, footer links) lives in `src/content/site.ts`. Firm data, logos and offers are edited in the admin panel.

## Admin panel

Go to `/admin` and log in with `ADMIN_PASSWORD` to add firms and edit their plans, rules and country restrictions.
Edits to an existing plan or rule are recorded in the change log. Set `ADMIN_PASSWORD` and `SESSION_SECRET` in `.env` (see `.env.example`).

## Deploying

The site runs on an OVH VPS with Ubuntu 24.04 and CloudPanel. See [DEPLOY.md](DEPLOY.md) for the full guide.

## Project layout

- `prisma/schema.prisma`: firms, plans, rules, rule changes, country rules, users, reviews, payout reports, proofs, forum, strategies, moderation reports
- `src/app/firms`: comparison table and firm profile pages
