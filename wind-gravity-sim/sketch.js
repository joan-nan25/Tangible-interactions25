let particles = [];
let gravitySlider, windSlider;

function setup() {
  let canvas = createCanvas(800, 500);
  canvas.parent("sketch-holder");

  gravitySlider = createSlider(0, 1, 0.2, 0.01);
  gravitySlider.position(20, 20);
  windSlider = createSlider(-0.5, 0.5, 0, 0.01);
  windSlider.position(20, 50);

  for (let i = 0; i < 100; i++) {
    particles.push(new Particle(random(width), random(height)));
  }
}

function draw() {
  background(220, 240, 255);
  let gravityStrength = gravitySlider.value();
  let windStrength = windSlider.value();

  fill(0);
  noStroke();
  textSize(14);
  text(`Gravity: ${gravityStrength}`, 160, 35);
  text(`Wind: ${windStrength}`, 160, 65);

  let gravity = createVector(0, gravityStrength);
  let wind = createVector(windStrength, 0);

  for (let p of particles) {
    p.applyForce(gravity);
    p.applyForce(wind);
    p.update();
    p.edges();
    p.display();
  }
}

class Particle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(random(-1, 1), random(-1, 1));
    this.acc = createVector(0, 0);
    this.size = random(5, 10);
    this.color = color(random(100, 255), random(100, 255), random(100, 255));
  }

  applyForce(force) {
    this.acc.add(force);
  }

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  edges() {
    if (this.pos.y > height) this.pos.y = 0;
    if (this.pos.x > width) this.pos.x = 0;
    if (this.pos.x < 0) this.pos.x = width;
  }

  display() {
    noStroke();
    fill(this.color);
    ellipse(this.pos.x, this.pos.y, this.size);
  }
}
