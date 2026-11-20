# Private Pilot ASEL checkride study guide

A static study site for the Private Pilot — Airplane Single-Engine Land practical test. It follows every Area of Operation and Task in FAA-S-ACS-6C (effective May 31, 2024), marks seaplane and multiengine tasks as not tested for ASEL, and keeps airplane-specific numbers on the Tecnam P-Mentor.

The guide is organized around the P-Mentor because that is the airplane the school's commercial study guide uses. The student started in a different airplane and is not training in the P-Mentor. If the checkride airplane is not a P-Mentor, that airplane's POH/AFM replaces every speed, system, and limitation on this site.

Home airport in the local section is KLIT, Bill and Hillary Clinton National Airport / Adams Field, Little Rock. The checkride date used by the countdown is December 2, 2026.

## Run it locally

No build step and no server are required. Open `index.html` in a browser. Progress is stored in that browser's `localStorage` under the key prefix `ppasel6c_`.

To serve it the way GitHub Pages will:

```bash
python3 -m http.server 8741
```

Then open `http://127.0.0.1:8741/`.

## Host it

GitHub Pages (or any static host) can serve this folder as-is. On GitHub: Settings → Pages → deploy from the branch, root directory. The site is HTML, CSS, and JavaScript. `js/data.js` is generated and already committed, so the published site does not need Python.

To regenerate `js/data.js` after editing the copy in `tools/`:

```bash
python3 tools/build.py
```

## What is in the site

- Every ACS area and task, with Knowledge, Risk Management, and Skill elements, private-pilot tolerances, and oral questions
- Mastery checkboxes, an overall progress bar, and a reset, saved in this browser
- P-Mentor speeds, limitations, systems, and performance from FAA TCDS A00067IB and a publicly posted AFM (Doc. 2002/1032, Ed. 1). The TCDS requires Ed. 1 Rev. 9 or later. The AFM in the airplane wins
- A KLIT page (Class C, frequencies, runways, KORK and Pine Bluff) from the Chart Supplement reprint and the 2017 Class C rule
- A ground-school page from the student's October 2026 notes, with the PAR-exam airplane (magnetos, carburetor heat, mixture) kept separate from the P-Mentor
- Oral flashcards and a checkride-day page

## What not to trust blindly

Element titles follow the ACS. Explanations are a study aid. Verify the ACS, 14 CFR, the AIM, and the POH/AFM before the test. Demonstrated crosswind in the public AFM copy reviewed here is 10 knots; a later revision may differ. Do not use P-Mentor V-speeds in another airplane.
