let windSpeed = 0.5;
let stormColorFactor = 0;
let staticGrass = [];

function drawEnvironment() {
  // --- Sky ---
  let skyTop = color(255 - 120 * stormColorFactor, 200 - 160 * stormColorFactor, 120);
  let skyBottom = color(240 - 100 * stormColorFactor, 180 - 90 * stormColorFactor, 80);
  setGradient(0, 0, width, height, skyTop, skyBottom);

  // Flash overlay during lightning
  if (stormColorFactor > 0.5) {
    fill(255, 255, 230, 80);
    rect(0, 0, width, height);
  }

  // --- Sand hill ---
  noStroke();
  fill(210, 180, 120);
  beginShape();
  for (let x = 0; x <= width; x += 10) {
    let y = height * 0.75 + noise(x * 0.01) * 40;
    vertex(x, y);
  }
  vertex(width, height);
  vertex(0, height);
  endShape(CLOSE);

  // --- Water (below the sand line) ---
  drawWater();

  // --- Static grass ---
  drawStaticGrass();
}

function drawWater() {
  push();
  noStroke();

  // Base water color
  let waterTop = color(50, 120, 200);
  let waterBottom = color(20, 80, 150);

  // small gradient to make it feel like depth
  for (let y = height * 0.82; y < height; y++) {
    let inter = map(y, height * 0.82, height, 0, 1);
    let c = lerpColor(waterTop, waterBottom, inter);
    stroke(c);
    line(0, y, width, y);
  }

  // Add a subtle highlight near the shore
  fill(255, 255, 255, 40);
  rect(0, height * 0.79, width, 5);

  pop();
}

function drawStaticGrass() {
  if (staticGrass.length === 0) {
    for (let i = 0; i < 180; i++) {
      staticGrass.push({
        x: random(width),
        y: height * 0.73 + noise(i * 0.1) * 20 + random(-5, 5),
        h: random(10, 25),
        color: color(60, 150 + random(-20, 30), 60)
      });
    }
  }

  for (let g of staticGrass) {
    stroke(g.color);
    strokeWeight(2);
    line(g.x, g.y, g.x + random(-1, 1), g.y - g.h);
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
