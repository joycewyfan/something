# Chromasight Intro — Audio Update

This folder contains the updated code files for the animated PRISM-256 intro plus the three new sound files you supplied.

## Replace these code files in your project
- `game.js`
- `scenes.js`
- `sketch.js`
- `saveData.js`
- `index.html`
- `style.css`

## Add these sound files to `assets/sound/`
- `Wakeup.mp3`
- `beepbeep.mp3`
- `Facility.mp3`

Keep your existing `story.mp3` in `assets/sound/` as well.

## Sound timing
- `story.mp3`: main cutscene background music.
- `Facility.mp3`: loops underneath `story.mp3` at a deliberately low volume (`0.10`).
- `Wakeup.mp3`: begins at 2.1 seconds, covering the "Clink clunk" and "BEEP BEEP BEEP — PRISM-256 activated" wake-up section.
- `beepbeep.mp3`: plays once whenever a PRISM-256 dialogue line starts.

## Volume controls
Edit these values in `game.js` under `AudioConfig`:

```js
storyVolume: 0.30,
wakeupVolume: 0.55,
robotVoiceVolume: 0.28,
facilityVolume: 0.10
```

If the facility ambience is still too noticeable, try `facilityVolume: 0.06`–`0.08`.

The mission terminology has also been corrected to:
`Restore Chroma Network integrity.`
