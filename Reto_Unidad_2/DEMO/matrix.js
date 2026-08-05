const Matrix = {
  defaultValues: [
    [ 0.8, -1.0,  0.5,  0.3,  0.2],
    [-1.0, -0.3, -0.4, -0.6, -0.5],
    [ 0.0,  0.4,  0.6,  0.2,  0.5],
    [ 0.5, -0.5,  0.3,  0.7,  0.0],
    [-0.2,  0.4, -0.1,  0.5, -0.3]
  ],
  values: [],
  initDefaults() {
    this.values = this.defaultValues.map(row => row.slice());
  },
  getValue(row, col) {
    return this.values[row][col];
  },
  setValue(row, col, value) {
    this.values[row][col] = Number(value);
  },
  randomize() {
    for (let row = 0; row < this.values.length; row++) {
      for (let col = 0; col < this.values[row].length; col++) {
        this.values[row][col] = Number((Math.random() * 2 - 1).toFixed(2));
      }
    }
  }
};
