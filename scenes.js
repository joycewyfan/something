ChromasightGame.prototype.draw = function () {
  if (this.scene === "start") {
    this.drawStartScreen();
    return;
  }

  if (this.scene === "controls") {
    this.drawControlsScreen();
    return;
  }

  if (this.scene === "story") {
    this.drawStoryScreen();
    return;
  }

  if (this.scene === "win") {
    this.drawWinScreen();
    return;
  }

  this.drawWorld();
  this.drawUi();
};

ChromasightGame.prototype.drawStartScreen = function () {
  push();
  if (this.assets.startImage) {
    image(this.assets.startImage, 0, 0, width, height);
  } else {
    translate(-Math.floor(this.cameraX), -Math.floor(this.cameraY));
    this.drawImageLayers(this.startImageLayers || []);
    this.drawTileLayer(this.startTiles || []);
  }
  for (const textBox of this.startTexts || []) {
    this.drawTextBox(textBox);
  }
  for (const button of this.startButtons || []) {
    this.drawMenuButton(button, button.name);
  }
  pop();
};

ChromasightGame.prototype.drawControlsScreen = function () {
  push();
  image(this.assets.controlsImage, 0, 0, width, height);
  this.drawMenuButton(this.optionsBackButton, "Back");
  pop();
};

ChromasightGame.prototype.drawWinScreen = function () {
  push();
  image(this.assets.winImage, 0, 0, width, height);
  pop();
};

ChromasightGame.prototype.drawStoryScreen = function () {
  const elapsed = this.storyElapsedMs || 0;

  push();
  noStroke();
  fill(0);
  rect(0, 0, width, height);

  this.drawStoryEnvironment(elapsed);
  this.drawStoryRobot(elapsed);

  if (elapsed >= INTRO_CONFIG.memoryStartMs && elapsed < INTRO_CONFIG.memoryEndMs) {
    this.drawStoryMemoryGlitch(elapsed);
  }

  if (elapsed >= INTRO_CONFIG.systemStartMs) {
    this.drawStorySystemPopup(elapsed);
  } else {
    const beat = this.getActiveStoryBeat();
    if (beat) this.drawStoryBeat(beat, elapsed);
  }

  if (!this.storyComplete) {
    this.drawStorySkipButton();
  } else {
    this.drawMenuButton(this.storyPlayButton, "Continue");
    this.drawMenuButton(this.storySkipButton, "Skip");
  }

  this.drawStoryScanlines();
  pop();
};

ChromasightGame.prototype.drawStoryEnvironment = function (elapsed) {
  if (!this.assets.storyImage || elapsed < INTRO_CONFIG.revealStartMs) return;

  const reveal = constrain(
    map(elapsed, INTRO_CONFIG.revealStartMs, INTRO_CONFIG.revealEndMs, 0, 1),
    0,
    1
  );
  const slowPan = constrain(map(elapsed, INTRO_CONFIG.revealStartMs, INTRO_CONFIG.durationMs, 0, 1), 0, 1);
  const zoom = 1.045 - slowPan * 0.025;
  const drawW = width * zoom;
  const drawH = height * zoom;
  const drawX = -(drawW - width) * (0.30 + slowPan * 0.18);
  const drawY = -(drawH - height) * 0.55;

  push();
  tint(255, 255 * reveal);
  image(this.assets.storyImage, drawX, drawY, drawW, drawH);
  noTint();

  // The facility is visible, but PRISM's damaged perception keeps it dim.
  noStroke();
  fill(0, 185 - reveal * 70);
  rect(0, 0, width, height);

  // A narrow cold light wakes up around PRISM before the rest of the room.
  const lightStrength = constrain(map(elapsed, INTRO_CONFIG.revealStartMs, INTRO_CONFIG.revealEndMs, 0, 1), 0, 1);
  for (let ring = 8; ring >= 1; ring -= 1) {
    const ringSize = ring * 42 + lightStrength * 85;
    const alpha = 4 + (9 - ring) * 2;
    fill(120, 225, 235, alpha * lightStrength);
    ellipse(220, 446, ringSize * 1.35, ringSize);
  }
  pop();
};

