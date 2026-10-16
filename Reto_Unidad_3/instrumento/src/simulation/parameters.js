import * as THREE from 'three/webgpu';
import { uniform } from 'three/tsl';

// Uniforms are CPU-side values that TSL exposes to the GPU.
// Changing .value does not rebuild the compute shader.
export function createParameters() {
  return {
    dt: uniform(1 / 60),
    timeScale: uniform(1.0),
    initialSpeed: uniform(0.35),
    maxSpeed: uniform(5.0),
    boundsSize: uniform(10.0),
    particleSize: uniform(0.035),

    windEnabled: uniform(0.0),
    wind: uniform(new THREE.Vector3(0.0, 0.0, 0.0)),

    radialEnabled: uniform(1.0),
    attractor: uniform(new THREE.Vector3(0.0, 0.0, 0.0)),
    radialStrength: uniform(2.2),
    softening: uniform(0.35),

    vortexEnabled: uniform(1.0),
    vortexStrength: uniform(1.4),

    dragEnabled: uniform(1.0),
    dragCoefficient: uniform(0.12),

    // [NUEVO] Confinamiento: cáscara elástica de radio shellRadius alrededor del atractor.
    // Solo actúa sobre las partículas que están afuera: F = -k · max(0, r - R) · r̂
    shellEnabled: uniform(0.0),
    shellRadius: uniform(3.0),
    shellStiffness: uniform(4.0),

    // [NUEVO] Liberación: empuje radial hacia afuera que decae en el tiempo.
    // F = E(t) · r̂ / (r + s), con E(t) = E0 · e^(-t/τ) calculado en la CPU (main.js)
    blast: uniform(0.0),

    // [NUEVO] Presión 0..1 (solo se usa para el color: más presión, más caliente)
    pressure: uniform(0.0)
  };
}
