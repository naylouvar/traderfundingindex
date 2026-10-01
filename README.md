# TraderFundingIndex

The honest index of futures prop firms: real payouts, hidden rules, country restrictions and verified trader reviews. Forum and strategy sharing come in later phases.

Product plan: https://claude.ai/code/artifact/89762862-a503-4e3f-aba9-da25f7cbadfe

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- Prisma with MySQL (included in every Hostinger plan; switch `provider` in `prisma/schema.prisma` to move to Postgres)

## Local setup

```bash
cp .env.example .env      # fill in DATABASE_URL
npm install
npm run db:push           # create tables
npm run db:seed           # add the seed firms
npm run dev               # http://localhost:3000
```

## Deploying on Hostinger

Next.js needs a Node.js runtime, so it runs on a Hostinger plan with Node.js web apps (Business or Cloud) or on a Hostinger VPS. Plain shared PHP hosting cannot run it.

1. Create a MySQL database in hPanel and put its connection string in `DATABASE_URL`.
2. Connect this GitHub repository as a Node.js app (build command `npm run build`, start command `npm start`), or on a VPS clone it and run it with `pm2 start npm -- start`.
3. Run `npm run db:push` and `npm run db:seed` once against the production database.

## Project layout

- `prisma/schema.prisma`: firms, plans, rules, rule changes, country rules, users, reviews, payout reports, proofs, forum, strategies, moderation reports
- `src/app/firms`: comparison table and firm profile pages