ChromasightGame.prototype.drawStoryRobot = function (elapsed) {
  if (!this.assets.playerImage || !this.assets.playerMeta) return;
  if (elapsed < 3600) return;

  const robot = INTRO_CONFIG.robot;
  let tileId = 0;
  let yOffset = 0;
  let alpha = 255;

  if (elapsed < INTRO_CONFIG.revealStartMs) {
    // Only the monitor/eye is perceptible in the darkness.
    alpha = 0;
  } else if (elapsed < INTRO_CONFIG.standStartMs) {
    tileId = GAME_CONFIG.playerIdleTileIds[Math.floor(elapsed / 420) % GAME_CONFIG.playerIdleTileIds.length];
    yOffset = 12;
  } else if (elapsed < INTRO_CONFIG.standEndMs) {
    const standT = constrain(map(elapsed, INTRO_CONFIG.standStartMs, INTRO_CONFIG.standEndMs, 0, 1), 0, 1);
    tileId = GAME_CONFIG.playerWalkingTileIds[Math.floor(elapsed / 170) % GAME_CONFIG.playerWalkingTileIds.length];
    yOffset = lerp(18, 0, easeOutCubic(standT));
  } else {
    tileId = GAME_CONFIG.playerIdleTileIds[Math.floor(elapsed / 650) % GAME_CONFIG.playerIdleTileIds.length];
  }

  if (alpha > 0) {
    const frame = frameFromTileId(tileId, this.assets.playerMeta);
    push();
    tint(205, 215, 220, alpha);
    image(
      this.assets.playerImage,
      robot.x,
      robot.y + yOffset,
      robot.w,
      robot.h,
      frame.sx,
      frame.sy,
      frame.sw,
      frame.sh
    );
    noTint();
    pop();
  }

  // Screen boot glow: visible before the body can be seen.
  if (elapsed >= 3600 && elapsed < 15400) {
    const pulse = 0.55 + Math.sin(elapsed * 0.012) * 0.25;
    push();
    noStroke();
    fill(120, 255, 228, 160 * pulse);
    rect(robot.x + 27, robot.y + yOffset + 21, 11, 5, 1);
    fill(160, 255, 240, 42 * pulse);
    rect(robot.x + 22, robot.y + yOffset + 17, 21, 13, 2);
    pop();
  }
};

ChromasightGame.prototype.drawStoryBeat = function (beat, elapsed) {
  const localElapsed = elapsed - beat.start;

  if (beat.kind === "sound" || beat.kind === "system") {
    const flicker = beat.kind === "system" && Math.floor(elapsed / 110) % 2 === 0;
    push();
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    textSize(beat.kind === "system" ? 22 : 20);
    fill(flicker ? 140 : 220, flicker ? 255 : 230, flicker ? 225 : 230);
    text(typewriterText(beat.text, localElapsed, 30), width / 2, height * 0.48);
    if (beat.note) {
      textStyle(NORMAL);
      textSize(13);
      fill(175, 190, 198);
      text(`(${beat.note})`, width / 2, height * 0.48 + 29);
    }
    pop();
    return;
  }

  const box = INTRO_CONFIG.dialogueBox;
  push();
  noStroke();
  fill(5, 9, 13, 225);
  rect(box.x + 4, box.y + 5, box.w, box.h, 3);
  stroke(80, 103, 112);
  strokeWeight(2);
  fill(15, 22, 28, 242);
  rect(box.x, box.y, box.w, box.h, 3);
  stroke(140, 244, 226, 95);
  strokeWeight(1);
  line(box.x + 14, box.y + 31, box.x + box.w - 14, box.y + 31);

  noStroke();
  fill(132, 245, 226);
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(13);
  text("PRISM-256", box.x + 18, box.y + 11);

  fill(235);
  textStyle(NORMAL);
  textSize(19);
  text(
    typewriterText(beat.text, localElapsed, 34),
    box.x + 18,
    box.y + 46,
    box.w - 36,
    box.h - 52
  );
  pop();
};

