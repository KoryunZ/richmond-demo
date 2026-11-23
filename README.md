# Richmond Rent a Car — a film you drive by scrolling

A concept site for Richmond Rent a Car (Dubai). The top of the page is a film of the lime Urus in five chapters.
Scroll position is the position in the film: scrolling down drives it forward, scrolling up drives it back,
stopping holds the frame. Nothing plays by itself. After the film the page carries on: fleet, three steps,
questions, a booking form that opens WhatsApp, footer.

| | Chapter | Title on screen |
|---|---|---|
| 1 | No deposit | Your journey starts without an upfront deposit. |
| 2 | 24/7 recovery | Help is always on the way. |
| 3 | From $400 | Find your perfect vehicle at an exceptional price. |
| 4 | SUV collection | Discover the freedom to go beyond the ordinary. |
| 5 | Sport & luxury | Experience performance, elegance and comfort. + Explore our fleet / Book your vehicle |

Below the film:

- **Fleet** "Cars that everyone can afford": eleven sample cars, cheapest first, with a per day / per month switch
  and a category filter, plus a tile for asking about a car that is not listed. On a phone the cars are a compact
  list. "Book" on a car takes it to the booking form.
- **Three steps to the keys**
- **Before you book**: five questions and answers.
- **Book your vehicle**: car, start date, days, name. The form shows the chosen car and what the rental comes to at
  the sample prices, and opens WhatsApp with the request written out. Nothing is sent anywhere else.
- **Footer**: WhatsApp, phone, Instagram, links to the sections, and what on the page is a placeholder.

Everything is in English and Russian (the RU / EN button in the header).

## Where the film stands

The footage is AI-generated video (Google Flow / Veo), made from pictures of the car.

- **Today** the film is cut from the footage that exists: five scenes and four bridges generated on 19–23 Nov.
  The car heads left or toward the camera throughout, and the stretches where it turned round or drove off the
  other way are cut out. It is not yet the single unbroken shot the brief asks for: between chapters the picture
  still cross-fades from one view of the car to another, the rental-lot scene is mirrored, and chapter 2 has no
  recovery truck.
- **Next** the film is rebuilt around one locked car: five key frames in which the car has the same place, size
  and angle, and new clips generated from key frame to key frame, so that only the world behind the car changes.
  The key frames are made; the clips need Flow credits. Everything is in `clips/SHOTLIST.md`: what to generate,
  from which frames, with which prompts, under which file names. When those files are in `clips/`,
  `npm run frames` switches the film to them.

## Run it

```bash
npm install
npm run dev            # http://127.0.0.1:5175
npm run build          # dist/         for hosting: page + frames.pack (the film, about 17 MB)
npm run build:single   # dist-single/  one self-contained index.html (about 24 MB) that opens with a double-click
npm run frames         # re-cut the film from clips/ (needs ffmpeg and python3 with numpy)
```

## How scroll drives the film

A video file cannot be scrubbed smoothly in both directions, so the film is stored as individual frames.

1. `tools/frames.py` cuts the clips into frames (WebP, 1280 × 720) and writes them one after another into
   `public/frames.pack`. A film is a list of clips (which frames of each, how fast each stretch goes by) plus
   chapter marks (where a title comes up, where its tab lands, where it leaves). The index is
   `src/film/film.json`; the first frame is also saved as `src/film/poster.webp`.
2. `src/film/pack.js` loads the pack. Frames stay compressed in memory and are decoded only around the current
   position, further in the direction of travel. A small copy of every sixth frame stays decoded, so a flick of
   the wheel that outruns the decoder shows a soft picture of the right moment instead of freezing.
3. `src/film/Film.jsx` draws the frame for the current position on a canvas. Between two frames it cross-fades;
   at rest it settles on a whole frame.
4. `src/film/timeline.js` lays the clips end to end. Where two meet, the last frame of the old one is held and
   fades over 5 frames, which hides the small step in brightness the generator leaves.
