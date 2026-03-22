# Wartime Tuckshop 🕯️

> *Which Singapore WWII food are you?*

A personality quiz set during the Japanese Occupation of Singapore (1942–1945). Players navigate 8 wartime scenarios and discover which food from the period matches their spirit — designed to be educational, shareable, and emotionally resonant.

**Live site:** [wartimetuckshop.vercel.app](https://wartimetuckshop.vercel.app)

---

## About the project

During the Occupation, ordinary Singaporeans survived on extraordinary ingenuity. Rice ran out. Tapioca took its place. This quiz uses that history as a lens for self-discovery — inspired by the viral [LimSimi quiz](https://limsimi.vercel.app/) format.

The four possible results are:

| Food | Spirit | Rarity |
|---|---|---|
| 🌱 Tapioca | The Resilient Root | 29% |
| 🫓 Ragi Roti | The Keeper of Community | 22% |
| 🥬 Lemak Sweet Potatoes & Kangkong | The Creative Nurturer | 18% |
| 🐟 Salted Fish & Ikan Bilis | The Steadfast Preserver | 31% |

---

## File structure

```
wartime-tuckshop/
├── index.html        # Page structure and all screen layouts
├── script.js         # Quiz logic, result calculation, sharing
├── style.css         # Visual design — vintage wartime document aesthetic
├── README.md         # This file
└── images/
    ├── tapioca.avif
    ├── ragi-roti.avif
    ├── lemak-sweet-potato.avif
    └── salted-fish.avif
```

---

## How the quiz works

1. On page load, the app checks for a `?result=X` URL parameter. If present (e.g. from a shared link), it skips straight to that result.
2. Otherwise the player sees the start screen and begins the 8-question quiz.
3. Each question has 4 options. Every option maps to one of the 4 food personalities (index 0–3).
4. On submit, the app tallies which index was chosen most often. Ties are broken by the last answer given.
5. The result screen populates a styled card with the personality's name, traits, description, strength, weakness, pairs/clashes, and a historical fact.
6. The URL is updated to `?result=X` without a page reload, making it instantly shareable.

---

## Sharing

| Button | Behaviour |
|---|---|
| Share 📤 | Opens native share sheet on mobile (WhatsApp, Instagram Stories, Telegram, etc.) |
| WhatsApp | Opens `wa.me` with pre-filled message and result URL |
| Copy Link | Copies `tapiocatales.vercel.app?result=X` to clipboard |
| Save Card 🖼 | Downloads the result card as a PNG image via html2canvas |

---

## Deployment

The site is hosted on [Vercel](https://vercel.com) and connected to this GitHub repository. Every push to `main` triggers an automatic redeploy — live within ~30 seconds.

**To make changes:**
```
1. Edit files locally
2. git add .
3. git commit -m "describe what changed"
4. git push
```

To roll back a broken deployment: Vercel Dashboard → Deployments → find last working build → Redeploy.

---

## Dependencies

- [html2canvas 1.4.1](https://html2canvas.hertzen.com/) — loaded via CDN, used for the Save Card feature
- [Playfair Display + Lora](https://fonts.google.com/) — loaded via Google Fonts
- No build tools, no frameworks, no npm. Plain HTML, CSS, and JavaScript.

---

## Credits

Created by **Wartime Tuckshop**, a pilot project under the **TF-NUS Heritage Champions Programme**.  
Inspired by the [LimSimi quiz](https://limsimi.vercel.app/) by [@tyeckh](https://twitter.com/tyeckh).
