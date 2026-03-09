# ProtectForward — Multi-Vertical Insurance Website
## Architecture & Developer Guide

---

## Folder Structure

```
/
├── index.html                    ← Universal entry point (all verticals)
├── assets/
│   ├── css/main.css              ← Full design system
│   └── js/
│       ├── segment.js            ← Vertical detection & session management
│       ├── pixels.js             ← Per-vertical Meta pixel firing
│       └── router.js             ← DOM visibility gating
├── verticals/
│   ├── federal-retirement/
│   │   ├── index.html            ← Dedicated landing page
│   │   ├── quiz.html             ← Deep vertical quiz
│   │   └── resources.html        ← SEO content page
│   ├── iul/
│   ├── annuities/
│   ├── life-insurance/
│   ├── teachers/
│   └── truckers/
├── shared/
│   ├── header.html               ← (optional include if using a build tool)
│   └── footer.html
├── quiz/
│   └── index.html                ← General routing quiz
├── booking/
│   └── index.html                ← Standalone booking page
└── README.md
```

---

## How Visibility Control Works

### The 3 Attributes

```html
data-vertical="teachers"          <!-- Only shown when teachers vertical is active -->
data-vertical="federal-retirement"
data-vertical="general"           <!-- Only shown when NO vertical is detected -->
data-vertical="all"               <!-- Always shown, regardless of vertical -->
```

Everything tagged with `data-vertical` is hidden by default via CSS.
`router.js` reveals only the matching vertical's elements on DOMContentLoaded.

---

## Vertical Detection Priority (segment.js)

```
1. URL param: /?v=teachers
2. sessionStorage (already set from prior visit)
3. UTM parameter: ?utm_content=teachers (Meta Ads)
4. null → show general content / quiz
```

---

## Meta Ads URL Patterns

For each ad campaign, use a URL like:
```
https://yoursite.com/?v=teachers&utm_source=facebook&utm_campaign=teachers_q1
```

This will:
- Detect the teachers vertical
- Fire only the teachers pixel
- Show only teachers hero/content
- Store vertical in session for the full visit

---

## Adding a New Vertical (takes ~20 minutes)

1. **Add to VERTICALS in segment.js:**
```js
'nurses': {
  label: 'Nurses & Healthcare Workers',
  path: '/verticals/nurses/',
  pixel: 'FB_PIXEL_NURSES',
  quizId: 'quiz-nurses'
}
```

2. **Add to PIXEL_IDS in pixels.js:**
```js
'nurses': 'YOUR_PIXEL_ID_HERE',
```

3. **Add hero to index.html:**
```html
<section class="hero" data-vertical="nurses">
  ...
</section>
```

4. **Create the folder and landing page:**
```
/verticals/nurses/index.html
```

5. **Add quiz option (if relevant):**
```html
<button class="quiz-option" onclick="Quiz.select('nurses')">
  🏥 Nurse / Healthcare Worker
</button>
```

6. **Add UTM mapping to segment.js:**
```js
'nurse': 'nurses',
'nurses': 'nurses',
```

That's it. No rebuild needed.

---

## CRM Integration (Make + Google Sheets)

Connect your lead forms to Make with a webhook:
```js
async function submitToMake(formData, verticalId) {
  await fetch('YOUR_MAKE_WEBHOOK_URL', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...formData,
      vertical: verticalId,
      source: document.referrer,
      timestamp: new Date().toISOString()
    })
  });
}
```

Make scenario: Webhook → Google Sheets Row → Slack notification → Calendly tag

---

## Pixel Configuration

Replace all placeholder IDs in `pixels.js`:
```js
const PIXEL_IDS = {
  'federal-retirement': 'YOUR_REAL_PIXEL_ID',
  'teachers':           'YOUR_REAL_PIXEL_ID',
  // ...
};
```

Each vertical gets its own pixel so you can:
- Run separate ad accounts per vertical
- Build custom audiences per vertical
- Track ROAS independently per vertical

---

## SEO Strategy

- Each `/verticals/[name]/index.html` has its own title, meta description, and H1
- The main `index.html` is the "gateway" — not keyword-optimized
- Each vertical page IS keyword-optimized for its niche
- URL structure: `yoursite.com/verticals/teachers/` → crawlable by Google
- The JS visibility gating does NOT affect crawlability (Google sees the HTML)

---

## Hosting on GitHub Pages

```bash
# Initial setup
git init
git add .
git commit -m "Initial multi-vertical site"
git remote add origin https://github.com/YOURUSERNAME/YOURREPO.git
git push -u origin main

# In GitHub: Settings → Pages → Deploy from main branch
```

Your site will be live at: `https://YOURUSERNAME.github.io/YOURREPO/`

For custom domain: add a `CNAME` file with your domain name.

---

## Future: 20+ Verticals Without Rebuilding

The architecture handles unlimited verticals. When you hit 20+ verticals, consider:

1. **JSON config file** instead of hardcoding in segment.js:
```js
fetch('/config/verticals.json').then(r => r.json()).then(v => VERTICALS = v);
```

2. **Dynamic hero templates** via JS instead of duplicating HTML

3. **Subdomain strategy**: `teachers.yoursite.com` → sets vertical via subdomain detection in segment.js

The core routing engine never needs to change.
