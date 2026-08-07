# Chromasight intro audio fix

These files are a patch for your existing Chromasight project.

## Replace these files in the project root
- game.js
- scenes.js
- sketch.js
- saveData.js
- index.html
- style.css

## Add these three files to `assets/sound/`
- Wakeup.mp3
- beepbeep.mp3
- Facility.mp3

Keep all of your existing `assets/img/`, `assets/map/`, and other `assets/sound/` files. In particular, keep `assets/sound/story.mp3`, because it remains the main intro background music.

## Audio behavior
- `story.mp3` starts when the animated story begins at volume 0.30.
- `Facility.mp3` loops under the story at volume 0.10.
- `Wakeup.mp3` plays at 2.1 seconds with the first `Clink clunk`, covering the wake-up / activation section.
- `beepbeep.mp3` plays once at the start of every PRISM-256 dialogue line.
- All intro-only sounds stop when the story is skipped, completed, or the player returns to the menu.

## Important
The three new sound paths are case-sensitive:
- `assets/sound/Wakeup.mp3`
- `assets/sound/beepbeep.mp3`
- `assets/sound/Facility.mp3`

If you deploy through GitHub Pages, make sure the filenames and capitalization match exactly.
