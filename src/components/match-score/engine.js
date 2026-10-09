/* =====================================================================
   SCORING CONFIG: tune the match score here.
   ===================================================================== */
export const CONFIG = {
  // Colour palette (see match-score.css): 'eagle' (gold → teal), 'retro' (gold → coral → steel blue), 'retro-warm' (gold → coral → crimson), 'emerald', 'cobalt' or 'sunset'.
  palette: 'eagle',

  // Factor weights in % (must add up to 100).
  weights: {
    cost: 20,      // price + activation fee for the selected size
    ease: 20,      // ease of keeping the account: drawdown type, daily loss limit
    speed: 15,     // time to first payout
    size: 15,      // first-payout cap as % of account, plus a low minimum payout
    friction: 15,  // funded consistency rule + winning-day threshold
    trust: 15,     // verified payout record, else years in operation
  },
  // A priority button raises its factor to this weight; the others are scaled down proportionally.
  priorityWeight: 35,
  priorities: {
    cheapest: { label: 'Cheapest', factor: 'cost' },
    fastest:  { label: 'Fastest payout', factor: 'speed' },
    biggest:  { label: 'Biggest payout', factor: 'size' },
    easiest:  { label: 'Easiest rules', factor: 'friction' },
  },
  // Score used for any factor whose data is missing (null). Same everywhere.
  neutral: 50,
  // Size used for price / cap columns when no size is selected.
  defaultSize: 50,

  // Ease: drawdown type score (EOD > Static > Intraday trailing) and daily loss limit adjustment.
  drawdownScore: { EOD: 100, Static: 85, Intraday: 40 },
  dailyLossLimit: { none: +10, has: -10 },

  // Payout speed: first matching row wins (days to first payout → score).
  speed: [
    { maxDays: 0, score: 100 },   // daily / on demand
    { maxDays: 3, score: 85 },
    { maxDays: 5, score: 70 },    // 5 winning days
    { maxDays: 10, score: 50 },   // 8–10 days
    { maxDays: Infinity, score: 30 }, // 14+ days
  ],

  // Payout size: cap as % of account size; this % (or "no cap") earns 100.
  size: {
    fullMarksCapPct: 6,
    capShare: 0.75,          // share of the factor that comes from the cap…
    minPayoutShare: 0.25,    // …and from the minimum payout
    minPayout: [             // minimum payout ($) → score
      { max: 100, score: 100 }, { max: 250, score: 85 }, { max: 500, score: 65 }, { max: 1000, score: 40 }, { max: Infinity, score: 20 },
    ],
  },

  // Rule friction: funded consistency % → score (straight lines between points). 0 / none = 100.
  consistency: { none: 100, points: [[20, 30], [30, 50], [40, 70], [50, 85]] },
  // Winning-day threshold penalty: points lost per 0.1% of account size, capped.
  winDayPenaltyPer01Pct: 4,
  winDayPenaltyMax: 20,

  // Trust: needs at least minReports verified payouts to use the denial rate.
  trust: {
    minReports: 20,
    denialPenaltyPerPct: 4,  // score = 100 − 4 × denial rate %
    years: [{ min: 8, score: 100 }, { min: 5, score: 85 }, { min: 3, score: 65 }, { min: 1, score: 45 }, { min: 0, score: 25 }],
  },

  // Style adjustments (points subtracted from the final score).
  stylePenalty: { scalpRestricted: 20, newsRestricted: 20, botsConditional: 15 },

  // Reason line: factor scores at or above this count as strengths, below weakMax as weaknesses.
  strengthMin: 65,
  weakMax: 55,

  // Where the "Firm" button goes.
  firmUrl: (firm) => `/firms/${firm.id}`,
};

/* ===== Filter options ===== */
const STYLES = [
  { id: 'scalper', label: 'Scalper', icon: '⚡' },
  { id: 'intraday', label: 'Intraday', icon: '📈' },
  { id: 'news', label: 'News trader', icon: '📰' },
  { id: 'swing', label: 'Swing', icon: '🌙' },
  { id: 'bot', label: 'Bot/Algo', icon: '🤖' },
];
const SIZES = [25, 50, 100, 150];
const ACCOUNTS = [
  { id: '1', label: '1', min: 1 },
  { id: '2-3', label: '2–3', min: 2 },
  { id: '5+', label: '5+', min: 5 },
];
// Platform dropdown: label → words matched against each firm's platform list.
const PLATFORMS = [
  { label: 'TradingView', match: ['tradingview'] },
  { label: 'NinjaTrader', match: ['ninjatrader'] },
  { label: 'Tradovate', match: ['tradovate'] },
  { label: 'Rithmic / R Trader', match: ['r trader', 'rithmic'] },
  { label: 'Quantower', match: ['quantower'] },
  { label: 'ATAS', match: ['atas'] },
  { label: 'Sierra Chart', match: ['sierra chart'] },
  { label: 'Bookmap', match: ['bookmap'] },
  { label: 'MotiveWave', match: ['motivewave'] },
  { label: 'MultiCharts', match: ['multicharts'] },
  { label: 'Jigsaw Daytradr', match: ['jigsaw'] },
  { label: 'Volumetrica', match: ['volumetrica'] },
  { label: 'WealthCharts', match: ['wealthcharts'] },
  { label: 'Deepcharts', match: ['deepcharts'] },
  { label: 'BlackArrow', match: ['blackarrow'] },
  { label: 'TopstepX', match: ['topstepx'] },
];
const COUNTRY_CODES = 'AD AE AF AG AI AL AM AO AQ AR AS AT AU AW AX AZ BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BV BW BY BZ CA CC CD CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ DE DJ DK DM DO DZ EC EE EG EH ER ES ET FI FJ FK FM FO FR GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GS GT GU GW GY HK HM HN HR HT HU ID IE IL IM IN IO IQ IR IS IT JE JM JO JP KE KG KH KI KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT MU MV MW MX MY MZ NA NC NE NF NG NI NL NO NP NR NU NZ OM PA PE PF PG PH PK PL PM PN PR PS PT PW PY QA RE RO RS RU RW SA SB SC SD SE SG SH SI SJ SK SL SM SN SO SR SS ST SV SX SY SZ TC TD TF TG TH TJ TK TL TM TN TO TR TT TV TW TZ UA UG UM US UY UZ VA VC VE VG VI VN VU WF WS XK YE YT ZA ZM ZW'.split(' ');

