let trees = [];
let tornadoes = [];
let thunderSound;
let scenarioType;
let speedSlider;
let soundHint;
let canvas;

function preload() {
  soundFormats('mp3', 'wav');
  thunderSound = loadSound('assets/thunder.mp3');
}

function setup() {
  canvas = createCanvas(800, 600);
  angleMode(RADIANS);
  textFont('Georgia');
  textAlign(CENTER);

  // Random scenario each session: global good or bad outcome
  scenarioType = random(["good", "bad"]);

  // Center canvas in the page
  if (canvas && canvas.elt) {
    canvas.elt.style.display = "block";
    canvas.elt.style.margin = "40px auto";
  }

  // Eight trees across the island
  const groundY = height * 0.75;
  trees = [];
  const treeCount = 8;
  const leftX = width * 0.15;
  const rightX = width * 0.85;
  for (let i = 0; i < treeCount; i++) {
    const x = lerp(leftX, rightX, i / (treeCount - 1));
    const colorShift = i * 10;
    trees.push(new Tree(x, groundY, colorShift));
  }

  // Tornado speed slider (will be positioned under canvas)
  speedSlider = createSlider(0.5, 5, 2, 0.1);
  speedSlider.style('z-index', '10');

  // Instruction text under the sketch for sound
  soundHint = createP("Click on the sketch for sound.");
  soundHint.style('text-align', 'center');
  soundHint.style('font-family', 'Georgia, serif');
  soundHint.style('font-size', '13px');
  soundHint.style('color', '#ffffff');
  soundHint.style('margin', '4px 0');
  soundHint.style('z-index', '10');

  positionUI();

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

  // Tornadoes with speed controlled by slider
  const tornadoSpeed = speedSlider.value();
  for (let tn of tornadoes) {
    tn.update(trees, tornadoSpeed);
    tn.display(tornadoSpeed);
  }

  // Remove tornadoes after fade-out
  tornadoes = tornadoes.filter(tn => tn.alpha > 0);

  // UI on canvas
  fill(255);
  noStroke();
  textSize(16);
  text(
    `Scenario: ${scenarioType === "good" ? "🌱 Growth" : "💀 Destruction"}`,
    width / 2,
    40
  );
  textSize(13);
  text("Press R to reset  |  Use the slider to adjust tornado speed", width / 2, 60);
}

function mousePressed() {
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
    trees = [];
    const treeCount = 8;
    const leftX = width * 0.15;
    const rightX = width * 0.85;
    for (let i = 0; i < treeCount; i++) {
      const x = lerp(leftX, rightX, i / (treeCount - 1));
      const colorShift = i * 10;
      trees.push(new Tree(x, groundY, colorShift));
    }

    tornadoes = [ new Tornado(width + 100, thunderSound, scenarioType) ];
    stormColorFactor = 0;
  }
}

function positionUI() {
  if (!canvas || !canvas.elt) return;
  const rect = canvas.elt.getBoundingClientRect();
  const sliderWidth = 200;

  // Position hint directly under the canvas
  if (soundHint) {
    soundHint.position(rect.left, rect.bottom + 5);
    soundHint.style('width', rect.width + 'px');
  }

  // Position slider centered under the hint
  if (speedSlider) {
    const sx = rect.left + (rect.width - sliderWidth) / 2;
    const sy = rect.bottom + 35;
    speedSlider.position(sx, sy);
    speedSlider.style('width', sliderWidth + 'px');
  }
}

function windowResized() {
  // Keep UI aligned with canvas on resize
  positionUI();
}
