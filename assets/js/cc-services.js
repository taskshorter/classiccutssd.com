/**
 * Classic Cuts — canonical service menu (single source of truth for site copy/pricing).
 * BookLocal may expose a different demo catalog; this list is the shop's published menu.
 */
(function (window) {
  "use strict";

  var SERVICES = [
    {
      id: "haircut",
      name: "Haircut",
      price: 60,
      priceLabel: "$60",
      category: "cuts",
      description:
        "Modern cuts, skin fades, tapers, and classic styles finished with detail.",
      tags: ["Fade", "Taper", "Classic"],
      image: "/assets/images/gallery/dsc-0378.webp",
      alt: "Men's haircut with clean fade at Classic Cuts",
    },
    {
      id: "kids",
      name: "Kid's Cut",
      price: 55,
      priceLabel: "$55",
      category: "cuts",
      description: "Patient, friendly cuts for kids — sharp looks without the stress.",
      tags: ["Kids", "Family"],
      image: "/assets/images/gallery/dsc-0445.webp",
      alt: "Kids haircut at Classic Cuts Mission Valley",
    },
    {
      id: "senior",
      name: "Senior Cut",
      price: 45,
      priceLabel: "$45",
      category: "cuts",
      description: "Classic gentlemen's cuts with a clean, comfortable finish.",
      tags: ["Classic", "Senior"],
      image: "/assets/images/gallery/dsc-0136-copy.webp",
      alt: "Classic gentleman's haircut at Classic Cuts",
    },
    {
      id: "haircut-beard",
      name: "Haircut & Beard",
      price: 90,
      priceLabel: "$90",
      category: "beard",
      description: "Full service — haircut plus beard shaping for a complete look.",
      tags: ["Combo", "Beard"],
      image: "/assets/images/gallery/dsc-1008-copy.webp",
      alt: "Haircut and beard combo at Classic Cuts",
    },
    {
      id: "beard",
      name: "Beard Trim",
      price: 45,
      priceLabel: "$45",
      category: "beard",
      description: "Shape, line, and clean up — kept sharp and intentional.",
      tags: ["Beard", "Lineup"],
      image: "/assets/images/gallery/dsc-0682.webp",
      alt: "Beard trim and lineup at Classic Cuts",
    },
    {
      id: "hot-towel",
      name: "Hot Towel Shave",
      price: 45,
      priceLabel: "$45",
      category: "shaves",
      description: "Traditional hot towel shave for a smooth, refreshed finish.",
      tags: ["Hot Towel", "Shave"],
      image: "/assets/images/gallery/dsc-0375.webp",
      alt: "Straight razor hot towel shave at Classic Cuts",
    },
  ];

  var SPECIALS = [
    { label: "Monday", detail: "$50 Military Haircuts" },
    { label: "New Client", detail: "$10 off" },
  ];

  window.ClassicCutsServices = {
    SERVICES: SERVICES,
    SPECIALS: SPECIALS,
  };
})(window);
