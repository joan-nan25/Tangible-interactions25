let planets = [];
let asteroids = [];
let collisionSound, crackSound, rattleSound;
let bgImage; // background image
let stars = [];

function preload() {
  soundFormats('mp3', 'wav');
  collisionSound = loadSound('assets/collision.wav');
  crackSound = loadSound('assets/crack.wav');
  rattleSound = loadSound('assets/rattle.wav');
  bgImage = loadImage('assets/space-bg.jpg'); // place your gradient image in assets/
}

function setup() {
  createCanvas(800, 600);
  angleMode(RADIANS);

  // two planets, closer together
  planets.push(createVector(width * 0.35, height / 2));
  planets.push(createVector(width * 0.65, height / 2));

  // one asteroid per planet
  for (let i = 0; i < planets.length; i++) {
    asteroids.push(makeAsteroid(i, 100, 15, 0));
  }

  // continuous ambient rattle
  rattleSound.setLoop(true);
  rattleSound.setVolume(0.4);
  rattleSound.play();

  // generate stars
  for (let i = 0; i < 200; i++) {
    stars.push({
      x: random(width),
      y: random(height),
      size: random(1, 3),
      alpha: random(100, 255)
    });
  }
}

function draw() {
  // draw colorful space background
  background(0);
  image(bgImage, 0, 0, width, height);

  // draw stars
  noStroke();
  for (let s of stars) {
    fill(255, 255, 255, s.alpha + random(-30, 30)); // twinkle
    ellipse(s.x, s.y, s.size);
  }

  // draw planets with 3D shading
  for (let p of planets) {
    drawPlanet(p.x, p.y, 100); // bigger size
  }

  // update & draw asteroids
  for (let a of asteroids) {
    let planet = planets[a.planetIndex];

    // orbit motion
    a.angle -= a.speed;
    a.x = planet.x + cos(a.angle) * a.orbitRadius;
    a.y = planet.y + sin(a.angle) * a.orbitRadius;

    // spin
    a.rotation += a.rotSpeed;

    drawAsteroid(a.x, a.y, a.size, a.col, a.rotation);

    // slowly fade back toward brown
    a.col = lerpColor(a.col, color(139, 69, 19), 0.05);
  }

  // check collisions between planet A + planet B asteroids
  let groupA = asteroids.filter(a => a.planetIndex === 0);
  let groupB = asteroids.filter(a => a.planetIndex === 1);

  for (let a of groupA) {
    for (let b of groupB) {
      let d = dist(a.x, a.y, b.x, b.y);
      if (d < (a.size + b.size) * 0.5) {
        handleCollision(a, b);
      }
    }
  }
}

// ------- Helpers -------

// asteroid factory
function makeAsteroid(planetIndex, orbitR, size, generation) {
  let planet = planets[planetIndex];
  let angle = random(TWO_PI);
  return {
    planetIndex: planetIndex,
    angle: angle,
    speed: 0.02,
    orbitRadius: orbitR,
    size: size,
    col: color(139, 69, 19), // brown
    generation: generation,
    x: planet.x + cos(angle) * orbitR,
    y: planet.y + sin(angle) * orbitR,
    rotation: random(TWO_PI),      // start spin
    rotSpeed: random(-0.02, 0.02)  // spin speed
  };
}

// draw asteroid as jagged polygon with rotation
function drawAsteroid(x, y, r, col, rot) {
  push();
  translate(x, y);
  rotate(rot);
  fill(col);
  noStroke();
  beginShape();
  let points = 10; // jagged edges
  for (let i = 0; i < TWO_PI; i += TWO_PI / points) {
    let radius = r * random(0.7, 1.2);
    let vx = cos(i) * radius;
    let vy = sin(i) * radius;
    vertex(vx, vy);
  }
  endShape(CLOSE);
  pop();
}

// draw planet with radial shading
function drawPlanet(x, y, r) {
  noStroke();
  for (let i = r; i > 0; i--) {
    let inter = map(i, 0, r, 0, 1);
    let c = lerpColor(color(30, 60, 150), color(120, 180, 255), inter);
    fill(c);
    ellipse(x, y, i * 2);
  }
}

// collision event
function handleCollision(a, b) {
  a.col = color(255, 100, 100);
  b.col = color(255, 100, 100);

  spawnAsteroid(a.planetIndex, a.generation + 1);
  spawnAsteroid(b.planetIndex, b.generation + 1);

  playCollisionSounds();
}

// spawn new asteroid near planet
function spawnAsteroid(planetIndex, generation) {
  let newSize = max(5, 15 - generation * 2);
  asteroids.push(makeAsteroid(planetIndex, random(80, 120), newSize, generation));
}

// sound cascade
function playCollisionSounds() {
  collisionSound.play(); // tick

  let crackDelay = int(random(100, 200));
  setTimeout(() => crackSound.play(), crackDelay);
}

// unlock audio on click
function mousePressed() {
  userStartAudio();
}
