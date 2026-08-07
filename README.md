# Chromasight

## Setup and Interaction Instructions

To run the sketch locally, open `index.html` in Google Chrome using Live Server.

**Controls:**

- Click `Start` on the title screen to enter the game.
- Click `Controls` on the title screen to view the controls of the game.
- Move: `A` / `D` or Left / Right Arrow
- Jump: `W` or Up Arrow or Spacebar
- Climb / move down: `W` / `S` or Up / Down Arrow when overlapping a ladder
- Use portal: stand inside a portal trigger and press `F`
- Switch vision mode: `Q` or `E` after collecting a vision key

There is a debug panel. To use it press **C** that will show at the bottom of the screen. Then you can press the key that correspond to the shortcuts. 

The game begins in Colour Blindness mode. The player collects a Chroma glasses fragement to unlock another vision mode, then uses `Q` and `E` to shift vision. Mode blocks are controlled through Tiled object properties: each block can render as a different tile and can either have collision or no collision depending on the current mode. This allows the same space to change function as the player changes visual mode. 

This game has 3 levels. Each level consist of a series of diffrent obstacles to overcome to collect all the books. The first playable section (level 1) teaches movement, Chroma glasses fragement collection, vision switching, mode-based blocks, tutorial text, and portal progression. Then the second level introduces another colour, spikes, and ladder interactions. In the final round of the game (level 3) the features in levels 1 and 2 are re-introduced with the addition of a block mechanic where players can use to drag or push to solve the puzzle to get all the books. 

**Opening the Chrome Console**

- **Windows:** Press `F12` or `Ctrl + Shift + J`, then click the **Console** tab
- **Mac:** Press `Cmd + Option + J`

The console will show any errors in the sketch.


# Changes Made

**CHROMASIGHT — Animated PRISM-256 Intro**

Added an animation scene to the existing project structure and turns the current `story` scene into a timed animated opening cutscene. So the video that we used to have after the player press start was replaced with the storyline. 

***Existing assets used***

The cutscene uses the same assets already referenced by your project:

- `assets/img/storyline.png`
- `assets/img/robotFighter.png`
- `assets/sound/story.mp3`

No new image assets are required.

***Cutscene sequence***

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

***Controls for the Animation***

- `Skip` button skips the intro.
- `Enter` or `Backspace` still skips because the original `sketch.js` input behaviour is preserved.
- `Escape` returns to the start menu.

**Block Mechanic Changes**

1. We removed the block mechanic to level 3 instead of introducing it in level 2. 
2. The instructions for using the block mechanic was move to the beginning of level 3. 

**Doors**

We swap the doors to a more visually appealing door. So the portals that looked like blocks are now looking like proper portals with frames. 

## Project Structure

| File | Purpose |
|------|---------|
| `index.html` | Loads p5.js, p5.sound, and the project scripts |
| `sketch.js` | Handles p5 lifecycle functions, asset loading, input, and audio helpers |
| `game.js` | Stores game configuration and the main `ChromasightGame` class |
| `scenes.js` | Stores scene drawing helpers, Tiled parsing helpers, collision helpers, and animation helpers |
| `assets/map/Start.tmj` | Tiled start screen map and clickable Start object |
| `assets/map/level_1.tmj` | Main playable Tiled map |
| `assets/map/tiles_packed.tsx` | Tiled tileset definition |

## Assets

