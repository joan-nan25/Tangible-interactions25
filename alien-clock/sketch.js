let planets = [];
let asteroids = [];
let collisionSound, crackSound, rattleSound;

let clashInterval = 5000; // every 5 seconds
let lastClash = 0;
let colliding = false;

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

    if (!colliding) {
      // normal orbit
      a.angle -= a.speed; // counterclockwise
      a.x = planet.x + cos(a.angle) * a.orbitRadius;
      a.y = planet.y + sin(a.angle) * a.orbitRadius;
    } else {
      // move toward midpoint
      let midX = (planets[0].x + planets[1].x) / 2;
      let midY = (planets[0].y + planets[1].y) / 2;
      a.x = lerp(a.x, midX, 0.1);
      a.y = lerp(a.y, midY, 0.1);
    }

    fill(a.col);
    ellipse(a.x, a.y, a.size);

    // reset asteroid color slowly
    a.col = lerpColor(a.col, color(200), 0.05);
  }

  // check clash timer
  if (millis() - lastClash > clashInterval && !colliding) {
    colliding = true;
    setTimeout(() => {
      clashEvent();
      colliding = false;
      lastClash = millis();
    }, 1500); // allow asteroids ~1.5s to move inward
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
  asteroids.push(makeAsteroid(planetIndex, random(60, 100), newSize, generation));
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
