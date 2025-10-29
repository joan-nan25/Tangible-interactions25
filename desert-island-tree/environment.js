let windSpeed = 0.5;
let stormColorFactor = 0; // shifts when storms happen

function drawEnvironment(treeHealth) {
  // sky gradient changes with stormColorFactor
  let skyTop = color(255 - 80 * stormColorFactor, 200 - 100 * stormColorFactor, 120);
  let skyBottom = color(240 - 60 * stormColorFactor, 180 - 50 * stormColorFactor, 80);

  setGradient(0, 0, width, height, skyTop, skyBottom);

  // draw the hill
  noStroke();
  fill(200, 180, 120);
  beginShape();
  for (let x = 0; x <= width; x += 10) {
    let y = height * 0.75 + noise(x * 0.01) * 40;
    vertex(x, y);
  }
  vertex(width, height);
  vertex(0, height);
  endShape(CLOSE);
}

// helper for gradient
function setGradient(x, y, w, h, c1, c2) {
  noFill();
  for (let i = y; i <= y + h; i++) {
    let inter = map(i, y, y + h, 0, 1);
    let c = lerpColor(c1, c2, inter);
    stroke(c);
    line(x, i, x + w, i);
  }
}
