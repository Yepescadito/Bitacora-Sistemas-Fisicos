const Simulation = {
  particles: [],
  isPaused: false,
  lastFrameTime: 0,
  fps: 0,

  settings: {
    interactionRadius: Config.defaultSettings.interactionRadius,
    maxForce: Config.defaultSettings.maxForce,
    maxAccel: Config.defaultSettings.maxAccel,
    friction: Config.defaultSettings.friction,
    maxSpeed: Config.defaultSettings.maxSpeed,
    particleSize: Config.defaultSettings.particleSize,
    counts: Config.defaultSettings.counts.slice(),
    positionMode: Config.defaultSettings.positionMode,
    seed: Config.defaultSettings.seed
  },

  initialize(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.resizeCanvas();
    Matrix.initDefaults();
    this.reset();
    window.requestAnimationFrame(this.loop.bind(this));
  },

  resizeCanvas() {
    if (!this.canvas) return;
    this.canvas.width = this.canvas.clientWidth;
    this.canvas.height = this.canvas.clientHeight;
  },

  seedRandom(seed) {
    this._seed = Number(seed) >>> 0;
  },

  random() {
    this._seed = (this._seed * 1664525 + 1013904223) >>> 0;
    return this._seed / 4294967296;
  },

  generateSeed(seed) {
    const sanitized = Number(seed) || 0;
    const result = Math.abs(sanitized % 1000000);
    this.settings.seed = result;
    return result;
  },

  reset() {
    this.particles = [];
    this.isPaused = false;
    this.seedRandom(this.settings.seed);
    this.createParticles();
  },

  createParticles() {
    this.particles = [];
    const { counts, positionMode } = this.settings;
    for (let type = 0; type < Config.teams.length; type++) {
      for (let i = 0; i < counts[type]; i++) {
        const position = this.generatePosition(type, positionMode);
        this.particles.push(new Particle(type, position.x, position.y));
      }
    }
  },

  generatePosition(type, mode) {
    const w = this.canvas.width;
    const h = this.canvas.height;
    const angle = this.random() * Math.PI * 2;

    if (mode === 'centered') {
      const radius = Math.min(w, h) * 0.12;
      return {
        x: w / 2 + Math.cos(angle) * radius,
        y: h / 2 + Math.sin(angle) * radius
      };
    }

    if (mode === 'circle') {
      const radius = Math.min(w, h) * 0.35;
      return {
        x: w / 2 + Math.cos(angle) * radius,
        y: h / 2 + Math.sin(angle) * radius
      };
    }

    if (mode === 'clusters') {
      const clusterRadius = Math.min(w, h) * 0.15;
      const clusterAngle = (type / Config.teams.length) * Math.PI * 2;
      const clusterCenter = {
        x: w / 2 + Math.cos(clusterAngle) * Math.min(w, h) * 0.25,
        y: h / 2 + Math.sin(clusterAngle) * Math.min(w, h) * 0.25
      };
      const distance = this.random() * clusterRadius;
      return {
        x: clusterCenter.x + Math.cos(angle) * distance,
        y: clusterCenter.y + Math.sin(angle) * distance
      };
    }

    return {
      x: this.random() * w,
      y: this.random() * h
    };
  },

  loop(timestamp) {
    const dt = timestamp - this.lastFrameTime;
    this.lastFrameTime = timestamp;
    if (dt > 0) {
      this.fps = 1000 / dt;
    }

    if (!this.isPaused) {
      this.update();
      this.render();
    }

    UI.updateStats(Math.round(this.fps), this.particles.length, this.settings.seed);
    window.requestAnimationFrame(this.loop.bind(this));
  },

  update() {
    const particles = this.particles;
    const length = particles.length;
    const radius = this.settings.interactionRadius;
    const radiusSq = radius * radius;
    const maxForce = this.settings.maxForce;
    const maxAccel = this.settings.maxAccel;

    for (let i = 0; i < length; i++) {
      const particle = particles[i];
      particle.resetAcceleration();

      for (let j = 0; j < length; j++) {
        if (i === j) continue;
        const other = particles[j];
        const offset = this.computeToroidalOffset(particle.position, other.position);
        const distSq = offset.x * offset.x + offset.y * offset.y;
        if (distSq === 0 || distSq > radiusSq) continue;

        const distance = Math.sqrt(distSq);
        const relation = Matrix.getValue(particle.type, other.type);
        const forceMagnitude = (1 - distance / radius) * maxForce * relation;
        const invDist = 1 / distance;
        particle.applyForce({
          x: offset.x * invDist * forceMagnitude,
          y: offset.y * invDist * forceMagnitude
        });
      }

      if (particle.type === 4) {
        const wander = Particle.randomVelocity();
        particle.applyForce({ x: wander.x * 0.02, y: wander.y * 0.02 });
      }

      particle.limitAcceleration(maxAccel);
      particle.update(this.settings.maxSpeed, this.settings.friction);
      particle.wrapEdges(this.canvas.width, this.canvas.height);
    }
  },

  render() {
    const ctx = this.ctx;
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    for (const particle of this.particles) {
      particle.display(ctx, this.settings.particleSize);
    }
  },

  computeToroidalOffset(source, target) {
    const dx = target.x - source.x;
    const dy = target.y - source.y;
    const width = this.canvas.width;
    const height = this.canvas.height;
    return {
      x: dx > width / 2 ? dx - width : dx < -width / 2 ? dx + width : dx,
      y: dy > height / 2 ? dy - height : dy < -height / 2 ? dy + height : dy
    };
  }
};
