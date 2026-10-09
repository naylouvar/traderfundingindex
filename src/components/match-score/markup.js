// Static markup for the match-score table; engine.js fills it in.
export const MARKUP = `  <section class="tfi-hero">
    <div class="tfi-hero-top">
      <div class="tfi-hero-text">
        <span class="tfi-kicker"><span class="tfi-live"></span>Match Score engine</span>
        <h2>Find your <span class="tfi-grad-text">perfect</span> futures prop firm</h2>
        <p>Tell us how you trade. Our engine scores every firm from 0 to 100 on 6 factors taken from its published rules, then re-ranks the list instantly for your style, account size, country and priorities.</p>
      </div>
      <div class="tfi-best" data-best aria-live="polite"></div>
    </div>
    <div class="tfi-engine" data-engine aria-label="How the score is weighted"></div>

  <div class="tfi-filters">
    <div class="tfi-bar" role="toolbar" aria-label="Filters">
      <div class="tfi-group" data-filter="styles" aria-label="Trading style">
        <span class="tfi-group-label"><b>1</b> How do you trade?</span>
      </div>
      <span class="tfi-sep" aria-hidden="true"></span>
      <div class="tfi-group" data-filter="size" aria-label="Account size">
        <span class="tfi-group-label"><b>2</b> Account size</span>
      </div>
      <span class="tfi-sep" aria-hidden="true"></span>
      <button class="tfi-pill tfi-more" type="button" aria-expanded="false" aria-controls="tfi-panel"><b class="tfi-step">3</b> Country, platform, priority <span class="tfi-count" hidden></span></button>
    </div>
    <div class="tfi-backdrop" data-close></div>
    <div class="tfi-panel" id="tfi-panel" role="region" aria-label="More filters">
      <div class="tfi-sheet-head"><strong>More filters</strong><button class="tfi-link" type="button" data-close>Done</button></div>
      <label class="tfi-group">
        <span class="tfi-group-label">Your country</span>
        <select class="tfi-select" data-filter="country"></select>
        <span class="tfi-hint" data-country-hint></span>
      </label>
      <div class="tfi-group">
        <span class="tfi-group-label">Accounts I want</span>
        <div class="tfi-pills" data-filter="accounts"></div>
      </div>
      <label class="tfi-group">
        <span class="tfi-group-label">Platform</span>
        <select class="tfi-select" data-filter="platform"></select>
      </label>
      <div class="tfi-group">
        <span class="tfi-group-label">Priority</span>
        <div class="tfi-pills" data-filter="priority"></div>
      </div>
    </div>
  </div>

  </section>

  <div class="tfi-status">
    <span data-ranked></span>
    <span><span data-summary></span> · <button class="tfi-link" type="button" data-reset>Reset</button></span>
  </div>

  <div class="tfi-scroll">
    <div class="tfi-table" role="table" aria-label="Futures prop firms ranked by match score">
      <div class="tfi-thead tfi-cols" role="row"></div>
      <div class="tfi-rows" role="rowgroup"></div>
    </div>
  </div>

  <p class="tfi-legal" data-legal></p>
  <div class="tfi-tooltip" role="tooltip"></div>`;
