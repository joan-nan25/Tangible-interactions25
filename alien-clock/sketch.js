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

  // two planets
  planets.push(createVector(width * 0.3, height / 2));
  planets.push(createVector(width * 0.7, height / 2));

  // asteroids orbiting each planet
  for (let i = 0; i < planets.length; i++) {
    asteroids.push(makeAsteroid(i, 80));
    asteroids.push(makeAsteroid(i, 120));
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
    a.angle += a.speed;
    let x = planet.x + cos(a.angle) * a.orbitRadius;
    let y = planet.y + sin(a.angle) * a.orbitRadius;

    fill(a.col);
    ellipse(x, y, a.size);

    // reset color gradually
    a.col = lerpColor(a.col, color(200), 0.05);

    // check for collisions with other asteroids around same planet
    for (let b of asteroids) {
      if (a !== b && a.planetIndex === b.planetIndex) {
        let bx = planet.x + cos(b.angle) * b.orbitRadius;
        let by = planet.y + sin(b.angle) * b.orbitRadius;
        let d = dist(x, y, bx, by);

        if (d < (a.size + b.size) * 0.5) {
          a.col = color(255, 100, 100);
          b.col = color(255, 100, 100);

          playCollisionSounds(); // ✅ sound logic
          spawnAsteroid(a.planetIndex); // ✅ always spawn new asteroid
        }
      }
    }
  }
}

// ------- Helpers -------

// make a new asteroid
function makeAsteroid(planetIndex, orbitR) {
  return {
    planetIndex: planetIndex,
    angle: random(TWO_PI),
    speed: random(0.01, 0.03),
    orbitRadius: orbitR,
    size: 15,
    col: color(200)
  };
}

// spawn a new asteroid after collision
function spawnAsteroid(planetIndex) {
  asteroids.push({
    planetIndex: planetIndex,
    angle: random(TWO_PI),
    speed: random(0.01, 0.03),
    orbitRadius: random(60, 140),
    size: 10,
    col: color(255, 200, 100)
  });
}

// handle sound cascade
function playCollisionSounds() {
  if (!collisionSound.isPlaying()) {
    collisionSound.play();   // sharp tick

    // crack comes a little later with random delay
    let crackDelay = int(random(100, 200)); // 100–200ms
    setTimeout(() => {
      crackSound.play();
    }, crackDelay);

    // rattle starts immediately, no overlap
    if (rattleSound.isPlaying()) {
      rattleSound.stop();
    }
    rattleSound.setVolume(0);
    rattleSound.play();

    // fade in
    rattleSound.fade(0.6, 1.5);

    // fade out after 3s
    setTimeout(() => {
      if (rattleSound.isPlaying()) {
        rattleSound.fade(0, 2);
      }
    }, 3000);
  }
}
