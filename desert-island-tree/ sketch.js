let tree;
let storms = [];
let stormFreqSlider;
let thunderSound;

function preload() {
  thunderSound = loadSound("assets/thunder.mp3");
}

function setup() {
  createCanvas(800, 600);
  tree = new Tree(width / 2, height * 0.75);

  stormFreqSlider = createSlider(0, 0.02, 0.005, 0.001);
  stormFreqSlider.position(20, 20);
  stormFreqSlider.style('width', '150px');
}

function draw() {
  drawEnvironment(tree.health);

  tree.update();
  tree.display();

  for (let s of storms) {
    s.update(tree);
    s.display();
  }

  if (random(1) < stormFreqSlider.value()) {
    storms.push(new Storm(width + 100, thunderSound));
  }

  storms = storms.filter(s => s.pos.x > -200);

  // UI
  fill(255);
  textSize(14);
  text("Storm Frequency", 20, 15);
}

function mousePressed() {
  storms.push(new Storm(mouseX, thunderSound));
}

function keyPressed() {
  if (key === 'W') windSpeed += 0.1;
  if (key === 'S') windSpeed = max(0.1, windSpeed - 0.1);
  if (key === 'R') {
    tree = new Tree(width / 2, height * 0.75);
    storms = [];
  }
}
