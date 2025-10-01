let planets = [];
let asteroids = [];
let collisionSound, crackSound, rattleSound;
let bgImage;
let stars = [];
let particles = [];

// Roman numeral countdown
let alienYear = 100;
let romanNumerals = romanTable(100);

// sound state
let soundReady = false;

// cycle system
let cycleLength = 3;     // first gathering after 3 orbits
let inGathering = false; // are we currently moving to the center?

const PLANET_LEFT_X  = 0.3; 
const PLANET_RIGHT_X = 0.7;
const ORBIT_BASE_RADIUS = 140;

function preload() {
  soundFormats('mp3', 'wav');
  collisionSound = loadSound('assets/collision.wav');
  crackSound     = loadSound('assets/crack.wav');
  rattleSound    = loadSound('assets/rattle.wav');
  bgImage        = loadImage('assets/space-bg.jpg'); // rename if needed
}

function setup() {
  createCanvas(800, 600);
  angleMode(RADIANS);

  // planets
  planets.push(createVector(width * PLANET_LEFT_X, height / 2));
  planets.push(createVector(width * PLANET_RIGHT_X, height / 2));

  // starter asteroids
  asteroids.push(makeAsteroid(0, ORBIT_BASE_RADIUS, 20));
  asteroids.push(makeAsteroid(1, ORBIT_BASE_RADIUS, 20));

  // stars
  for (let i = 0; i < 200; i++) {
    stars.push({ x: random(width), y: random(height), size: random(1, 3), alpha: random(100, 255) });
  }
}

function draw() {
  background(0);
  image(bgImage, 0, 0, width, height);

  // stars
  noStroke();
  for (let s of stars) {
    fill(255, 255, 255, constrain(s.alpha + random(-30, 30), 60, 255));
    ellipse(s.x, s.y, s.size);
  }

  // planets
  for (let p of planets) drawPlanet(p.x, p.y, 110);

  // asteroids
  for (let a of asteroids) {
    updateAsteroid(a);
    drawAsteroid(a.x, a.y, a.size, a.col, a.rotation);
  }

  // gathering check
  if (inGathering && asteroids.every(ast => dist(ast.x, ast.y, width/2, height/2) < 5)) {
    performGathering();
  }

  // particles
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].show();
    if (particles[i].finished()) particles.splice(i, 1);
  }

  // Alien year display
  fill(255);
  textSize(20);
  textAlign(CENTER, TOP);
  if (alienYear >= 1) {
    text("Alien Year: " + romanNumerals[alienYear], width / 2, 20);
  } else {
    text("Alien Time has ended", width / 2, 20);
  }

  // sound note
  if (!soundReady) {
    textSize(12);
    fill(200);
    textAlign(CENTER, BOTTOM);
    text("Click anywhere to enable sound", width / 2, height - 10);
  }

  // domination end condition
  if (asteroids.length > 60) {
    noLoop();
    fill(255, 100, 100);
    textSize(28);
    textAlign(CENTER, CENTER);
    text("Asteroids have overtaken the clock", width/2, height/2);
  }
}

/* ----------------- asteroid logic ----------------- */

function makeAsteroid(planetIndex, orbitR, size) {
  const angle = random(TWO_PI);
  return {
    planetIndex,
    angle,
    speed: 0.02,
    baseOrbit: orbitR,
    orbitRadius: orbitR,
    size,
    col: color(139, 69, 19),
    x: 0, y: 0,
    rotation: random(TWO_PI),
    rotSpeed: random(-0.02, 0.02),
    orbits: 0
  };
}

function updateAsteroid(a) {
  if (!inGathering) {
    // orbit normally
    if (a.planetIndex === 0) a.angle -= a.speed;
    else a.angle += a.speed;

    // orbit completion
    if (a.angle < 0) { a.angle += TWO_PI; a.orbits++; }
    if (a.angle > TWO_PI) { a.angle -= TWO_PI; a.orbits++; }

    // check if all asteroids reached threshold
    if (asteroids.every(ast => ast.orbits >= cycleLength)) {
      inGathering = true;
    }

    // normal orbit position
    a.x = planets[a.planetIndex].x + cos(a.angle) * a.baseOrbit;
    a.y = planets[a.planetIndex].y + sin(a.angle) * a.baseOrbit;

  } else {
    // move to center
    a.x = lerp(a.x, width/2, 0.1);
    a.y = lerp(a.y, height/2, 0.1);
  }

  // spin
  a.rotation += a.rotSpeed;
  a.col = lerpColor(a.col, color(139, 69, 19), 0.05);
}

function performGathering() {
  // flash and spawn children
  for (let a of asteroids) a.col = color(255, 80, 80);

  spawnAsteroid(0, 20); // one new on left
  spawnAsteroid(1, 20); // one new on right

  if (alienYear > 0) alienYear--;

  playCollisionSounds();

  // sparks
  for (let i = 0; i < 30; i++) particles.push(new Particle(width/2, height/2));

  // reset
  asteroids.forEach(ast => ast.orbits = 0);
  cycleLength++; // next round takes longer
  inGathering = false;
}

function spawnAsteroid(planetIndex, size) {
  asteroids.push(makeAsteroid(planetIndex, ORBIT_BASE_RADIUS, size));
}

/* ----------------- particles ----------------- */

class Particle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D().mult(random(1, 3));
    this.alpha = 255;
    this.size = random(3, 6);
    this.col = random([
      color(139, 69, 19, this.alpha),
      color(255, 140, 0, this.alpha)
    ]);
  }
  update() {
    this.pos.add(this.vel);
    this.alpha -= 5;
  }
  finished() { return this.alpha < 0; }
  show() {
    noStroke();
    fill(red(this.col), green(this.col), blue(this.col), this.alpha);
    ellipse(this.pos.x, this.pos.y, this.size);
  }
}

/* ----------------- visuals ----------------- */

function drawAsteroid(x, y, r, col, rot) {
  push();
  translate(x, y);
  rotate(rot);
  fill(col);
  noStroke();
  beginShape();
  let points = 10;
  for (let i = 0; i < TWO_PI; i += TWO_PI / points) {
    let radius = r * random(0.7, 1.2);
    vertex(cos(i) * radius, sin(i) * radius);
  }
  endShape(CLOSE);
  pop();
}

function drawPlanet(x, y, r) {
  noStroke();
  for (let i = r; i > 0; i--) {
    let t = map(i, 0, r, 0, 1);
    let c = lerpColor(color(20, 40, 110), color(130, 190, 255), t);
    fill(c);
    ellipse(x, y, i * 2);
  }
  fill(255, 255, 255, 40);
  ellipse(x - r*0.35, y - r*0.35, r*0.6);
}

/* ----------------- sound ----------------- */

function playCollisionSounds() {
  collisionSound.play();
  setTimeout(() => crackSound.play(), int(random(100, 200)));
}

function mousePressed() {
  userStartAudio();
  if (!rattleSound.isPlaying()) {
    rattleSound.loop();
    soundReady = true;
  }
}

/* ----------------- Roman numerals ----------------- */

function romanTable(n) {
  const map = {M:1000,CM:900,D:500,CD:400,C:100,XC:90,L:50,XL:40,X:10,IX:9,V:5,IV:4,I:1};
  let table = {};
  for (let i = 1; i <= n; i++) {
    let num = i, str = "";
    for (let k in map) {
      while (num >= map[k]) {
        str += k;
        num -= map[k];
      }
    }
    table[i] = str;
  }
  return table;
}
