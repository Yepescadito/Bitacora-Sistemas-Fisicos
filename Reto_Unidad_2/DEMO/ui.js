const UI = {
  elements: {},

  init() {
    this.elements = {
      interactionRadius: document.getElementById('interactionRadius'),
      interactionRadiusValue: document.getElementById('interactionRadiusValue'),
      maxForce: document.getElementById('maxForce'),
      maxForceValue: document.getElementById('maxForceValue'),
      maxAccel: document.getElementById('maxAccel'),
      maxAccelValue: document.getElementById('maxAccelValue'),
      friction: document.getElementById('friction'),
      frictionValue: document.getElementById('frictionValue'),
      maxSpeed: document.getElementById('maxSpeed'),
      maxSpeedValue: document.getElementById('maxSpeedValue'),
      particleSize: document.getElementById('particleSize'),
      particleSizeValue: document.getElementById('particleSizeValue'),
      positionMode: document.getElementById('positionMode'),
      countInputs: [
        document.getElementById('count0'),
        document.getElementById('count1'),
        document.getElementById('count2'),
        document.getElementById('count3'),
        document.getElementById('count4')
      ],
      pauseButton: document.getElementById('pauseButton'),
      resumeButton: document.getElementById('resumeButton'),
      resetButton: document.getElementById('resetButton'),
      newSimulationButton: document.getElementById('newSimulationButton'),
      randomizeMatrixButton: document.getElementById('randomizeMatrixButton'),
      fpsValue: document.getElementById('fpsValue'),
      particleCount: document.getElementById('particleCount'),
      matrixTable: document.getElementById('matrixTable')
    };

    Matrix.initDefaults();
    this.bindControls();
    this.buildMatrixUI();
    this.updateControlValues();
  },

  bindControls() {
    const setNumber = (element, setter) => {
      element.addEventListener('input', () => {
        setter(element.value);
        this.updateControlValues();
      });
    };

    setNumber(this.elements.interactionRadius, value => Simulation.settings.interactionRadius = Number(value));
    setNumber(this.elements.maxForce, value => Simulation.settings.maxForce = Number(value));
    setNumber(this.elements.maxAccel, value => Simulation.settings.maxAccel = Number(value));
    setNumber(this.elements.friction, value => Simulation.settings.friction = Number(value));
    setNumber(this.elements.maxSpeed, value => Simulation.settings.maxSpeed = Number(value));
    setNumber(this.elements.particleSize, value => Simulation.settings.particleSize = Number(value));

    this.elements.positionMode.addEventListener('change', () => {
      Simulation.settings.positionMode = this.elements.positionMode.value;
      Simulation.reset();
    });

    this.elements.countInputs.forEach((input, index) => {
      input.addEventListener('change', () => {
        Simulation.settings.counts[index] = Number(input.value);
        Simulation.reset();
      });
    });

    this.elements.pauseButton.addEventListener('click', () => {
      Simulation.isPaused = true;
    });

    this.elements.resumeButton.addEventListener('click', () => {
      Simulation.isPaused = false;
    });

    this.elements.resetButton.addEventListener('click', () => {
      Simulation.reset();
    });

    this.elements.newSimulationButton.addEventListener('click', () => {
      const newSeed = Math.floor(Math.random() * 1000000);
      Simulation.generateSeed(newSeed);
      this.elements.seedInput.value = Simulation.settings.seed;
      Simulation.reset();
    });

    this.elements.randomizeMatrixButton.addEventListener('click', () => {
      Matrix.randomize();
      this.updateMatrixUI();
    });
  },

  buildMatrixUI() {
    const headerRow = document.createElement('div');
    headerRow.className = 'matrix-row header';
    headerRow.innerHTML = '<div></div>' + Config.teams.map(team => `
      <div class="matrix-label matrix-dot team-${team.name.toLowerCase().replace('é', 'e').replace('í', 'i')}" title="${team.name}"></div>
    `).join('');
    this.elements.matrixTable.appendChild(headerRow);

    Matrix.values.forEach((row, rowIndex) => {
      const rowElement = document.createElement('div');
      rowElement.className = 'matrix-row';
      const label = document.createElement('div');
      label.className = `matrix-label matrix-dot team-${Config.teams[rowIndex].name.toLowerCase().replace('é', 'e').replace('í', 'i')}`;
      label.title = Config.teams[rowIndex].name;
      rowElement.appendChild(label);

      row.forEach((value, colIndex) => {
        const cell = document.createElement('div');
        cell.className = 'matrix-cell';

        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = -1;
        slider.max = 1;
        slider.step = 0.02;
        slider.value = value;
        slider.dataset.row = rowIndex;
        slider.dataset.col = colIndex;
        slider.title = `${Config.teams[rowIndex].name} → ${Config.teams[colIndex].name}: ${value.toFixed(2)}`;

        const valueLabel = document.createElement('div');
        valueLabel.className = 'matrix-value';
        valueLabel.textContent = value.toFixed(2);

        slider.addEventListener('input', () => {
          const r = Number(slider.dataset.row);
          const c = Number(slider.dataset.col);
          const val = Number(slider.value);
          Matrix.setValue(r, c, val);
          valueLabel.textContent = val.toFixed(2);
          this.updateMatrixCellColor(cell, val);
          slider.title = `${Config.teams[r].name} → ${Config.teams[c].name}: ${val.toFixed(2)}`;
        });

        this.updateMatrixCellColor(cell, value);
        cell.appendChild(slider);
        cell.appendChild(valueLabel);
        rowElement.appendChild(cell);
      });

      this.elements.matrixTable.appendChild(rowElement);
    });
  },

  updateMatrixUI() {
    const sliders = this.elements.matrixTable.querySelectorAll('input[type="range"]');
    sliders.forEach(slider => {
      const row = Number(slider.dataset.row);
      const col = Number(slider.dataset.col);
      const value = Matrix.getValue(row, col);
      slider.value = value;
      const cell = slider.closest('.matrix-cell');
      const label = cell.querySelector('.matrix-value');
      if (label) label.textContent = value.toFixed(2);
      this.updateMatrixCellColor(cell, value);
      slider.title = `${Config.teams[row].name} → ${Config.teams[col].name}: ${value.toFixed(2)}`;
    });
  },

  updateControlValues() {
    this.elements.interactionRadiusValue.textContent = Simulation.settings.interactionRadius;
    this.elements.maxForceValue.textContent = Simulation.settings.maxForce.toFixed(2);
    this.elements.maxAccelValue.textContent = Simulation.settings.maxAccel.toFixed(2);
    this.elements.frictionValue.textContent = Simulation.settings.friction.toFixed(2);
    this.elements.maxSpeedValue.textContent = Simulation.settings.maxSpeed.toFixed(1);
    this.elements.particleSizeValue.textContent = Simulation.settings.particleSize;
    this.elements.countInputs.forEach((input, index) => input.value = Simulation.settings.counts[index]);
    this.elements.positionMode.value = Simulation.settings.positionMode;
  },

  updateStats(fps, totalParticles) {
    this.elements.fpsValue.textContent = fps;
    this.elements.particleCount.textContent = totalParticles;
  },

  updateMatrixCellColor(cell, value) {
    const intensity = Math.min(1, Math.abs(value));
    const positive = value > 0;
    const negative = value < 0;
    const base = positive ? [48, 210, 45] : negative ? [220, 35, 35] : [30, 30, 30];
    const alpha = 0.18 + intensity * 0.6;
    const brightness = 0.08 + intensity * 0.35;
    const background = negative || positive
      ? `rgba(${base[0]}, ${base[1]}, ${base[2]}, ${alpha})`
      : `rgba(18, 18, 18, 0.95)`;

    cell.style.background = background;
    cell.style.boxShadow = negative || positive
      ? `inset 0 0 0 1px rgba(255,255,255, ${0.06 + brightness * 0.1})`
      : 'inset 0 0 0 1px rgba(255,255,255, 0.06)';
  }
};
