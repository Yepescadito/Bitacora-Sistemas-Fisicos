// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

let walker;

function setup() {
  createCanvas(640, 240);
  walker = new Walker();
  background(255);
}

function draw() {
  walker.step();
  walker.show();
}

class Walker {
  constructor() {
    this.x = width / 2;
    this.y = height / 2;
  }


  
  show() {
    stroke("blue");
    fill(0, 10);
    circle(this.x, 120, 16);
    //circle(this.x, this.y, 25);
    //point(this.x, this.y);
  }

  step() {
    this.x = randomGaussian(width / 2, 60);
  }
}