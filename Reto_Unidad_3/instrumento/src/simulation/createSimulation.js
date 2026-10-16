import * as THREE from 'three/webgpu';
import {
  Fn,
  If,
  color,
  hash,
  instanceIndex,
  instancedArray,
  max,
  mix,
  mod,
  step,
  uint,
  uv,
  vec3,
  vec4
} from 'three/tsl';

export function createSimulation({ renderer, scene, params, count = 131072 }) {
  // STATE -----------------------------------------------------------------
  // Each particle owns position and velocity. The arrays live in GPU storage.
  const positionBuffer = instancedArray(count, 'vec3');
  const velocityBuffer = instancedArray(count, 'vec3');

  // INITIALIZATION --------------------------------------------------------
  // A compute pass writes the initial state for every particle in parallel.
  const initParticles = Fn(() => {
    const i = instanceIndex;
    const p = positionBuffer.element(i);
    const v = velocityBuffer.element(i);

    const r1 = hash(i.add(uint(11)));
    const r2 = hash(i.add(uint(23)));
    const r3 = hash(i.add(uint(37)));
    const r4 = hash(i.add(uint(53)));
    const r5 = hash(i.add(uint(71)));
    const r6 = hash(i.add(uint(89)));

    p.assign(vec3(r1, r2, r3).sub(0.5).mul(params.boundsSize.mul(0.45)));
    v.assign(vec3(r4, r5, r6).sub(0.5).mul(params.initialSpeed));
  })().compute(count).setName('Initialize Particles');

  // UPDATE / COMPUTE SHADER ----------------------------------------------
  // This is the conceptual heart of the project:
  // state -> forces -> acceleration -> velocity -> position.
  const updateParticles = Fn(() => {
    const p = positionBuffer.element(instanceIndex);
    const v = velocityBuffer.element(instanceIndex);

    const dt = params.dt.mul(params.timeScale);
    const force = vec3(0.0).toVar();

    // 1) CONSTANT / WIND FORCE
    force.addAssign(params.wind.mul(params.windEnabled));

    // 2) RADIAL FORCE (positive = attraction, negative = repulsion)
    const toAttractor = params.attractor.sub(p);
    const distance = max(toAttractor.length(), params.softening);
    const radialDirection = toAttractor.div(distance);
    const radialForce = radialDirection
      .mul(params.radialStrength)
      .div(distance.pow(2))
      .mul(params.radialEnabled);
    force.addAssign(radialForce);

    // 3) VORTEX FORCE: tangent to the radial direction around Z.
    const zAxis = vec3(0.0, 0.0, 1.0);
    const tangent = zAxis.cross(radialDirection);
    force.addAssign(tangent.mul(params.vortexStrength).mul(params.vortexEnabled));

    // 4) LINEAR DRAG: F = -c v
    force.addAssign(v.mul(params.dragCoefficient).mul(params.dragEnabled).mul(-1.0));

    // [NUEVO] r̂ hacia afuera (desde el atractor hacia la partícula) y distancia r
    const outward = radialDirection.mul(-1.0);
    const r = toAttractor.length();

    // 5) [NUEVO] CONFINAMIENTO (cáscara elástica): F = -k · max(0, r - R) · r̂
    // Adentro de la cáscara no hace nada; afuera, un resorte de una sola cara la devuelve.
    const outside = max(r.sub(params.shellRadius), 0.0);
    force.addAssign(outward.mul(outside).mul(params.shellStiffness).mul(params.shellEnabled).mul(-1.0));

    // 6) [NUEVO] LIBERACIÓN: F = E(t) · r̂ / (r + s). E(t) llega desde la CPU ya decayendo.
    // Se divide entre (r + s) y no entre r²: así la onda empuja también a las lejanas.
    force.addAssign(outward.mul(params.blast).div(r.add(params.softening)));

    // INTEGRATION ---------------------------------------------------------
    // Unit mass: a = F. Semi-implicit Euler: update v, then p.
    v.addAssign(force.mul(dt));

    const speed = v.length();
    If(speed.greaterThan(params.maxSpeed), () => {
      v.assign(v.normalize().mul(params.maxSpeed));
    });

    p.addAssign(v.mul(dt));

    // Periodic boundary conditions: particles leaving one side re-enter.
    const half = params.boundsSize.mul(0.5);
    p.assign(mod(p.add(half), params.boundsSize).sub(half));
  })().compute(count).setName('Update Particles');

  // RENDER ---------------------------------------------------------------
  // Rendering does not recompute the physics. It consumes the GPU state.
  const material = new THREE.SpriteNodeMaterial({
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    transparent: true
  });

  material.positionNode = positionBuffer.toAttribute();
  material.scaleNode = params.particleSize;

  material.colorNode = Fn(() => {
    const speed = velocityBuffer.toAttribute().length();
    const t = speed.div(params.maxSpeed).clamp(0.0, 1.0);
    // [NUEVO] la presión calienta la paleta: en reposo azul → cian; comprimida, violeta → blanco
    const slow = mix(color('#2f6bff'), color('#b04bff'), params.pressure);
    const fast = mix(color('#7fe8ff'), color('#fff1e0'), params.pressure);
    return vec4(mix(slow, fast, t), 1.0);
  })();

  // Circular sprite mask, avoiding visible square planes.
  material.opacityNode = step(uv().xy.sub(0.5).length(), 0.5);

  const geometry = new THREE.PlaneGeometry(1, 1);
  const mesh = new THREE.InstancedMesh(geometry, material, count);
  mesh.frustumCulled = false;
  scene.add(mesh);

  function reset() {
    renderer.compute(initParticles);
  }

  function stepSimulation() {
    renderer.compute(updateParticles);
  }

  // [NUEVO] MEDICIÓN: copia los buffers de la GPU a la CPU y resume el estado en números,
  // para comparar predicción y observación en el LAB sin depender de "se ve bien".
  // r̂ es la dirección hacia afuera desde el atractor; el giro se mide alrededor del eje Z.
  async function measure(center, sample = 64) {
    const P = new Float32Array(await renderer.getArrayBufferAsync(positionBuffer.value));
    const V = new Float32Array(await renderer.getArrayBufferAsync(velocityBuffer.value));
    const stride = P.length / count; // vec3 puede venir alineado a 4 floats
    let n = 0, r = 0, vr = 0, vt = 0, vx = 0, speed = 0;
    for (let i = 0; i < count; i += sample) {
      const k = i * stride;
      const dx = P[k] - center.x, dy = P[k + 1] - center.y, dz = P[k + 2] - center.z;
      const vxi = V[k], vyi = V[k + 1], vzi = V[k + 2];
      const d = Math.hypot(dx, dy, dz) || 1e-6, dxy = Math.hypot(dx, dy) || 1e-6;
      r += d;
      vr += (dx * vxi + dy * vyi + dz * vzi) / d;   // + se aleja, − se acerca
      vt += (-dy * vxi + dx * vyi) / dxy;           // + gira antihorario visto desde +Z
      vx += vxi;
      speed += Math.hypot(vxi, vyi, vzi);
      n++;
    }
    return { radioMedio: r / n, velRadial: vr / n, velGiro: vt / n, velX: vx / n, rapidez: speed / n, muestras: n };
  }

  function dispose() {
    geometry.dispose();
    material.dispose();
    scene.remove(mesh);
  }

  return {
    count,
    positionBuffer,
    velocityBuffer,
    reset,
    stepSimulation,
    measure,
    dispose
  };
}
