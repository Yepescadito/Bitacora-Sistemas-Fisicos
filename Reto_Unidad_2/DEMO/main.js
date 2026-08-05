window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('simCanvas');
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;

  UI.init();
  Simulation.initialize(canvas);

  window.addEventListener('resize', () => {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    Simulation.resizeCanvas();
    Simulation.reset();
  });
});
