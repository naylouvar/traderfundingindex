// All homepage and footer text lives here so it can be edited without
// touching the page code. Firm data itself is managed in /admin.

type Link = { label: string; href: string | null };
type NavItem = { label: string; href: string | null; note?: string };

export const site = {
  name: "TraderFundingIndex",
  brand: {
    name: "TraderFundingIndex",
    accent: "Funding",
    logoUrl: "",
  },
  promoBar: {
    text: "Every rule, fee and payout, checked by traders who bought the challenges.",
    linkLabel: "See the firms",
    href: "/firms",
  },
  nav: [
    { label: "Home", href: "/" },
    { label: "Firms", href: "/firms" },
    { label: "Offers", href: "/#offers" },
    { label: "Hidden rules", href: "/firms#rules" },
    { label: "Forum", href: null, note: "Soon" },
    { label: "Strategies", href: null, note: "Soon" },
  ] as NavItem[],
  assetTabs: [
    { label: "Futures", active: true },
    { label: "Forex", active: false },
    { label: "Crypto", active: false },
  ],
  hero: {
    title: "Compare the best futures prop firms of 2026",
    subtitle:
      "Real profit splits, hidden rules, payout reports and banned countries. Independent rankings, never paid for.",
  },
  stats: {
    firms: "futures firms tracked",
    reviews: "verified reviews",
    payouts: "payout reports",
    rules: "hidden rules exposed",
  },
  offers: {
    title: "Current offers",
    subtitle: "Discount codes from the firms we track. Partner links are always labelled.",
    empty: "No active offers right now.",
  },
  table: {
    title: "Futures prop firm rankings",
    tabs: ["Firms", "Challenges", "Offers", "Reviews"],
    method: "How we rank firms",
    methodHref: "/how-we-rank",
  },
  pillars: [
    {
      title: "Firm index",
      body: "Every futures prop firm side by side: fees, trailing drawdown, contract limits, profit split and payout terms.",
    },
    {
      title: "Hidden rules",
      body: "The consistency rules, news bans and country restrictions buried in the fine print, each with its source.",
    },
    {
      title: "Real payouts",
      body: "What traders actually got paid, how long it took, and which payouts were denied, backed by proof.",
    },
    {
      title: "Rule change log",
      body: "Every change a firm makes to its plans and rules, dated, so you can see who moves the goalposts.",
    },
  ],
  faq: {
    title: "Frequently asked questions",
    items: [
      {
        q: "Which futures prop firm is the best?",
        a: "It depends on your trading style. Compare drawdown type, contract limits, consistency rules and payout terms in the table above, then read verified reviews before you buy.",
      },
      {
        q: "How are firms ranked?",
        a: "Rankings come from verified trader reviews and payout reports. Firms cannot pay to change their position, and partner links never affect scores.",
      },
      {
        q: "What is a hidden rule?",
        a: "A rule that changes your result but is not on the firm's pricing page, such as a consistency rule, a news-trading ban or a payout condition buried in the terms. We link the source for each one.",
      },
      {
        q: "What is the difference between end-of-day and intraday trailing drawdown?",
        a: "End-of-day trailing drawdown only moves up when your balance closes higher at the end of the day. Intraday trailing drawdown follows your highest unrealized balance during the day, which makes it much easier to breach.",
      },
      {
        q: "Which prop firms accept traders from my country?",
        a: "Each firm page lists banned and restricted countries with a source. Check it before you buy a challenge.",
      },
      {
        q: "Are the discount codes affiliate links?",
        a: "Some offers are partner links and are always labelled. They never change a firm's ranking or rating.",
      },
    ],
  },
  newsletter: {
    eyebrow: "Stay informed",
    title: "Get rule changes and new offers by email",
    placeholder: "Your email",
    button: "Subscribe",
    thanks: "Thanks, you're subscribed.",
  },
  footer: {
    tagline: "The honest index of futures prop firms. Real payouts, hidden rules and banned countries, checked by traders.",
    disclaimer:
      "Reviews are traders' own experiences. Rankings are never paid for. Trading futures involves substantial risk of loss and is not suitable for every investor. Nothing on this site is financial advice.",
    x: "",
    discord: "",
    youtube: "",
    telegram: "",
    instagram: "",
    columns: [
      {
        title: "Compare",
        links: [
          { label: "All prop firms", href: "/firms" },
          { label: "Current offers", href: "/#offers" },
          { label: "Hidden rules", href: "/firms#rules" },
        ],
      },
      {
        title: "Community",
        links: [
          { label: "Forum (soon)", href: null },
          { label: "Strategies (soon)", href: null },
          { label: "Review guidelines", href: "/review-guidelines" },
        ],
      },
      {
        title: "Company",
        links: [
          { label: "About us", href: "/about" },
          { label: "How we rank firms", href: "/how-we-rank" },
          { label: "Affiliate disclosure", href: "/affiliate-disclosure" },
          { label: "Contact", href: "/contact" },
        ],
      },
      {
        title: "Legal",
        links: [
          { label: "Terms of use", href: "/terms" },
          { label: "Privacy policy", href: "/privacy" },
          { label: "Cookie policy", href: "/cookies" },
          { label: "Risk disclosure", href: "/risk-disclosure" },
        ],
      },
    ] as { title: string; links: Link[] }[],
  },
};
