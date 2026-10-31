# Diana Fonseca Fitness Coach — website

One-page bilingual (EN / PT) site for 1:1 online coaching. Its job is to capture leads through a free consult call request form.

## Files

- `index.html` — page structure and styles
- `i18n.js` — all copy, in English and European Portuguese (edit text here)
- `main.js` — language switch, form submission
- `netlify.toml` — Netlify config (static site, no build step)

## Leads

The form `consult-request` uses Netlify Forms. Submissions appear in Netlify under **Forms**. To email each lead, go to Forms → Form notifications → Add notification → Email.

Choice fields (goal, experience, best time) are always saved in English, whatever the language on screen. The `language` field records which version the visitor used. `plan_interest` records which plan button they clicked.

After a successful submit, the page fires a `generate_lead` (gtag) / `Lead` (Meta Pixel) / `lead_submitted` (dataLayer) event if those tags are installed.

## Still to fill in

Search for `[` in `i18n.js` and `index.html`: prices, bio, qualifications, testimonials, photos, Instagram handle, email, reply time, privacy policy.

Photos: add them to an `images/` folder and set them as `background-image` on `.photo` and `.portrait` (see the comments in `index.html`).

Link to the Portuguese version directly with `?lang=pt`.
