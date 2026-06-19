/* ============================================================
   SPARKLE CITY RIVER DANCE — EVENT DATA  (the "one file" per year)
   ------------------------------------------------------------
   This is the ONLY file you edit to roll the site to a new year.
   Everything below is plain data. Change the values, save, deploy.
   - Text in "quotes" can say anything.
   - Lists in [ square brackets ] can have items added/removed.
   - Don't delete the commas, colons, or brackets — those hold it together.

   To start a new year: duplicate this file (e.g. event-2026.js to keep
   as an archive), then edit the values here for the new year.
   ============================================================ */

window.RD = {

  /* ---- THE BASICS ---- */
  event: {
    siteName:     "Sparkle City River Dance",
    year:         2026,
    edition:      "10th Anniversary",
    nights:       2,

    datesDisplay: "August 21–23, 2026",   // long form, used in copy
    datesShort:   "Aug 21–23, 2026",      // short form, used in footer/title
    venue:        "Bone's Kayak & Campground",
    city:         "Hurricane Mills, TN",
    river:        "Buffalo River, TN",

    tagline:      "Ten Years. 2 Nights. Super Nature.",
    heroEyebrow:  "✦ 10th Anniversary ✦ Two Nights For The First Time Ever ✦",

    ticketsUrl:   "https://www.prekindle.com/event/18553-sparkle-city-river-dance-hurricane-mills",
    recapVideoId: "Ug17W4f0KGw"           // the YouTube id of the recap film
  },

  /* ---- HOME PAGE BIG NUMBERS ---- */
  homeStats: [
    { num: "10",   label: "Years of River Dance" },
    { num: "2",    label: "Nights, First Ever" },
    { num: "300+", label: "Dancers Expected" },
    { num: "1",    label: "River. The Buffalo." }
  ],

  /* ---- LINEUP ----
     List each night's acts in CHRONOLOGICAL set order — first act first, closer last.
     The poster displays them reversed (closer on top, opener at the bottom).
     A duo is just two names joined with  ×  — e.g. "Maggie Wells × Amy Darling".
     Add " (City)" after a name to show a small location beside it.
     "headliner" = the act shown in pink (the only visual standout). */
  lineup: {
    nights: [
      {
        day: "Friday", date: "Aug 21", endNote: "music till midnight",
        acts: [
          "Sessy",
          "Honey Simone",
          "J.Howard × Jimmy Guaro",
          "Spice J × Notxander",
          "Ultrafrog"
        ]
      },
      {
        day: "Saturday", date: "Aug 22", endNote: "music till 3am",
        headliner: "Sparkle City Disco",
        acts: [
          "Lux Velour",
          "Topo Bandido",
          "Maggie Wells × Amy Darling",
          "Zach Cowie (Los Angeles)",
          "Sparkle City Disco",
          "Burika (Costa Rica)"
        ]
      }
    ]
  },

  /* ---- WEEKEND SCHEDULE (Guest Info page) ----
     Each row is [ time, what's happening ]. */
  schedule: [
    {
      day: "Friday", date: "Aug 21",
      rows: [
        ["3:00 PM", "Gates open · check-in begins"],
        ["3–7 PM",  "Roll in, set up camp, find your people"],
        ["Sunset",  "First DJ sets of the weekend"],
        ["Late",    "Disco in the woods, night one 🪩"]
      ]
    },
    {
      day: "Saturday", date: "Aug 22",
      rows: [
        ["Morning",   "Slow coffee & easy mornings"],
        ["9 AM–12 PM", "Shuttle to the river drop-in (the float back takes 2–4 hrs)"],
        ["Evening",   "Music kicks back up"],
        ["Late",      "Night two. The big one. ✦"]
      ]
    }
  ],

  /* ---- SPONSORS ---- */
  sponsors: {
    stats: [
      { num: "10th", label: "Anniversary Year" },
      { num: "300",  label: "River Dancers" },
      { num: "50K",  label: "Social Media Impressions" }
    ],
    tiers: [
      {
        name: "Tier 1 · Top", price: "$2K", featured: true,
        perks: [
          "6 tickets",
          "Logo placement on all ad, print & collateral materials",
          "Logo placement & mentions in social media",
          "Logo featured on on-site Photo Booth digital prints",
          "Booth activation location on site",
          "1 dedicated social media post with sponsorship recognition"
        ]
      },
      {
        name: "Tier 2", price: "$1K",
        perks: [
          "4 tickets",
          "Logo placement on all ad, print & collateral materials",
          "Logo placement & mentions in social media",
          "Logo featured on on-site Photo Booth digital prints",
          "Booth activation location on site"
        ]
      },
      {
        name: "Tier 3", price: "$500",
        perks: [
          "2 tickets",
          "Logo placement on all ad, print & collateral materials",
          "Logo placement & mentions in social media"
        ]
      }
    ]
  },

  /* ---- ABOUT PAGE TIMELINE CHIPS ----
     type: "hiatus" = greyed gap chip, "now" = the current-year link chip. */
  timeline: [
    { label: "2016" },
    { label: "2017" },
    { label: "2018" },
    { label: "2019" },
    { label: "hiatus", type: "hiatus" },
    { label: "2025" },
    { label: "2026 ✦ 10th", type: "now" }
  ]

};
