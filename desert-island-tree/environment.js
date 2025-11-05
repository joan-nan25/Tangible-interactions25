let windSpeed = 0.5;
let stormColorFactor = 0;

function drawEnvironment() {
  // Sky gradient that darkens during tornado
  let skyTop = color(255 - 120 * stormColorFactor, 200 - 160 * stormColorFactor, 120);
  let skyBottom = color(240 - 100 * stormColorFactor, 180 - 90 * stormColorFactor, 80);
  setGradient(0, 0, width, height, skyTop, skyBottom);

  // Light flash overlay during event
  if (stormColorFactor > 0.5) {
    fill(255, 255, 230, 80);
    rect(0, 0, width, height);
  }

  // Draw the hill (still desert sand)
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

  // Static grass — not regenerated each frame
  drawStaticGrass();
}

let staticGrass = [];

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
