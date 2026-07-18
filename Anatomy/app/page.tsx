export default function Home() {
  return (
    <main id="app" className="app-shell">
      <a className="skip-link" href="#main-content">Skip to game</a>

      <header className="site-header">
        <a className="brand" href="#" aria-label="Critical Structures home">
          <span className="brand-mark" aria-hidden="true"><i></i><i></i><i></i></span>
          <span><strong>Critical</strong> Structures</span>
        </a>
        <div className="header-actions">
          <button className="icon-button" id="audio-toggle" type="button" aria-pressed="false" aria-label="Mute audio">♪</button>
          <button className="icon-button" id="contrast-toggle" type="button" aria-pressed="false" aria-label="Toggle high contrast">◐</button>
          <button className="icon-button" id="text-toggle" type="button" aria-pressed="false" aria-label="Increase text size">Aa</button>
        </div>
      </header>

      <div id="live-region" className="sr-only" aria-live="polite"></div>

      <section id="setup-screen" className="screen setup-screen">
        <div className="setup-hero">
          <p className="eyebrow">An anatomy placement game</p>
          <h1>Read the clues.<br/><em>Place the structure.</em></h1>
          <p className="hero-copy">Build spatial anatomy fluency by identifying a structure, navigating through layered views, and placing it where it belongs.</p>
          <div className="hero-stat-row" aria-label="Game content summary">
            <span><strong>7</strong> anatomy zones</span>
            <span><strong>14</strong> provisional structures</span>
            <span><strong>4</strong> difficulty levels</span>
          </div>
          <div className="anatomy-orbit" aria-hidden="true">
            <div className="orbit orbit-one"></div><div className="orbit orbit-two"></div>
            <div className="body-glyph"><i className="head"></i><i className="torso"></i><i className="arm a-left"></i><i className="arm a-right"></i><i className="leg l-left"></i><i className="leg l-right"></i></div>
            <span className="callout c1">identify</span><span className="callout c2">navigate</span><span className="callout c3">orient</span>
          </div>
        </div>

        <div className="setup-card" id="main-content">
          <div className="setup-card-heading">
            <div><p className="step-label">New session</p><h2>Set up your game</h2></div>
            <span className="provisional-badge">Learning prototype</span>
          </div>

          <fieldset className="field-group">
            <legend>Play mode</legend>
            <div className="choice-grid two-col" id="mode-options">
              <label className="choice-card selected"><input type="radio" name="mode" value="single" defaultChecked/><span className="choice-icon">◎</span><span><strong>Single player</strong><small>Build mastery and track progress</small></span><span className="choice-check">✓</span></label>
              <label className="choice-card"><input type="radio" name="mode" value="multi"/><span className="choice-icon">♟</span><span><strong>Pass & play</strong><small>2–6 players on one device</small></span><span className="choice-check">✓</span></label>
            </div>
          </fieldset>

          <div id="multiplayer-setup" className="multiplayer-setup" hidden>
            <label>Players <select id="player-count" defaultValue="2"><option>2</option><option>3</option><option>4</option><option>5</option><option>6</option></select></label>
            <div id="player-names" className="player-names"></div>
            <label className="check-line"><input id="steal-mode" type="checkbox"/> Allow a steal attempt after an incorrect answer</label>
          </div>

          <fieldset className="field-group">
            <legend>Anatomy zone</legend>
            <p className="field-hint">Choose one or combine several.</p>
            <div id="zone-options" className="zone-chips">
              <label className="zone-chip selected"><input type="checkbox" value="whole" defaultChecked/><span>✣</span> Whole body</label>
              <label className="zone-chip"><input type="checkbox" value="face"/><span>◉</span> Face</label>
              <label className="zone-chip"><input type="checkbox" value="arm"/><span>⌁</span> Arm</label>
              <label className="zone-chip"><input type="checkbox" value="leg"/><span>⌇</span> Leg</label>
              <label className="zone-chip"><input type="checkbox" value="neck-back"/><span>↟</span> Neck & back</label>
              <label className="zone-chip"><input type="checkbox" value="neuro"/><span>⌘</span> Neuro</label>
              <label className="zone-chip"><input type="checkbox" value="thorax"/><span>♡</span> Thorax</label>
              <label className="zone-chip"><input type="checkbox" value="abdomen-pelvis"/><span>◒</span> Abdomen & pelvis</label>
            </div>
          </fieldset>

          <fieldset className="field-group">
            <legend>Difficulty</legend>
            <div className="segmented" id="difficulty-options">
              <label className="selected"><input type="radio" name="difficulty" value="novice" defaultChecked/><strong>Novice</strong><small>Names + broad locations</small></label>
              <label><input type="radio" name="difficulty" value="intermediate"/><strong>Intermediate</strong><small>Functions + relationships</small></label>
              <label><input type="radio" name="difficulty" value="advanced"/><strong>Advanced</strong><small>Clinical + orientation</small></label>
              <label><input type="radio" name="difficulty" value="expert"/><strong>Expert</strong><small>Integrated clues</small></label>
            </div>
          </fieldset>

          <div className="setup-footer">
            <label>Rounds <select id="round-count" defaultValue="5"><option value="3">3 · quick</option><option value="5">5 · standard</option><option value="7">7 · focused</option></select></label>
            <button id="start-game" className="primary-button" type="button"><span>Start session</span><b aria-hidden="true">→</b></button>
          </div>
          <p className="review-note">All demonstration anatomy is provisional pending educator review.</p>
        </div>
      </section>

      <section id="game-screen" className="screen game-screen" hidden>
        <div className="game-statusbar">
          <button id="exit-game" className="text-button" type="button">← End session</button>
          <div className="round-progress"><span id="round-label">Round 1 of 5</span><div className="progress-track"><i id="round-progress-fill"></i></div></div>
          <div className="score-cluster"><span className="active-player" id="active-player">Your turn</span><span className="score-pill"><small>Score</small><strong id="score-value">0</strong></span><span className="streak-pill" title="Correct answer streak">✦ <b id="streak-value">0</b></span></div>
        </div>

        <div className="game-grid">
          <aside className="clue-panel panel">
            <div className="panel-kicker"><span className="step-dot">1</span><span>Decode the clue</span><small id="clue-value">100 pts</small></div>
            <div className="spinner-wrap">
              <div id="spinner" className="spinner" role="img" aria-label="Clue spinner"><div className="spinner-center"><span>CLUE</span><strong id="clue-count">—</strong></div></div>
              <button id="spin-button" className="spin-button" type="button">Spin for a clue</button>
            </div>
            <div id="clue-card" className="clue-card empty" aria-live="polite">
              <span className="clue-category">Waiting to spin</span>
              <p>Each new clue narrows the answer—but reduces the points available.</p>
            </div>
            <div id="used-clues" className="used-clues" aria-label="Used clue categories"></div>
            <div className="clue-actions">
              <button id="spin-again" className="secondary-button" type="button" disabled>Another clue <small>−15</small></button>
              <button id="answer-button" className="primary-button compact" type="button" disabled>Choose a structure →</button>
            </div>
          </aside>

          <section className="board-panel panel" aria-labelledby="board-heading">
            <div className="panel-kicker"><span className="step-dot">2</span><span id="board-heading">Navigate & place</span><small id="board-depth">Whole body</small></div>
            <div className="board-toolbar">
              <button id="board-back" type="button" className="icon-button small" aria-label="Previous anatomical view" disabled>←</button>
              <div id="breadcrumbs" className="breadcrumbs"><span>Whole body</span></div>
              <button id="debug-toggle" type="button" className="debug-button" aria-pressed="false">Debug</button>
            </div>
            <div id="board-stage" className="board-stage" aria-label="Interactive anatomy board">
              <div id="board-instruction" className="board-instruction"><strong>Reveal a clue to begin</strong><span>Then select a candidate and navigate to its location.</span></div>
              <div id="anatomy-board"></div>
              <div id="placed-piece" className="placed-piece" tabIndex={0} hidden aria-label="Placed anatomy structure"></div>
            </div>
            <div id="placement-controls" className="placement-controls" hidden>
              <label>Orientation <span id="rotation-value">0°</span><input id="rotation-control" type="range" min="-180" max="180" defaultValue="0" step="5"/></label>
              <label className="tolerance-check"><input id="tolerance-toggle" type="checkbox"/> Enlarged tolerance</label>
              <button id="check-placement" className="primary-button compact" type="button" disabled>Check placement</button>
            </div>
            <div id="feedback-card" className="feedback-card" hidden aria-live="assertive"></div>
            <div id="debug-panel" className="debug-panel" hidden>
              <div><span>Board</span><b id="debug-board">—</b></div><div><span>Target</span><b id="debug-target">—</b></div><div><span>Pointer</span><b id="debug-pointer">—</b></div><div><span>Overlap</span><b id="debug-overlap">—</b></div><div><span>Δ rotation</span><b id="debug-rotation">—</b></div>
              <label>Force target <select id="force-target"><option value="">Random</option></select></label>
              <label>Force clue <select id="force-clue"><option value="">Random</option></select></label>
              <div className="authoring-tools"><button id="authoring-start" type="button">Trace polygon</button><button id="authoring-export" type="button" disabled>Copy points</button><span id="authoring-status">0 points</span></div>
            </div>
          </section>

          <aside className="tray-panel panel">
            <div className="panel-kicker"><span className="step-dot">3</span><span>Candidate tray</span><small id="candidate-count">Locked</small></div>
            <p className="tray-instruction" id="tray-instruction">Candidates appear when you choose to answer.</p>
            <div id="candidate-tray" className="candidate-tray" role="listbox" aria-label="Candidate anatomy structures"></div>
            <div className="tray-tip"><span aria-hidden="true">⌘</span><p><strong>Two ways to play</strong>Drag a piece to the board, or select it and click through the views.</p></div>
          </aside>
        </div>
      </section>

      <section id="summary-screen" className="screen summary-screen" hidden>
        <div className="summary-card">
          <span className="summary-mark">✦</span><p className="eyebrow">Session complete</p><h2 id="summary-title">Strong work.</h2><p id="summary-copy">You completed the anatomy round.</p>
          <div className="summary-score"><small>Total score</small><strong id="summary-score">0</strong></div>
          <div id="summary-stats" className="summary-stats"></div>
          <div className="summary-actions"><button id="play-again" className="primary-button" type="button">Play again</button><button id="back-home" className="secondary-button" type="button">Change setup</button></div>
        </div>
      </section>

      <footer className="site-footer"><span>Critical Structures · Provisional anatomy content</span><span>Keyboard: Tab to navigate · Enter to select · Arrow keys to adjust placement</span></footer>
      <script type="module" src="/js/app.js"></script>
    </main>
  );
}
