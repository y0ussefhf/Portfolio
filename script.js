// Hero video: only "activates" once a real <source> is dropped into the
// .hero-video element in index.html. Until then the placeholder stays
// visible and this is a no-op. Once a source is added, it also respects
// prefers-reduced-motion instead of forcing autoplay on everyone.
document.addEventListener("DOMContentLoaded", function () {
  var heroFilm = document.querySelector(".hero-film");
  var video = heroFilm && heroFilm.querySelector(".hero-video");
  if (!video || !video.querySelector("source[src]")) return;

  heroFilm.classList.add("has-video");

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) {
    video.removeAttribute("autoplay");
    video.pause();
  } else {
    video.setAttribute("autoplay", "");
    video.play().catch(function () {
      // Autoplay can still be blocked by the browser; that's fine, the
      // poster frame / first video frame just sits there instead.
    });
  }
});


// Active-section state for the sticky nav. The page is ~6800px tall with three
// anchored sections; without this there is no cue as to where you are.
//
// This was an IntersectionObserver watching a band across the upper part of the
// viewport, which is cheaper but is wrong for the LAST section: #contact is
// ~690px tall and sits at the very end of the document, so once the page is
// scrolled as far as it goes, #contact still starts below the band on any
// viewport taller than about 1240px. It could never light up. Deciding from the
// scroll offset instead costs three rectangle reads per scroll event, which is
// nothing, and it cannot fail that way.
function initNavState() {
  var links = Array.prototype.slice.call(document.querySelectorAll(".nav-links a[href^='#']"));
  if (!links.length) return;

  var sections = links
    .map(function (a) {
      var el = document.getElementById(a.getAttribute("href").slice(1));
      return el ? { link: a, el: el } : null;
    })
    .filter(Boolean);
  if (!sections.length) return;

  // Where the page is measured from: a line a little below the top of the
  // viewport. It has to clear the sections' 72px scroll-margin-top by a real
  // margin, not a couple of pixels - clicking ABOUT lands 72px above the
  // section, and a lazy image loading in at that moment moves the target enough
  // to miss a tight threshold, leaving the wrong link underlined until the next
  // scroll. Never less than 96px, and a fifth of the viewport on taller screens.
  function probeLine() {
    return Math.max(96, Math.min(0.2 * window.innerHeight, 200));
  }
  var activeLink = null;

  function apply() {
    var y = window.pageYOffset;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var current = null;

    if (max > 0 && y >= max - 2) {
      // Resting against the end of the document. Whatever the arithmetic says,
      // the reader is looking at the last section - it is the only thing that
      // can be on screen down here, and on a tall viewport it is not tall
      // enough to reach any threshold further up.
      current = sections[sections.length - 1];
    } else {
      var probe = y + probeLine();
      sections
        .map(function (s) {
          return { s: s, top: s.el.getBoundingClientRect().top + y };
        })
        .sort(function (a, b) { return a.top - b.top; })
        .forEach(function (r) { if (r.top <= probe) current = r.s; });
    }

    // Above the first section nothing is current, which is right: the hero and
    // the intro belong to no nav item.
    var link = current ? current.link : null;
    if (link === activeLink) return;
    if (activeLink) activeLink.removeAttribute("aria-current");
    if (link) link.setAttribute("aria-current", "true");
    activeLink = link;
  }

  // Called straight from the scroll event rather than deferred to
  // requestAnimationFrame. rAF is throttled or skipped outright in some
  // contexts, and a deferred version that guards itself with an "already
  // queued" flag stops updating for good if that callback never arrives.
  // Three rectangle reads on a scroll event, and no DOM write unless the
  // answer actually changed, is cheap enough not to need the indirection.
  window.addEventListener("scroll", apply, { passive: true });
  window.addEventListener("resize", apply);
  window.addEventListener("load", apply);
  apply();
}
// Run now if the DOM is already parsed, otherwise wait. A bare
// DOMContentLoaded listener silently no-ops when the script loads late
// (deferred, async, or injected), which is easy to mistake for broken code.
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initNavState);
} else {
  initNavState();
}


// Scroll reveals. One-shot: each element is unobserved once shown, so nothing
// re-animates on scroll-up and the observer empties itself as you go.
// Tell the inline failsafe in <head> that this file arrived and parsed. If it
// never runs, the page un-hides itself rather than staying blank.
window.__revealsReady = true;

(function () {
  function initReveals() {
    var els = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));
    if (!els.length) return;

    // No IntersectionObserver, or the visitor asked for reduced motion: show
    // everything immediately rather than leaving content hidden.
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!("IntersectionObserver" in window) || reduce) {
      els.forEach(function (el) { el.classList.add("is-in"); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add("is-in");
        io.unobserve(e.target);
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.08 });

    els.forEach(function (el) {
      // If the failsafe already rescued this element inline, hand control back.
      el.style.opacity = "";
      el.style.transform = "";
      el.style.transition = "";
      // Anything already in view on load should not wait for a scroll.
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.92) el.classList.add("is-in");
      else io.observe(el);
    });
  }
  // If anything in here throws, un-hide rather than leaving content invisible.
  function safeInit() {
    try { initReveals(); }
    catch (e) { document.documentElement.classList.add("reveals-failed"); }
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", safeInit);
  } else {
    safeInit();
  }
})();


// Re-apply an incoming #fragment once layout has settled.
//
// The browser honours index.html#contact while the document is still parsing -
// before the webfont swaps and before the lazy images below the fold have taken
// up their space. Those land afterwards, everything below shifts, and the
// visitor ends up somewhere arbitrary. On a cold load #contact left them near
// the top of the page: the contact section never came into view, so its reveals
// never fired and the email and social links stayed at opacity 0. It looked
// like the content was missing rather than simply off screen.
//
// So jump again when the page has finished loading - but only if the visitor
// has not scrolled themselves in the meantime, so this never yanks the page out
// from under someone who has started reading.
(function () {
  var hash = window.location.hash;
  if (!hash || hash.length < 2) return;

  var target;
  try { target = document.getElementById(decodeURIComponent(hash.slice(1))); }
  catch (e) { return; }
  if (!target) return;

  var moved = false;
  function giveUp() {
    moved = true;
    window.removeEventListener("wheel", giveUp);
    window.removeEventListener("touchmove", giveUp);
    window.removeEventListener("keydown", onKey);
  }
  function onKey(e) {
    var k = e.key;
    if (k === " " || k === "Home" || k === "End" || k === "PageUp" ||
        k === "PageDown" || (k && k.indexOf("Arrow") === 0)) giveUp();
  }
  window.addEventListener("wheel", giveUp, { passive: true });
  window.addEventListener("touchmove", giveUp, { passive: true });
  window.addEventListener("keydown", onKey);

  function settle() {
    if (moved) return;
    // scroll-margin-top keeps the section clear of the sticky nav; honour it
    // here too, otherwise this correction would land 72px off from where the
    // browser's own anchor jump puts it.
    var margin = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
    var want = target.getBoundingClientRect().top + window.pageYOffset - margin;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    if (want > max) want = max;
    if (want < 0) want = 0;
    if (Math.abs(window.pageYOffset - want) < 2) return;
    // Instant, not smooth. This is correcting a jump that already happened, not
    // starting a new one, and a half-second glide here reads as a glitch.
    window.scrollTo({ top: want, behavior: "auto" });
  }

  window.addEventListener("load", function () {
    settle();
    // Webfonts swapping in can shift the page one last time after load.
    setTimeout(settle, 300);
    setTimeout(giveUp, 1200);
  });
})();
