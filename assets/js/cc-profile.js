(function () {
  "use strict";

  var grid = document.querySelector(".cc-work-grid");
  if (!grid) return;

  var lb = document.createElement("div");
  lb.className = "cc-profile-lightbox";
  lb.setAttribute("role", "dialog");
  lb.setAttribute("aria-modal", "true");
  lb.setAttribute("aria-label", "Photo preview");
  lb.innerHTML =
    '<button type="button" class="cc-profile-lightbox__close" aria-label="Close">&times;</button>' +
    '<img class="cc-profile-lightbox__img" alt="" />';
  document.body.appendChild(lb);

  var imgEl = lb.querySelector(".cc-profile-lightbox__img");
  var closeBtn = lb.querySelector(".cc-profile-lightbox__close");

  function open(src, alt) {
    imgEl.src = src;
    imgEl.alt = alt || "";
    lb.classList.add("is-open");
    document.documentElement.style.overflow = "hidden";
  }

  function close() {
    lb.classList.remove("is-open");
    imgEl.removeAttribute("src");
    document.documentElement.style.overflow = "";
  }

  grid.addEventListener("click", function (e) {
    var a = e.target.closest("a.cc-work-grid__item");
    if (!a) return;
    e.preventDefault();
    var img = a.querySelector("img");
    open(a.getAttribute("href"), img ? img.getAttribute("alt") : "");
  });

  closeBtn.addEventListener("click", close);
  lb.addEventListener("click", function (e) {
    if (e.target === lb) close();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && lb.classList.contains("is-open")) close();
  });
})();
