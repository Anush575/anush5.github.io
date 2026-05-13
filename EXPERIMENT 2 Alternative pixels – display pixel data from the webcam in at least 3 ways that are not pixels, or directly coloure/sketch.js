let video;
let mode = 0;
let step;

function setup() {
  createCanvas(800, 600);
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  step = 10;
  textFont('monospace');
}

function draw() {
  video.loadPixels();

  // subtle trail effect instead of hard background clear
  background(0, 40);

  // mirror view
  translate(width, 0);
  scale(-1, 1);

  for (let x = 0; x < width; x += step) {
    for (let y = 0; y < height; y += step) {

      let index = ((x + y * video.width) * 4);

      let r = video.pixels[index];
      let g = video.pixels[index + 1];
      let b = video.pixels[index + 2];

      let brightness = (r + g + b) / 3;

      // slight time animation
      let t = millis() * 0.002;

      if (mode === 0) {
        //  Smooth circles
        let size = map(brightness, 0, 255, step * 0.2, step * 1.5);
        fill(r, g, b, 200);
        noStroke();
        circle(x, y, size + sin(t + x * 0.01) * 2);
      }

      else if (mode === 1) {
        //  Dynamic rotating lines
        let len = map(brightness, 0, 255, 2, step * 2);
        stroke(r, g, b, 180);
        strokeWeight(1);

        let angle = t + (x + y) * 0.01;
        line(x, y, x + cos(angle) * len, y + sin(angle) * len);
      }

      else if (mode === 2) {
        //  ASCII density field
        let chars = " .:-=+*#%@";
        let idx = floor(map(brightness, 0, 255, 0, chars.length - 1));

        fill(r, g, b, 220);
        noStroke();
        textSize(step);
        text(chars[idx], x, y);
      }

      else if (mode === 3) {
        //  RGB offset glitch effect
        let offset = sin(t + y * 0.01) * 5;

        fill(r, 0, 0, 180);
        circle(x + offset, y, step * 0.6);

        fill(0, g, 0, 180);
        circle(x, y, step * 0.6);

        fill(0, 0, b, 180);
        circle(x - offset, y, step * 0.6);
      }

      else if (mode === 4) {
        //  Pulsing mosaic tiles
        let pulse = sin(t + brightness * 0.01) * 3;

        fill(r, g, b, 200);
        noStroke();
        rect(x, y, step + pulse, step + pulse);
      }
    }
  }

  resetMatrix();
  drawUI();
}

function drawUI() {
  fill(255);
  textSize(14);
  textAlign(LEFT);

  text("Mode: " + mode, 20, 30);
  text("Keys: 1-5 change mode", 20, 50);
  text("Mouse X = resolution", 20, 70);
  text("Step: " + step, 20, 90);
}

function keyPressed() {
  if (key >= '1' && key <= '5') {
    mode = int(key) - 1;
  }
}

function mouseMoved() {
  step = int(map(mouseX, 0, width, 4, 25));
}