/* =====================================================================
   LOGIC (no need to edit below to update data)
   ===================================================================== */
/** Mounts the table inside `root` (markup from markup.js). Returns a cleanup function. */
export function mountMatchScore(root, FIRMS) {
  if (!root.dataset.palette) root.dataset.palette = CONFIG.palette;
  const $ = (s) => root.querySelector(s);
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const usd = (n) => '$' + Math.round(n).toLocaleString('en-US');
  const regionNames = (() => { try { return new Intl.DisplayNames(['en'], { type: 'region' }); } catch { return null; } })();
  const countryName = (c) => (c && regionNames ? regionNames.of(c) : c) || c;
  const clamp = (n, a = 0, b = 100) => Math.max(a, Math.min(b, n));
  const N = CONFIG.neutral;

  /* ----- State ----- */
  const defaults = () => ({ styles: new Set(), size: CONFIG.defaultSize, country: detectCountry(), accounts: null, platform: '', priority: null });
  let detected = null;
  let state;
  let sortCol = null, sortDir = 1; // null = match score
  const open = new Set();

  function detectCountry() {
    if (detected !== null) return detected;
    detected = '';
    const langs = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language];
    for (const l of langs) {
      let r = null;
      try { r = new Intl.Locale(l).region; } catch { const m = /[-_]([A-Za-z]{2})$/.exec(l || ''); r = m && m[1]; }
      if (r && COUNTRY_CODES.includes(r.toUpperCase())) { detected = r.toUpperCase(); break; }
    }
    return detected;
  }

  /* ----- Data helpers ----- */
  const bySize = (v, size) => (v !== null && typeof v === 'object' ? (v[size] ?? null) : v);
  const plansOf = (f) => [{ ...f, plans: undefined, isMain: true }, ...(f.plans || []).map((p) => ({ ...f, plans: undefined, ...p, isMain: false }))];
  const sizesOf = (p) => p.accountSizes || [];
  const kLabel = (s) => s + 'K';
  const matchesPlatform = (f, label) => {
    const opt = PLATFORMS.find((p) => p.label === label);
    if (!opt) return true;
    return f.platforms.some((p) => opt.match.some((m) => new RegExp('(^|\\W)' + m.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i').test(p)));
  };
  const yearsOf = (f) => (f.founded ? new Date().getFullYear() - f.founded : null);

  /* ----- Step 1: hard filters ----- */
  function exclusions(p, size, st) {
    const out = [];
    if (st.country && p.restrictedCountries.includes(st.country)) out.push(`❌ Not available in ${countryName(st.country)}`);
    if (st.styles.has('bot') && p.bots === 'banned') out.push('❌ No bots allowed');
    if (st.styles.has('news') && p.news === 'banned') out.push('❌ Must be flat during news');
    if (st.styles.has('scalper') && p.scalping === 'banned') out.push('❌ Minimum trade hold time');
    const acc = ACCOUNTS.find((a) => a.id === st.accounts);
    const max = bySize(p.maxFundedAccounts, size ?? CONFIG.defaultSize);
    if (acc && max !== null && acc.min > max) out.push(`❌ Max ${max} funded account${max === 1 ? '' : 's'}`);
    if (st.platform && !matchesPlatform(p, st.platform)) out.push(`❌ No ${st.platform}`);
    if (st.size && !sizesOf(p).includes(st.size)) out.push(`❌ No ${kLabel(st.size)} account`);
    return out;
  }

  /* ----- Step 2: factor scores (each 0–100, plus labels for the reason line) ----- */
  function refSize(p, st) {
    if (st.size) return st.size;
    if (sizesOf(p).includes(CONFIG.defaultSize)) return CONFIG.defaultSize;
    return SIZES.find((s) => sizesOf(p).includes(s)) ?? sizesOf(p)[0];
  }
  function totalCost(p, size) {
    const price = bySize(p.price, size);
    return price === null || price === undefined ? null : price + (p.activationFee || 0);
  }
  function interp(points, x) {
    if (x <= points[0][0]) return points[0][1];
    for (let i = 1; i < points.length; i++) {
      const [x0, y0] = points[i - 1], [x1, y1] = points[i];
      if (x <= x1) return y0 + ((x - x0) / (x1 - x0)) * (y1 - y0);
    }
    return points[points.length - 1][1];
  }

  const FACTORS = {
    cost(p, size, ctx) {
      const c = totalCost(p, size);
      if (c === null) return { score: N, pending: 'price' };
      const min = ctx.minCost[size];
      const score = min ? clamp((100 * min) / c) : 100;
      return { score, good: score >= 99 ? `Cheapest ${kLabel(size)}` : `${usd(c)} for ${kLabel(size)}`, weak: `${usd(c)} for ${kLabel(size)}` };
    },
    ease(p) {
      const dd = p.drawdownType, dll = p.dailyLossLimit;
      if (!dd && dll === null) return { score: N, pending: 'drawdown' };
      let score = dd ? CONFIG.drawdownScore[dd] ?? N : N;
      if (dll === false) score += CONFIG.dailyLossLimit.none;
      if (dll === true) score += CONFIG.dailyLossLimit.has;
      score = clamp(score);
      const good = dd === 'Intraday' ? 'No daily loss limit' : dd ? `${dd} drawdown` : 'No daily loss limit';
      const weak = dd === 'Intraday' ? 'Intraday trailing drawdown' : 'Daily loss limit';
      return { score, good, weak, pending: dd ? null : 'drawdown' };
    },
    speed(p) {
      const d = p.daysToFirstPayout;
      if (d === null || d === undefined) return { score: N, pending: 'payout timing' };
      const score = CONFIG.speed.find((r) => d <= r.maxDays).score;
      return { score, good: d === 0 ? 'On-demand payouts' : `${d}-day payouts`, weak: `${d}+ days to first payout` };
    },
    size(p, size) {
      const cap = bySize(p.firstPayoutCap, size);
      const minP = bySize(p.minPayout, size);
      if ((cap === null || cap === undefined) && (minP === null || minP === undefined)) return { score: N, pending: 'payout cap' };
      const capScore = cap === 'none' ? 100 : cap == null ? N : clamp(((cap / (size * 1000)) * 100 / CONFIG.size.fullMarksCapPct) * 100);
      const minScore = minP == null ? N : CONFIG.size.minPayout.find((r) => minP <= r.max).score;
      const score = capScore * CONFIG.size.capShare + minScore * CONFIG.size.minPayoutShare;
      const good = cap === 'none' ? 'No payout cap' : cap != null ? `${usd(cap)} first payout cap` : `${usd(minP)} min payout`;
      const weak = minP != null && minScore <= 40 ? `${usd(minP)} min payout` : cap != null && cap !== 'none' ? `${usd(cap)} first payout cap` : `${usd(minP)} min payout`;
      return { score, good, weak, pending: cap == null ? 'payout cap' : null };
    },
    friction(p, size) {
      const c = p.consistencyFunded;
      const win = bySize(p.minWinDayProfit, size);
      let score, good, weak;
      if (c === null || c === undefined) { score = N; }
      else if (c === 0) { score = CONFIG.consistency.none; good = 'No funded consistency rule'; }
      else { score = interp(CONFIG.consistency.points, c); good = `${c}% consistency rule`; weak = `${c}% consistency rule`; }
      if (win) {
        const pct = (win / (size * 1000)) * 100;
        score -= Math.min(CONFIG.winDayPenaltyMax, (pct / 0.1) * CONFIG.winDayPenaltyPer01Pct);
        if (!weak || c === 0) weak = `${usd(win)} winning-day minimum`;
      }
      if (c === null || c === undefined) return { score: clamp(score), pending: 'consistency', weak };
      return { score: clamp(score), good, weak };
    },
    trust(p) {
      if (p.payoutsReported >= CONFIG.trust.minReports) {
        const rate = (p.payoutsDenied / p.payoutsReported) * 100;
        const score = clamp(100 - rate * CONFIG.trust.denialPenaltyPerPct);
        return { score, good: `${p.payoutsReported} verified payouts`, weak: `${rate.toFixed(0)}% payouts denied` };
      }
      const y = yearsOf(p);
      if (y === null) return { score: N, pending: 'track record' };
      const score = CONFIG.trust.years.find((r) => y >= r.min).score;
      return { score, good: `${y} years in business`, weak: y < 2 ? 'New firm' : `${y} years in business` };
    },
  };
  const FACTOR_LABELS = { cost: 'Cost', ease: 'Keeping the account', speed: 'Payout speed', size: 'Payout size', friction: 'Rule friction', trust: 'Trust' };

  function effectiveWeights(priority) {
    const w = { ...CONFIG.weights };
    const pr = priority && CONFIG.priorities[priority];
    if (!pr) return w;
    const f = pr.factor, rest = 100 - w[f], target = 100 - CONFIG.priorityWeight;
    for (const k in w) w[k] = k === f ? CONFIG.priorityWeight : (w[k] * target) / rest;
    return w;
  }

  function scorePlan(p, size, st, ctx, weights) {
    const factors = {};
    let total = 0;
    for (const k in weights) {
      factors[k] = FACTORS[k](p, size, ctx);
      total += (weights[k] * factors[k].score) / 100;
    }
    const warnings = [];
    if (st.styles.has('scalper')) {
      if (p.scalping === 'restricted') { total -= CONFIG.stylePenalty.scalpRestricted; warnings.push('⚠️ Scalping restricted'); }
      else if (!p.scalping) warnings.push('⚠️ Scalping rules not stated');
    }
    if (st.styles.has('news')) {
      if (p.news === 'restricted') { total -= CONFIG.stylePenalty.newsRestricted; warnings.push('⚠️ News trading restricted'); }
      else if (!p.news) warnings.push('⚠️ News rules not stated');
    }
    if (st.styles.has('bot')) {
      if (p.bots === 'conditional') { total -= CONFIG.stylePenalty.botsConditional; warnings.push('⚠️ Bots need approval'); }
      else if (!p.bots) warnings.push('⚠️ Bot policy not stated');
    }
    if (st.country && p.countryWarnings && p.countryWarnings[st.country]) warnings.push(`⚠️ Check ${countryName(st.country)}`);
    const acc = ACCOUNTS.find((a) => a.id === st.accounts);
    if (acc && acc.min > 1 && bySize(p.maxFundedAccounts, size) === null) warnings.push('⚠️ Account limit not stated');
    return { score: Math.round(clamp(total)), factors, warnings };
  }

  function reasonLine(r, weights) {
    const entries = Object.entries(r.factors).filter(([, f]) => !f.pending || f.good);
    const strengths = entries
      .filter(([, f]) => f.good && f.score >= CONFIG.strengthMin && !f.pending)
      .sort((a, b) => b[1].score * weights[b[0]] - a[1].score * weights[a[0]])
      .slice(0, 2)
      .map(([, f]) => '✅ ' + f.good);
    let weakness = r.warnings[0];
    if (!weakness) {
      const w = Object.entries(r.factors)
        .filter(([, f]) => f.weak && f.score < CONFIG.weakMax)
        .sort((a, b) => a[1].score - b[1].score)[0];
      if (w) weakness = '⚠️ ' + w[1].weak;
    }
    return [...strengths, weakness].filter(Boolean).join(' · ');
  }

  /* ----- Evaluate every firm ----- */
  function evaluate(st) {
    const weights = effectiveWeights(st.priority);
    // Candidate plan per firm: main plan if it fits, else the first plan that does.
    const picks = FIRMS.map((f) => {
      const cands = plansOf(f).map((p) => ({ p, size: refSize(p, st), ex: exclusions(p, refSize(p, st), st) }));
      const fit = !cands[0].ex.length ? cands[0] : cands.find((c) => !c.ex.length);
      const offering = cands.find((c) => !st.size || sizesOf(c.p).includes(st.size)) || cands[0];
      const pick = fit || offering;
      // When nothing fits, show the main plan's reasons (or the size-matching plan's)
      return { f, ...pick, excluded: !fit };
    });
    // Cheapest total cost per size among firms that fit (for the cost factor)
    const ctx = { minCost: {} };
    for (const s of SIZES) {
      const costs = picks.filter((x) => !x.excluded).map((x) => totalCost(x.p, s)).filter((c) => c !== null);
      ctx.minCost[s] = costs.length ? Math.min(...costs) : null;
    }
    return picks.map((x) => {
      const r = scorePlan(x.p, x.size, st, ctx, weights);
      const pending = Object.entries(r.factors).filter(([, f]) => f.pending).map(([, f]) => f.pending);
      return { ...x, ...r, pending, reason: x.excluded ? x.ex.join(' · ') : reasonLine(r, weights), weights };
    });
  }

  /* ----- Columns (header labels + sort keys; higher key = better, null sorts last) ----- */
  const ruleRank = { allowed: 3, conditional: 2, restricted: 2, banned: 0 };
  const COLUMNS = [
    { id: 'match', label: 'Match', key: (r) => (r.excluded ? null : r.score), cls: 'c-match' },
    { id: 'firm', label: 'Firm', key: (r) => r.f.firm.toLowerCase(), alpha: true, cls: 'c-firm' },
    { id: 'country', label: 'Your country', key: (r) => (state.country ? (r.p.restrictedCountries.includes(state.country) ? 0 : 1) : null), cls: 'c-country' },
    { id: 'price', label: () => `${kLabel(state.size || CONFIG.defaultSize)} price`, key: (r) => { const c = totalCost(r.p, r.size); return c === null ? null : -c; }, cls: 'c-price' },
    { id: 'dd', label: 'Drawdown', key: (r) => (r.p.drawdownType ? CONFIG.drawdownScore[r.p.drawdownType] : null), cls: 'c-dd' },
    { id: 'cons', label: 'Consistency (funded)', key: (r) => (r.p.consistencyFunded == null ? null : r.p.consistencyFunded === 0 ? 101 : r.p.consistencyFunded), cls: 'c-cons' },
    { id: 'time', label: 'First payout', key: (r) => (r.p.daysToFirstPayout == null ? null : -r.p.daysToFirstPayout), cls: 'c-time' },
    { id: 'cap', label: 'First payout cap', key: (r) => { const c = bySize(r.p.firstPayoutCap, r.size); return c == null ? null : c === 'none' ? Infinity : c / r.size; }, cls: 'c-cap' },
    { id: 'rules', label: 'Rules', key: (r) => ['news', 'bots', 'scalping'].reduce((s, k) => s + (ruleRank[r.p[k]] ?? 1), 0), cls: 'c-rules' },
    { id: 'record', label: 'Payout record', key: (r) => (r.p.payoutsReported ? r.p.payoutsReported - r.p.payoutsDenied * 10 : null), cls: 'c-record' },
    { id: 'action', label: '', cls: 'c-action' },
  ];

  /* ----- Rendering ----- */
  function pills(container, items, isOn, onClick, extraClass = '') {
    container.querySelectorAll('.tfi-pill').forEach((b) => b.remove());
    for (const it of items) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'tfi-pill ' + extraClass;
      b.innerHTML = (it.icon ? `<span class="tfi-ico" aria-hidden="true">${it.icon}</span>` : '') + esc(it.label);
      b.setAttribute('aria-pressed', String(isOn(it)));
      b.addEventListener('click', () => { onClick(it); update(); });
      container.appendChild(b);
    }
  }

  function renderFilters() {
    pills($('[data-filter="styles"]'), STYLES, (s) => state.styles.has(s.id), (s) => { if (state.styles.has(s.id)) state.styles.delete(s.id); else state.styles.add(s.id); });
    pills($('[data-filter="size"]'), SIZES.map((s) => ({ id: s, label: kLabel(s) })), (s) => state.size === s.id, (s) => { state.size = state.size === s.id ? null : s.id; }, 'tfi-pill--size');
    pills($('[data-filter="accounts"]'), ACCOUNTS, (a) => state.accounts === a.id, (a) => { state.accounts = state.accounts === a.id ? null : a.id; });
    pills($('[data-filter="priority"]'), Object.entries(CONFIG.priorities).map(([id, v]) => ({ id, label: v.label })), (p) => state.priority === p.id, (p) => { state.priority = state.priority === p.id ? null : p.id; });
    $('[data-filter="country"]').value = state.country;
    $('[data-filter="platform"]').value = state.platform;
    const n = [state.country && state.country !== detected ? 1 : 0, state.accounts, state.platform, state.priority].filter(Boolean).length;
    const badge = $('.tfi-count');
    badge.hidden = !n;
    badge.textContent = n;
    $('[data-country-hint]').textContent = state.country && state.country === detected ? 'Detected from your browser. Change it if it is wrong.' : '';
  }

  function setupSelects() {
    const sel = $('[data-filter="country"]');
    const opts = COUNTRY_CODES.map((c) => [c, countryName(c)]).sort((a, b) => a[1].localeCompare(b[1]));
    sel.innerHTML = '<option value="">Any country</option>' + opts.map(([c, n]) => `<option value="${c}">${esc(n)}</option>`).join('');
    sel.addEventListener('change', () => { state.country = sel.value; update(); });
    const ps = $('[data-filter="platform"]');
    ps.innerHTML = '<option value="">Any platform</option>' + PLATFORMS.map((p) => `<option>${esc(p.label)}</option>`).join('');
    ps.addEventListener('change', () => { state.platform = ps.value; update(); });
  }

  function renderHead() {
    const head = $('.tfi-thead');
    head.innerHTML = COLUMNS.map((c) => {
      if (c.id === 'action') return '<span></span>';
      const label = typeof c.label === 'function' ? c.label() : c.label;
      const active = (sortCol || 'match') === c.id;
      const arrow = active ? (sortCol && sortDir < 0 ? '▲' : '▼') : '▼';
      return `<button type="button" class="tfi-th ${active ? 'active' : ''}" data-sort="${c.id}" role="columnheader" aria-sort="${active ? (sortDir < 0 && sortCol ? 'ascending' : 'descending') : 'none'}">${esc(label)} <span class="arr">${arrow}</span></button>`;
    }).join('');
  }

  const ruleIcon = { news: '📰', bots: '🤖', scalping: '⚡' };
  const ruleName = { news: 'News', bots: 'Bots', scalping: 'Scalping' };
  const ruleWord = { allowed: 'Allowed', restricted: 'Restricted', conditional: 'Conditional', banned: 'Not allowed' };
  function rulesHtml(p) {
    const notes = { news: p.newsNote, bots: p.botsNote, scalping: p.scalpNote };
    const flags = [];
    const html = ['news', 'bots', 'scalping'].map((k) => {
      const v = p[k] || 'unknown';
      if (v === 'banned') flags.push(`no ${ruleName[k].toLowerCase()}`);
      const tip = `${ruleName[k]}: ${ruleWord[v] || 'Not stated'}\n${notes[k] || ''}`;
      return `<span class="tfi-rule ${v}" data-tip="${esc(tip)}" tabindex="0" aria-label="${esc(tip)}">${ruleIcon[k]}</span>`;
    }).join('');
    return `<div class="tfi-rules" data-label="${esc(flags.length ? flags.join(', ') : '')}">${html}</div>`;
  }

  function capText(p, size) {
    const c = bySize(p.firstPayoutCap, size);
    if (c === 'none') return 'No cap';
    if (c == null) return '<span class="tfi-pending">Data pending</span>';
    return `<span class="tfi-num">${usd(c)}</span>`;
  }
  function consText(c) {
    if (c == null) return '<span class="tfi-pending">Not stated</span>';
    return c === 0 ? 'None' : `${c}%`;
  }
  function timeText(p) {
    const d = p.daysToFirstPayout;
    if (d == null) return '<span class="tfi-pending">Not stated</span>';
    return `<span data-tip="${esc(p.payoutTime || '')}">${d === 0 ? 'On demand' : d + ' days'}</span>`;
  }
  function priceText(p, size) {
    const c = totalCost(p, size);
    const diff = !state.size && size !== CONFIG.defaultSize ? ` <span class="tfi-muted tfi-small">(${kLabel(size)})</span>` : '';
    return c === null ? `<span class="tfi-pending">Price pending</span>${diff}` : `<span class="tfi-num">${usd(c)}</span>${diff}`;
  }
  function countryCell(r) {
    if (!state.country) return '<span class="tfi-muted" data-tip="Pick your country under More filters">—</span>';
    const name = countryName(state.country);
    if (r.p.restrictedCountries.includes(state.country)) return `<span data-tip="${esc(r.f.firm)} does not accept traders from ${esc(name)}">❌</span>`;
    const w = r.p.countryWarnings && r.p.countryWarnings[state.country];
    if (w) return `<span data-tip="${esc(w)}">⚠️</span>`;
    return `<span data-tip="${esc(name + ' is not on the restricted list.' + (r.p.countryNote ? '\n' + r.p.countryNote : ''))}">✅${r.p.countryNote ? '<sup class="tfi-muted">i</sup>' : ''}</span>`;
  }
  function initials(name) { return name.split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase(); }

  function summaryHtml(r) {
    const { f, p, size } = r;
    const y = yearsOf(f);
    const switched = !p.isMain;
    const pendingTxt = r.pending.length && !r.excluded ? `<div class="tfi-reason-sub"><span data-tip="${esc('Scored as neutral (50) until collected: ' + r.pending.join(', '))}">Data pending: ${r.pending.length} factor${r.pending.length === 1 ? '' : 's'}</span></div>` : '';
    const reason = r.excluded ? `<span class="bad">${esc(r.reason)}</span>` : esc(r.reason || 'Data pending');
    const cells = {
      match: `<div class="tfi-badge ${scoreTier(r)}" style="--p:${r.excluded ? 0 : r.score}" aria-label="Match score ${r.excluded ? 'not applicable' : r.score}"><span data-score="${r.excluded ? '' : r.score}">${r.excluded ? '—' : r.score}</span></div>
              <div class="tfi-reason-wrap"><div class="tfi-reason">${reason}</div>${pendingTxt}</div>`,
      firm: `<div class="tfi-firm"><span class="tfi-logo">${f.logo ? `<img src="${esc(f.logo)}" alt="">` : initials(f.firm)}</span>
              <div style="min-width:0"><div class="tfi-firm-name">${esc(f.firm)} <span class="tfi-chev">▾</span></div>
              <div class="tfi-firm-sub">${y !== null ? `${y} year${y === 1 ? '' : 's'} in operation` : 'Years: pending'}</div>
              <span class="tfi-plan-tag ${switched ? 'switched' : ''}">${switched ? 'Best fit: ' : ''}${esc(p.plan)}</span></div></div>`,
      country: countryCell(r),
      price: priceText(p, size),
      dd: p.drawdownType ? esc(p.drawdownType) : '<span class="tfi-pending">Data pending</span>',
      cons: consText(p.consistencyFunded),
      time: timeText(p),
      cap: capText(p, size),
      rules: rulesHtml(p),
      record: p.payoutsReported ? `${p.payoutsReported} paid · ${p.payoutsDenied} denied` : '<span class="tfi-muted">— no data yet</span>',
      action: `<a class="tfi-btn" href="${esc(CONFIG.firmUrl(f))}">Firm</a>`,
    };
    const meta = `<div class="tfi-cell c-meta">
        <span>Country ${state.country ? countryCell(r) : '<b>—</b>'}</span>
        <span>${kLabel(size)} price <b>${priceText(p, size)}</b></span></div>`;
    return COLUMNS.map((c) => `<div class="tfi-cell ${c.cls}" role="cell">${cells[c.id]}</div>`).join('') + meta;
  }

  function detailsHtml(r) {
    const { f, p, size } = r;
    const all = plansOf(f);
    const money = (v, s) => { const x = bySize(v, s); return x === 'none' ? 'No cap' : x == null ? '—' : x === 0 ? 'None' : usd(x); };
    const planRows = all.map((q) => {
      const s = sizesOf(q).includes(size) ? size : refSize(q, state);
      return `<tr class="${q.plan === p.plan ? 'current' : ''}">
        <td><strong>${esc(q.plan)}</strong>${q.isMain ? ' <span class="tfi-muted tfi-small">main</span>' : ''}</td>
        <td>${sizesOf(q).map(kLabel).join(', ')}</td>
        <td>${q.consistencyFunded == null ? '—' : q.consistencyFunded === 0 ? 'None' : q.consistencyFunded + '%'}</td>
        <td>${esc(q.payoutTime || '—')}</td>
        <td>${money(q.minWinDayProfit, s)}</td>
        <td>${money(q.minPayout, s)}</td>
        <td>${money(q.firstPayoutCap, s)}${s !== size ? ` <span class="tfi-muted">(${kLabel(s)})</span>` : ''}${q.capNote ? `<div class="tfi-muted tfi-small">${esc(q.capNote)}</div>` : ''}</td>
      </tr>`;
    }).join('');
    const breakdown = Object.entries(r.factors).map(([k, fc]) => `
      <div class="tfi-bar-row"><span>${FACTOR_LABELS[k]} <span class="tfi-muted">${Math.round(r.weights[k])}%</span></span>
      <span class="tfi-meter ${fc.pending ? 'neutral' : ''}"><i style="width:${fc.score}%"></i></span>
      <span class="tfi-num ${fc.pending ? 'tfi-muted' : ''}">${fc.pending ? 'pending' : Math.round(fc.score)}</span></div>`).join('');
    const maxAcc = bySize(p.maxFundedAccounts, size);
    const kv = (k, v) => (v ? `<dt>${k}</dt><dd>${v}</dd>` : '');
    const countries = p.restrictedCountries.map(countryName).sort().join(', ');
    return `
      <dl class="tfi-kv tfi-facts" style="margin-top:12px">
        ${kv('Drawdown', p.drawdownType ? esc(p.drawdownType) : 'Data pending')}
        ${kv('Consistency', consText(p.consistencyFunded))}
        ${kv('First payout', esc(p.payoutTime || 'Not stated'))}
        ${kv('First payout cap', capText(p, size))}
        ${kv('Payout record', p.payoutsReported ? `${p.payoutsReported} paid · ${p.payoutsDenied} denied` : '— no data yet')}
      </dl>
      <div class="tfi-dgrid">
        <div class="tfi-dbox">
          <h4>Funded plans (${kLabel(size)} shown)</h4>
          <div class="tfi-plans-wrap"><table class="tfi-plans">
            <thead><tr><th>Plan</th><th>Sizes</th><th>Consistency</th><th>First payout</th><th>Winning day</th><th>Min payout</th><th>First cap</th></tr></thead>
            <tbody>${planRows}</tbody></table></div>
          <h4 style="margin-top:16px">Rules</h4>
          <dl class="tfi-kv">
            ${kv('📰 News', esc(p.newsNote || 'Not stated'))}
            ${kv('⚡ Scalping', esc(p.scalpNote || 'Not stated'))}
            ${kv('🤖 Bots', esc(p.botsNote || 'Not stated'))}
            ${kv('Funded accounts', esc(p.maxFundedNote || (maxAcc ?? 'Not stated')))}
            ${kv('Payout threshold', p.thresholdNote ? esc(p.thresholdNote) : '')}
            ${kv('Profit split', p.profitSplit ? `${p.profitSplit}%${p.splitNote ? ' · ' + esc(p.splitNote) : ''}` : 'Data pending')}
            ${kv('Activation fee', p.activationFee ? `${usd(p.activationFee)}${p.activationNote ? ' · ' + esc(p.activationNote) : ''}` : 'Data pending')}
            ${kv('Platforms', esc(p.platforms.join(', ')))}
          </dl>
        </div>
        <div class="tfi-dbox">
          <h4>Score breakdown</h4>
          <div class="tfi-breakdown">${breakdown}</div>
          ${r.warnings.length ? `<p class="tfi-small" style="margin:10px 0 0">${r.warnings.map(esc).join('<br>')}</p>` : ''}
          <h4 style="margin-top:16px">Restricted countries (${p.restrictedCountries.length})</h4>
          <details class="tfi-countries"><summary>Show list</summary><p>${esc(countries)}${p.restrictedRegions ? `<br>Regions: ${esc(p.restrictedRegions)}` : ''}</p></details>
          ${p.countryNote ? `<p class="tfi-small tfi-muted">${esc(p.countryNote)}</p>` : ''}
          ${p.notes ? `<h4 style="margin-top:16px">Notes</h4><p class="tfi-small tfi-muted" style="margin:0">${esc(p.notes)}</p>` : ''}
          <p class="tfi-small" style="margin-top:14px">Source: <a href="${esc(p.source)}" target="_blank" rel="noopener nofollow">${esc(p.source.replace(/^https?:\/\//, ''))}</a> · checked ${esc(p.lastChecked)}</p>
        </div>
      </div>`;
  }

  /* Rows are kept between renders so they can slide to their new position (FLIP). */
  const rowEls = new Map();
  function rowEl(id) {
    let el = rowEls.get(id);
    if (!el) {
      el = document.createElement('div');
      el.className = 'tfi-row';
      el.dataset.id = id;
      el.setAttribute('role', 'row');
      el.innerHTML = '<div class="tfi-sum tfi-cols" tabindex="0" aria-expanded="false"></div><div class="tfi-details"></div>';
      rowEls.set(id, el);
    }
    return el;
  }

  function sortRows(rows) {
    const col = COLUMNS.find((c) => c.id === sortCol);
    const keyOf = col ? col.key : (r) => (r.excluded ? null : r.score);
    const dir = col ? sortDir : 1;
    return rows.slice().sort((a, b) => {
      if (a.excluded !== b.excluded) return a.excluded ? 1 : -1; // firms that don't fit always go last
      const ka = keyOf(a), kb = keyOf(b);
      if (ka === null && kb === null) return a.f.firm.localeCompare(b.f.firm);
      if (ka === null) return 1;
      if (kb === null) return -1;
      if (col && col.alpha) return dir * String(ka).localeCompare(String(kb));
      if (ka !== kb) return dir * (kb - ka);
      if (!a.excluded && a.score !== b.score) return b.score - a.score;
      return a.f.firm.localeCompare(b.f.firm);
    });
  }

  const scoreTier = (r) => (r.excluded ? 'tier-out' : r.score >= 70 ? 'tier-high' : r.score >= 55 ? 'tier-mid' : 'tier-low');

  /* Live weight bars: shows visitors what the engine is weighing right now. */
  const FACTOR_SHORT = { cost: 'Cost', ease: 'Risk', speed: 'Speed', size: 'Payout', friction: 'Rules', trust: 'Trust' };
  const FACTOR_ICONS = { cost: '💰', ease: '🛡️', speed: '⏱️', size: '💸', friction: '📏', trust: '🔒' };
  function renderEngine(weights) {
    const boosted = state.priority && CONFIG.priorities[state.priority].factor;
    $('[data-engine]').innerHTML = Object.keys(CONFIG.weights).map((k) => `
      <div class="tfi-factor ${k === boosted ? 'boosted' : ''}">
        <div class="tfi-factor-top"><span>${FACTOR_ICONS[k]} <span class="tfi-long">${FACTOR_LABELS[k]}</span><span class="tfi-short">${FACTOR_SHORT[k]}</span></span><b class="tfi-num">${Math.round(weights[k])}%</b></div>
        <div class="tfi-factor-bar"><i style="width:${(weights[k] / CONFIG.priorityWeight) * 100}%"></i></div>
      </div>`).join('');
  }

  /* "Your best match" card in the header. */
  function renderBest(results, ms) {
    const best = results.filter((r) => !r.excluded).sort((a, b) => b.score - a.score)[0];
    const box = $('[data-best]');
    if (!best) {
      box.innerHTML = `<div class="tfi-best-label">Your best match</div><p class="tfi-best-none">No firm fits every filter. Loosen one to see matches.</p>`;
      return;
    }
    box.innerHTML = `
      <div class="tfi-best-label">Your best match <span class="tfi-muted">· ${results.length} firms scored in ${ms < 1 ? '<1' : Math.round(ms)} ms</span></div>
      <div class="tfi-best-body">
        <div class="tfi-badge tfi-badge--xl ${scoreTier(best)}" style="--p:${best.score}"><span data-score="${best.score}">${best.score}</span></div>
        <div style="min-width:0">
          <div class="tfi-best-name">${esc(best.f.firm)}</div>
          <div class="tfi-muted tfi-small">${esc(best.p.plan)} · ${kLabel(best.size)}</div>
          <div class="tfi-reason" style="margin-top:6px">${esc(best.reason)}</div>
        </div>
      </div>`;
  }

  /* Count each score up from its previous value so recalculation is visible. */
  const lastScore = new Map();
  function animateScores() {
    const reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    root.querySelectorAll('[data-score]').forEach((el) => {
      const to = Number(el.dataset.score);
      const key = el.closest('.tfi-row')?.dataset.id || 'best';
      const from = lastScore.has(key) ? lastScore.get(key) : to;
      if (el.dataset.score === '') { lastScore.delete(key); return; }
      lastScore.set(key, to);
      if (reduce || from === to) return;
      const t0 = performance.now();
      const step = (t) => {
        const k = Math.min(1, (t - t0) / 450);
        el.textContent = Math.round(from + (to - from) * (1 - Math.pow(1 - k, 3)));
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }

  let first = true;
  function update() {
    const t0 = performance.now();
    const results = sortRows(evaluate(state));
    const ms = performance.now() - t0;
    renderFilters();
    renderHead();
    renderEngine(results[0] ? results[0].weights : CONFIG.weights);
    renderBest(results, ms);

    const list = $('.tfi-rows');
    const before = new Map();
    if (!first) rowEls.forEach((el, id) => before.set(id, el.getBoundingClientRect().top));

    results.forEach((r, i) => {
      const el = rowEl(r.f.id);
      el.classList.toggle('excluded', r.excluded);
      el.classList.toggle('top', !r.excluded && i === 0 && !sortCol);
      el.classList.toggle('open', open.has(r.f.id));
      el.querySelector('.tfi-sum').innerHTML = summaryHtml(r);
      el.querySelector('.tfi-sum').setAttribute('aria-expanded', String(open.has(r.f.id)));
      el.querySelector('.tfi-details').innerHTML = open.has(r.f.id) ? detailsHtml(r) : '';
      el._result = r;
      list.appendChild(el);
    });

    // FLIP: slide each row from its old position to the new one
    const reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!first && !reduce) {
      rowEls.forEach((el, id) => {
        const old = before.get(id);
        if (old === undefined) return;
        const dy = old - el.getBoundingClientRect().top;
        if (!dy) return;
        el.style.transition = 'none';
        el.style.transform = `translateY(${dy}px)`;
      });
      void list.offsetHeight; // force layout
      rowEls.forEach((el) => {
        if (!el.style.transform) return;
        el.style.transition = 'transform 300ms cubic-bezier(.2,.7,.2,1), background .15s, border-color .15s, opacity .3s';
        el.style.transform = '';
        el.addEventListener('transitionend', () => { el.style.transition = ''; }, { once: true });
      });
    }
    first = false;
    animateScores();

    const fit = results.filter((r) => !r.excluded).length;
    const out = results.length - fit;
    $('[data-summary]').textContent = `${fit} firm${fit === 1 ? '' : 's'} fit${out ? ` · ${out} don't` : ''}`;
    const ranked = $('[data-ranked]');
    if (sortCol) {
      const col = COLUMNS.find((c) => c.id === sortCol);
      const label = typeof col.label === 'function' ? col.label() : col.label;
      ranked.innerHTML = `Sorted by: <strong>${esc(label)}</strong> · <button type="button" class="tfi-link" data-back>Back to match score</button>`;
    } else {
      const personal = state.styles.size || (state.size && state.size !== CONFIG.defaultSize) || state.priority || state.accounts || state.platform;
      ranked.innerHTML = `Ranked by: <strong>match score</strong> · ${personal ? 'personalised to your filters' : 'tap a style to personalise'}`;
    }
  }

  /* ----- Events ----- */
  root.addEventListener('click', (e) => {
    const t = e.target;
    const th = t.closest('[data-sort]');
    if (th) {
      const id = th.dataset.sort;
      if (id === 'match') { sortCol = null; sortDir = 1; }
      else if (sortCol === id) sortDir = -sortDir;
      else { sortCol = id; sortDir = 1; }
      update();
      return;
    }
    if (t.closest('[data-back]')) { sortCol = null; sortDir = 1; update(); return; }
    if (t.closest('[data-reset]')) { state = defaults(); sortCol = null; sortDir = 1; update(); return; }
    if (t.closest('[data-close]')) { togglePanel(false); return; }
    if (t.closest('.tfi-more')) { togglePanel(!$('.tfi-panel').classList.contains('open')); return; }
    const sum = t.closest('.tfi-sum');
    if (sum && !t.closest('a, button, summary')) toggleRow(sum.parentElement);
  });
  root.addEventListener('keydown', (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('tfi-sum')) { e.preventDefault(); toggleRow(e.target.parentElement); }
    if (e.key === 'Escape') togglePanel(false);
  });
  function toggleRow(el) {
    const id = el.dataset.id;
    if (open.has(id)) open.delete(id); else open.add(id);
    el.classList.toggle('open', open.has(id));
    el.querySelector('.tfi-sum').setAttribute('aria-expanded', String(open.has(id)));
    el.querySelector('.tfi-details').innerHTML = open.has(id) ? detailsHtml(el._result) : '';
  }
  function togglePanel(show) {
    $('.tfi-panel').classList.toggle('open', show);
    $('.tfi-backdrop').classList.toggle('open', show);
    $('.tfi-more').setAttribute('aria-expanded', String(show));
  }

  /* Tooltip */
  const tip = $('.tfi-tooltip');
  function showTip(el) {
    const text = el.getAttribute('data-tip');
    if (!text || !text.trim()) return;
    tip.textContent = text;
    tip.classList.add('show');
    const r = el.getBoundingClientRect(), tr = tip.getBoundingClientRect();
    let left = Math.min(window.innerWidth - tr.width - 8, Math.max(8, r.left + r.width / 2 - tr.width / 2));
    let top = r.top - tr.height - 8;
    if (top < 8) top = r.bottom + 8;
    tip.style.left = left + 'px';
    tip.style.top = top + 'px';
  }
  const hideTip = () => tip.classList.remove('show');
  root.addEventListener('mouseover', (e) => { const el = e.target.closest('[data-tip]'); if (el) showTip(el); });
  root.addEventListener('mouseout', (e) => { if (e.target.closest('[data-tip]')) hideTip(); });
  root.addEventListener('focusin', (e) => { const el = e.target.closest('[data-tip]'); if (el) showTip(el); });
  root.addEventListener('focusout', hideTip);
  window.addEventListener('scroll', hideTip, { passive: true });

  /* ----- Init ----- */
  const lastChecked = FIRMS.map((f) => f.lastChecked).sort().pop();
  $('[data-legal]').innerHTML = `<strong>Match score is calculated only from each firm's published rules and our verified payout data.</strong> Affiliate partnerships never affect the score. Rules checked on ${esc(lastChecked)}; always confirm on the firm's website before buying.`;
  setupSelects();
  state = defaults();
  update();
  return () => window.removeEventListener('scroll', hideTip);
}
