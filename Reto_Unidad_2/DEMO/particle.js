class Particle {
  constructor(type, x, y) {
    this.type = type;
    this.position = { x, y };
    this.velocity = Particle.randomVelocity();
    this.acceleration = { x: 0, y: 0 };
    this.mass = Config.teams[type].mass;
  }

  static randomVelocity() {
    const angle = (Simulation && typeof Simulation.random === 'function')
      ? Simulation.random() * Math.PI * 2
      : Math.random() * Math.PI * 2;
    return { x: Math.cos(angle), y: Math.sin(angle) };
  }

  resetAcceleration() {
    this.acceleration.x = 0;
    this.acceleration.y = 0;
  }

  applyForce(force) {
    this.acceleration.x += force.x / this.mass;
    this.acceleration.y += force.y / this.mass;
  }

  limitAcceleration(maxAccel) {
    const ax = this.acceleration.x;
    const ay = this.acceleration.y;
    const magnitude = Math.hypot(ax, ay);
    if (magnitude > maxAccel) {
      const scale = maxAccel / magnitude;
      this.acceleration.x *= scale;
      this.acceleration.y *= scale;
    }
  }

  update(maxSpeed, friction) {
    this.limitAcceleration(maxSpeed * 0.75);
    this.velocity.x += this.acceleration.x;
    this.velocity.y += this.acceleration.y;

    const speed = Math.hypot(this.velocity.x, this.velocity.y);
    if (speed > maxSpeed) {
      const scale = maxSpeed / speed;
      this.velocity.x *= scale;
      this.velocity.y *= scale;
    }

    this.velocity.x *= friction;
    this.velocity.y *= friction;

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }

  wrapEdges(width, height) {
    if (this.position.x < 0) this.position.x += width;
    if (this.position.x >= width) this.position.x -= width;
    if (this.position.y < 0) this.position.y += height;
    if (this.position.y >= height) this.position.y -= height;
  }

  display(ctx, size) {
    const color = Config.teams[this.type].color;
    ctx.fillStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.92)`;
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, size, 0, Math.PI * 2);
    ctx.fill();
  }
}
