/**
 * Classic Cuts — barber roster (crawlable pages + team cards).
 * Paths are root-absolute for clean URL routing.
 */
(function (window) {
  "use strict";

  var BARBERS = [
    {
      id: "ray-lopez",
      name: "Ray Lopez",
      shortName: "Ray",
      slug: "/barbers/ray-lopez",
      file: "raylopez.html",
      photo: "/assets/images/barbers/ray.jpg",
      specialty: "Consistent craft · Owner",
      intro:
        "A Classic Cuts staple — Ray delivers confident, consistent cuts with the craft that keeps clients coming back.",
      specialties: ["Classic cuts", "Fades", "Everyday maintenance"],
      instagram: "https://www.instagram.com/myclassiccut/",
      instagramLabel: "@myclassiccut",
    },
    {
      id: "jay-oceguera",
      name: "Jay Oceguera",
      shortName: "Jay",
      slug: "/barbers/jay-oceguera",
      file: "jayoceguera.html",
      photo: "/assets/images/barbers/jay.jpg",
      specialty: "Skin fades · Gentlemen's cuts",
      intro:
        "Skin fades, taper fades, gentlemen's cuts, and hot towel shaves. Jay keeps it classic with a modern edge.",
      specialties: ["Skin fades", "Taper fades", "Hot towel shaves"],
      instagram: "https://www.instagram.com/myclassiccut/",
      instagramLabel: "@myclassiccut",
    },
    {
      id: "romero",
      name: "Romero Jorge",
      shortName: "Romero",
      slug: "/barbers/romero",
      file: "romero.html",
      photo: "/assets/images/barbers/romero.png",
      specialty: "Clean tapers · Bold styles",
      intro:
        "From clean tapers to bold styles, Romero brings steady hands and a welcoming vibe to every appointment.",
      specialties: ["Tapers", "Bold styles", "Lineups"],
      instagram: "https://www.instagram.com/myclassiccut/",
      instagramLabel: "@myclassiccut",
    },
    {
      id: "colton-ballew",
      name: "Colton Ballew",
      shortName: "Colton",
      slug: "/barbers/colton-ballew",
      file: "colton.html",
      photo: "/assets/images/barbers/colton.png",
      specialty: "Clean fades · Sharp lines",
      intro:
        "Clean fades, sharp lines, and a chill chair — Colton brings precision and personality to every cut.",
      specialties: ["Fades", "Sharp lines", "Detail work"],
      instagram: "https://www.instagram.com/colton_ballew/",
      instagramLabel: "@colton_ballew",
    },
    {
      id: "will-jaimes",
      name: "Will Jaimes",
      shortName: "Will",
      slug: "/barbers/will-jaimes",
      file: "willjaimes.html",
      photo: "/assets/images/barbers/will.png",
      specialty: "Detail-focused fades",
      intro:
        "Detail-focused and easygoing — Will dials in fades and finishes that look sharp walking out and hold up all week.",
      specialties: ["Fades", "Finishes", "Week-ready cuts"],
      instagram: "https://www.instagram.com/willthebarber81/",
      instagramLabel: "@willthebarber81",
    },
    {
      id: "tammy",
      name: "Tammy",
      shortName: "Tammy",
      slug: "/barbers/tammy",
      file: "wellington-199912.html",
      photo: "/assets/images/barbers/tevel.jpg",
      specialty: "Fresh cuts · Clean finishes",
      intro:
        "Fresh cuts and clean finishes — Tammy helps you leave looking sharp and ready for the day.",
      specialties: ["Fresh cuts", "Clean finishes"],
      instagram: "https://www.instagram.com/myclassiccut/",
      instagramLabel: "@myclassiccut",
    },
    {
      id: "tevel",
      name: "Tevel",
      shortName: "Tevel",
      slug: "/barbers/tevel",
      file: "wellington-199912-210611.html",
      photo: "/assets/images/barbers/tevel.jpg",
      specialty: "Walk-ins · Bookings",
      intro:
        "Fresh cuts and clean finishes — Tevel is ready when you need a sharp look, whether you book ahead or walk in.",
      specialties: ["Walk-ins", "Clean finishes"],
      instagram: "https://www.instagram.com/myclassiccut/",
      instagramLabel: "@myclassiccut",
    },
  ];

  window.ClassicCutsBarbers = { BARBERS: BARBERS };
})(window);
