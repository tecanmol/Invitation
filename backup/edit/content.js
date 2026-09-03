/* ==========================================================================
   THIS IS THE ONLY FILE YOU EDIT.

   Everything the guest reads lives here. Change the words between the
   "quotation marks", save, and re-upload this one file.

   Read HOW-TO-EDIT.txt in this same folder before you start — it shows you
   how to add a card, add an event, and change the photo.

   Two rules, and nothing else can go wrong:
      1. Never delete a "quotation mark"
      2. Never delete a comma at the end of a line
   ========================================================================== */

const invitation = {


/* ---------------------------------------------------------------- BASICS */

  /* Shown on the browser tab */
  pageTitle:
      "Invitation from Pandey Family",


/* ----------------------------------------------------------------- MUSIC,
   PHOTOS AND DECORATION
   Put your own files in the assets folders, keeping the same names, and
   they appear automatically. Delete a line to turn that piece off. */

  media: {

      /* 3D Ganesha Model */
      model3d:
          "assets/models/ganesha-3d.glb",

      /* Your Ganpati photo. Fills card 1 poster, and glows behind every card. */
      hero:
          "assets/images/ganpati-hero.webp",

      /* The same photo, small and blurred, used as the card background */
      reflection:
          "assets/images/card-reflection.webp",

      /* The gold Ganpati outline on the opening curtain */
      mark:
          "assets/images/ganpati-mark.webp",

      /* plays softly behind the closing blessing */
      blessingVideo:
          "assets/videos/blessing.mp4",

      /* the aged paper of the opening page */
      paper:
          "assets/images/paper.webp",

      /* Decoration */
      garland:
          "assets/images/garland.webp",

      corner:
          "assets/images/corner.webp",

      divider:
          "assets/images/divider.webp",

      /* Plays by itself when the curtain opens. Delete this line for silence. */
      music:
          "assets/audio/music.mp3"

  },


/* ------------------------------------------------------------------ CARDS

   The guest swipes through these in order, top to bottom.

   To ADD a card:    copy one whole block from  {  to  },  and paste it
                     where you want it, then change the words.
   To REMOVE a card: delete its whole block, from  {  to  },
   To REORDER:       move a block up or down.

   The dots at the bottom of the screen count themselves — you never have
   to change anything else.

   There are four kinds of card. The "type" line decides which:

      type: "photo"      your photo filling the card, words inside it
      type: "timeline"   a list of events down a gold line
      type: "message"    a paragraph, an address and a button
      type: "blessing"   a closing blessing over the photo
                                                                            */

  cards: [


      /* ============ CARD 1 ============ */
      {
          type: "photo",

          /* 3D Model of Lord Ganesha */
          model3d:
              "assets/models/ganesha-3d.glb",

          /* the two small lines at the top, over the photo */
          mantra:
              "|| Shri Ganeshaya Namah ||",

          welcome:
              "A warm invitation from the Pandey Family",

          /* the words at the bottom, over the photo */
          lead:
              "This year, at our home",

          title:
              "1.5 Days with Lord Ganesha",

          dates:
              "14 — 15 September 2026"
      },


      /* ============ CARD 2 — the invitation itself ============ */
      {
          type: "message",

          eyebrow:
              "AN INVITATION",

          title:
              "Please Join Us",

          /* One paragraph per line. Add or remove lines freely. */
          paragraphs: [
              "Bappa is coming home to bless our family and fill our lives with joy, peace, and abundance. ❤️",
              "We warmly invite you and your family to celebrate these auspicious 1.5 days of Ganpati Utsav with us.",
              "Come join us for prayers, aartis, and prasad as we welcome Lord Ganesha.",
              "Your presence and warm wishes would mean the world to our family! 🙏"
          ],

          signoff:
              "With warm regards, The Pandey Family"
      },


      /* ============ CARD 3 ============ */
      {
          type: "timeline",

          eyebrow:
              "FESTIVAL SCHEDULE",

          title:
              "Utsav Timings",

          /* To ADD an event: copy one block from { to }, and paste it below.
             To REMOVE one:   delete its block.
             Four to six events look best. The card shrinks the text to fit. */
          events: [

              {
                  label: "STHAPANA",
                  name:  "Murti Sthapana & Aarti",
                  date:  "14 September 2026",
                  time:  "10:00 am",
                  extra: "Prasad to follow"
              },
              {
                  label: "DOPAHAR AARTI",
                  name:  "Afternoon Aarti",
                  date:  "14 & 15 September",
                  time:  "1:00 pm",
                  extra: "Prasad to follow"
              },
              {
                  label: "SANDHYA AARTI",
                  name:  "Evening Aarti",
                  date:  "14 September 2026",
                  time:  "8:00 pm",
                  extra: "Prasad to follow"
              },
              {
                  label: "KATHA & PUJA",
                  name:  "Satyanarayan Puja",
                  date:  "15 September 2026",
                  time:  "4:00 pm",
                  extra: "Prasad to follow"
              },
              {
                  label: "VISARJAN",
                  name:  "Visarjan & Aarti",
                  date:  "15 September 2026",
                  time:  "8:00 pm"
              }

          ]
      },


      /* ============ CARD 4 — the address, on its own ============ */
      {
          type: "location",

          eyebrow:
              "COME CELEBRATE WITH US",

          title:
              "The Venue",

          addressLines: [
              "Upvan Nivara Phase 2, C-Wing 404",
              "Nanbhat Road, Bolinj",
              "Virar (West)"
          ],

          buttonText:
              "Open in Maps",

          /* Open Google Maps, find your home, press Share, Copy link,
             and paste it between the quotation marks below. */
          buttonUrl:
              "https://maps.app.goo.gl/KN3kbbAM2zWrYyea8"
      },


      /* ============ CARD 5 ============ */
      {
          type: "blessing",

          eyebrow:
              "BLESSINGS",

          title:
              "Bappa's Blessings",

          message:
              "May Lord Ganesha shower his choicest blessings upon you and your loved ones.",

          signoff:
              "With warm regards",

          name:
              "The Pandey Family"
      }


  ],


/* ----------------------------------------------------- THE OPENING CURTAIN
   The card that hangs on the curtain before the invitation opens. */

  curtain: {

      /* the small line above the name */
      mantra:
          "An invitation from",

      /* the big name */
      invites:
          "The Pandey Family",

      /* the small line under the gold rule */
      note:
          "1.5 Days of Ganpati Utsav · 14 — 15 September 2026",

      button:
          "Open Invitation"

  },


/* ------------------------------------------------------- THE BOTTOM BUTTONS */

  navigation: {

      swipeInstruction:
          "Swipe to continue",

      swipeMore:
          "Swipe for more",

      nextText:
          "Next",

      previousText:
          "Back"

  }

};
