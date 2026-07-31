# Maitree ❤ Cutie — an interactive love story

A small handcrafted website. Vanilla HTML, CSS, and JavaScript only — no build step, no frameworks.

## How to open it

Just double-click **`index.html`**. It opens straight in any browser (Chrome, Safari, Firefox, Edge) on desktop, laptop, phone, or tablet — nothing to install.

To send it to her, either:
- Zip the whole folder and send it — she unzips and opens `index.html`, or
- Upload the folder to any free static host (Netlify, Vercel, GitHub Pages, Cloudflare Pages — drag-and-drop the folder in) and just send her the link.

## What's inside

```
index.html    the structure of all six scenes
style.css     the look — colors, glassmorphism, every animation
script.js     the behavior — the evasive NO button, the YES celebration,
              the 8-second cat scene, the music, the floating messages
README.md     this file
assets/
  cat.png              the 8-second surprise
  iloveyoukhushi.png   the final, forever image
  music.mp3            the background track (loops automatically)
```

## How the experience flows

1. **Loading** — a soft glowing infinity mark, for a couple of seconds.
2. **Welcome** — "Hey Cutie ❤", her name, one line, then a glowing **Start** button.
3. **The question** — YES is real. NO evades the mouse and every touch, on any device, every time, with a different funny excuse.
4. **YES** — heart burst, glow, a zoom, one line of text.
5. **The cat** — exactly 8 seconds, then it's gone for good.
6. **Forever** — the final image, floating and glowing, romantic lines fading in and out on a loop, music playing on repeat. This screen never ends and never restarts — only the song loops.

## If you want to tweak anything

- **Colors** — all named at the top of `style.css` under `:root` (`--pink`, `--purple`, `--blush`, etc.).
- **The messages that fade in on the final screen** — the `ROMANTIC_MESSAGES` array near the middle of `script.js`.
- **The NO button's excuses** — the `NO_MESSAGES` array in `script.js`.
- **The opening line or the question text** — plain text inside `index.html`, in the welcome and question sections.
- **Swapping an image or the song** — replace the file in `assets/` and keep the exact same filename, and everything else keeps working.

Made with care — **BHAUMIK.8**
