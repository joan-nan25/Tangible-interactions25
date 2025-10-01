let planets = [];
let asteroids = [];
let collisionSound, crackSound, rattleSound;

function preload() {
  soundFormats('mp3', 'wav');
  collisionSound = loadSound('assets/collision.wav');
  crackSound = loadSound('assets/crack.wav');
  rattleSound = loadSound('assets/rattle.wav');
}

function setup() {
  createCanvas(800, 600);
  angleMode(RADIANS);

  // two planets, closer
  planets.push(createVector(width * 0.4, height / 2));
  planets.push(createVector(width * 0.6, height / 2));

  // one asteroid per planet
  for (let i = 0; i < planets.length; i++) {
    asteroids.push(makeAsteroid(i, 80, 15, 0));
  }

  // continuous ambient rattle
  rattleSound.setLoop(true);
  rattleSound.setVolume(0.4);
  rattleSound.play();
}

function draw() {
  background(20);

  // draw planets
  fill(100, 150, 255);
  noStroke();
  for (let p of planets) {
    ellipse(p.x, p.y, 50, 50);
  }

  // update & draw asteroids
  for (let a of asteroids) {
    let planet = planets[a.planetIndex];

    // orbit
    a.angle -= a.speed;
    a.x = planet.x + cos(a.angle) * a.orbitRadius;
    a.y = planet.y + sin(a.angle) * a.orbitRadius;

    fill(a.col);
    ellipse(a.x, a.y, a.size);

    // slowly fade back to gray
    a.col = lerpColor(a.col, color(200), 0.05);
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
    col: color(200),
    generation: generation,
    x: planet.x + cos(angle) * orbitR,
    y: planet.y + sin(angle) * orbitR
  };
}

// collision event
function handleCollision(a, b) {
  // flash red
  a.col = color(255, 100, 100);
  b.col = color(255, 100, 100);

  // spawn child asteroid from each parent
  spawnAsteroid(a.planetIndex, a.generation + 1);
  spawnAsteroid(b.planetIndex, b.generation + 1);

  // play sounds
  playCollisionSounds();
}

// spawn new asteroid near planet
function spawnAsteroid(planetIndex, generation) {
  let newSize = max(5, 15 - generation * 2);
  asteroids.push(makeAsteroid(planetIndex, random(60, 100), newSize, generation));
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
