# Content guide: how to add or change things

Almost everything is edited in **`js/data.js`**. Copy a template below, paste it into the right list, change the values, save. Lists are written as `[ ... ]`, so every entry ends with a comma except the last one (a trailing comma is also fine).

Where new items go:
- Projects, experience, certificates: **add at the top** of the list (newest first).
- Images and PDFs: put the file in the `assets/` folder first, then write its path in the entry.

---

## 1. Project  (`projects` in `js/data.js`)

Shows on Projects page, the map, and the `Ctrl K` menu.

```js
{
  id: 'my-new-project',              // unique, lowercase, no spaces
  title: 'My New Project',
  short: 'One or two sentences shown on the card.',
  full: 'Longer description shown in the pop-up.',
  tags: ['python', 'cyber'],         // used for filters and map links
  img: 'assets/images/projects/my-new-project.png',   // or a full https:// image URL
  links: [
    { label: 'View GitHub', url: 'https://github.com/Hk-Hacker-Harsh/my-new-project' },
    { label: 'Live demo', url: 'https://example.com' }      // optional extra links
  ]
},
```

Notes:
- The first link becomes the main (amber) button.
- A new tag automatically appears as a filter chip and as a skill node on the map.
- To change which 3 projects show under "Recent builds" on the home page, edit the list `['whats-going-on', 'ccrm', 'placement-portal']` inside `home()` in `js/main.js` (use project `id`s).

## 2. Skill  (`skills` in `js/data.js`)

Skills are grouped in categories. Add an item inside a category's `items`:

```js
{ name: 'Docker', level: 60, tag: 'docker' },    // level is 0-100; use null for no bar
```

`tag` is the project tag it links to. A new category looks like this (the key, here `data`, goes in the URL as `skills.html#data`):

```js
data: {
  title: 'Data Science',
  mastery: 50,                       // number for the ring, or null for a dot
  items: [
    { name: 'Pandas', level: 55, tag: 'pandas' }
  ]
},
```

## 3. Experience  (`experience` in `js/data.js`)

```js
{
  id: 'company-short-name',          // unique
  title: 'Security Intern',
  org: 'Company Name',
  period: 'Jan 2027 - Mar 2027',
  desc: 'Short summary shown on the card.',
  learnings: 'What you learned. Shown when the card is opened.',
  status: { type: 'success', text: 'Success - What you delivered.' },
  //  type is one of: 'ongoing' | 'success' | 'fail'
  //  For success/fail, start text with "Success - " or "Failed - " (that prefix is removed on screen).
  //  For ongoing, text is ignored.
  links: [
    { label: 'Certificate', url: 'viewer.html?file=assets/experience/my-cert.pdf' },
    { label: 'Project link', url: 'https://github.com/...' }
  ],

  // Optional extras:
  photo: 'assets/moments/my-photo.jpg',
  photoCaption: 'Receiving my certificate',
  statsTitle: 'Final stats',
  stats: [ { v: '40K+', l: 'Impressions' }, { v: '7', l: 'Orders' } ]
},
```

On the map, a new experience gets a node linked to you. To also link it to skills, add lines like `link('x-company-short-name', 's-python', 'Python scripting');` in `js/map.js` (look for the `link('x-phq', ...)` lines). Optionally add a short label for it in `ORG_SHORT` at the top of that file.

## 4. Certificate  (`certs` in `js/data.js`)

```js
{
  cat: 'course',                     // cert | course | comp | other
  title: 'Certificate Title',
  issuer: 'Issuer Name',
  date: '12 Dec 2026',
  file: 'assets/certificates/my-cert.pdf',      // .pdf, .png, .jpg or .webp inside assets/
  links: [ { label: 'Verify', url: 'https://...' } ]      // can be empty: []
},
```

`cat` meaning: `cert` = certification, `course` = course/path, `comp` = competition, `other` = volunteering, roles, etc.
The certificate count on the home page updates by itself. To show a certificate on the map, add its exact `title` to the `CERT_PICK` list in `js/map.js`, then add `link(C('Your Title'), 's-cyber', 'covers');` below.

## 5. Verified badge  (`badges` in `js/data.js`)

