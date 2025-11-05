let trees = [];
let storms = [];
let stormFreqSlider;
let thunderSound;

function preload() {
  soundFormats('mp3', 'wav');
  thunderSound = loadSound("assets/thunder.mp3");
}

function setup() {
  createCanvas(800, 600);

  // Two trees with slight color variation
  trees.push(new Tree(width / 2 - 100, height * 0.75, 0));
  trees.push(new Tree(width / 2 + 100, height * 0.75, 40));

  stormFreqSlider = createSlider(0, 0.02, 0.005, 0.001);
  stormFreqSlider.position(20, 20);
  stormFreqSlider.style('width', '150px');

  textFont('Georgia');
}

function draw() {
  drawEnvironment(averageHealth());

  for (let t of trees) {
    t.update();
    t.display();
  }

  for (let s of storms) {
    s.update(trees);
    s.display();
  }

  if (random(1) < stormFreqSlider.value()) {
    storms.push(new Storm(width + 100, thunderSound));
  }

  storms = storms.filter(s => s.pos.x > -200);

  // UI text
  noStroke();
  fill(255);
  textSize(14);
  text("Storm Frequency", 20, 15);
  text("Average Health: " + nf(averageHealth(), 1, 2), 20, 45);
}

function mousePressed() {
  userStartAudio(); // ensures sound works in browser
  storms.push(new Storm(mouseX, thunderSound));
}

function keyPressed() {
  if (key === 'W') windSpeed += 0.1;
  if (key === 'S') windSpeed = max(0.1, windSpeed - 0.1);
  if (key === 'R') {
    trees = [
      new Tree(width / 2 - 100, height * 0.75, 0),
      new Tree(width / 2 + 100, height * 0.75, 40),
    ];
    storms = [];
  }
}

function averageHealth() {
  let total = 0;
  for (let t of trees) total += t.health;
  return total / trees.length;
}
