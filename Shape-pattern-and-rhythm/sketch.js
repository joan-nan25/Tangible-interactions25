
let seed = 12345;
let mode = 1;

function setup() {
  createCanvas(600, 400);
  angleMode(DEGREES);
  rectMode(CENTER);
  noLoop();
}

function draw() {
  randomSeed(seed);
  noiseSeed(seed);

  background(0,0,255);
  strokeCap(SQUARE);

  // grid size based on aspect ratio
  const cols = floor(map(width, 360, 1600, 10, 24, true));
  const rows = floor(cols * (height / width));
  const tileW = width / cols;
  const tileH = height / rows;
  const tile = min(tileW, tileH);
  const margin = tile * 0.14;

  // center of the grid 
  const cx = (cols - 1) * 0.5;
  const cy = (rows - 1) * 0.5;
  const rMax = sqrt(cx * cx + cy * cy);

  for (let gy = 0; gy < rows; gy++) {
    for (let gx = 0; gx < cols; gx++) {
      const x = gx * tileW + tileW / 2;
      const y = gy * tileH + tileH / 2;

      // grid coordinates [0..1]
      const u = gx / max(1, cols - 1);
      const v = gy / max(1, rows - 1);

      // variation and symmetry
      const dx = gx - cx;
      const dy = gy - cy;
      const radial = sqrt(dx * dx + dy * dy) / rMax;      
      const theta = atan2(dy, dx);                         
      const wave = (sin((u + v) * 180) + 1) * 0.5;         
      const n = noise(u * 2.2, v * 2.2);                   

      // blend fields 
      let vary, rotBase;
      if (mode === 1) {
        // Radial pinwheel with distance falloff
        vary = lerp(n, wave, 0.35) * (1.0 - 0.2 * cos(theta * 4));
        rotBase = theta * 0.5;
      } else if (mode === 2) {
        
        const parity = (gx + gy) % 2 === 0 ? 1 : -1;
        vary = lerp(radial, n, 0.5) * 0.85;
        rotBase = (u - 0.5) * 90 * parity;
      } else {
     
        vary = pow(1.0 - radial, 0.7) * 0.6 + n * 0.25;
        rotBase = theta + wave * 45;
      }

      push();
      translate(x, y);

      // mirroring per column for rhythm
      if (gx % 2 === 0) scale(1, 1); else scale(-1, 1);

      drawMotif(tile - margin, vary, rotBase);
      pop();
    }
  }

 
  noFill();
  stroke(0, 20);
  strokeWeight(2);
  rect(width / 2, height / 2, width - 4, height - 4, min(width, height) * 0.01);
}

function drawMotif(size, vary, rotBase) {
 
  // inner loop establishes rhythm inside each tile
  const steps = 7;
  const sw0 = max(1, size * 0.008);

  for (let i = 0; i < steps; i++) {
    const t = i / (steps - 1);                 // 0..1
    const s = lerp(size * 0.9, size * 0.25, t);
    const rot = rotBase + (t - 0.5) * 40 * (0.6 + vary);
    const w = sw0 * (1.0 + i * 0.15);

    push();
    rotate(rot);

    
    const ink = 15;
    const accent = 220 - 120 * vary;
    if (i % 2 === 0) {
      stroke(ink);
    } else {
      stroke(accent);
    }
    strokeWeight(w);
    noFill();

    //  beat:
    // 
    if (i % 3 === 0) {
      rect(0, 0, s, s, s * 0.15);
    } else if (i % 3 === 1) {
      const arcSpan = 120 + 100 * vary;
      arc(0, 0, s, s, -arcSpan / 2, arcSpan / 2);
    } else {
      // short parallel lines for texture
      const L = s * 0.55;
      const gap = s * 0.18;
      line(-L / 2, -gap, L / 2, -gap);
      line(-L / 2, 0,     L / 2, 0);
      line(-L / 2, +gap,  L / 2, +gap);
    }
    pop();
  }
}

function keyPressed() {
  if (key === '1') { mode = 1; redraw(); }
  if (key === '2') { mode = 2; redraw(); }
  if (key === '3') { mode = 3; redraw(); }
  if (key === ' ') { seed = floor(random(1e9)); redraw(); }
  if (key === 'S') { saveCanvas('pattern', 'png'); }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  redraw();
}
