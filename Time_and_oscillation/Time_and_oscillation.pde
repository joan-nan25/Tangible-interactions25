// space
import processing.sound.*;

// ----- Global variables -----
PImage galaxy, sunImg, earthImg, catImg;
SoundFile bounce;

// Earth orbit (trig motion)
float angle = 0;
float angleSpeed = 0.025; // faster orbit
float orbitRadius = 240;
float earthX, earthY;
boolean tickedThisOrbit = false;

// Spaceship (rocket) motion
int interval = 2000;  // every 2 seconds
int lastTrigger = 0;
float shipY;
boolean shipMoving = false;
float shipAngle = 0; // rotation

// Sun movement
float sunPulseAngle = 0;

// Cat orbit
float catOrbitAngle = 0;
float catOrbitSpeed = 0.05; // faster than Earth
float catOrbitRadius = 350;

void setup() {
  size(800, 600);
  imageMode(CENTER);
  noStroke();

  gifExport = new GifMaker(this, "export.gif");
    gifExport.setRepeat(0);				// make it an "endless" animation
    gifExport.setTransparent(0,0,0);	// black is transparent

}

void draw() {
    background(0);
    fill(255);
    ellipse(mouseX, mouseY, 10, 10);

    gifExport.setDelay(1);
    gifExport.addFrame();
}

void mousePressed() {
    gifExport.finish();					// write file
}
  // ---- Load images (from data folder) ----
  galaxy  = loadImage("galaxy.jpg");
  sunImg  = loadImage("sun.png");
  earthImg= loadImage("earth.png");
  catImg  = loadImage("cat.png");

  // ---- Fallbacks if files are missing ----
  if (galaxy == null)  galaxy  = solidImage(width, height, color(10, 10, 30));
  if (sunImg == null)  sunImg  = solidImage(200, 200, color(255, 200, 0));
  if (earthImg == null)earthImg= solidImage(120, 120, color(0, 120, 255));
  if (catImg == null)  catImg  = solidImage(100, 100, color(255, 150, 200)); // pink placeholder

  // Resize images
  sunImg.resize(200, 200);
  earthImg.resize(120, 120);
  catImg.resize(100, 100);

  // Load sound
  try {
    bounce = new SoundFile(this, "bounce.wav");
    bounce.play(); // 🔊 play instantly on start
  } catch (Exception e) {
    println("⚠️ Sound not available. Continuing without sound.");
    bounce = null;
  }

  shipY = height - 100;
}

void draw() {
  // Background galaxy with reduced opacity
  tint(255, 90);
  image(galaxy, width/2, height/2, width, height);
  noTint();

  // ---- Sun with pulsing movement ----
  sunPulseAngle += 0.05;
  float sunScale = 1.0 + 0.05 * sin(sunPulseAngle);
  pushMatrix();
  translate(width/2, height/2);
  scale(sunScale);
  image(sunImg, 0, 0);
  popMatrix();

  // ---- Earth orbiting Sun ----
  angle += angleSpeed;
  earthX = width/2 + orbitRadius * cos(angle);
  earthY = height/2 + orbitRadius * sin(angle);
  image(earthImg, earthX, earthY);

  // Play tick when Earth crosses right side
  if (abs(sin(angle)) < 0.01 && !tickedThisOrbit) {
    if (bounce != null) bounce.play();
    tickedThisOrbit = true;
  }
  if (abs(sin(angle)) > 0.2) tickedThisOrbit = false;

  // ---- Rocket launches every interval ----
  if (millis() - lastTrigger > interval) {
    shipMoving = true;
    lastTrigger = millis();
  }
  if (shipMoving) {
    shipY -= 5;       // ascent speed
    shipAngle += 2;   // rotate while moving
    if (shipAngle >= 360) shipAngle = 0;
    if (shipY < -150) {
      shipY = height - 100;
      shipMoving = false;
      if (bounce != null) bounce.play();
    }
  }

  // ---- Draw rotating red & black rocket ----
  float shipX = width * 0.22; //  moved to LEFT side
  float rocketH = 140; // rocket height
  float rocketW = 40;  // rocket width

  pushMatrix();
  translate(shipX, shipY);
  rotate(radians(shipAngle));

  // Rocket body
  fill(200, 0, 0); // red
  stroke(0);
  strokeWeight(2);
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

  popMatrix();

  // ---- Cat orbiting the Sun ----
  catOrbitAngle += catOrbitSpeed;
  float catX = width/2 + catOrbitRadius * cos(catOrbitAngle);
  float catY = height/2 + catOrbitRadius * sin(catOrbitAngle);
  image(catImg, catX, catY);
}

// ---- Helper: make solid-colored placeholder ----
PImage solidImage(int w, int h, int c) {
  PImage img = createImage(w, h, ARGB);
  img.loadPixels();
  for (int i = 0; i < img.pixels.length; i++) {
    img.pixels[i] = c;
  }
  img.updatePixels();
  return img;
}
