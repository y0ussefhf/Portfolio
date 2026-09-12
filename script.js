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


// Glass for the nav strip -- ported from the supplied reference implementation.
// See the comment above the filter defs in index.html for why the blue channel,
// the pinned R and the repeated sRGB declarations are all deliberate.
//
// Displacement profile measured from the 3D render, 256 rows top to bottom.
// 128 is no shift; shift in px = scale * (value/255 - 0.5). Bright at the top
// pulls content up from below, dark at the bottom pulls it down from above.
// Do not re-centre or normalise this array.
(function () {
  var DISP_MAP = [255,247,239,231,223,223,224,225,226,226,227,227,228,228,227,226,226,225,223,222,220,219,217,215,214,212,210,209,207,206,204,202,201,199,197,195,194,192,190,188,186,185,183,181,180,178,177,176,174,173,172,170,169,168,167,166,165,164,163,162,161,160,159,158,157,156,155,154,153,152,150,149,148,147,146,145,144,143,142,141,141,140,139,139,138,137,137,136,136,135,134,134,133,133,133,132,132,131,131,131,131,130,130,130,130,130,129,129,129,129,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,128,127,127,126,126,126,125,125,124,124,123,122,122,121,120,120,119,118,118,117,116,116,115,114,114,113,112,111,111,110,109,109,108,107,107,106,105,104,104,103,102,101,100,100,99,98,97,96,95,93,92,91,90,89,87,86,85,83,82,80,79,77,76,74,73,71,69,68,66,64,63,61,59,58,56,54,53,51,50,48,46,45,43,41,39,37,35,33,30,28,26,24,21,19,17,15,13,12,10,9,8,6,5,4,4,3,2,2,1,1];
  var EDGE_LAYERS = 8;

  var cfg = {
    dispScaleAt64: 90,   // measured at a 64px bar; scaled to the real height below
    baseBlur: 2,
    edgeMax: 6,
    edgeRegion: 41,      // percent of bar height, in from each edge
    falloff: 3
  };

  var nav = document.querySelector(".nav");
  var glass = nav && nav.querySelector(".nav-glass");
  if (!glass) return;

  // Firefox has backdrop-filter but not SVG filter references inside it, and the
  // failure mode is silent: feDisplacementMap gets transparent black for its map
  // and applies a uniform diagonal shove, which reads as a working effect with
  // wrong values rather than as an error. Gate on the capability and leave those
  // engines on the CSS frosted bar.
  var canSvgBackdrop = !!(window.CSS && CSS.supports &&
    (CSS.supports("backdrop-filter", 'url("#glassBase")') ||
     CSS.supports("-webkit-backdrop-filter", 'url("#glassBase")')));
  if (!canSvgBackdrop) return;

  var stageDisp = document.getElementById("navGlassDisp");
  var stageBase = document.getElementById("navGlassBase");
  var edges = glass.querySelectorAll(".nav-glass__edge");
  var dispImg = document.getElementById("glassDispImg");
  var dispMapEl = document.getElementById("glassDispMap");
  var baseBlurEl = document.getElementById("glassBaseBlur");
  if (!stageDisp || !stageBase || !dispImg || edges.length !== EDGE_LAYERS) return;

  // The map has to be a raster PNG. An SVG data URI does not load in feImage
  // inside backdrop-filter. R is pinned to 128 (zero horizontal displacement) and
  // the profile goes in B; G is unused by the filter.
  function buildMapURI() {
    var h = DISP_MAP.length, w = 8;
    var cv = document.createElement("canvas");
    cv.width = w; cv.height = h;
    var ctx = cv.getContext("2d");
    var img = ctx.createImageData(w, h);
    for (var y = 0; y < h; y++) {
      var v = Math.max(0, Math.min(255, DISP_MAP[y]));
      for (var x = 0; x < w; x++) {
        var o = (y * w + x) * 4;
        img.data[o] = 128;
        img.data[o + 1] = 255;
        img.data[o + 2] = v;
        img.data[o + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
    return cv.toDataURL("image/png");
  }

  var mapURI = buildMapURI();   // depends only on the profile, so built once
  var dispReady = false;

  function targetRadius(d) {        // d: 0 at the outer edge, 1 at the cutoff
    if (d >= 1 || d < 0) return 0;
    return cfg.edgeMax * Math.pow(1 - d, cfg.falloff);
  }

  function layout() {
    // The reference assumes a fixed 64px bar. This nav is 60px, and wraps to two
    // rows near 100px below 480px, so the height is measured rather than assumed
    // and the displacement scales with it -- the bevel is a proportion of the bar
    // (41 percent each side), so a taller bar refracts proportionally harder.
    var h = nav.getBoundingClientRect().height;
    var w = window.innerWidth;
    if (!h) return;

    if (dispReady) {
      dispImg.setAttribute("x", (-0.25 * w).toFixed(1));
      dispImg.setAttribute("y", "0");
      dispImg.setAttribute("width", (1.5 * w).toFixed(1));
      dispImg.setAttribute("height", h.toFixed(1));
      dispMapEl.setAttribute("scale", (cfg.dispScaleAt64 * h / 64).toFixed(2));
    }

    baseBlurEl.setAttribute("stdDeviation",
      cfg.baseBlur.toFixed(2) + " " + cfg.baseBlur.toFixed(2));
    stageBase.style.backdropFilter =
      stageBase.style.webkitBackdropFilter = "url(#glassBase)";

    // CSS has no variable-radius blur. Eight overlapping increments, sized by
    // sum-of-squares so the accumulated radius tracks the target curve at every
    // depth. The overlap is what removes the stepping, not the layer count.
    for (var j = 1; j <= EDGE_LAYERS; j++) {
      var tIn = (EDGE_LAYERS - j) / EDGE_LAYERS;
      var tOut = (EDGE_LAYERS - j + 1) / EDGE_LAYERS;
      var rIn = targetRadius(tIn), rOut = targetRadius(tOut);
      var inc = Math.sqrt(Math.max(0, rIn * rIn - rOut * rOut));

      var blurEl = document.getElementById("glassEdgeBlur" + (j - 1));
      if (blurEl) blurEl.setAttribute("stdDeviation", inc.toFixed(3) + " 0");

      var a = tIn * cfg.edgeRegion, b = tOut * cfg.edgeRegion;
      if (b <= a) b = a + 0.01;
      var mask = "linear-gradient(to bottom," +
        "rgba(0,0,0,1) 0%," +
        "rgba(0,0,0,1) " + a.toFixed(2) + "%," +
        "rgba(0,0,0,0) " + b.toFixed(2) + "%," +
        "rgba(0,0,0,0) " + (100 - b).toFixed(2) + "%," +
        "rgba(0,0,0,1) " + (100 - a).toFixed(2) + "%," +
        "rgba(0,0,0,1) 100%)";

      var el = edges[j - 1];
      el.style.webkitMaskImage = el.style.maskImage = mask;
      el.style.backdropFilter =
        el.style.webkitBackdropFilter = "url(#glassEdge" + (j - 1) + ")";
      el.style.display = inc > 0.005 ? "block" : "none";
    }
  }

  // Only switch the displacement stage on once the generated PNG has actually
  // decoded. If it has not, the blur stages alone still read as glass, which is
  // the fallback the brief asks for.
  var probe = new Image();
  probe.onload = function () {
    dispReady = true;
    dispImg.setAttribute("href", mapURI);
    dispImg.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", mapURI);
    layout();
    stageDisp.style.backdropFilter =
      stageDisp.style.webkitBackdropFilter = "url(#glassDisp)";
  };
  probe.src = mapURI;

  window.addEventListener("resize", layout);
  layout();
})();
