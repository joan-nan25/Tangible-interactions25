let trees = [];
let tornadoes = [];
let thunderSound;
let scenarioType;
let speedSlider;

function preload() {
  soundFormats('mp3', 'wav');
  thunderSound = loadSound("assets/thunder.mp3");
}

function setup() {
  createCanvas(800, 600);
  angleMode(RADIANS);
  textFont('Georgia');
  textAlign(CENTER);

  // Random scenario each session
  scenarioType = random(["good", "bad"]);

  // Center canvas in page
  let canvas = document.querySelector("canvas");
  if (canvas) {
    canvas.style.display = "block";
    canvas.style.margin = "auto";
  }

  // Two trees
  trees.push(new Tree(width / 2 - 120, height * 0.75, 0));
  trees.push(new Tree(width / 2 + 120, height * 0.75, 40));

  // Tornado speed slider
  speedSlider = createSlider(0.5, 5, 2, 0.1); // min, max, default, step
  speedSlider.position(20, 20);
  speedSlider.style('width', '150px');

  // Spawn initial tornado
  tornadoes.push(new Tornado(width + 100, thunderSound, scenarioType));
}

function draw() {
  drawEnvironment();

  // Update trees
  for (let t of trees) {
    t.update();
    t.display();
  }

  // Update tornadoes with slider speed
  let tornadoSpeed = speedSlider.value();
  for (let tn of tornadoes) {
    tn.update(trees, tornadoSpeed);
    tn.display();
  }

  // Remove old ones
  tornadoes = tornadoes.filter(tn => tn.pos.x > -200);

  // UI text
  fill(255);
  noStroke();
  textSize(16);
  text(`Scenario: ${scenarioType === "good" ? "🌱 Growth" : "💀 Destruction"}`, width / 2, 40);
  textSize(13);
  text("Press R to reset  |  Adjust Tornado Speed below", width / 2, 60);
  textSize(12);
  text("Tornado Speed", 95, 55);
}

function mousePressed() {
  if (getAudioContext().state !== "running") {
    getAudioContext().resume();
  }
  userStartAudio();
}

function keyPressed() {
  if (key === 'R' || key === 'r') {
    // Reset environment and scenario
    scenarioType = random(["good", "bad"]);
    trees = [
      new Tree(width / 2 - 120, height * 0.75, 0),
      new Tree(width / 2 + 120, height * 0.75, 40)
    ];
    tornadoes = [];
    tornadoes.push(new Tornado(width + 100, thunderSound, scenarioType));
    stormColorFactor = 0;
  }
}
