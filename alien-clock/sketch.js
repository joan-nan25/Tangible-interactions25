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
  bgImage        = loadImage('assets/space-bg.jpg'); // rename file if needed
}

function setup() {
  createCanvas(800, 600);
  angleMode(RADIANS);

  // planets farther apart
  planets.push(createVector(width * 0.3, height / 2));
  planets.push(createVector(width * 0.7, height / 2));

  // one big asteroid per planet
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
    let planet = planets[a.planetIndex];
    let prevAngle = a.angle;

    // orbit direction
    if (a.planetIndex === 0) {
      a.angle -= a.speed; // counterclockwise
    } else {
      a.angle += a.speed; // clockwise
    }

    // detect orbit completion
    if ((a.planetIndex === 0 && prevAngle < 0 && a.angle >= 0) ||
        (a.planetIndex === 1 && prevAngle > TWO_PI && a.angle <= TWO_PI)) {
      a.orbits++;
    }

    // threshold: originals after 3, children after 6
    let threshold = a.generation === 0 ? 3 : 6;

    if (a.orbits >= threshold - 1) {
      // BOOST speed on final orbit
      a.speed = a.baseSpeed * 3;
    } else {
      a.speed = a.baseSpeed;
    }

    if (a.orbits >= threshold) {
      // move to middle for collision
      a.x = (planets[0].x + planets[1].x) / 2;
      a.y = (planets[0].y + planets[1].y) / 2;
    } else {
      // normal orbit
      a.x = planet.x + cos(a.angle) * a.orbitRadius;
      a.y = planet.y + sin(a.angle) * a.orbitRadius;
    }

    // spin
    a.rotation += a.rotSpeed;

    drawAsteroid(a.x, a.y, a.size, a.col, a.rotation);
    a.col = lerpColor(a.col, color(0), 0.05);
  }

  // collision check
  let groupA = asteroids.filter(a => a.planetIndex === 0 && aReady(a));
  let groupB = asteroids.filter(a => a.planetIndex === 1 && aReady(a));

  for (let a of groupA) {
    for (let b of groupB) {
      let d = dist(a.x, a.y, b.x, b.y);
      if (d < (a.size + b.size) * 0.6) {
        handleSlingshotCollision(a, b);
      }
    }
  }

  // update and draw particles
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

/* ----------------- helpers ----------------- */

function makeAsteroid(planetIndex, orbitR, size, generation) {
  let planet = planets[planetIndex];
  let angle = random(TWO_PI);
  let baseSpeed = 0.02;
  return {
    planetIndex,
    angle,
    speed: baseSpeed,
    baseSpeed: baseSpeed,
    orbitRadius: orbitR,
    size: size,
    col: color(0), // black asteroids
    generation,
    x: planet.x + cos(angle) * orbitR,
    y: planet.y + sin(angle) * orbitR,
    rotation: random(TWO_PI),
    rotSpeed: random(-0.02, 0.02),
    orbits: 0,
    hasCollided: false
  };
}

// asteroid ready to collide?
function aReady(a) {
  let threshold = a.generation === 0 ? 3 : 6;
  return a.orbits >= threshold;
}

function handleSlingshotCollision(a, b) {
  if (a.hasCollided || b.hasCollided) return;

  a.hasCollided = true;
  b.hasCollided = true;

  a.orbits = 0;
  b.orbits = 0;
  a.speed = a.baseSpeed;
  b.speed = b.baseSpeed;

  a.col = color(255, 80, 80); // red flash
  b.col = color(255, 80, 80);

  // spawn one smaller asteroid
  let parent = random([a, b]);
  spawnAsteroid(parent.planetIndex, parent.generation + 1, parent.size);

  if (alienYear > 0) alienYear--;

  playCollisionSounds();

  // sparks burst
  let cx = (a.x + b.x) / 2;
  let cy = (a.y + b.y) / 2;
  for (let i = 0; i < 30; i++) {
    particles.push(new Particle(cx, cy));
  }
}

function spawnAsteroid(planetIndex, generation, parentSize = 20) {
  let newSize = max(5, parentSize - 3);
  let child = makeAsteroid(planetIndex, random(120, 160), newSize, generation);
  asteroids.push(child);
}

// ---- Particle system ----
class Particle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D().mult(random(1, 3));
    this.alpha = 255;
    this.size = random(3, 6);

    // brown/orange sparks
    let options = [
      color(139, 69, 19, this.alpha),   // brown
      color(255, 140, 0, this.alpha)    // orange
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
