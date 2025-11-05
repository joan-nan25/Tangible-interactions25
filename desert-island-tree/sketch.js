let trees = [];
let tornadoes = [];
let thunderSound;
let scenarioType;

function preload() {
  soundFormats('mp3', 'wav');
  thunderSound = loadSound("assets/thunder.mp3");
}

function setup() {
  createCanvas(800, 600);
  angleMode(RADIANS);
  textFont('Georgia');
  textAlign(CENTER);

  // Random scenario for this session
  scenarioType = random(["good", "bad"]);

  // Center canvas if inside a page
  let canvas = document.querySelector("canvas");
  if (canvas) {
    canvas.style.display = "block";
    canvas.style.margin = "auto";
  }

  // Two trees
  trees.push(new Tree(width / 2 - 120, height * 0.75, 0));
  trees.push(new Tree(width / 2 + 120, height * 0.75, 40));

  // One tornado per session
  tornadoes.push(new Tornado(width + 100, thunderSound, scenarioType));
}

function draw() {
  drawEnvironment();

  for (let t of trees) {
    t.update();
    t.display();
  }

  for (let tn of tornadoes) {
    tn.update(trees);
    tn.display();
  }

  tornadoes = tornadoes.filter(tn => tn.pos.x > -200);

  fill(255);
  noStroke();
  textSize(18);
  text(`Scenario: ${scenarioType === "good" ? "🌱 Growth" : "💀 Destruction"}`, width / 2, 40);
  textSize(14);
  text("Press R to reload (new scenario)", width / 2, 60);
}

function mousePressed() {
  userStartAudio();
}

function keyPressed() {
  if (key === 'R') location.reload();
}