ChromasightGame.prototype.drawStoryMemoryGlitch = function (elapsed) {
  const intensity = 1 - Math.abs(
    map(elapsed, INTRO_CONFIG.memoryStartMs, INTRO_CONFIG.memoryEndMs, -1, 1)
  );

  push();
  noStroke();
  for (let i = 0; i < 9; i += 1) {
    const bandY = (i * 67 + Math.floor(elapsed / 34) * 19) % height;
    const bandH = 2 + (i % 3) * 3;
    const jitter = ((i * 31 + Math.floor(elapsed / 45)) % 13) - 6;
    fill(i % 2 === 0 ? 120 : 235, 245, 240, 20 + intensity * 28);
    rect(jitter, bandY, width, bandH);
  }

  if (Math.floor(elapsed / 95) % 5 === 0) {
    fill(225, 245, 240, 26 + intensity * 38);
    rect(0, 0, width, height);
  }

  fill(130, 250, 224, 180);
  textAlign(LEFT, TOP);
  textSize(11);
  text("MEMORY BUFFER // PARTIAL SIGNAL", 20, 18);
  pop();
};

ChromasightGame.prototype.drawStorySystemPopup = function (elapsed) {
  const panelW = 670;
  const panelH = 254;
  const panelX = (width - panelW) / 2;
  const panelY = (height - panelH) / 2 - 8;
  const appear = constrain(map(elapsed, INTRO_CONFIG.systemStartMs, INTRO_CONFIG.systemStartMs + 500, 0, 1), 0, 1);

  push();
  translate(0, (1 - easeOutCubic(appear)) * 14);
  noStroke();
  fill(0, 0, 0, 160 * appear);
  rect(panelX + 8, panelY + 9, panelW, panelH, 4);
  stroke(97, 128, 136, 220 * appear);
  strokeWeight(2);
  fill(9, 18, 22, 244 * appear);
  rect(panelX, panelY, panelW, panelH, 4);
  stroke(125, 255, 225, 110 * appear);
  line(panelX + 18, panelY + 49, panelX + panelW - 18, panelY + 49);

  noStroke();
  fill(135, 255, 226, 255 * appear);
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(15);
  text("PRISM-256 // RECOVERY DIRECTIVE", panelX + 22, panelY + 17);

  let rowY = panelY + 72;
  for (const lineData of INTRO_CONFIG.systemLines) {
    if (elapsed < lineData.at) continue;
    const localElapsed = elapsed - lineData.at;
    fill(118, 190, 183, 255 * appear);
    textStyle(BOLD);
    textSize(12);
    text(`${lineData.label}:`, panelX + 24, rowY);
    fill(235, 242, 240, 255 * appear);
    textStyle(NORMAL);
    textSize(16);
    text(typewriterText(lineData.text, localElapsed, 26), panelX + 156, rowY - 2);
    rowY += 41;
  }

  if (this.storyComplete) {
    const pulse = 160 + Math.sin(elapsed * 0.007) * 75;
    fill(130, 255, 225, pulse);
    textStyle(NORMAL);
    textSize(12);
    textAlign(CENTER, TOP);
    text("DIRECTIVE LOADED // CONTINUE TO FACILITY", width / 2, panelY + panelH - 27);
  }
  pop();
};

ChromasightGame.prototype.drawStorySkipButton = function () {
  const button = this.storySkipButton;
  push();
  noStroke();
  fill(7, 12, 16, 170);
  rect(button.x, button.y, button.w, button.h, 6);
  stroke(126, 154, 160, 120);
  noFill();
  rect(button.x + 0.5, button.y + 0.5, button.w - 1, button.h - 1, 6);
  noStroke();
  fill(200, 214, 216);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  textSize(14);
  text("Skip", button.x + button.w / 2, button.y + button.h / 2);
  pop();
};

