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

  // Two trees
  trees.push(new Tree(width / 2 - 100, height * 0.75, 0));
  trees.push(new Tree(width / 2 + 100, height * 0.75, 40));

  stormFreqSlider = createSlider(0, 0.02, 0.005, 0.001);
  stormFreqSlider.position(20, 20);
  stormFreqSlider.style('width', '150px');
}

function draw() {
  drawEnvironment(1); // keep background consistent

  // Trees update and draw
  for (let t of trees) {
    t.update();
    t.display();
  }

  // Storms update and draw
  for (let s of storms) {
    s.update(trees);
    s.display();
  }

  // Spawn new storms
  if (random(1) < stormFreqSlider.value()) {
    storms.push(new Storm(width + 100, thunderSound));
  }

  // Clean up old storms
  storms = storms.filter(s => s.pos.x > -200);

  // UI
  noStroke();
  fill(255);
  textSize(14);
  text("Storm Frequency", 20, 15);
}

function mousePressed() {
  userStartAudio(); // enable sound
  storms.push(new Storm(mouseX, thunderSound));
}

function keyPressed() {
  if (key === 'R') {
    trees = [
      new Tree(width / 2 - 100, height * 0.75, 0),
      new Tree(width / 2 + 100, height * 0.75, 40),
    ];
    storms = [];
  }
}
