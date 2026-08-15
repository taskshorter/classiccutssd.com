/* Hero video — poster is LCP; video only on capable desktops */
(function () {
  "use strict";
  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }
  ready(function () {
    var video = document.querySelector(".cc-hero-video");
    var poster = document.querySelector(".cc-hero-poster");
    if (!video) return;
    var reduce =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var narrow =
      window.matchMedia && window.matchMedia("(max-width: 767px)").matches;
    if (reduce || narrow) {
      video.removeAttribute("autoplay");
      video.pause();
      video.style.display = "none";
      return;
    }
    video.setAttribute("autoplay", "");
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    video.preload = "metadata";
    var play = video.play();
    if (play && typeof play.then === "function") {
      play.then(function () {
        if (poster) poster.style.opacity = "0";
      }).catch(function () {});
    }
  });
})();
