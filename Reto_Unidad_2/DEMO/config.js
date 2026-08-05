const Config = {
  teams: [
    { name: 'Nacional', color: [30, 220, 80], mass: 1.0 },
    { name: 'Santa Fe', color: [255, 60, 60], mass: 0.95 },
    { name: 'Bucaramanga', color: [255, 225, 65], mass: 1.05 },
    { name: 'Millonarios', color: [80, 145, 255], mass: 1.0 },
    { name: 'Envigado', color: [255, 145, 60], mass: 0.98 }
  ],
  defaultSettings: {
    interactionRadius: 130,
    maxForce: 0.18,
    maxAccel: 1.2,
    friction: 0.94,
    maxSpeed: 4.2,
    particleSize: 5,
    positionMode: 'random',
    counts: [40, 30, 20, 25, 25],
    seed: Math.floor(Date.now() % 1000000)
  }
};
