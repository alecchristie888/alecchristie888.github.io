# alecresearch.com — Alec Christie

Personal academic website. Plain static HTML/CSS/JS — no build step, no dependencies. Hosted free on **GitHub Pages** with the custom domain `alecresearch.com`.

## Files
- `index.html` — all page content (single-page site)
- `style.css` — design system + layout (dark/light themes)
- `script.js` — theme toggle, mobile nav, scroll reveals, animated background, publications list
- `assets/headshot.jpg` — your photo
- `assets/favicon.svg` — site icon
- `CNAME` — custom domain config for GitHub Pages (do not delete)
- `.nojekyll` — tells GitHub Pages to serve files as-is

## How to publish on GitHub Pages (one-time setup)

1. **Create the repo.** On GitHub, create a new **public** repository named exactly:
   `alecchristie888.github.io`
   (A repo with this exact name is served at the root of your GitHub Pages site.)

2. **Upload these files.** Either drag-and-drop all files into the repo via the web UI, or from your computer:
   ```bash
   git clone https://github.com/alecchristie888/alecchristie888.github.io.git
   # copy all files from this folder into the cloned folder, then:
   git add -A
   git commit -m "Launch site"
   git push
   ```

3. **Enable Pages.** In the repo → **Settings → Pages** → Source: "Deploy from a branch" → Branch: `main` / `/ (root)` → Save. Your site goes live at `https://alecchristie888.github.io` within a minute or two.

## Point alecresearch.com at GitHub Pages (keep your domain, drop the hosting cost)

You keep the domain registered at IONOS (cheap, ~£10–15/yr) and just repoint its DNS. Cancel the IONOS/WordPress **hosting** plan.

1. **In GitHub** → repo → Settings → Pages → "Custom domain": enter `alecresearch.com` and Save. (The included `CNAME` file already sets this.) Tick **Enforce HTTPS** once it's available.

2. **In IONOS DNS** for alecresearch.com, set these records:

   **Apex domain (alecresearch.com)** — four A records pointing to GitHub:
   ```
   A   @   185.199.108.153
   A   @   185.199.109.153
   A   @   185.199.110.153
   A   @   185.199.111.153
   ```
   (Optionally also add AAAA records for IPv6: 2606:50c0:8000::153, ...8001::153, ...8002::153, ...8003::153)

   **www subdomain** — a CNAME:
   ```
   CNAME   www   alecchristie888.github.io
   ```

3. **Remove** any old IONOS/WordPress A records or parking records that conflict.

4. DNS changes take anywhere from a few minutes to ~24 hours. GitHub will auto-provision a free HTTPS certificate. Once "Enforce HTTPS" can be ticked, you're done.

## Editing later
- **Text**: edit `index.html`.
- **Publications**: edit the `PUBS` array near the top of `script.js` — each entry is `{ y: year, t: title, v: venue, k: tag }`. First 8 show by default; the rest are behind "Show all".
- **Photo**: replace `assets/headshot.jpg` (keep the same filename).
- **Colours/fonts**: the `:root` and `[data-theme='light']` blocks at the top of `style.css`.
