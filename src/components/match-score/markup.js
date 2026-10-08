// Static markup for the match-score table; engine.js fills it in.
export const MARKUP = `  <div class="tfi-head">
    <div>
      <h2>Find your futures prop firm</h2>
      <p>Pick your style and account size. Every firm gets a match score from its published rules.</p>
    </div>
  </div>

  <div class="tfi-filters">
    <div class="tfi-bar" role="toolbar" aria-label="Filters">
      <div class="tfi-group" data-filter="styles" aria-label="Trading style">
        <span class="tfi-group-label">Style</span>
      </div>
      <span class="tfi-sep" aria-hidden="true"></span>
      <div class="tfi-group" data-filter="size" aria-label="Account size">
        <span class="tfi-group-label">Size</span>
      </div>
      <span class="tfi-sep" aria-hidden="true"></span>
      <button class="tfi-pill tfi-more" type="button" aria-expanded="false" aria-controls="tfi-panel">More filters <span class="tfi-count" hidden></span></button>
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
