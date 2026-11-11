# REDAC & Associates — Website Project

Website design, hosting and SEO project for **REDAC & Associates**, a tax and accounting firm.

## Contents

| Path | What it is |
|---|---|
| `demo/` | Static demo of the new website (HTML, CSS, vanilla JS) to show the client the design direction |
| `docs/REDAC-What-We-Need-From-You.pdf` | Client information checklist: everything we need from the client, marked Required or Optional |
| `docs/tools/make_checklist.py` | Python (ReportLab) script that generates the checklist PDF |

## Run the demo

Open `demo/index.html` in a browser, or serve the folder:

```sh
cd demo
python -m http.server 8000
```

Then visit http://localhost:8000.

## Demo sections

Hero, services (all eight services from the proposal), who we help, process, why REDAC, FAQ,
booking form and footer. The final site will be built on WordPress, as the proposal describes.

## Regenerate the checklist PDF

```sh
pip install reportlab
python docs/tools/make_checklist.py docs/REDAC-What-We-Need-From-You.pdf
```

The script uses the Arial and Calibri fonts from `C:/Windows/Fonts`.

## Notes

- The booking form posts to a placeholder `mailto:` address until the client's email or form service is set up.
- The client's proposal document is confidential and is not stored in this repository.

---

Author: Riflan Mohamed