ChromasightGame.prototype.drawStoryScanlines = function () {
  push();
  noStroke();
  fill(0, 0, 0, 24);
  for (let y = 0; y < height; y += 4) rect(0, y, width, 1);
  pop();
};

function typewriterText(text, elapsedMs, millisecondsPerCharacter = 32) {
  const count = Math.max(0, Math.floor(elapsedMs / millisecondsPerCharacter));
  return String(text).slice(0, count);
}

function easeOutCubic(value) {
  const t = constrain(value, 0, 1);
  return 1 - Math.pow(1 - t, 3);
}

ChromasightGame.prototype.drawWorld = function () {
  push();
  translate(-Math.floor(this.cameraX), -Math.floor(this.cameraY));
  this.drawTileLayer(this.decor);
  this.drawModeBlocks();
  this.drawTileLayer(this.terrain);
  this.drawWorldObjects(this.worldObjects);
  this.drawBoxes();
  this.drawItems();
  this.drawWorldObjects(this.spikeObjects);
  this.drawPlayer();
  if (this.showCollisionDebug) this.drawCollisionDebug();
  pop();
};

ChromasightGame.prototype.drawBoxes = function () {
  for (const box of this.boxes) {
    this.drawBoxObject(box);
  }
};

ChromasightGame.prototype.drawWorldObjects = function (objects = this.objects) {
  for (const object of objects) {
    if (object.type === ObjectTypes.box) {
      this.drawBoxObject(object);
      continue;
    }

    if (object.type === ObjectTypes.hazardBlock) {
      this.drawHazardObject(object);
      continue;
    }

    if (object.type === ObjectTypes.portal) continue;
  }
};

ChromasightGame.prototype.drawBoxObject = function (box) {
  drawTileGid(GAME_CONFIG.boxGrid.tileGid, box.x, box.y, box.w, box.h, this.assets.tilesetImage, this.assets.tilesetMeta, this.firstGid);
};

ChromasightGame.prototype.drawHazardObject = function (hazard) {
  const faceUp = hazard.props.FaceUp === true;

  for (let y = hazard.y; y < hazard.y + hazard.h; y += this.tileHeight) {
    for (let x = hazard.x; x < hazard.x + hazard.w; x += this.tileWidth) {
      const tileW = Math.min(this.tileWidth, hazard.x + hazard.w - x);
      const tileH = Math.min(this.tileHeight, hazard.y + hazard.h - y);
      if (faceUp) {
        drawTileGid(GAME_CONFIG.hazardGrid.tileGid, x, y, tileW, tileH, this.assets.tilesetImage, this.assets.tilesetMeta, this.firstGid);
      } else {
        drawVerticallyFlippedTileGid(GAME_CONFIG.hazardGrid.tileGid, x, y, tileW, tileH, this.assets.tilesetImage, this.assets.tilesetMeta, this.firstGid);
      }
    }
  }
};

ChromasightGame.prototype.drawTileLayer = function (tiles) {
  for (const tile of tiles) {
    drawTileGid(tile.gid, tile.x, tile.y, this.tileWidth, this.tileHeight, this.assets.tilesetImage, this.assets.tilesetMeta, this.firstGid);
  }
};

ChromasightGame.prototype.drawImageLayers = function (layers) {
  for (const layer of layers) {
    if (layer.image === GAME_CONFIG.tiledStartImageLayerPath) {
      image(this.assets.startImage, layer.x, layer.y, layer.imagewidth, layer.imageheight);
    }
  }
};

