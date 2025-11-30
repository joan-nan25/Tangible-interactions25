let trees = [];
let tornadoes = [];
let thunderSound;
let scenarioType;
let speedSlider;

function preload() {
  // Support mp3 or wav
  soundFormats('mp3', 'wav');
  thunderSound = loadSound('assets/thunder.mp3');
}

function setup() {
  createCanvas(800, 600);
  angleMode(RADIANS);
  textFont('Georgia');
  textAlign(CENTER);

  // Random scenario each session
  scenarioType = random(["good", "bad"]);

  // Center the canvas in the webpage
  const c = document.querySelector("canvas");
  if (c) {
    c.style.display = "block";
    c.style.margin = "40px auto";
  }

  // Four trees across the island
  const groundY = height * 0.75; // trunk base point (still works with raised hill)
  trees = [
    new Tree(width / 2 - 210, groundY, 0),
    new Tree(width / 2 - 70,  groundY, 20),
    new Tree(width / 2 + 70,  groundY, 40),
    new Tree(width / 2 + 210, groundY, 60),
  ];

  // Tornado speed slider (positioned relative to window so it stays visible)
  speedSlider = createSlider(0.5, 5, 2, 0.1); // min, max, default, step
  positionSlider();

  // Initial tornado
  tornadoes = [ new Tornado(width + 100, thunderSound, scenarioType) ];
}

function draw() {
  drawEnvironment();

  // Trees
  for (let t of trees) {
    t.update();
    t.display();
  }

  // Tornadoes with slider-controlled speed
  const tornadoSpeed = speedSlider.value();
  for (let tn of tornadoes) {
    tn.update(trees, tornadoSpeed);
    tn.display(tornadoSpeed);
  }

  // Remove tornado once fully faded
  tornadoes = tornadoes.filter(tn => tn.alpha > 0);

  // UI text
  fill(255);
  noStroke();
  textSize(16);
  text(
    `Scenario: ${scenarioType === "good" ? "🌱 Growth" : "💀 Destruction"}`,
    width / 2,
    40
  );
  textSize(13);
  text("Press R to reset  |  Adjust Tornado Speed", width / 2, 60);
}

function mousePressed() {
  // Unlock audio context
  if (getAudioContext().state !== "running") getAudioContext().resume();
  userStartAudio();
}

function touchStarted() {
  if (getAudioContext().state !== "running") getAudioContext().resume();
  userStartAudio();
}

function keyPressed() {
  if (key === 'R' || key === 'r') {
    // New random scenario on reset
    scenarioType = random(["good", "bad"]);
    const groundY = height * 0.75;

    trees = [
      new Tree(width / 2 - 210, groundY, 0),
      new Tree(width / 2 - 70,  groundY, 20),
      new Tree(width / 2 + 70,  groundY, 40),
      new Tree(width / 2 + 210, groundY, 60),
    ];

    tornadoes = [ new Tornado(width + 100, thunderSound, scenarioType) ];
    stormColorFactor = 0;
  }
}

function positionSlider() {
  const sliderWidth = 150;
  const x = (windowWidth - sliderWidth) / 2; // center in window (canvas is centered too)
  const y = 80; // just below the text
  speedSlider.position(x, y);
  speedSlider.style('width', sliderWidth + 'px');
}

function windowResized() {
  // Keep slider in frame when window size changes
  positionSlider();
}
