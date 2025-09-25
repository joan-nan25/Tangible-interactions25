// ----- Global variables -----
let galaxy, sunImg, earthImg, catImg;
let bounce;

// Earth orbit
let angle = 0;
let angleSpeed = 0.025;
let orbitRadius = 240;
let tickedThisOrbit = false;

// Rocket motion
let interval = 2000; // 2 seconds
let lastTrigger = 0;
let shipY;
let shipMoving = false;
let shipAngle = 0;

// Sun movement
let sunPulseAngle = 0;

// Cat orbit
let catOrbitAngle = 0;
let catOrbitSpeed = 0.02;   // slower orbit
let catOrbitRadius = 200;   // stays inside galaxy

function preload() {
  // Load images
  galaxy = loadImage("data/galaxy.jpg");
  sunImg = loadImage("data/sun.png");
  earthImg = loadImage("data/earth.png");
  catImg = loadImage("data/cat.png");

  // Load sound
  bounce = loadSound("data/bounce.wav");
}

function setup() {
  createCanvas(800, 600);
  imageMode(CENTER);

  // Allow sound after user clicks
  userStartAudio().then(() => {
    console.log("🔊 Audio enabled");
  });

  shipY = height - 100;
}

function draw() {
  background(0);

  // Galaxy background
  push();
  tint(255, 90);
  image(galaxy, width/2, height/2, width, height);
  pop();

  // ---- Sun with pulsing movement ----
  sunPulseAngle += 0.05;
  let sunScale = 1.0 + 0.05 * sin(sunPulseAngle);
  push();
  translate(width/2, height/2);
  scale(sunScale);
  image(sunImg, 0, 0, 200, 200);
  pop();

  // ---- Earth orbiting Sun ----
  angle += angleSpeed;
  let earthX = width/2 + orbitRadius * cos(angle);
  let earthY = height/2 + orbitRadius * sin(angle);
  image(earthImg, earthX, earthY, 120, 120);

  // Play tick when Earth crosses right side
  if (abs(sin(angle)) < 0.01 && !tickedThisOrbit) {
    if (bounce && bounce.isLoaded()) bounce.play();
    tickedThisOrbit = true;
  }
  if (abs(sin(angle)) > 0.2) {
    tickedThisOrbit = false;
  }

  // ---- Rocket launches every interval ----
  if (millis() - lastTrigger > interval) {
    shipMoving = true;
    lastTrigger = millis();
  }
  if (shipMoving) {
    shipY -= 5;
    shipAngle += 2;
    if (shipAngle >= 360) shipAngle = 0;
    if (shipY < -150) {
      shipY = height - 100;
      shipMoving = false;
      if (bounce && bounce.isLoaded()) bounce.play();
    }
  }

  // ---- Draw red & black rocket (RIGHT side) ----
  let shipX = width * 0.78; // 👉 moved back to right side
  let rocketH = 140;
  let rocketW = 40;

  push();
  translate(shipX, shipY);
  rotate(radians(shipAngle));

  // Rocket body
  fill(200, 0, 0); // red
  stroke(0);
  rectMode(CENTER);
  rect(0, 0, rocketW, rocketH, 20);

  // Nose cone
  fill(0); // black
  triangle(-rocketW/2, -rocketH/2,
           rocketW/2, -rocketH/2,
           0, -rocketH);

  // Fins
  fill(0);
  triangle(-rocketW/2, rocketH/2,
           -rocketW, rocketH/2 + 30,
           -rocketW/4, rocketH/2);
  triangle( rocketW/2, rocketH/2,
            rocketW, rocketH/2 + 30,
            rocketW/4, rocketH/2);

  // Flame (only when moving)
  if (shipMoving) {
    noStroke();
    fill(255, 150 + random(-30, 30), 0); // flicker orange
    let flameH = 50 + random(-10, 10);
    triangle(-rocketW/4, rocketH/2,
             rocketW/4, rocketH/2,
             0, rocketH/2 + flameH);
  }

  pop();

  // ---- Cat orbiting the Sun ----
  catOrbitAngle += catOrbitSpeed;
  let catX = width/2 + catOrbitRadius * cos(catOrbitAngle);
  let catY = height/2 + catOrbitRadius * sin(catOrbitAngle);
  image(catImg, catX, catY, 100, 100);
}

