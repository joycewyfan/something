# CHROMASIGHT — Animated PRISM-256 Intro

This package keeps the existing project structure and turns the current `story` scene into a timed animated opening cutscene.

## Replace these files

- `game.js` — adds `INTRO_CONFIG`, story timing/state, and story update logic.
- `scenes.js` — replaces the static story screen with animated darkness, boot-up text, environmental reveal, robot animation, memory glitch, dialogue box, and system mission popup.
- `sketch.js` — unchanged from your original upload; included so the set stays together.
- `saveData.js`, `index.html`, `style.css` — unchanged copies for reference.

## Existing assets used

The cutscene uses the same assets already referenced by your project:

- `assets/img/storyline.png`
- `assets/img/robotFighter.png`
- `assets/sound/story.mp3`

No new image assets are required.

## Cutscene sequence

1. Black screen with humming/clink/boot captions.
2. PRISM-256 screen/eye flickers on.
3. Dialogue begins in darkness.
4. Facility slowly fades into view with a cold local light around PRISM.
5. Robot sprite rises/settles using frames from the existing sprite sheet.
6. Memory-rewind glitch effect appears.
7. A recovery directive panel types in:
   - MISSION: Restore Chroma Network integrity.
   - MISSION: Find ???
   - STATUS: Interpretation system degraded
   - FALLBACK TOOL: Contrast Scanner available.
8. Continue button appears and loads the saved level.

## Controls

- `Skip` button skips the intro.
- `Enter` or `Backspace` still skips because the original `sketch.js` input behavior is preserved.
- `Escape` returns to the start menu.

## Retiming dialogue

Edit only `INTRO_CONFIG.beats` and `INTRO_CONFIG.systemLines` near the top of `game.js`. The rendering code does not need to change.

## Robot placement

If the sprite does not perfectly cover the robot already painted into `storyline.png`, change:

```js
robot: Object.freeze({ x: 188, y: 423, w: 64, h: 64 })
```

The values are in the 960 × 540 canvas coordinate system.
