# Harsh Khandal - Portfolio

Static site: plain HTML, CSS and vanilla JS. No backend, no build step. Works on GitHub Pages.

## Deploy
1. Copy everything in this folder into the root of your `Hk-Hacker-Harsh.github.io` repo (keep your existing `assets/` folder).
2. Delete the old `css/` and `js/` files and `assets/includes/header.html` (no longer used).
3. Commit and push. `CNAME` keeps `harshkhandal.dev`.

## Edit content
Everything lives in `js/data.js`: projects, skills, experience, certificates, badges, education.
Add one object to a list and the page updates.

## Files
- `css/site.css` - the whole design
- `js/data.js` - all content
- `js/main.js` - header effects, command menu (Ctrl K or /), renderers for each page
- `js/graph.js` - the small interactive graph on the home page
- `js/map.js` - the detailed map page (`map.html`), generated from `js/data.js`

## Extras
- Command menu: press `Ctrl K` (or `/`) anywhere
- Easter egg: the Konami code
- Contact form opens the visitor's mail app (no server needed)

## Add real photos
1. Put images in `assets/moments/` (about 1600px wide, JPG).
2. Add an entry to `gallery` in `js/data.js`. The "Moments" section on the home page appears automatically.
3. To show a photo inside an experience card, add `photo: 'assets/moments/file.jpg'` (and optional `photoCaption`) to that entry in `experience`.
