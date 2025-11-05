let windSpeed = 0.5;
let stormColorFactor = 0;

function drawEnvironment(treeHealth) {
  // Sky gradient that darkens during storms
  let skyTop = color(255 - 120 * stormColorFactor, 200 - 160 * stormColorFactor, 120);
  let skyBottom = color(240 - 100 * stormColorFactor, 180 - 90 * stormColorFactor, 80);
  setGradient(0, 0, width, height, skyTop, skyBottom);

  // Glow flash effect for lightning
  if (stormColorFactor > 0.5) {
    fill(255, 255, 230, 80);
    rect(0, 0, width, height);
  }

  // Draw sand hill
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

  // Add grass patches
  drawGrass();
}

function drawGrass() {
  push();
  for (let i = 0; i < 150; i++) {
    let gx = random(width);
    let gy = height * 0.73 + noise(gx * 0.01) * 20 + random(-5, 5);
    let c = color(60, 150 + random(-20, 30), 60);
    stroke(c);
    strokeWeight(2);
    line(gx, gy, gx + random(-2, 2), gy - random(10, 20));
  }
  pop();
}

// Helper for vertical gradient
function setGradient(x, y, w, h, c1, c2) {
  noFill();
  for (let i = y; i <= y + h; i++) {
    let inter = map(i, y, y + h, 0, 1);
    let c = lerpColor(c1, c2, inter);
    stroke(c);
    line(x, i, x + w, i);
  }
}
