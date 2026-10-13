/**
 * Classic Cuts — card media for the BookLocal booking widget on /book.
 *
 * BookLocal's widget is merchant-agnostic: it renders an image/subtitle for a
 * service or barber only if the host page supplies one, keyed by the STABLE
 * BookLocal catalog id. This file is that merchant-side join:
 *
 *   BookLocal id  →  this site's own menu / roster entry  →  its existing image
 *
 * Image paths and specialties are NOT repeated here; they come from the site's
 * canonical data files (`cc-services.js`, `cc-barbers-data.js`), whose images
 * are the same ones the Services and Barbers pages display. Anything not mapped (or whose image
 * fails to load) falls back to the widget's initials tile.
 *
 * Ids below are the BookLocal catalog ids for the Classic Cuts tenant. If the
 * catalog is rebuilt (e.g. go-live cutover) re-copy them from
 * GET {origin}/api/public/catalog?publishableKey=…  — until then the widget
 * simply shows initials, nothing breaks.
 */
(function (window, document) {
  "use strict";

  /** BookLocal service id → cc-services.js id */
  var SERVICES = {
    ce93a8580c2907bde8086e108: "haircut",
    cbe0e63f86710048f59e45d40: "kids",
    c7e9192c577a9af7b21b224e7: "senior",
    cb3e927f2f3403df9446513a6: "beard",
    ce6521db00aa31b2253a61843: "haircut-beard",
    ce859e5ea9f10f7a5defad651: "hot-towel",
  };

  /** BookLocal staff id → cc-barbers-data.js id. (Carlos has no site roster entry.) */
  var STAFF = {
    c0ab7b8f39591fd9f2dcb63d4: "ray-lopez",
    c452c49c7063674dab780674b: "jay-oceguera",
    c76753135e2872816c9cd7cbb: "romero",
    c41c8753b7d28beae3d26b9eb: "colton-ballew",
    c870bc8ffa8a3b06c1c774d8b: "will-jaimes",
    ca9f9fb569d9a6f81c39b257e: "tevel",
    c6c14c79caeb5518ea852e031: "tammy",
  };

  /**
   * Roster entries whose `photo` is a stand-in for someone else's picture.
   * The Barbers page currently reuses Tevel's photo on Tammy's card; showing
   * that in booking would put the wrong face on her, so she keeps initials.
   */
  var PLACEHOLDER_PHOTO = { tammy: true };

  function indexBy(list) {
    var out = {};
    (list || []).forEach(function (item) {
      out[item.id] = item;
    });
    return out;
  }

  var menu = indexBy(window.ClassicCutsServices && window.ClassicCutsServices.SERVICES);
  var roster = indexBy(window.ClassicCutsBarbers && window.ClassicCutsBarbers.BARBERS);
  var media = { services: {}, staff: {} };

  Object.keys(SERVICES).forEach(function (bookLocalId) {
    var item = menu[SERVICES[bookLocalId]];
    if (item && item.image) media.services[bookLocalId] = item.image;
  });

  Object.keys(STAFF).forEach(function (bookLocalId) {
    var barber = roster[STAFF[bookLocalId]];
    if (!barber) return;
    var entry = {};
    if (barber.photo && !PLACEHOLDER_PHOTO[barber.id]) entry.src = barber.photo;
    if (barber.specialty) entry.subtitle = barber.specialty;
    media.staff[bookLocalId] = entry;
  });

  window.CC_BOOKLOCAL_MEDIA = media;

  var el = document.getElementById("cc-booklocal");
  if (el) el.media = media;
})(window, document);