ChromasightGame.prototype.drawMenuButton = function (button, label) {
  if (!button) return;

  const hovered = typeof mouseX === "number" && typeof mouseY === "number" && pointInRect(mouseX, mouseY, button);
  const primary = label === "Start";

  push();
  noStroke();
  fill(12, 16, 24, 120);
  rect(button.x + 5, button.y + 6, button.w, button.h, 12);
  stroke(25, 28, 36);
  strokeWeight(3);
  if (primary) {
    fill(hovered ? 255 : 246, hovered ? 220 : 213, hovered ? 108 : 74, hovered ? 255 : 235);
  } else {
    fill(hovered ? 241 : 222, hovered ? 241 : 225, hovered ? 241 : 230, hovered ? 255 : 235);
  }
  rect(button.x, button.y, button.w, button.h, 12);
  noStroke();
  fill(25, 28, 36);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  textSize(hovered ? 27 : 25);
  text(label, button.x + button.w / 2, button.y + button.h / 2 + 1);
  pop();
};

ChromasightGame.prototype.drawModeBlocks = function () {
  for (const block of this.modeBlocks) {
    const key = this.modeRenderKey(block);
    const gid = GAME_CONFIG.renderTileMap[key];
    if (!gid) continue;

    for (let y = block.y; y < block.y + block.h; y += this.tileHeight) {
      for (let x = block.x; x < block.x + block.w; x += this.tileWidth) {
        drawTileGid(gid, x, y, this.tileWidth, this.tileHeight, this.assets.tilesetImage, this.assets.tilesetMeta, this.firstGid);
      }
    }
  }
};

ChromasightGame.prototype.drawItems = function () {
  for (const item of this.collectible) {
    if (item.collected) continue;

    if (item.type === ObjectTypes.key) {
      drawTileGid(keyTileGidFor(item), item.x, item.y, item.w, item.h, this.assets.tilesetImage, this.assets.tilesetMeta, this.firstGid);
      continue;
    }

    if (item.type === ObjectTypes.book) {
      drawTileGid(GAME_CONFIG.bookTileGid, item.x, item.y, item.w, item.h, this.assets.tilesetImage, this.assets.tilesetMeta, this.firstGid);
      continue;
    }

    fill(235, 224, 168);
    stroke(33, 38, 46);
    strokeWeight(2);
    rect(item.x, item.y, item.w, item.h, 2);
  }
};

function keyTileGidFor(item) {
  if (item.props.blueAbilityunlock) return GAME_CONFIG.keyTileGids.blue;
  return GAME_CONFIG.keyTileGids.red;
}

ChromasightGame.prototype.drawTextBoxes = function () {
  const activeTextDisplays = this.getActiveTextDisplays();
  for (const textBox of activeTextDisplays) {
    this.drawTextBox(textBox);
  }
};

ChromasightGame.prototype.drawTextBox = function (textBox) {
  const textData = textBox.text || {};
  const message = textData.text || "";
  if (!message) return;

  const isHintText = typeof HINT_TEXTS !== "undefined" && Object.prototype.hasOwnProperty.call(HINT_TEXTS, textBox.name);
  if (!isHintText) {
    push();
    textAlign(textAlignFromTiled(textData.halign), TOP);
    textSize(Number(textData.pixelsize || 12));
    stroke(40, 45, 56);
    strokeWeight(3);
    fill(255);
    text(message, textBox.x, textBox.y, textBox.w, textBox.h);
    pop();
    return;
  }

  push();
  const boxW = Math.min(680, width - 48);
  const boxH = Math.max(58, Math.min(116, textHeightForMessage(message, boxW - 32, Number(textData.pixelsize || 16)) + 28));
  const boxX = (width - boxW) / 2;
  const boxY = 70;

  noStroke();
  fill(8, 12, 18, 220);
  rect(boxX, boxY, boxW, boxH, 8);
  stroke(255, 255, 255, 55);
  strokeWeight(1);
  noFill();
  rect(boxX + 0.5, boxY + 0.5, boxW - 1, boxH - 1, 8);

  textAlign(textAlignFromTiled(textData.halign), TOP);
  textSize(Number(textData.pixelsize || 12));
  noStroke();
  fill(255);
  text(message, boxX + 16, boxY + 14, boxW - 32, boxH - 24);
  pop();
};

