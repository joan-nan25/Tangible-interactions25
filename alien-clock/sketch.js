let planets = [];
let asteroids = [];
let collisionSound, crackSound, rattleSound;
let bgImage;
let stars = [];

// ---- clash timing ----
let colliding = false;
let nextClashAt = 0;
let clashDuration = 1800;
let clashEndAt = 0;
let currentClashId = 0;

// ---- alien time counter ----
let alienTime = 0;

function preload() {
  soundFormats('mp3', 'wav');
  collisionSound = loadSound('assets/collision.wav');
  crackSound     = loadSound('assets/crack.wav');
  rattleSound    = loadSound('assets/rattle.wav');
  bgImage        = loadImage('assets/space-bg.jpg'); // your gradient background
}

function setup() {
  createCanvas(800, 600);
  angleMode(RADIANS);

  planets.push(createVector(width * 0.35, height / 2));
  planets.push(createVector(width * 0.65, height / 2));

  for (let i = 0; i < planets.length; i++) {
    asteroids.push(makeAsteroid(i, 100, 15, 0));
  }

  // rattle will only play after user click due to browser policy
  rattleSound.setLoop(true);
  rattleSound.setVolume(0.4);

  for (let i = 0; i < 200; i++) {
    stars.push({ x: random(width), y: random(height), size: random(1, 3), alpha: random(100, 255) });
  }

  nextClashAt = millis() + 5000; // first clash at 5s
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

  let now = millis();
  if (!colliding && now >= nextClashAt) {
    colliding = true;
    clashEndAt = now + clashDuration;
    currentClashId++;
  }

  // asteroids
  for (let a of asteroids) {
    let planet = planets[a.planetIndex];

    if (colliding) {
      let midX = (planets[0].x + planets[1].x) / 2;
      let midY = (planets[0].y + planets[1].y) / 2;
      a.x = lerp(a.x, midX, 0.12);
      a.y = lerp(a.y, midY, 0.12);
    } else {
      a.angle -= a.speed;
      a.x = planet.x + cos(a.angle) * a.orbitRadius;
      a.y = planet.y + sin(a.angle) * a.orbitRadius;
    }

    a.rotation += a.rotSpeed;
    drawAsteroid(a.x, a.y, a.size, a.col, a.rotation);
    a.col = lerpColor(a.col, color(139, 69, 19), 0.05);
  }

  // collisions
  if (colliding) {
    let groupA = asteroids.filter(t => t.planetIndex === 0);
    let groupB = asteroids.filter(t => t.planetIndex === 1);

    for (let a of groupA) {
      for (let b of groupB) {
        let d = dist(a.x, a.y, b.x, b.y);
        if (d < (a.size + b.size) * 0.55) {
          handleCollisionOncePerWindow(a, b);
        }
      }
    }

    if (now >= clashEndAt) {
      colliding = false;
      nextClashAt = clashEndAt + 10000; // every 10s after first
    }
  }

  // alien time counter
  fill(255);
  textSize(18);
  textAlign(LEFT, TOP);
  text("Alien Time: " + alienTime, 20, 20);

  // sound note
  textSize(12);
  textAlign(CENTER, BOTTOM);
  fill(200);
  text("Click anywhere to enable sound", width / 2, height - 10);
}

/* ----------------- helpers ----------------- */

function makeAsteroid(planetIndex, orbitR, size, generation) {
  const planet = planets[planetIndex];
  const angle = random(TWO_PI);
  return {
    planetIndex,
    angle,
    speed: 0.02,
    orbitRadius: orbitR,
    size,
    col: color(139, 69, 19),
    generation,
    x: planet.x + cos(angle) * orbitR,
    y: planet.y + sin(angle) * orbitR,
    rotation: random(TWO_PI),
    rotSpeed: random(-0.02, 0.02),
    lastClashProcessed: -1
  };
}

function handleCollisionOncePerWindow(a, b) {
  if (a.lastClashProcessed === currentClashId && b.lastClashProcessed === currentClashId) return;

  a.col = color(255, 100, 100);
  b.col = color(255, 100, 100);

  if (a.lastClashProcessed !== currentClashId) {
    spawnAsteroid(a.planetIndex, a.generation + 1);
    a.lastClashProcessed = currentClashId;
  }
  if (b.lastClashProcessed !== currentClashId) {
    spawnAsteroid(b.planetIndex, b.generation + 1);
    b.lastClashProcessed = currentClashId;
  }

  playCollisionSounds();
}

function spawnAsteroid(planetIndex, generation) {
  let newSize = max(5, 15 - generation * 2);
  asteroids.push(makeAsteroid(planetIndex, random(80, 120), newSize, generation));
  alienTime++; // increment alien time counter
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
  userStartAudio(); // starts sound on first click
  if (!rattleSound.isPlaying()) {
    rattleSound.play();
  }
}