5. `src/App.jsx`: GSAP ScrollTrigger pins the stage for the film's stretch of the page (one screen-height of
   scrolling per 60 frames) and turns scroll position into `t`, 0 to 100, which the film, the titles and the
   chapter rail all read. A click on a chapter tab scrolls the page to that chapter's resting frame, so the film
   plays there because the scroll does.

`SCROLL` at the top of `src/App.jsx` switches between `'scrub'` (above) and `'step'`, where one scroll, swipe or
arrow key plays on to the next chapter by itself (`src/film/stepper.js`).

Titles place themselves from the footage: on the right when the car is on the left, at the top when the car fills
the left of the frame, and they leave early if the car drives into their corner.

On an upright phone the picture is cropped around the car and sits in the upper part of the screen, with a
blurred copy behind it and the title underneath.

If the film cannot load (no `createImageBitmap`, or the pack fails to download), the page shows the film's first
frame with the first title, and everything below it works as usual.

## Changing things

- **Swap, re-cut or re-time a clip**: `CURRENT` / `NEXT` at the top of `tools/frames.py`, then `npm run frames`.
- **New footage**: `clips/SHOTLIST.md`. The prompts used for the existing bridges are in `clips/PROMPTS.md`.
- **Copy, phone, prices, questions**: `src/i18n.js`
- **Fleet pictures**: put a PNG per car in `tools/fleet-src/` (named by the car's id), run `python3 tools/fleet.py`
- **How much scrolling the film takes**: `FRAMES_PER_SCREEN` in `src/App.jsx`

## Honest notes

- The car in the footage is the AI's rendering of the Urus from the reference pictures. It is close, not identical:
  badges, grille details and wheel design can drift between scenes.
- Today's film is not one unbroken take (see "Where the film stands"). The rental-lot scene is flipped left to
  right so that the car heads left; it is the first clip the rebuild replaces.
- Every frame is enlarged by 3% so that a bridge can drift a few pixels at its end and hand the car over to the
  next scene without a jump.
- The fleet is a sample: the pictures are AI-generated illustrations, the prices are not Richmond's price list, and
  the answer about documents in "Before you book" is an example to be replaced with Richmond's terms.
- Tested in headless Chrome only (desktop and phone-sized). Not yet checked on a real phone or in Safari.

## Licences

| Asset | Note |
|---|---|
| Film footage and key frames | Generated in Google Flow from the client's reference pictures of the car. Check Google's terms for commercial use of generated video before going live. |
| Reference pictures of the Urus | Supplied by the client; they look like Lamborghini configurator renders. |
| Fleet pictures | Generated in Google Flow (image model) on 23 Nov 2026: illustrations of the models in one studio, not photos of Richmond's cars. Sources in `tools/fleet-src/`, cropped and matched by `tools/fleet.py`. Replace them with photos of the real fleet before going live. |
| Onest typeface | SIL OFL 1.1 |
| React, Vite | MIT |
| GSAP + ScrollTrigger | GSAP standard licence |

The Richmond name and mark belong to Richmond Rent a Car; the "R" tile here is drawn in code, not their logo file.

## Tests (headless Chrome)

```bash
python3 tests/scroll.py http://127.0.0.1:5175/ out                            # real wheel scrolling at three speeds, both ways; chapter tabs; counts late and blank frames
python3 tests/scroll.py http://127.0.0.1:5175/ out --w 390 --h 844 --mobile   # the same on a phone-sized screen
python3 tests/layout.py http://127.0.0.1:5175/                                # below the film at 8 screen widths, EN and RU: overflow, clipped text, small tap targets
python3 tests/sections.py http://127.0.0.1:5175/ out [--lang ru]              # full-length pictures of everything below the film, desktop and phone
python3 tests/shot.py http://127.0.0.1:5175/ out 0,28.7,50.3,64.3,100         # stills at timeline positions
python3 tests/steps.py http://127.0.0.1:5175/ out                             # only for SCROLL = 'step'
```
