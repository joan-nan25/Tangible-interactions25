let trees = [];
let storms = [];
let stormFreqSlider;
let thunderSound;
let scenarioType; // "good" or "bad"

function preload() {
  soundFormats('mp3', 'wav');
  thunderSound = loadSound("assets/thunder.mp3");
}

function setup() {
  createCanvas(800, 600);

  // Random scenario for this session
  scenarioType = random(["good", "bad"]);

  // Two starting trees
  trees.push(new Tree(width / 2 - 100, height * 0.75, 0));
  trees.push(new Tree(width / 2 + 100, height * 0.75, 40));

  stormFreqSlider = createSlider(0, 0.02, 0.005, 0.001);
  stormFreqSlider.position(20, 20);
  stormFreqSlider.style('width', '150px');

  textFont('Georgia');
  textSize(16);
}

function draw() {
  drawEnvironment();

  // Update trees
  for (let t of trees) {
    t.update();
    t.display();
  }

  // Update storms
  for (let s of storms) {
    s.update(trees);
    s.display();
  }

  // Spawn one storm only if none exists
  if (storms.length === 0) {
    storms.push(new Storm(width + 100, thunderSound, scenarioType));
  }

  // Clean up old storms
  storms = storms.filter(s => s.pos.x > -200);

  // UI text
  noStroke();
  fill(255);
  text("Scenario: " + scenarioType.toUpperCase(), 20, 20);
  text("Press R to Reload (new scenario)", 20, 45);
}

function mousePressed() {
  userStartAudio(); // unlock sound
}

function keyPressed() {
  if (key === 'R') {
    // Reload to get new scenario
    location.reload();
  }
}