```js
{
  title: 'Badge Name',
  desc: 'What it proves. Shown in the pop-up.',
  img: 'assets/badges/my-badge.png',
  verify: 'https://www.credly.com/...'
},
```

## 6. Education  (`education` in `js/data.js`)

```js
{
  title: 'Course or Class', where: 'School or University',
  meta: 'Completed 2026-27 · Board or focus',
  chips: [ { t: 'Completed', k: 'mute' }, { t: '90%', k: 'score' } ],
  url: 'https://...'                 // optional: makes the whole card a link
},
```

Chip `k` values: `ongoing` (amber), `ok` (green), `future` (outlined), `mute` (grey), `score` (cyan).

## 7. Moments, real photos  (`gallery` in `js/data.js`)

Shows as a "Moments" strip on the **home page**, between "Recent builds" and "Mission log". It stays hidden while the list is empty.

```js
{
  img: 'assets/moments/phq-certificate.jpg',
  caption: 'Receiving my certificate at Rajasthan Police HQ',
  date: 'Aug 2026',
  note: 'Optional longer text shown in the pop-up.'
},
```

Create the folder `assets/moments/` and keep photos around 1600px wide, JPG, under 500 KB.

## 8. Email

```js
email: 'hk.harsh.khandal@gmail.com',
```

Used by the Copy address button, the contact form and the `Ctrl K` menu.

---

## Things that are NOT in `data.js`

These are plain HTML. Open the file and edit the text.

| What | File | Where to look |
| --- | --- | --- |
| Terminal intro lines on the home page | `index.html` | the `<li data-k="...">` lines inside `id="term-body"` |
| Home numbers (25+ repos, Top 3%) | `index.html` | `data-count="25"` and `data-count="3"` |
| Mission log cards | `index.html` | `class="card log-card"` |
| "Find me on" cards (TryHackMe, GitHub, HackTheBox) | `index.html` | `class="card ident"` |
| Resume link | `index.html` and `js/main.js` | search for `flowcv.com` |
| Contact cards (LinkedIn, X, Linktree), location line | `contact.html` | `class="card contact-card"` |
| Page titles and intro sentences | each `.html` file | `<h1 class="page-title">` and `<p class="page-lead">` |
| Home page graph nodes | `js/graph.js` | the `nodes` list at the top (see below) |
| Colors, fonts, spacing | `css/site.css` | `:root { ... }` at the top |

### Home page graph node (`js/graph.js`)

```js
{ id: 'new', label: 'Label', short: 'Short', sub: 'Shown on hover', x: .50, y: .50, r: 20, g: 'build', href: 'projects.html?filter=python' },
```

- `x`, `y` are positions from 0 to 1 across the graph area.
- `g` is the color group: `me`, `cyber`, `police`, `build` or `learn`.
- `short` is the label used on small phone screens.
- Then connect it by adding a pair to `edgeDefs`, for example `['me','new']`.
- `href` can be an internal page (`experience.html`), a filtered projects page (`projects.html?filter=n8n`), a project pop-up (`projects.html?open=ccrm`) or an external `https://` link.

### Adding a whole new page

1. Copy an existing page (for example `contact.html`) and rename it.
2. Add `<a href="newpage.html">New page</a>` to the `<nav id="nav">` in **every** `.html` file.
3. Add it to the `pages` list near the top of the command menu code in `js/main.js`.
4. Add the URL to `sitemap.xml`.

---

## Quick links in URLs

- `projects.html?filter=python` opens Projects filtered to a tag.
- `projects.html?open=ccrm` opens a project's pop-up (use the project `id`).
- `skills.html#ai` opens a skills category (`cyber`, `ai`, `lang`, `web`, `startups`, `others`).
- `map.html#p-ccrm` opens the map with a node selected. Node ids: `p-<project id>`, `x-<experience id>`, `s-<tag>`, `iitm`, `nielit`, `tryhackme`, `htb`, `github`.
- `viewer.html?file=assets/certificates/file.pdf` opens a certificate (only files inside `assets/` are allowed).

## Before you push

Open the site locally (for example `python -m http.server` in this folder, then visit `http://localhost:8000`). If a page looks empty, press F12 and check the Console: a missing comma or quote in `js/data.js` is the usual cause.
