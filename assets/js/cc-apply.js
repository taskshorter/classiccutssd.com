(function () {
  "use strict";

  /* Keep left pitch top-aligned at page top; when sticky, lock at vertical center */
  var pitch = document.querySelector(".cc-apply__pitch");
  if (pitch && window.matchMedia("(min-width: 981px)").matches) {
    function chromeHeight() {
      var root = getComputedStyle(document.documentElement);
      var announce = parseFloat(root.getPropertyValue("--cc-announce-h")) || 36;
      var nav = parseFloat(root.getPropertyValue("--cc-nav-h")) || 48;
      return announce + nav;
    }

    function updateStickyTop() {
      if (!window.matchMedia("(min-width: 981px)").matches) {
        pitch.style.removeProperty("--cc-pitch-sticky-top");
        return;
      }
      var chrome = chromeHeight();
      var h = pitch.offsetHeight;
      var available = window.innerHeight - chrome;
      var top = chrome + Math.max(12, (available - h) / 2);
      pitch.style.setProperty("--cc-pitch-sticky-top", top + "px");
    }

    updateStickyTop();
    window.addEventListener("resize", updateStickyTop);
    if (window.ResizeObserver) {
      new ResizeObserver(updateStickyTop).observe(pitch);
    }
  }

  var input = document.getElementById("cc-apply-photos");
  var zone = document.getElementById("cc-apply-dropzone");
  var list = document.getElementById("cc-apply-file-list");
  if (!input || !zone || !list) return;

  var MAX_FILES = 5;
  var MAX_BYTES = 5 * 1024 * 1024;
  var store = [];

  function syncInput() {
    var dt = new DataTransfer();
    store.forEach(function (f) {
      dt.items.add(f);
    });
    input.files = dt.files;
  }

  function render() {
    list.innerHTML = "";
    store.forEach(function (file, index) {
      var li = document.createElement("li");
      var name = document.createElement("span");
      name.textContent = file.name + " · " + Math.round(file.size / 1024) + " KB";
      var btn = document.createElement("button");
      btn.type = "button";
      btn.setAttribute("aria-label", "Remove " + file.name);
      btn.textContent = "×";
      btn.addEventListener("click", function () {
        store.splice(index, 1);
        syncInput();
        render();
      });
      li.appendChild(name);
      li.appendChild(btn);
      list.appendChild(li);
    });
  }

  function addFiles(fileList) {
    Array.prototype.forEach.call(fileList || [], function (file) {
      if (store.length >= MAX_FILES) return;
      if (!/^image\/(jpeg|png|webp)$/i.test(file.type)) return;
      if (file.size > MAX_BYTES) return;
      store.push(file);
    });
    syncInput();
    render();
  }

  input.addEventListener("change", function () {
    addFiles(input.files);
    input.value = "";
    syncInput();
  });

  ["dragenter", "dragover"].forEach(function (evt) {
    zone.addEventListener(evt, function (e) {
      e.preventDefault();
      zone.classList.add("is-dragover");
    });
  });

  ["dragleave", "drop"].forEach(function (evt) {
    zone.addEventListener(evt, function (e) {
      e.preventDefault();
      zone.classList.remove("is-dragover");
    });
  });

  zone.addEventListener("drop", function (e) {
    addFiles(e.dataTransfer && e.dataTransfer.files);
  });
})();