function textHeightForMessage(message, maxWidth, size) {
  push();
  textSize(size);
  const words = String(message).split(/\s+/);
  let line = "";
  let lines = 1;

  for (const word of words) {
    const testLine = line ? `${line} ${word}` : word;
    if (line && textWidth(testLine) > maxWidth) {
      lines += 1;
      line = word;
    } else {
      line = testLine;
    }
  }

  pop();
  return lines * size * 1.3;
}

ChromasightGame.prototype.drawPlayer = function () {
  const p = this.player;
  const frame = playerFrameFor(p, this.assets.playerMeta);
  const spriteBox = GAME_CONFIG.playerSpriteBox;
  const drawScale = p.h / spriteBox.h;
  const drawWidth = frame.sw * drawScale;
  const drawHeight = frame.sh * drawScale;
  const spriteCenterX = (spriteBox.x + spriteBox.w / 2) * drawScale;
  const spriteBottomY = (spriteBox.y + spriteBox.h) * drawScale;
  const playerCenterX = p.x + p.w / 2;
  const drawX = p.facing < 0
    ? playerCenterX - drawWidth + spriteCenterX
    : playerCenterX - spriteCenterX;
  const drawY = p.y + p.h - spriteBottomY;

  push();
  translate(drawX + drawWidth / 2, drawY);
  scale(p.facing, 1);
  imageMode(CORNER);
  image(
    this.assets.playerImage,
    -drawWidth / 2,
    0,
    drawWidth,
    drawHeight,
    frame.sx,
    frame.sy,
    frame.sw,
    frame.sh
  );
  pop();
};

ChromasightGame.prototype.drawCollisionDebug = function () {
  push();
  noFill();
  strokeWeight(2);

  stroke(86, 170, 255, 180);
  for (const rect of this.terrain) {
    this.drawDebugRect(rect.x, rect.y, this.tileWidth, this.tileHeight);
  }

  stroke(255, 170, 40, 220);
  for (const block of this.modeBlocks) {
    if (this.modeCollision(block)) this.drawDebugRect(block.x, block.y, block.w, block.h);
  }

  stroke(178, 110, 255, 220);
  for (const ladder of this.ladders) {
    this.drawDebugRect(ladder.x, ladder.y, ladder.w, ladder.h);
  }

  stroke(80, 255, 225, 220);
  for (const portal of this.portals) {
    this.drawDebugRect(portal.x, portal.y, portal.w, portal.h);
  }

  stroke(255, 230, 80, 220);
  for (const item of this.collectible) {
    if (!item.collected) this.drawDebugRect(item.x, item.y, item.w, item.h);
  }

  stroke(255, 110, 210, 220);
  for (const textBox of this.textBoxes) {
    this.drawDebugRect(textBox.x, textBox.y, textBox.w, textBox.h);
  }

  stroke(255, 60, 90, 255);
  this.drawDebugRect(this.player.x, this.player.y, this.player.w, this.player.h);
  pop();
};

ChromasightGame.prototype.drawDebugRect = function (x, y, w, h) {
  rect(Math.floor(x) + 0.5, Math.floor(y) + 0.5, Math.floor(w), Math.floor(h));
};

