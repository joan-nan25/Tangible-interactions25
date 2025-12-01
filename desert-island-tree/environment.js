let windSpeed = 0.5;
let stormColorFactor = 0;
let staticGrass = [];

function drawEnvironment() {
  // --- Sky ---
  let skyTop = color(255 - 120 * stormColorFactor, 200 - 160 * stormColorFactor, 120);
  let skyBottom = color(240 - 100 * stormColorFactor, 180 - 90 * stormColorFactor, 80);
  setGradient(0, 0, width, height, skyTop, skyBottom);

  // Lightning flash overlay
  if (stormColorFactor > 0.5) {
    fill(255, 255, 230, 80);
    rect(0, 0, width, height);
  }

  // --- Raised sand hill to emphasize "island" ---
  noStroke();
  fill(210, 180, 120);
  beginShape();
  for (let x = 0; x <= width; x += 10) {
    // Higher baseline and more variation for a distinct hill
    let y = height * 0.62 + noise(x * 0.01) * 65;
    vertex(x, y);
  }
  vertex(width, height);
  vertex(0, height);
  endShape(CLOSE);

  // --- Ocean water below ---
  drawWater();

  // --- Static grass on top of the island ---
  drawStaticGrass();
}

function drawWater() {
  push();
  noStroke();

  let waterTop = color(50, 120, 200);
  let waterBottom = color(20, 80, 150);

  const waterStart = height * 0.82;
  for (let y = waterStart; y < height; y++) {
    let inter = map(y, waterStart, height, 0, 1);
    let c = lerpColor(waterTop, waterBottom, inter);
    stroke(c);
    line(0, y, width, y);
  }

  // Shoreline highlight
  fill(255, 255, 255, 40);
  rect(0, height * 0.79, width, 5);

  pop();
}

function drawStaticGrass() {
  if (staticGrass.length === 0) {
    for (let i = 0; i < 260; i++) {
      staticGrass.push({
        x: random(width),
        // Grass sits slightly above hill baseline
        y: height * 0.60 + noise(i * 0.1) * 25 + random(-5, 5),
        h: random(10, 25),
        color: color(60, 150 + random(-20, 30), 60)
      });
    }
  }

  for (let g of staticGrass) {
    stroke(g.color);
    strokeWeight(2);
    line(g.x, g.y, g.x, g.y - g.h);
  }
}

function setGradient(x, y, w, h, c1, c2) {
  noFill();
  for (let i = y; i <= y + h; i++) {
    let inter = map(i, y, y + h, 0, 1);
    let c = lerpColor(c1, c2, inter);
    stroke(c);
    line(x, i, x + w, i);
  }
}
