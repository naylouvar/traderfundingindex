// Default text for the site's content pages. Each page can be rewritten in
// /admin/pages; the edited version is stored in the database and replaces the
// default. Bodies use a small Markdown subset: "## " and "### " headings,
// "- " and "1. " lists, **bold**, *italic*, [links](/path) and blank lines
// between paragraphs.

export type PageDefault = { slug: string; title: string; description: string; body: string };

export const RESERVED_SLUGS = ["admin", "firms", "fine-print", "payout-rules", "uploads", "api", "sitemap.xml", "robots.txt", "favicon.ico"];

export const defaultPages: PageDefault[] = [
  {
    slug: "about",
    title: "About TraderFundingIndex",
    description: "Who we are and why we built an independent index of futures prop firms.",
    body: `TraderFundingIndex is an independent index of futures prop firms, built by traders who have bought the challenges, passed them, failed them and waited on payouts.

## Why we built it

Prop firm marketing shows the profit split and the price. It rarely shows the consistency rule that voids your payout, the news ban buried in the terms, or the country list that stops you from being paid at all. We collect those details in one place, with a source for each one.

## What you will find here

- **A side-by-side index** of futures prop firms: prices, drawdown type, contract limits, profit split and payout terms.
- **Hidden rules** pulled from the fine print, each linked to its source.
- **Country restrictions**, so you know before you buy whether you can be paid.
- **Real trader experiences**, moderated so that one angry post or one paid review does not decide a rating.

## Our promise

Rankings are never for sale. Some offers on the site are partner links and they are always labelled. They never change a firm's position or rating. Read [how we rank firms](/how-we-rank) for the details.

## Get in touch

Spotted a rule change or a mistake? [Contact us](/contact) and we will check it.`,
  },
  {
    slug: "how-we-rank",
    title: "How we rank firms",
    description: "The method behind the TraderFundingIndex rankings and ratings.",
    body: `Our rankings are built to answer one question: if you buy this challenge today, how likely are you to be treated fairly and paid?

## Ratings

A firm's rating is the average of approved trader reviews. Each review scores the firm on overall experience, rules, payouts and support. Until a firm has enough reviews, we show an **editor rating** based on our own experience with the firm, clearly labelled as such.

## What we check

- **Payout record:** how fast payouts arrive, how often they are denied and why.
- **Rules:** drawdown type, consistency rules, news bans, contract limits and anything that changes your result but is not on the pricing page.
- **Country restrictions:** where the firm will not sell or will not pay.
- **Rule changes:** firms that change terms after you buy are marked down.

## Moderation

Every review is read before it is published. We remove reviews that are spam, written by the firm or its affiliates, or impossible to verify when they make serious claims. Firms can reply but cannot remove reviews.

## Money and rankings

Some firms pay us a commission when you use a partner link. That money never changes a ranking, a rating or what we publish about a firm. See our [affiliate disclosure](/affiliate-disclosure).`,
  },
  {
    slug: "contact",
    title: "Contact us",
    description: "Send a rule change, a correction or a question to the TraderFundingIndex team.",
    body: `Found a rule that changed, a payout problem, or a mistake in our data? Send it here. We read every message.

Firms that want to correct information about themselves are welcome too. Please include a link to the official source.`,
  },
  {
    slug: "affiliate-disclosure",
    title: "Affiliate disclosure",
    description: "How TraderFundingIndex earns money and why it never affects rankings.",
    body: `TraderFundingIndex is free to use. To keep it running, some links and discount codes on the site are partner links. If you buy through one of them, the firm may pay us a commission at no extra cost to you.

## What this means for you

- Partner offers are labelled on the site.
- Commissions **never** change a firm's ranking, rating, reviews or the rules we publish.
- We list firms that have no partner program, and we publish negative information about firms that do.

If you prefer, you can always go to a firm's website directly instead of using our link.`,
  },
  {
    slug: "review-guidelines",
    title: "Review guidelines",
    description: "What makes a review useful and what we remove.",
    body: `Reviews are the heart of TraderFundingIndex. These rules keep them honest and useful.

## Write a useful review

- Say which plan you bought and when.
- Describe what happened: passed, failed, paid or denied, and how long it took.
- Name the specific rule involved if something went wrong.
- Keep proof (receipts, payout emails, screenshots). We may ask for it before publishing serious claims.

## What we remove

- Reviews written by a firm, its staff or its affiliates.
- Spam, insults, personal information and threats.
- Reviews about a different firm or product.
- Multiple reviews of the same firm by the same person.

Reviews are the author's own opinion and experience. TraderFundingIndex does not verify every statement.`,
  },
  {
    slug: "terms",
    title: "Terms of use",
    description: "The terms that apply when you use TraderFundingIndex.",
    body: `By using TraderFundingIndex you agree to these terms. If you do not agree, please do not use the site.

## Information only

Everything on this site is general information. It is not financial, investment or legal advice. Prop firm rules, prices and payouts change often. Always check the firm's own website and terms before you buy.

## No guarantee

We work hard to keep the data accurate, but we cannot guarantee that it is complete, current or error free. You use the site at your own risk.

## User content

When you post a review or other content, you confirm that it is your own honest experience and you give us permission to publish, edit for length or clarity, and remove it. You are responsible for what you post.

## Acceptable use

Do not post false or misleading content, impersonate others, scrape the site in bulk, or try to break or overload it.

## Links to other sites

We link to prop firms and other websites. We are not responsible for their content, products or practices.

## Changes

We may update these terms. The version on this page is the one that applies.`,
  },
  {
    slug: "privacy",
    title: "Privacy policy",
    description: "What personal data TraderFundingIndex collects and how it is used.",
    body: `This policy explains what data we collect, why, and what you can do about it.

## What we collect

- **Newsletter:** your email address, if you subscribe.
- **Contact form:** your name, email address and message.
- **Reviews and accounts:** the information you choose to post.
- **Server logs:** standard technical data such as IP address and browser type, kept for security.

## How we use it

We use your data only to run the site: to send the newsletter you asked for, to answer your messages, to publish your reviews and to keep the site secure. We do not sell your data.

## How long we keep it

Newsletter emails are kept until you unsubscribe. Contact messages are deleted when they are no longer needed. Server logs are kept for a short period.

## Your rights

You can ask to see, correct or delete your personal data at any time through our [contact page](/contact). If you are in the EU or UK, you can also complain to your data protection authority.

## Cookies

See our [cookie policy](/cookies).`,
  },
  {
    slug: "cookies",
    title: "Cookie policy",
    description: "The cookies TraderFundingIndex uses.",
    body: `TraderFundingIndex uses as few cookies as possible.

## Cookies we use

- **Essential cookies:** used to keep administrators and members signed in. The site cannot work without them.

We do not currently use advertising or tracking cookies. If that changes, this page will be updated and we will ask for your consent first where the law requires it.

## Managing cookies

You can block or delete cookies in your browser settings. Blocking essential cookies may stop you from signing in.`,
  },
  {
    slug: "risk-disclosure",
    title: "Risk disclosure",
    description: "Trading futures carries a high level of risk. Read this before you trade.",
    body: `Trading futures and other leveraged products carries a high level of risk and is not suitable for everyone. You can lose more than you expect.

## Prop firm challenges

Most traders do not pass prop firm evaluations, and many who pass never receive a payout. Challenge fees are usually not refundable. Only spend money you can afford to lose.

## Simulated accounts

Many funded accounts are simulated. Payouts depend on the firm's own rules and its ability to pay.

## No advice

Nothing on TraderFundingIndex is a recommendation to buy a challenge, trade a product or follow a strategy. Past results, reviews and strategies shared by other traders do not guarantee future results.`,
  },
];
