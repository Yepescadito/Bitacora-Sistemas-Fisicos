import * as THREE from 'three/webgpu';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import WebGPU from 'three/addons/capabilities/WebGPU.js';
import './styles.css';

import { createParameters } from './simulation/parameters.js';
import { createSimulation } from './simulation/createSimulation.js';
import { createLabPanel } from './ui/labPanel.js';
import { createScoreView } from './ui/scoreView.js';



/*
2^15: 32768
2^16: 65536
2^17: 131072
2^18: 262144
2^19: 524288
2^20: 1048576
2^21: 2097152
2^22: 4194304
2^23: 8388608
2^24: 16777216
*/

const PARTICLE_COUNT = 131072; //2^17. Increase only after measuring performance.

// [NUEVO] MODELO DE PRESIÓN Y LIBERACIÓN (lado CPU) ------------------------
// Sostener espacio carga la presión p (0 → 1 en `carga` segundos):
//   radio de la cáscara  R(p) = R0 − (R0 − Rmin) · p     (se comprime)
//   rigidez              k(p) = k0 · (1 + 4p)               (aprieta más)
//   arrastre             c(p) = c0 + cExtra · p             (frena: así la fuerza centrífuga no le gana)
//   giro                 g(p) = giroBase + giroExtra · p    (un poco más de giro, no mucho)
// Soltar espacio libera: E0 = Emax · p y la explosión decae E(t) = E0 · e^(−t/τ).
// La cáscara se rompe al liberar y su rigidez vuelve en `rehacer` segundos.
const PRESION = { carga: 5, R0: 3.4, Rmin: 0.6, giroExtra: 1.5, Emax: 18, tau: 0.6, rehacer: 3, kCascara: 4, c0: 0.25, cExtra: 1.2, limites: 16 };

