

PImage sprite; 
Mover[] movers = new Mover[20]; // Multiple moving objects

void setup() {
  size(800, 600);
  smooth();

  // Load image (place "sprite.png" inside a "data" folder in your sketch directory)
  sprite = loadImage("sprite.png");

  // Initialize movers
  for (int i = 0; i < movers.length; i++) {
    movers[i] = new Mover(random(width), random(height));
  }
}

void draw() {
  background(20, 30, 50);

  for (Mover m : movers) {
    m.update();
    m.checkEdges();
    m.display();
  }
}

// --- CLASS ---
class Mover {
  float x, y;
  float xSpeed, ySpeed;
  float noiseOffsetX, noiseOffsetY;
  color c;
  
  Mover(float startX, float startY) {
    x = startX;
    y = startY;
    xSpeed = random(-2, 2);
    ySpeed = random(-2, 2);
    noiseOffsetX = random(1000);
    noiseOffsetY = random(2000);
    c = color(random(255), random(255), random(255), 180);
  }
  
  void update() {
    // Add some Perlin noise to make the path more organic
    x += map(noise(noiseOffsetX), 0, 1, -2, 2) + xSpeed;
    y += map(noise(noiseOffsetY), 0, 1, -2, 2) + ySpeed;

    noiseOffsetX += 0.01;
    noiseOffsetY += 0.01;
    
    // Change color depending on speed
    float speed = dist(0, 0, xSpeed, ySpeed);
    c = color(map(speed, 0, 4, 50, 255), random(150, 255), 200, 200);

    // Conditional rule: reverse if in central "zone"
    if (x > width/3 && x < 2*width/3 && y > height/3 && y < 2*height/3) {
      xSpeed *= -1;
      ySpeed *= -1;
    }
  }
  
  void checkEdges() {
    // Bounce off walls
    if (x < 0 || x > width) {
      xSpeed *= -1;
    }
    if (y < 0 || y > height) {
      ySpeed *= -1;
    }
  }
  
  void display() {
    noStroke();
    fill(c);
    ellipse(x, y, 25, 25);
    
    // Draw sprite image behind ellipse
    imageMode(CENTER);
    tint(255, 180);
    image(sprite, x, y, 40, 40);
  }
}
