let skydiver;
let gravity;
let started = false;
let materialType = "silk";

// Material properties (drag = air resistance, weight = mass)
let materials = {
  silk: { drag: 0.08, weight: 1 },
  nylon: { drag: 0.05, weight: 1.2 },
  plastic: { drag: 0.03, weight: 1.5 },
  metal: { drag: 0.0, weight: 3 },
};

function setup() {
  let canvas = createCanvas(500, 600);
  canvas.parent("sketch-holder");

  gravity = createVector(0, 0.2);

  select("#start-btn").mousePressed(startSim);
  select("#reset-btn").mousePressed(resetSim);
  select("#material").changed(() => {
    materialType = select("#material").value();
  });

  resetSim();
}

function draw() {
  background(135, 206, 235); // Sky blue

  // Ground
  noStroke();
  fill(90, 180, 90);
  rect(0, height - 50, width, 50);

  if (started) {
    // Apply gravity
    skydiver.applyForce(p5.Vector.mult(gravity, skydiver.weight));

    // Air resistance (drag)
    let drag = skydiver.velocity.copy();
    drag.mult(-1);
    drag.normalize();
    let c = materials[materialType].drag;
    let speedSq = skydiver.velocity.magSq();
    drag.mult(c * speedSq);
    skydiver.applyForce(drag);

    // Update motion
    skydiver.update();
    skydiver.checkGround();
  }

  // Display the skydiver and data
  skydiver.display();
  fill(0);
  textSize(14);
  textAlign(LEFT);
  text(`Material: ${materialType}`, 20, 20);
  text(`Velocity: ${skydiver.velocity.y.toFixed(2)}`, 20, 40);
}

// Skydiver Class
class Skydiver {
  constructor() {
    this.pos = createVector(width / 2, 50);
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
    arc(this.pos.x, this.pos.y - 40, 80, 50, PI, TWO_PI);

    // Strings
    stroke(180);
    line(this.pos.x - 30, this.pos.y - 40, this.pos.x - 10, this.pos.y);
    line(this.pos.x + 30, this.pos.y - 40, this.pos.x + 10, this.pos.y);

    // Diver
    noStroke();
    fill(255, 100, 100);
    ellipse(this.pos.x, this.pos.y, 20, 30);
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
