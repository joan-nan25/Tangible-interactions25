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

function preload() {
  soundFormats('mp3', 'wav');
  collisionSound = loadSound('assets/collision.wav');
  crackSound     = loadSound('assets/crack.wav');
  rattleSound    = loadSound('assets/rattle.wav');
  bgImage        = loadImage('assets/space-bg.jpg');
}

function setup() {
  createCanvas(800, 600);
  angleMode(RADIANS);

  // planets
  planets.push(createVector(width * 0.3, height / 2));
  planets.push(createVector(width * 0.7, height / 2));

  // starting asteroids
  asteroids.push(makeAsteroid(0, 140, 20, 0));
  asteroids.push(makeAsteroid(1, 140, 20, 0));

  // starfield
  for (let i = 0; i < 200; i++) {
    stars.push({ x: random(width), y: random(height), size: random(1, 3), alpha: random(100, 255) });
  }
}

function draw() {
  // background + stars
  background(0);
  image(bgImage, 0, 0, width, height);
  noStroke();
  for (let s of stars) {
    fill(255, 255, 255, constrain(s.alpha + random(-30, 30), 60, 255));
    ellipse(s.x, s.y, s.size);
  }

  // planets
  for (let p of planets) drawPlanet(p.x, p.y, 110);

  // update asteroids
  for (let a of asteroids) {
    updateAsteroid(a);
    drawAsteroid(a.x, a.y, a.size, a.col, a.rotation);
  }

  // check for collisions
  checkCollisions();

  // update & draw particles
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].show();
    if (particles[i].finished()) {
      particles.splice(i, 1);
    }
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
}

/* ----------------- asteroid logic ----------------- */

function makeAsteroid(planetIndex, orbitR, size, generation) {
  let angle = random(TWO_PI);
  return {
    planetIndex,
    angle,
    speed: 0.02,
    baseOrbit: orbitR,
    orbitRadius: orbitR,
    size: size,
    col: color(139, 69, 19), // brownish asteroids
    generation,
    x: 0,
    y: 0,
    rotation: random(TWO_PI),
    rotSpeed: random(-0.02, 0.02),
    orbits: 0,
    hasCollided: false
  };
}

function updateAsteroid(a) {
  let planet = planets[a.planetIndex];
  let prevAngle = a.angle;

  // orbit direction
  if (a.planetIndex === 0) {
    a.angle -= a.speed; // CCW
  } else {
    a.angle += a.speed; // CW
  }

  // detect orbit completion
  if ((a.planetIndex === 0 && prevAngle < 0 && a.angle >= 0) ||
      (a.planetIndex === 1 && prevAngle > TWO_PI && a.angle <= TWO_PI)) {
    a.orbits++;
  }

  // threshold: gen0 = 1 orbit, children = 2
  let threshold = a.generation === 0 ? 1 : 2;

  if (a.orbits >= threshold) {
    // spiral inward smoothly
    a.orbitRadius = lerp(a.orbitRadius, 0, 0.05);
  } else {
    a.orbitRadius = a.baseOrbit;
  }

  // update position
  a.x = planet.x + cos(a.angle) * a.orbitRadius;
  a.y = planet.y + sin(a.angle) * a.orbitRadius;

  a.rotation += a.rotSpeed;
}

function checkCollisions() {
  let groupA = asteroids.filter(a => a.planetIndex === 0);
  let groupB = asteroids.filter(a => a.planetIndex === 1);

  for (let a of groupA) {
    for (let b of groupB) {
      let d = dist(a.x, a.y, b.x, b.y);
      if (d < (a.size + b.size) * 0.6) {
        handleCollision(a, b);
      }
    }
  }
}

function handleCollision(a, b) {
  if (a.hasCollided || b.hasCollided) return;

  a.hasCollided = true;
  b.hasCollided = true;

  a.orbits = 0;
  b.orbits = 0;
  a.orbitRadius = a.baseOrbit;
  b.orbitRadius = b.baseOrbit;

  // flash red
  a.col = color(255, 80, 80);
  b.col = color(255, 80, 80);

  // spawn 1 smaller asteroid
  let parent = random([a, b]);
  spawnAsteroid(parent.planetIndex, parent.generation + 1, parent.size);

  if (alienYear > 0) alienYear--;

  playCollisionSounds();

  // sparks burst
  for (let i = 0; i < 30; i++) {
    particles.push(new Particle((a.x + b.x) / 2, (a.y + b.y) / 2));
  }

  // reset flags shortly after
  setTimeout(() => {
    a.hasCollided = false;
    b.hasCollided = false;
  }, 500);
}

function spawnAsteroid(planetIndex, generation, parentSize = 20) {
  let newSize = max(5, parentSize - 3);
  asteroids.push(makeAsteroid(planetIndex, random(120, 160), newSize, generation));
}

/* ----------------- particles ----------------- */

class Particle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D().mult(random(1, 3));
    this.alpha = 255;
    this.size = random(3, 6);
    let options = [
      color(139, 69, 19, this.alpha),
      color(255, 140, 0, this.alpha)
    ];
    this.col = random(options);
  }
  update() {
    this.pos.add(this.vel);
    this.alpha -= 5;
  }
  finished() {
    return this.alpha < 0;
  }
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
  ellipse(x - r * 0.35, y - r * 0.35, r * 0.6);
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