async function main() {
  const mount = document.querySelector('#app');

  if (!WebGPU.isAvailable()) {
    mount.appendChild(WebGPU.getErrorMessage());
    throw new Error('Este proyecto requiere WebGPU para ejecutar compute shaders.');
  }

  // THREE.JS MENTAL MODEL: scene + camera + renderer ---------------------
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#050607');

  const camera = new THREE.PerspectiveCamera(50, innerWidth / innerHeight, 0.05, 100);
  camera.position.set(0, 0, 11);

  const renderer = new THREE.WebGPURenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(innerWidth, innerHeight);
  mount.appendChild(renderer.domElement);
  await renderer.init();

  const orbit = new OrbitControls(camera, renderer.domElement);
  orbit.enableDamping = true;
  orbit.enableZoom = false; // [NUEVO] la rueda queda para el giro del instrumento
  orbit.target.set(0, 0, 0);

  const params = createParameters();
  const simulation = createSimulation({ renderer, scene, params, count: PARTICLE_COUNT });

  // LAB HELPERS -----------------------------------------------------------
  const attractorHelper = new THREE.Mesh(
    new THREE.SphereGeometry(0.12, 16, 12),
    new THREE.MeshBasicMaterial({ color: '#ffffff' })
  );
  scene.add(attractorHelper);
  const axes = new THREE.AxesHelper(1.5);
  scene.add(axes);
  // [NUEVO] la cáscara visible en el LAB (alambre), para comparar su radio con la nube
  const shellHelper = new THREE.Mesh(
    new THREE.SphereGeometry(1, 24, 16),
    new THREE.MeshBasicMaterial({ color: '#b04bff', wireframe: true, transparent: true, opacity: 0.25 })
  );
  scene.add(shellHelper);

  // POINTER -> WORLD POSITION --------------------------------------------
  // This is a useful camera concept: screen coordinates are not world coords.
  const pointerNdc = new THREE.Vector2();
  const raycaster = new THREE.Raycaster();
  const interactionPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  const hit = new THREE.Vector3();

  addEventListener('pointermove', (event) => {
    pointerNdc.x = (event.clientX / innerWidth) * 2 - 1;
    pointerNdc.y = -(event.clientY / innerHeight) * 2 + 1;
    raycaster.setFromCamera(pointerNdc, camera);
    if (raycaster.ray.intersectPlane(interactionPlane, hit)) {
      params.attractor.value.copy(hit);
      attractorHelper.position.copy(hit);
    }
  });

  let paused = false;
  let mode = 'LAB';
  let panel;

  // [NUEVO] estado del instrumento
  const inst = {
    presion: 0, cargando: false,
    E0: 0, tLib: -1e9,          // explosión: amplitud inicial y momento de la liberación
    tRotura: -1e9,              // cuándo se rompió la cáscara
    giroBase: 1.2, calma: false,
    reloj: 0,
  };

  // [NUEVO] configuración de partida del modo PERFORMANCE: cáscara + atracción suave + giro + arrastre
  const configurarPerformance = () => {
    params.windEnabled.value = 0;
    params.radialEnabled.value = 1; params.radialStrength.value = 1.0;
    params.vortexEnabled.value = 1; params.vortexStrength.value = inst.giroBase;
    params.dragEnabled.value = 1; params.dragCoefficient.value = PRESION.c0;
    params.shellEnabled.value = 1; params.shellRadius.value = PRESION.R0; params.shellStiffness.value = PRESION.kCascara;
    params.maxSpeed.value = 8;
    params.boundsSize.value = PRESION.limites; // espacio más grande: la explosión no reaparece por el otro lado
    panel?.refresh();
  };

  const applyPreset = (id) => {
    params.windEnabled.value = 0;
    params.radialEnabled.value = 0;
    params.vortexEnabled.value = 0;
    params.dragEnabled.value = 0;
    params.shellEnabled.value = 0;   // [NUEVO]
    params.blast.value = 0;          // [NUEVO]
    inst.E0 = 0; inst.presion = 0;   // [NUEVO]
    params.boundsSize.value = 10;    // [NUEVO] las pruebas usan el espacio original del proyecto base
    params.wind.value.set(0, 0, 0);
    params.initialSpeed.value = 0;

    if (id === 'inertia') {
      params.initialSpeed.value = 0.8;
    } else if (id === 'wind') {
      params.windEnabled.value = 1;
      params.wind.value.set(1.5, 0, 0);
    } else if (id === 'attract') {
      params.radialEnabled.value = 1;
      params.radialStrength.value = 3.0;
    } else if (id === 'repel') {
      params.radialEnabled.value = 1;
      params.radialStrength.value = -3.0;
    } else if (id === 'vortex') {
      params.radialEnabled.value = 1;
      params.radialStrength.value = 1.0;
      params.vortexEnabled.value = 1;
      params.vortexStrength.value = 3.0;
      params.dragEnabled.value = 1;
      params.dragCoefficient.value = 0.08;
    } else if (id === 'shell') {
      // [NUEVO] 6 · Confinamiento aislado: solo la cáscara (R = 2) y un poco de arrastre para que se asienten
      params.shellEnabled.value = 1;
      params.shellRadius.value = 2.0;
      params.shellStiffness.value = PRESION.kCascara;
      params.dragEnabled.value = 1;
      params.dragCoefficient.value = 0.6;
    } else if (id === 'blast') {
      // [NUEVO] 7 · Liberación aislada: desde el reposo, una explosión de amplitud Emax y nada más
      inst.E0 = PRESION.Emax; inst.tLib = inst.reloj;
    }
    simulation.reset();
    panel?.refresh();
  };

  // [NUEVO] presión: cargar mientras se sostiene espacio, liberar al soltar
  const empezarCarga = () => { inst.cargando = true; };
  const liberar = () => {
    if (!inst.cargando) return;
    inst.cargando = false;
    inst.E0 = PRESION.Emax * inst.presion;
    inst.tLib = inst.reloj;
    inst.tRotura = inst.reloj;
    inst.presion = 0;
  };

  const setMode = (next) => {
    mode = next;
    const lab = mode === 'LAB';
    panel.setVisible(lab);
    axes.visible = lab;
    attractorHelper.visible = lab;
    if (!lab) configurarPerformance(); // [NUEVO]
    //orbit.enabled = lab;
    hud.innerHTML = lab
      ? '<strong>LAB</strong> · P: performance · R: reset · 1–7: pruebas · espacio: presión'
      //: '<strong>PERFORMANCE</strong> · P: lab · espacio: invertir radial · puntero: atractor';
      : '';
  };

  panel = createLabPanel({
    params,
    onReset: () => simulation.reset(),
    onPreset: applyPreset,
    onModeChange: () => setMode(mode === 'LAB' ? 'PERFORMANCE' : 'LAB'),
    onPauseChange: () => paused = !paused,
    onBlast: () => { inst.E0 = PRESION.Emax; inst.tLib = inst.reloj; } // [NUEVO]
  });

  const hud = document.createElement('div');
  hud.className = 'hud';
  document.body.append(hud);

  // [NUEVO] barra de presión (solo la ve quien interpreta; H la oculta)
  const barra = document.createElement('div');
  barra.className = 'pressure';
  barra.innerHTML = '<i></i>';
  document.body.append(barra);

  // [NUEVO] música y score: el audio solo suena; no se analiza ni controla nada
  const score = createScoreView();

  setMode('LAB');

  // BASELINE LIVE INSTRUMENT MAPPING -------------------------------------
  // [NUEVO] Mapeo propio del instrumento:
  //   espacio (sostener / soltar) → cargar presión / liberar
  //   puntero                     → centro (atractor)
  //   rueda                       → giro (vórtice), cambia de sentido al pasar por 0
  //   shift (sostener)            → calma: arrastre alto, todo se queda quieto
  addEventListener('keydown', (event) => {
    if (event.code === 'Space') event.preventDefault();
    if (event.repeat) return;
    if (event.code === 'KeyP') setMode(mode === 'LAB' ? 'PERFORMANCE' : 'LAB');
    if (event.code === 'KeyR') simulation.reset();
    if (event.code === 'Digit1') applyPreset('inertia');
    if (event.code === 'Digit2') applyPreset('wind');
    if (event.code === 'Digit3') applyPreset('attract');
    if (event.code === 'Digit4') applyPreset('repel');
    if (event.code === 'Digit5') applyPreset('vortex');
    if (event.code === 'Digit6') applyPreset('shell');
    if (event.code === 'Digit7') applyPreset('blast');
    if (event.code === 'Space') empezarCarga();
    if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') inst.calma = true;
    if (event.code === 'KeyH') barra.classList.toggle('hidden');
    if (event.code === 'KeyK') score.alternarAudio();
    if (event.code === 'KeyT') score.alternarVista();
    if (event.code === 'ArrowLeft') score.mover(-5);
    if (event.code === 'ArrowRight') score.mover(5);
    if (event.code === 'KeyM') score.marcar();
  });

  addEventListener('keyup', (event) => {
    if (event.code === 'Space') liberar();
    if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') inst.calma = false;
  });

  addEventListener('wheel', (event) => {
    inst.giroBase = THREE.MathUtils.clamp(inst.giroBase - event.deltaY * 0.004, -6, 6);
  }, { passive: true });

  addEventListener('resize', () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  });

  simulation.reset();

  // [NUEVO] actualización del modelo de presión en cada frame (CPU → uniforms)
  const actualizarInstrumento = (dt) => {
    inst.reloj += dt;
    if (inst.cargando) inst.presion = Math.min(1, inst.presion + dt / PRESION.carga);
    params.pressure.value = inst.presion;
    params.blast.value = inst.E0 * Math.exp(-(inst.reloj - inst.tLib) / PRESION.tau);
    if (mode === 'PERFORMANCE') {
      params.shellRadius.value = PRESION.R0 - (PRESION.R0 - PRESION.Rmin) * inst.presion;
      // la cáscara se rompe al liberar y se rehace poco a poco
      const rehecha = THREE.MathUtils.clamp((inst.reloj - inst.tRotura) / PRESION.rehacer, 0, 1);
      params.shellStiffness.value = PRESION.kCascara * (1 + 4 * inst.presion) * rehecha * rehecha;
      params.vortexStrength.value = inst.giroBase + Math.sign(inst.giroBase || 1) * PRESION.giroExtra * inst.presion;
      params.dragCoefficient.value = inst.calma ? 1.4 : PRESION.c0 + PRESION.cExtra * inst.presion;
    }
    shellHelper.visible = mode === 'LAB' && params.shellEnabled.value > 0;
    shellHelper.position.copy(params.attractor.value);
    shellHelper.scale.setScalar(params.shellRadius.value);
    barra.firstChild.style.width = (inst.presion * 100).toFixed(1) + '%';
    barra.style.opacity = mode === 'PERFORMANCE' ? 1 : 0;
  };

  // [NUEVO] medición en el LAB cada 0.5 s (lee la GPU; no detiene el render)
  let midiendo = false, ultimaMedicion = 0;
  const medir = async () => {
    if (midiendo) return;
    midiendo = true;
    try { panel.setMeasure(await simulation.measure(params.attractor.value)); }
    finally { midiendo = false; }
  };

  // FRAME LOOP ------------------------------------------------------------
  let ultimo = performance.now();
  renderer.setAnimationLoop(() => {
    const ahora = performance.now();
    const dt = Math.min(0.1, (ahora - ultimo) / 1000); ultimo = ahora;
    if (!paused) {
      actualizarInstrumento(dt);
      simulation.stepSimulation();
    }
    if (mode === 'LAB' && ahora - ultimaMedicion > 500) { ultimaMedicion = ahora; medir(); }
    score.actualizar();
    orbit.update();
    renderer.render(scene, camera);
  });

  // [NUEVO] acceso para pruebas desde la consola
  window.__u3 = { params, simulation, inst, PRESION, applyPreset, empezarCarga, liberar, setMode, renderer,
    paso: (n = 1) => { for (let i = 0; i < n; i++) { actualizarInstrumento(1 / 60); simulation.stepSimulation(); } } };
}

main().catch((error) => {
  console.error(error);
  const pre = document.createElement('pre');
  pre.style.cssText = 'position:fixed;inset:16px;white-space:pre-wrap;color:#fff;z-index:50';
  pre.textContent = String(error?.stack || error);
  document.body.append(pre);
});
