let tree;
let storms = [];

function setup() {
  createCanvas(800, 600);
  tree = new Tree(width / 2, height * 0.75);
}

function draw() {
  drawEnvironment(tree.health);

  tree.update();
  tree.display();

  for (let s of storms) {
    s.update(tree);
    s.display();
  }

  // occasional random storms
  if (random(1) < 0.005) storms.push(new Storm(width + 100));

  // trim old storms
  storms = storms.filter(s => s.pos.x > -200);
}

function mousePressed() {
  storms.push(new Storm(mouseX));
}

function keyPressed() {
  if (key === 'W') windSpeed += 0.1;
  if (key === 'S') windSpeed = max(0.1, windSpeed - 0.1);
  if (key === 'R') {
    tree = new Tree(width / 2, height * 0.75);
    storms = [];
  }
}
