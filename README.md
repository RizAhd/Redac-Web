# REDAC & Associates — Website

Website for **REDAC & Associates**, a tax and accounting firm: design, hosting and SEO project.

Built with **React + Vite**, animated with **GSAP** (ScrollTrigger, SplitText) and **Lenis** smooth
scrolling. All client data lives in one JSON file, so the site can be updated quickly once the
client sends their details.

## Pages

| Section | Pages |
|---|---|
| Core | Home, About us, Our team, Contact us, Book a consultation |
| Services | Services overview + 8 service pages (individual tax returns; business tax and financial reports; GST and BAS; bookkeeping and payroll; business advisory and project finance; company registration and ASIC; corporate administration; tax compliance) |
| Content | Who we help, FAQ, News and insights (+ articles) |
| Trust | Privacy policy, Disclaimer and terms of use, Enquiry confirmation (thank you), Photo credits, 404 |

## Run it

```sh
cd website
npm install
npm run dev       # local development with live reload
npm run build     # production build into website/dist
npm run preview   # serve the production build
```

The built site in `website/dist` is fully static and can be uploaded to any host.

## Folder layout

```
website/
  src/data/site.json          <- ALL client data: company, contact, team, services, FAQ, articles, photos
  src/data/photo-credits.json <- credits for the stand-in photos
  public/img/                 <- photos (replace with the client's own)
  src/pages/                  <- one file per page
  src/components/             <- nav, footer and shared sections
  src/lib/motion.js           <- GSAP and Lenis setup and the reveal helpers
  src/styles/global.css       <- design system (colours, type scale, layout)
```

## Update the site when client data arrives

1. Open `website/src/data/site.json`.
2. Replace any `null` with the real value, for example:
   - `contact.phone`, `contact.email`, `contact.address`, `contact.hours`, `contact.map_embed_url`
   - `team[]`: `name`, `role`, `qualifications`, `bio`, `photo` (photo files go in `public/img/team/`)
   - `company.year_founded`, `company.registrations`
   - `integrations.calendly_url` (switches the booking page to the client's Calendly)
   - `integrations.enquiry_form_action` (where the enquiry form sends)
3. Photos: put the file in `website/public/img/` and set its name under `images` (for example `"hero": "hero.jpg"`).
4. Run `npm run build`.

Anything still `null` shows a small "to be confirmed" marker on the page, so nothing is missed.

## Design

- Colours: royal blue, white and green (no black).
- Type: Manrope throughout, Roboto Condensed for the oversized display words, on one fluid type scale.
- Layout and motion ideas inspired by the OneFin, Quadro and Kora Framer templates, written from scratch.
  No template code or assets are used. Animations run by default on every device; visitors can
  turn them off with the "Reduce motion" switch in the footer.
- Client documents (proposal, checklists and other PDFs) are kept out of this repository.

---

Author: Riflan Mohamed
