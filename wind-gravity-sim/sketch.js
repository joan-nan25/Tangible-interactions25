let skydiver;
let gravity;
let started = false;
let materialType = "silk";
let windSlider;
let windVariation = 0; // for subtle natural oscillation

// Material properties (drag = air resistance, weight = mass)
let materials = {
  silk: { drag: 0.08, weight: 1 },
  nylon: { drag: 0.05, weight: 1.2 },
  plastic: { drag: 0.03, weight: 1.5 },
  metal: { drag: 0.0, weight: 3 },
};

function setup() {
  let canvas = createCanvas(800, 800);
  canvas.parent("sketch-holder");

  gravity = createVector(0, 0.2);

  // Connect UI
  select("#start-btn").mousePressed(startSim);
  select("#reset-btn").mousePressed(resetSim);
  select("#material").changed(() => {
    materialType = select("#material").value();
  });
  windSlider = select("#windSpeed");

  resetSim();
}

function draw() {
  background(135, 206, 235);

  // Ground
  noStroke();
  fill(90, 180, 90);
  rect(0, height - 50, width, 50);

  // Get wind from slider + a subtle oscillation to simulate gusts
  let baseWind = parseFloat(windSlider.value());
  windVariation = sin(frameCount * 0.01) * 0.2;
  let totalWind = baseWind + windVariation;
  let wind = createVector(totalWind, 0);

  if (started) {
    // Apply gravity
    skydiver.applyForce(p5.Vector.mult(gravity, skydiver.weight));

    // Apply air drag
    let drag = skydiver.velocity.copy();
    drag.mult(-1);
    drag.normalize();
    let c = materials[materialType].drag;
    let speedSq = skydiver.velocity.magSq();
    drag.mult(c * speedSq);
    skydiver.applyForce(drag);

    // Apply wind
    skydiver.applyForce(wind);

    // Update motion
    skydiver.update();
    skydiver.checkGround();
  }

  // Draw diver and info
  skydiver.display();

  fill(0);
  textSize(16);
  textAlign(LEFT);
  text(`Material: ${materialType}`, 20, 30);
  text(`Vertical Velocity: ${skydiver.velocity.y.toFixed(2)}`, 20, 55);
  text(`Wind Speed: ${totalWind.toFixed(2)}`, 20, 80);
}

// Skydiver class
class Skydiver {
  constructor() {
    this.pos = createVector(width / 2, 100);
    this.velocity = createVector(0, 0);
    this.acceleration = createVector(0, 0);
    this.weight = 1;
  }

  applyForce(force) {
    let f = p5.Vector.div(force, this.weight);
    this.acceleration.add(f);
  }

  update() {
    this.velocity.add(this.acceleration);
    this.pos.add(this.velocity);
    this.acceleration.mult(0);
  }

  checkGround() {
    if (this.pos.y > height - 70) {
      this.pos.y = height - 70;
      this.velocity.mult(0);
      started = false;
    }
  }

  display() {
    // Parachute
    fill(255, 200, 200);
    arc(this.pos.x, this.pos.y - 40, 100, 60, PI, TWO_PI);

    // Strings
    stroke(180);
    line(this.pos.x - 35, this.pos.y - 40, this.pos.x - 10, this.pos.y);
    line(this.pos.x + 35, this.pos.y - 40, this.pos.x + 10, this.pos.y);

    // Diver body
    noStroke();
    fill(255, 100, 100);
    ellipse(this.pos.x, this.pos.y, 22, 32);
  }
}

function startSim() {
  if (!started) {
    started = true;
    skydiver.weight = materials[materialType].weight;
  }
}

function resetSim() {
  skydiver = new Skydiver();
  started = false;
}
