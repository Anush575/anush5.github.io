let variation = 0; // 0, 1, 2
let phase = 0;
let time = 0;

function setup() {
  createCanvas(800, 600);
  noFill();
  strokeWeight(2);
  smooth();
}

function draw() {
  background(0, 20); 
  push();
  translate(width/2, height/2);
  
  // Update time for animations
  time = millis();
  phase += 0.02;
  
  if (variation === 0) {
    drawConcentricCircles();
  } 
  else if (variation === 1) {
    drawRotatingGrid();
  } 
  else if (variation === 2) {
    drawWaveInterference();
  }
  
  pop();
  
 
  drawUI();
}

function drawConcentricCircles() {
  
  let offsetX = map(mouseX, 0, width, -80, 80);
  let offsetY = map(mouseY, 0, height, -80, 80);
  
  // Dynamic circle count
  let circleCount = 40;
  
  for (let i = 0; i < circleCount; i++) {
    let t = i / circleCount;
    let radius = i * 12;
    
    // Dynamic colors
    let hue = (i * 5 + time * 0.05) % 360;
    let strokeVal = map(i, 0, circleCount, 100, 255);
    
    colorMode(HSB, 360, 100, 100);
    stroke(hue, 80, strokeVal);
    
    // Main circles with pulse effect
    let pulse = sin(time * 0.003 + i * 0.2) * 2;
    circle(0, 0, radius + pulse);
    
    // Offset circles with rotation
    let angle = time * 0.002;
    let xOff = offsetX + cos(angle + i * 0.1) * 5;
    let yOff = offsetY + sin(angle + i * 0.1) * 5;
    circle(xOff, yOff, radius + pulse);
  }
  
  colorMode(RGB, 255);
}

function drawRotatingGrid() {
  let angle1 = time * 0.002;
  let angle2 = angle1 + map(mouseX, 0, width, 0, TWO_PI);
  
  // Dynamic line spacing
  let spacing = map(mouseY, 0, height, 15, 40);
  let lineCount = floor(800 / spacing);
  
  for (let i = -lineCount/2; i < lineCount/2; i++) {
    let pos = i * spacing;
    
    // Rotate points
    let x1 = cos(angle1) * pos - sin(angle1) * pos;
    let y1 = sin(angle1) * pos + cos(angle1) * pos;
    let x2 = cos(angle2) * pos - sin(angle2) * pos;
    let y2 = sin(angle2) * pos + cos(angle2) * pos;
    
    // Dynamic colors
    let hue = (angle1 * 100 + i * 10) % 360;
    let brightness = 100 + sin(angle1 + i) * 50;
    
    colorMode(HSB, 360, 100, 100);
    stroke(hue, 80, brightness);
    strokeWeight(1.5);
    
    // Draw lines
    line(x1, y1, -x1, -y1);
    line(x2, y2, -x2, -y2);
    
    // Add connecting lines for web effect
    if (i < lineCount/2 - 1) {
      let nextPos = (i + 1) * spacing;
      let x1next = cos(angle1) * nextPos - sin(angle1) * nextPos;
      let y1next = sin(angle1) * nextPos + cos(angle1) * nextPos;
      line(x1, y1, x1next, y1next);
    }
  }
  
  colorMode(RGB, 255);
}

function drawWaveInterference() {
  let density = map(mouseX, 0, width, 10, 50);
  let freq = map(mouseY, 0, height, 0.01, 0.1);
  
  // Dynamic wave sources that move
  let source1X = -100 + sin(phase) * 50;
  let source1Y = -100 + cos(phase) * 50;
  let source2X = 100 + cos(phase) * 50;
  let source2Y = 100 + sin(phase) * 50;
  
  strokeWeight(2);
  
  // Draw the wave interference pattern
  for (let x = -400; x < 400; x += density) {
    for (let y = -300; y < 300; y += density) {
      let dist1 = dist(x, y, source1X, source1Y);
      let dist2 = dist(x, y, source2X, source2Y);
      let val = sin(dist1 * freq + phase) * cos(dist2 * freq + phase);
      
      // Create vibrant colors
      let hue = (val * 180 + phase * 50) % 360;
      let brightness = map(val, -1, 1, 30, 100);
      
      colorMode(HSB, 360, 100, 100);
      stroke(hue, 80, brightness);
      
      // Draw point with size variation
      let pointSize = map(abs(val), 0, 1, 1, 4);
      strokeWeight(pointSize);
      point(x, y);
    }
  }
  
  colorMode(RGB, 255);
}

function drawUI() {
  fill(0, 200);
  noStroke();
  rect(10, 10, 320, 55, 5);
  
  fill(255);
  strokeWeight(1);
  textSize(12);
  textAlign(LEFT);
  text("Press 1, 2, 3 to change variation | Move mouse for interaction", 20, 30);
  text("Variation: " + (variation + 1) + " | FPS: " + floor(frameRate()), 20, 50);
  
  // Variation descriptions
  textAlign(RIGHT);
  let descriptions = [
    "Concentric Circles with Mouse Offset",
    "Rotating Grid with Web Effect", 
    "Wave Interference Pattern"
  ];
  text(descriptions[variation], width - 20, 30);
}

function keyPressed() {
  if (key === '1') variation = 0;
  if (key === '2') variation = 1;
  if (key === '3') variation = 2;
  if (key === ' ') phase = 0; 
}