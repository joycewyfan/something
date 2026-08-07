# Chromasight — Quieter Facility Audio

This version keeps the existing intro/audio code and only lowers the facility ambience.

## Changed
In `game.js` under `AudioConfig`:

```js
facilityVolume: 0.03
```

The other intro volumes remain:

```js
storyVolume: 0.30,
wakeupVolume: 0.55,
robotVoiceVolume: 0.28,
facilityVolume: 0.03
```

## Important
Keep your existing `assets/img/`, `assets/map/`, and `assets/sound/` folders. These code files still expect all of your existing maps, images, and sounds, including:

- `assets/sound/story.mp3`
- `assets/sound/Wakeup.mp3`
- `assets/sound/beepbeep.mp3`
- `assets/sound/Facility.mp3`

Replace the root code files with the versions in this folder.
