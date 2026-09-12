// Glass nav strip. Shared by index.html and the case study.
//
// Ported from the supplied reference implementation (glass-navbar-brief.md, kept
// local alongside PRODUCT.md). The displacement profile was measured frame by
// frame from a 3D render (rounded edge, IOR 1.1), so the bevel widths and the
// top/bottom asymmetry are data, not hand-approximation.
//
// Three stages stack bottom to top inside .nav-glass, each its own element with
// its own backdrop-filter, sampling the composited result beneath it:
//   1 displacement  feImage + feDisplacementMap
//   2 base blur     isotropic, even across the bar
//   3 edge blur     horizontal only, radius ramping toward both edges
// then a flat tint, then the nav content, which stays sharp.
//
// Four things below look like mistakes and are not:
//   - Y reads the BLUE channel, not green. The source normal map uses a swapped
//     axis order (R=X, G=Z, B=Y), so its flat area is (128,255,128). Reading G
//     would apply a constant full-scale shift, because G is 255 throughout.
//   - R is pinned to 128 when the map is built, which is zero horizontal shift.
//     Any sideways movement in the finished bar is a bug, never the effect.
//   - color-interpolation-filters="sRGB" is repeated on every primitive. On the
//     parent alone is not enough: feImage still decodes to linearRGB, and that
//     gamma shift turns the smooth bevel into a hard step.
//   - The filter region is objectBoundingBox (percentages only) while feImage's
//     subregion is userSpaceOnUse (pixels). The attributes look identical.
//
// A comment in index.html used to claim feImage silently no-ops inside
// backdrop-filter in Chrome, and a whole synthesised-ramp effect was built around
// that. It is wrong. What fails is an SVG data URI; a raster PNG built on a canvas
// loads fine. Verified by A/B-ing the displacement stage against stripe content.
//
// The defs are injected from here rather than written into each page, so there is
// one copy of them. The .nav-glass markup itself stays in the HTML, because the
// tint is what keeps nav text legible over bright imagery and it must survive this
// script failing to load.

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

  // Filter defs live here so the two pages cannot drift apart. Injected rather
  // than authored per page; SVG filter references have to resolve inside the
  // same document, so an external file is not an option.
  function injectDefs() {
    if (document.getElementById("glassDefs")) return;
    var edges = "";
    for (var i = 0; i < EDGE_LAYERS; i++) {
      edges +=
        '<filter id="glassEdge' + i + '" x="-25%" y="-25%" width="150%" height="150%" ' +
        'color-interpolation-filters="sRGB">' +
        '<feGaussianBlur id="glassEdgeBlur' + i + '" in="SourceGraphic" stdDeviation="0 0" ' +
        'color-interpolation-filters="sRGB"/></filter>';
    }
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("id", "glassDefs");
    svg.setAttribute("width", "0");
    svg.setAttribute("height", "0");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    svg.style.cssText = "position:absolute;width:0;height:0;overflow:hidden";
    svg.innerHTML =
      '<filter id="glassDisp" x="-25%" y="-100%" width="150%" height="300%" ' +
        'filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse" ' +
        'color-interpolation-filters="sRGB">' +
        '<feImage id="glassDispImg" result="dispMap" preserveAspectRatio="none" ' +
          'color-interpolation-filters="sRGB"/>' +
        '<feDisplacementMap id="glassDispMap" in="SourceGraphic" in2="dispMap" scale="0" ' +
          'xChannelSelector="R" yChannelSelector="B" color-interpolation-filters="sRGB"/>' +
      '</filter>' +
      '<filter id="glassBase" x="-25%" y="-25%" width="150%" height="150%" ' +
        'color-interpolation-filters="sRGB">' +
        '<feGaussianBlur id="glassBaseBlur" in="SourceGraphic" stdDeviation="2 2" ' +
          'color-interpolation-filters="sRGB"/>' +
      '</filter>' + edges;
    document.body.appendChild(svg);
  }
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

  injectDefs();

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
