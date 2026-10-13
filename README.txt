PALMENGARTEN — ONLINE-DESIGNSTUDIE
==================================

WHAT PARTICIPANTS DO
--------------------
1. Open the study link.
2. Answer the questionnaire and review the six materials.
3. On the final screen, download their individual JSON response file.
4. Send that file back to you by email or your chosen upload channel.

PROJECT FILES
-------------
- `index.html` — document structure
- `styles.css` — responsive presentation styles
- `app.js` — study flow, local saving, and JSON export

The browser does not upload or track answers. The response file contains the
answers, optional demographic fields, display order, participant ID, and dates.
An unfinished response is retained locally in that browser until the participant
finishes or clears browser data.

HOSTING WITH GITHUB PAGES
-------------------------
GitHub Pages can host this study perfectly, but Pages is static hosting: it
cannot receive or store completed questionnaires itself.

To publish:
1. Create a new GitHub repository and upload this entire folder.
2. In the repository: Settings → Pages.
3. Set Source to "Deploy from a branch", select `main` and `/ (root)`.
4. Save. GitHub will show the public Pages URL after deployment.
5. Send participants that URL and ask them to download and email their JSON
   file at the end.

LOCAL FONTS
-----------
The presentation self-hosts the supplied fonts via `@font-face`, so fonts work
on GitHub Pages with no external font connection:

  assets/fonts/argentum-sans-vf.ttf
  assets/fonts/helony.otf
  assets/fonts/sinkin-sans-regular.otf
  assets/fonts/urbanist-vf.ttf
  assets/fonts/vielotta.regular.otf

ASSET ORGANIZATION
------------------
`assets/moodboards/` contains the three files used by the study; the untouched
source moodboards are retained in `assets/moodboards/originals/`.
`assets/corporate-designs/` contains the three colour, typography, and logo
development boards. `assets/logos/` contains the three supplied logo drafts.
`assets/fonts/source-zips/` contains the supplied font downloads.
`assets/reference/` contains the original interview guide.
Unused original application and logo placeholder assets are retained in
`assets/archive/` for reference only.

LICENSING NOTE
--------------
Helony is distributed as a personal-use demo by its listed source; Vielotta is
a commercial typeface. Confirm the appropriate licence before publishing the
project beyond this study.
