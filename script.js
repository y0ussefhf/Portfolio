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


// Active-section state for the sticky nav. The page is ~6700px tall with three
// anchored sections; without this there is no cue as to where you are.
// IntersectionObserver rather than a scroll handler so it costs nothing per frame.
// Run now if the DOM is already parsed, otherwise wait. A bare
// DOMContentLoaded listener silently no-ops when the script loads late
// (deferred, async, or injected), which is easy to mistake for broken code.
function initNavState() {
  var links = Array.prototype.slice.call(document.querySelectorAll(".nav-links a[href^='#']"));
  if (!links.length || !("IntersectionObserver" in window)) return;

  var sections = links
    .map(function (a) {
      var el = document.getElementById(a.getAttribute("href").slice(1));
      return el ? { link: a, el: el } : null;
    })
    .filter(Boolean);
  if (!sections.length) return;

  var visible = Object.create(null);

  function render() {
    // Topmost section currently in view wins, so passing a short section
    // does not leave two links lit at once.
    var current = null;
    sections.forEach(function (s) {
      if (visible[s.el.id] && (!current || s.el.offsetTop < current.el.offsetTop)) current = s;
    });
    sections.forEach(function (s) {
      if (current && s === current) s.link.setAttribute("aria-current", "true");
      else s.link.removeAttribute("aria-current");
    });
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { visible[e.target.id] = e.isIntersecting; });
    render();
  }, { rootMargin: "-64px 0px -55% 0px" });

  sections.forEach(function (s) { io.observe(s.el); });
}
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
