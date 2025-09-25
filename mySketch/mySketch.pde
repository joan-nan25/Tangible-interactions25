

// === Mesmerizing Cat Animation ===
// Files in data folder: sprite.png, bounce.wav

import processing.sound.*;

PImage cat;
SoundFile bounce;

// Position + velocity
float x, y, vx, vy;
float noiseOffsetX, noiseOffsetY;

// Background particles
int particleCount = 180;
float[] px = new float[particleCount];
float[] py = new float[particleCount];
float[] pr = new float[particleCount];
color[] pc = new color[particleCount];

void setup() {
  size(800, 600);
  smooth();

  // Load assets
  cat = loadImage("sprite.png");
  bounce = new SoundFile(this, "bounce.wav");

  // Start in center
  x = width/2;
  y = height/2;
  vx = random(-3, 3);
  vy = random(-3, 3);

  noiseOffsetX = random(1000);
  noiseOffsetY = random(2000);

  // Init particles
  for (int i = 0; i < particleCount; i++) {
    px[i] = random(width);
    py[i] = random(height);
    pr[i] = random(2, 8);
    pc[i] = color(random(255), random(255), random(255), 180);
  }
}

void draw() {
  // Semi-transparent bg for trails
  fill(0, 40);
  rect(0, 0, width, height);

  // Noise-based drifting
  float noiseVX = map(noise(noiseOffsetX), 0, 1, -2, 2);
  float noiseVY = map(noise(noiseOffsetY), 0, 1, -2, 2);
  noiseOffsetX += 0.01;
  noiseOffsetY += 0.01;

  vx += noiseVX * 0.05;
  vy += noiseVY * 0.05;
  vx = constrain(vx, -5, 5);
  vy = constrain(vy, -5, 5);

  // Move sprite
  x += vx;
  y += vy;

  // Bounce + trigger sound + recolor particles
  if (x < 60 || x > width-60) {
    vx *= -1;
    bounce.play();
    randomizeColors();
  }
  if (y < 60 || y > height-60) {
    vy *= -1;
    bounce.play();
    randomizeColors();
  }

  // Draw particles
  noStroke();
  for (int i = 0; i < particleCount; i++) {
    fill(pc[i]);
    ellipse(px[i], py[i], pr[i], pr[i]);

    // Gentle drifting with noise
    px[i] += map(noise(px[i] * 0.01, frameCount * 0.01), 0, 1, -1.5, 1.5);
    py[i] += map(noise(py[i] * 0.01, frameCount * 0.01), 0, 1, -1.5, 1.5);

    // Wrap around edges
    if (px[i] < 0) px[i] = width;
    if (px[i] > width) px[i] = 0;
    if (py[i] < 0) py[i] = height;
    if (py[i] > height) py[i] = 0;
  }

  // Draw sprite with random tint
  imageMode(CENTER);
  tint(random(150, 255), random(150, 255), random(150, 255));
  image(cat, x, y, 120, 120);
  noTint();
}

// Change particle colors on bounce
void randomizeColors() {
  for (int i = 0; i < particleCount; i++) {
    pc[i] = color(random(255), random(255), random(255), 200);
  }
}