ChromasightGame.prototype.drawUi = function () {
  noStroke();
  fill(8, 12, 18, 190);
  rect(16, 14, 250, 36, 6);

  fill(240, 245, 250);
  textAlign(LEFT, TOP);
  textSize(15);
  text(`Mode: ${MODE_LABELS[this.mode]}`, 30, 26);

  if (this.messageTimer > 0) {
    fill(8, 12, 18, 205);
    rect(16, height - 54, Math.min(620, textWidth(this.message) + 32), 38, 6);
    fill(255);
    text(this.message, 30, height - 44);
  }

  if (this.getActivePortal()) {
    fill(8, 12, 18, 205);
    rect(width - 220, height - 54, 204, 38, 6);
    fill(255);
    textAlign(LEFT, TOP);
    text("Press F to enter portal", width - 204, height - 44);
  }

  if (this.showCollisionDebug) this.drawDebugShortcutMenu();
  this.drawTextBoxes();
};

ChromasightGame.prototype.drawDebugShortcutMenu = function () {
  const lines = [
    "1 - level_1",
    "2 - level_2",
    "3 - level_3",
    "4 - story",
    "5 - ending"
  ];
  const boxW = 132;
  const boxH = 104;
  const boxX = width - boxW - 16;
  const boxY = 14;

  push();
  noStroke();
  fill(8, 12, 18, 210);
  rect(boxX, boxY, boxW, boxH, 6);
  fill(240, 245, 250);
  textAlign(LEFT, TOP);
  textSize(13);
  text(lines.join("\n"), boxX + 12, boxY + 10);
  pop();
};

/**
 * Draws a single gid from a Tiled tileset image.
 *
 * @param {number} gid Global tile id from the TMJ file.
 * @param {number} dx Destination x.
 * @param {number} dy Destination y.
 * @param {number} dw Destination width.
 * @param {number} dh Destination height.
 * @param {p5.Image} sheet Tileset image.
 * @param {{tilewidth: number, tileheight: number, columns: number}} meta Parsed TSX grid data.
 * @param {number} firstGid First gid declared by the TMJ tileset reference.
 */
function drawTileGid(gid, dx, dy, dw, dh, sheet, meta, firstGid) {
  if (!sheet || !meta || !gid) return;

  const localId = gid - firstGid;
  const sx = (localId % meta.columns) * meta.tilewidth;
  const sy = Math.floor(localId / meta.columns) * meta.tileheight;
  image(sheet, dx, dy, dw, dh, sx, sy, meta.tilewidth, meta.tileheight);
}

function drawVerticallyFlippedTileGid(gid, dx, dy, dw, dh, sheet, meta, firstGid) {
  push();
  translate(dx + dw / 2, dy + dh / 2);
  scale(1, -1);
  drawTileGid(gid, -dw / 2, -dh / 2, dw, dh, sheet, meta, firstGid);
  pop();
}

/**
 * Selects the current robot frame according to movement state.
 *
 * @param {object} player Player physics state.
 * @param {object} meta Parsed robot TSX metadata.
 * @returns {{sx: number, sy: number, sw: number, sh: number}}
 */
function playerFrameFor(player, meta) {
  let tileId = 0;

  if (player.climbing) {
    tileId = 0;
  } else if (!player.grounded) {
    tileId = player.vy < 0 ? 12 : 13;
  } else if (Math.abs(player.vx) > 0.1) {
    const walkIds = GAME_CONFIG.playerWalkingTileIds;
    tileId = walkIds[Math.floor(frameCount / 8) % walkIds.length];
  } else {
    const idleIds = GAME_CONFIG.playerIdleTileIds;
    tileId = idleIds[Math.floor(frameCount / 10) % idleIds.length];
  }

  return frameFromTileId(tileId, meta);
}

function frameFromTileId(tileId, meta) {
  const safeTileId = clamp(Math.floor(tileId), 0, Math.max(0, meta.tilecount - 1));
  return {
    sx: (safeTileId % meta.columns) * meta.tilewidth,
    sy: Math.floor(safeTileId / meta.columns) * meta.tileheight,
    sw: meta.tilewidth,
    sh: meta.tileheight
  };
}

function textAlignFromTiled(value) {
  if (value === "center") return CENTER;
  if (value === "right") return RIGHT;
  return LEFT;
}
