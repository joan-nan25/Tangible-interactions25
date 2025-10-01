let planets = [];
let asteroids = [];
let collisionSound, crackSound, rattleSound;

let clashInterval = 5000; // every 5 seconds
let lastClash = 0;

function preload() {
  soundFormats('mp3', 'wav');
  collisionSound = loadSound('assets/collision.wav');
  crackSound = loadSound('assets/crack.wav');
  rattleSound = loadSound('assets/rattle.wav');
}

function setup() {
  createCanvas(800, 600);
  angleMode(RADIANS);

  // two planets, closer together
  planets.push(createVector(width * 0.4, height / 2));
  planets.push(createVector(width * 0.6, height / 2));

  // one asteroid per planet
  for (let i = 0; i < planets.length; i++) {
    asteroids.push(makeAsteroid(i, 80, 15, 0));
  }
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
    a.angle -= a.speed; // counterclockwise
    let x = planet.x + cos(a.angle) * a.orbitRadius;
    let y = planet.y + sin(a.angle) * a.orbitRadius;

    fill(a.col);
    ellipse(x, y, a.size);

    // reset asteroid color slowly
    a.col = lerpColor(a.col, color(200), 0.05);
  }

  // check clash timer
  if (millis() - lastClash > clashInterval) {
    clashEvent();
    lastClash = millis();
  }
}

// ------- Helpers -------

// asteroid factory
function makeAsteroid(planetIndex, orbitR, size, generation) {
  return {
    planetIndex: planetIndex,
    angle: random(TWO_PI),
    speed: 0.02,
    orbitRadius: orbitR,
    size: size,
    col: color(200),
    generation: generation
  };
}

// what happens on clash
function clashEvent() {
  if (asteroids.length < 2) return;

  // flash red
  for (let a of asteroids) {
    a.col = color(255, 100, 100);
  }

  // spawn a new asteroid for each planet
  for (let i = 0; i < planets.length; i++) {
    let gen = asteroids.filter(a => a.planetIndex === i).length;
    spawnAsteroid(i, gen);
  }

  // play sounds
  playCollisionSounds();
}

// spawn new asteroid
function spawnAsteroid(planetIndex, generation) {
  let newSize = max(5, 15 - generation * 2); // shrink with generations
  asteroids.push({
    planetIndex: planetIndex,
    angle: random(TWO_PI),
    speed: 0.02,
    orbitRadius: random(60, 100),
    size: newSize,
    col: color(255, 200, 100),
    generation: generation
  });
}

// sound cascade
function playCollisionSounds() {
  collisionSound.play(); // tick

  let crackDelay = int(random(100, 200));
  setTimeout(() => crackSound.play(), crackDelay);

  if (rattleSound.isPlaying()) {
    rattleSound.stop();
  }
  rattleSound.setVolume(0);
  rattleSound.play();
  rattleSound.fade(0.6, 1.5);

  setTimeout(() => {
    if (rattleSound.isPlaying()) {
      rattleSound.fade(0, 2);
    }
  }, 3000);
}

// unlock audio on click
function mousePressed() {
  userStartAudio();
}
