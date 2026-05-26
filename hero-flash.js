/* Homepage hero — one-shot cinematic intro.
   1) SAI logo overlay fades in, holds, then dissolves.
   2) Photo cycles through 4 frames quickly, settles on the final hero photo.
   3) 0.5s after that final image finishes fading in, the headline reveals.
   Respects prefers-reduced-motion: skips straight to the settled state. */
(function () {
  var body = document.body;
  var frames = document.querySelectorAll('.hero-frame');
  var intro  = document.querySelector('.hero-intro-logo');
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Preload all hero photos so the cycle is butter-smooth
  ['hero-2.webp','hero-4.webp','hero-3.webp','hero-bg.webp','mobile-hero.webp'].forEach(function (src) {
    var img = new Image();
    img.src = src;
  });

  var hasRevealed = false;
  function reveal() {
    if (hasRevealed) return;
    hasRevealed = true;
    body.classList.add('intro-done');
  }

  // ── SHOW LOGO INTRO ONLY ON FIRST VISIT ──
  // Skip the logo overlay when:
  //   • this tab has already loaded any SAI page (sessionStorage flag set)
  //   • the page is being reloaded (refresh)
  //   • the referrer is from this same origin (internal navigation)
  function isInternalReferrer() {
    if (!document.referrer) return false;
    try { return new URL(document.referrer).host === window.location.host; }
    catch (e) { return false; }
  }
  function isReload() {
    try {
      var nav = performance.getEntriesByType && performance.getEntriesByType('navigation')[0];
      if (nav && nav.type === 'reload') return true;
    } catch (e) {}
    // Legacy fallback
    return performance.navigation && performance.navigation.type === 1;
  }
  var hasVisitedThisSession = false;
  try { hasVisitedThisSession = sessionStorage.getItem('sai_visited') === '1'; } catch (e) {}
  try { sessionStorage.setItem('sai_visited', '1'); } catch (e) {}
  var skipIntro = hasVisitedThisSession || isReload() || isInternalReferrer();

  // Fast-path: reduced motion, skipped intro, or missing frames → snap to settled state.
  if (reduced || skipIntro || frames.length < 5) {
    frames.forEach(function (f) { f.classList.remove('is-active'); });
    var last = frames[frames.length - 1] || frames[0];
    if (last) last.classList.add('is-active');
    if (intro) intro.classList.add('removed');
    // Mark the body so the headline + kinetic cycle short-circuit any animations.
    body.classList.add('skip-intro');
    reveal();
    return;
  }

  // ── PHASE 1 — SAI logo intro ─────────────────────────────
  // 0     : logo overlay covers everything, mark hidden (scale 0.94 + opacity 0)
  // +80ms : add .lit  → mark fades up + scales to 1 (0.5s)
  // +750ms: add .gone → whole overlay fades out (0.55s)
  // +1300ms: add .removed → take overlay out of paint
  var LOGO_HOLD_MS = 975;        // when to start fading the overlay (+30%)
  var OVERLAY_GONE_MS = 1690;    // when to display:none the overlay (+30%)
  var FLASH_START_MS = 1365;     // when the photo flash sequence begins (overlay ~half faded, +30%)

  if (intro) {
    // Kick off logo entrance on the next frame so the initial dark state paints
    requestAnimationFrame(function () { intro.classList.add('lit'); });
    setTimeout(function () { intro.classList.add('gone'); }, LOGO_HOLD_MS);
    setTimeout(function () { intro.classList.add('removed'); }, OVERLAY_GONE_MS);
  }

  // ── PHASE 2 — Photo flash cycle ──────────────────────────
  // Offset relative to the LOGO end; punches are 255ms apart, then the final
  // frame begins its 0.9s opacity fade-in.
  var flashOffsets = [0, 255, 510, 765]; // ms from FLASH_START_MS for frames 2..5
  var REVEAL_DELAY_AFTER_FINAL = 500;

  frames.forEach(function (f, idx) {
    if (idx === 0) return;
    setTimeout(function () {
      frames.forEach(function (g) { g.classList.remove('is-active'); });
      f.classList.add('is-active');
    }, FLASH_START_MS + (flashOffsets[idx - 1] || 0));
  });

  // ── PHASE 3 — Headline reveal ────────────────────────────
  // Listen for the final frame's opacity transition to complete, then wait
  // 500ms so the headline always lands on the fully-loaded final photo.
  var finalFrame = frames[frames.length - 1];
  if (finalFrame) {
    finalFrame.addEventListener('transitionend', function onEnd(e) {
      if (e.propertyName !== 'opacity') return;
      finalFrame.removeEventListener('transitionend', onEnd);
      setTimeout(reveal, REVEAL_DELAY_AFTER_FINAL);
    });
  }

  // Safety net: if transitionend never lands (cached, GPU stall), reveal
  // anyway at the expected worst-case time.
  var finalActiveAt = FLASH_START_MS + 765;
  setTimeout(reveal, finalActiveAt + 900 + REVEAL_DELAY_AFTER_FINAL);
})();