| File | Source |
|------|--------|
| `assets/img/tiles_packed.png` | Game asset tileset by Piens Factory [1], modified for this project |
| `assets/img/robotFighter.png` | Cute Animated Robot Character by Ryder Studios Game Assets [2], modified for this project |
| Book collectible tile | Roguelike/RPG Items from OpenGameArt [3], modified for this project |
| Mode block tiles | Drawn by a team member for this project |
| `assets/img/Start.png` | Start screen image created for this project |
| `assets/sound/bgm.wav` | Loading Screen Loop from OpenGameArt [4] |
| `assets/sound/buttonon.mp3` | Technology Button On sound effect from Pixabay [5] |
| `assets/map/Start.tmj` | Tiled map created for this project |
| `assets/map/level_1.tmj` | Tiled map created for this project |
| `assets/sound/Options.mp3` | pixabay.com [10] |
| `assets/sound/book.mp3` | pixabay.com [11] |
| `assets/sound/Startscreen.mp3` | pixabay.com [12] |
| `assets/sound/Win.mp3` | pixabay.com [13] |
| `assets/sound/story.mp3` | pixabay.com [14] |
| `assets/sound/Jump.mp3` | pixabay.com [15] |
| `assets/img/AllBooks.png` | Drawn by ChatGPT |
| `assets/img/Options.png` | Drawn by Copilot with a Text Overlay using Adobe Express|
| `assets/img/storyline.png` | Drawn by ChatGPT |
| `assets/sound/beepbeep.mp3` | pixabay.com [16] |
| `assets/sound/Wakeup.mp3` | pixabay.com [17] |
| `assets/sound/Facility.mp3` | pixabay.com [18] |

## References

[1] Piens Factory. 2022. _Game Assets_. Patreon. Retrieved 2026, from https://www.patreon.com/Piensfactory/posts/game-assets-73297576

[2] Ryder Studios Game Assets. n.d. _Cute Animated Robot Character_. itch.io. Retrieved 2026, from https://ryder-studios-game-assets.itch.io/cute-animated-robot-character

[3] OpenGameArt. n.d. _Roguelike/RPG Items_. Retrieved 2026, from https://opengameart.org/content/roguelikerpg-items

[4] OpenGameArt. n.d. _Loading Screen Loop_. Retrieved 2026, from https://opengameart.org/content/loading-screen-loop

[5] Pixabay. n.d. _Technology Button On Sound Effect_. Retrieved 2026, from https://pixabay.com/sound-effects/technology-buttonon-521345/

[6] McCarthy, L., Reas, C., and Fry, B. n.d. _p5.js Reference_. Processing Foundation. Retrieved 2026, from https://p5js.org/reference/

[7] Processing Foundation. n.d. _p5.sound Reference_. Retrieved 2026, from https://p5js.org/reference/#/libraries/p5.sound

[8] Tiled. n.d. _Tiled Map Editor Documentation_. Retrieved 2026, from https://doc.mapeditor.org/

[9] OpenAI. 2026. _ChatGPT_. Used to assist with code organization, debugging, README drafting, and prototype iteration.

[10] AberrantRealities. Meet the (Mad) Scientist. Retrieved August 5, 2026 from https://pixabay.com/music/synthwave-meet-the-mad-scientist-545962/ 

[11] floraphonic.Retrieved August 5, 2026b from https://pixabay.com/sound-effects/film-special-effects-paper-collect-1-186598/ 

[12] SolarFLEX.Retrieved August 5, 2026 from https://pixabay.com/music/ambient-film-film-movie-soundtrack-music-2-571726/ 

[13] floraphonic.Retrieved August 5, 2026a from https://pixabay.com/sound-effects/musical-you-win-sequence-2-183949/ 

[14] Kulakovka.Retrieved August 5, 2026 from https://pixabay.com/music/beats-sci-fi-281087/ 

[15] DRAGON-STUDIO.Retrieved August 5, 2026 from https://pixabay.com/sound-effects/film-special-effects-cartoon-jump-463196/ 

[16] freesound_community.Retrieved August 7, 2026 from https://pixabay.com/sound-effects/film-special-effects-little-robot-sound-84657/ 

[17] freesound_community.Retrieved August 7, 2026a from https://pixabay.com/sound-effects/film-special-effects-wake-up-the-robot-84894/ 

[18] Fronbondi_Skegs.Retrieved August 7, 2026 from https://pixabay.com/sound-effects/technology-sfx-facility-failure-alarm-reverb-sound-effect-seamless-loop-478466/ 

## GenAI Use Statement

I used GenAI. I used ChatGPT GPT-5 to help organize the JavaScript architecture, debug p5.js and Tiled integration issues, refine gameplay logic, suggestion for sounds based on the theme of the game, and prepare this README in a clear submission format. I used ChatGPT and Copilot to create images and images to then edit on design softwares. 
