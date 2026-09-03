Bus Kuramoto — DEMO (Fases 1-8 scaffold)

Instrucciones rápidas:

1. Abrir `Reto_Unidad_4/DEMO/index.html` en un navegador moderno (Chrome/Firefox).
2. Hacer clic en la ventana para activar audio (Tone.js requiere gesto de usuario).
3. Usar los sliders de `K` y `D` para explorar acoplamiento y diversidad.
4. Pulsar `🚌 FRENAR` para aplicar una perturbación global.
5. Hacer clic sobre un pasajero para seleccionar y perturbar su fase.
6. Observar el indicador `r` y el círculo de fases para ver sincronización emergente.

Pruebas recomendadas:
- Empezar con `K ≈ 0.5` y `D ≈ 0.6` para ver desorden.
- Subir `K` gradualmente (1.5–3.0) para observar transición a sincronía.
- Ajustar `D` para ver cómo la distribución de `ωᵢ` afecta la capacidad de sincronizar.

Notas técnicas:
- Modelo: Kuramoto clásico integrado con RK4 por frame.
- `D` interpola las frecuencias naturales `ωᵢ` hacia valores objetivo sin reemplazar el modelo.
- Los eventos sonoros se disparan en cruzamientos de fase, no en cada frame.

Si quieres que configure más control UI, exporte un build estático, o ajuste mapeos sonoros/visuales, dime qué prefieres.