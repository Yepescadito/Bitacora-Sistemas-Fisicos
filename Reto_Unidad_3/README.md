## Reto de Diseño - Unidad 3 / Fuerzas

# Presión y liberación: un instrumento de fuerzas para LesAlpx

*Instrumento visual de fuerzas en la GPU (Three.js + WebGPU + TSL + Vite) para interpretar en vivo "LesAlpx" de Floating Points (Crush, 2019).*

Instrumento publicado (requiere un navegador con WebGPU: Chrome o Edge actuales):
https://yepescadito.github.io/Bitacora-Sistemas-Fisicos/Reto_Unidad_3/DEMO/

Código fuente: [`instrumento/`](instrumento/). Parte del proyecto base del profesor, [forces-instrument-u3](https://github.com/juanferfranco/forces-instrument-u3), copiado sin cambios en el commit `3d7bc6c`. Todo lo que agregué está marcado en el código con `[NUEVO]`, y se puede ver completo con `git diff 3d7bc6c -- Reto_Unidad_3/instrumento`.

# Intención

Escucho LesAlpx como **presión que se acumula y se libera**. Durante casi dos minutos la pieza va sumando brillo sin soltar el pulso. Luego se cae casi al silencio (2:04–2:08), vuelve más oscura, se afloja otra vez (3:44) y termina en su tramo más brillante, con un corte seco.

El instrumento hace sentir esa presión. Mientras sostengo una tecla, una cáscara invisible se encoge y aprieta todas las partículas hacia el centro, que se calientan de azul a violeta y blanco. Cuando suelto, la presión acumulada sale como una onda expansiva. Ninguna trayectoria está dibujada: la forma sale de las fuerzas.

# Mapa del sistema

| Responsabilidad | Dónde está | Qué hace |
|---|---|---|
| **Estado** | `src/simulation/createSimulation.js` → `positionBuffer`, `velocityBuffer` | posición y velocidad de 131 072 partículas, guardadas en la memoria de la GPU |
| **Fuerzas** | bloque `force` del compute `updateParticles` en `createSimulation.js` | suma viento, radial, vórtice y arrastre (del proyecto base) más **confinamiento** y **liberación** (nuevas) |
| **Integración** | mismo compute: `v += F·dt`, límite de `maxSpeed`, `p += v·dt`, bordes periódicos | Euler semiimplícito con masa 1: la fuerza cambia la velocidad y la velocidad nueva cambia la posición |
| **Render** | `SpriteNodeMaterial` + `InstancedMesh` en `createSimulation.js` | dibuja el estado sin recalcularlo; el color depende de la rapidez y de la presión |
| **Parámetros** | `src/simulation/parameters.js` | uniforms: los puentes entre JavaScript y la GPU (incluye `shellEnabled`, `shellRadius`, `shellStiffness`, `blast`, `pressure`) |
| **Modelo de presión** | `src/main.js` → `PRESION`, `actualizarInstrumento()` | en la CPU convierte el gesto (cargar o soltar) en valores de los uniforms en cada frame |
| **Controles** | `src/main.js` (teclado, rueda, puntero) y `src/ui/labPanel.js` | mapeo del instrumento y panel del LAB |
| **Medición** | `measure()` en `createSimulation.js` | copia los buffers de la GPU a la CPU y calcula promedios para las pruebas |
| **Música y score** | `src/ui/scoreView.js` | el audio solo suena; el score es una guía en pantalla |

```text
GESTO (espacio, rueda, puntero, shift)
        ↓
MODELO DE PRESIÓN en CPU  →  uniforms (shellRadius, shellStiffness, blast, vortex, drag, pressure)
        ↓
COMPUTE en GPU: estado → fuerzas → v → p
        ↓
BUFFERS → RENDER (sprites instanciados)          medición: GPU → CPU (solo en LAB)
```

# Ficha de fuerzas

`r` es la distancia de la partícula al centro (atractor), `r̂` la dirección **hacia afuera** y `ẑ` el eje Z.

| # | Fuerza | Ecuación | Parámetros | Origen |
|---|---|---|---|---|
| 1 | Viento | `F = c` | `wind` | proyecto base |
| 2 | Radial suavizada | `F = −S · r̂ / max(r, s)²` (S > 0 atrae) | `radialStrength`, `softening` | proyecto base |
| 3 | Vórtice | `F = g · (ẑ × (−r̂))` | `vortexStrength` | proyecto base |
| 4 | Arrastre | `F = −c · v` | `dragCoefficient` | proyecto base |
| 5 | **Confinamiento** | `F = −k · max(0, r − R) · r̂` | `shellRadius` (R), `shellStiffness` (k) | **nueva** |
| 6 | **Liberación** | `F = E(t) · r̂ / (r + s)`, con `E(t) = E₀ · e^(−t/τ)` | `blast` (E(t), calculado en la CPU) | **nueva** |

**Decisiones de diseño:**
- **El confinamiento es un resorte de una sola cara:** no actúa adentro de la cáscara. Así la cáscara contiene sin aplastar lo que ya está adentro.
- **La liberación divide entre `(r + s)` y no entre `r²`:** con `r²` la onda casi no alcanzaría a las partículas lejanas, y quería que la explosión se sintiera en toda la nube.
- **`E(t)` se calcula en la CPU y llega como un solo uniform:** el compute no necesita saber cuándo empezó la explosión.

### Modelo de presión (lo que conduce la persona)

Sostener espacio carga la presión `p` de 0 a 1 en 5 s:

| Magnitud | Con presión `p` | Para qué |
|---|---|---|
| radio de la cáscara | `R(p) = 3.4 − 2.8·p` (de 3.4 a 0.6) | comprime |
| rigidez | `k(p) = 4 · (1 + 4p)` | aprieta más |
| arrastre | `c(p) = 0.25 + 1.2·p` | frena (ver prueba 9) |
| giro | `g(p) = giroBase + 1.5·p` | un poco más de giro |
| color | de azul y cian a violeta y blanco | se ve la presión |

Soltar espacio dispara la liberación con `E₀ = 18·p` y `τ = 0.6 s`. En ese momento la cáscara **se rompe** (k = 0) y se rehace en 3 s (`k · (t/3)²`). En PERFORMANCE el espacio mide 16 de lado y no 10, para que la onda no reaparezca por el lado opuesto.

# Controles

| Modo | Control | Qué hace |
|---|---|---|
| ambos | **P** | cambiar entre LAB y PERFORMANCE |
| ambos | **puntero** | mover el centro (atractor) sobre el plano Z = 0 |
| PERFORMANCE | **espacio** (sostener → soltar) | cargar presión → liberar |
| PERFORMANCE | **rueda** | giro base (−6 a 6); al pasar por 0 cambia de sentido |
| PERFORMANCE | **shift** (sostener) | calma: arrastre 1.4, todo se queda suspendido |
| ambos | **K** · **T** · **← / →** · **M** | música (reproducir o pausar) · score · moverse 5 s · marcar un tiempo |
| ambos | **H** | ocultar la barra de presión |
| LAB | **1–7** · **R** | pruebas · reset |

Son pocos controles a propósito: **un gesto principal** (cargar y soltar) y tres de apoyo (centro, giro y calma). El audio **no** se analiza: solo suena (ver "Música").

# Registro de pruebas

Todas se hicieron en el modo LAB, con el centro en el origen y midiendo **desde la GPU** el promedio sobre 8 192 partículas (una de cada 16). Mediciones: `r` = radio medio al centro, `vr` = velocidad radial media (+ hacia afuera), `giro` = velocidad tangencial media alrededor de Z (+ antihorario visto desde +Z), `vx` = velocidad X media.

| # | Prueba | Predicción (antes de ejecutar) | Medido: 0 s → 1 s → 3 s | ¿Coincide? |
|---|---|---|---|---|
| 1 | Inercia (sin fuerzas, v₀ ≠ 0) | la rapidez se conserva; sin dirección preferida | rapidez **0.384 → 0.384 → 0.384**; `vx` ≈ −0.003 | sí |
| 2 | Viento +X (c = 1.5) | `vx` crece ≈ 1.5 por segundo | `vx` **0.03 → 1.55 → 4.58** | sí (1.5 por segundo exacto) |
| 3 | Atracción (S = 3) | `vr` negativa, `r` baja | `r` **2.16 → 1.76 → 1.30**; `vr` −0.64 al segundo | sí; a los 3 s `vr` = +0.31 porque, sin arrastre, las partículas cruzan el centro y salen por el otro lado |
| 4 | Repulsión (S = −3) | todo lo contrario de la 3 | `r` **2.16 → 2.60 → 4.60**; `vr` +0.74 | sí |
| 5 | Vórtice (S = 1, g = 3, c = 0.08) | aparece giro; no es solo caída radial | `giro` **−0.04 → −2.17 → −1.47** | sí, pero **el signo me sorprendió** (ver abajo) |
| 6 | **Confinamiento** (R = 2, k = 4, c = 0.6) | lo de afuera vuelve y se acumula **en la superficie** r ≈ 2 | afuera de R: **60 % → 0 %**; radio máximo **3.82 → 2.00**; por cuartos de R a los 9 s: 18 % · 21 % · 26 % · 35 % · 0 % | **en parte**: nada queda afuera, pero **llenan el interior** (ver abajo) |
| 7 | **Liberación** (E₀ = 18 desde el reposo) | `vr` positiva grande, `r` crece y luego frena | `r` **2.16 → 4.39**; `vr` **+3.10** al segundo | sí; a los 3 s `vr` sale negativa por los bordes periódicos (las que salen por un lado entran por el otro) |

**Prueba 5, el signo del vórtice:** con `vortexStrength = +3` el giro medido es **negativo** (horario visto desde +Z). En el código, la tangente es `ẑ × radialDirection`, y `radialDirection` apunta **hacia** el atractor, es decir `−r̂`. Por eso `ẑ × (−r̂)` gira en sentido horario. Lo verifiqué cambiando el signo: tras 1 s, con g = +3 el giro medido es **−2.087** y con g = −3 es **+2.087**, exactamente simétrico. La ficha lo escribe como `g · (ẑ × (−r̂))`.

**Prueba 6, el confinamiento es un recipiente y no una membrana:** el resorte devuelve las partículas con velocidad hacia adentro. Adentro no hay fuerza, así que siguen de largo hasta que el arrastre las detiene y llenan la esfera. Mi predicción era incorrecta. Para la intención sirve mejor así: al achicar R se comprime **todo** el volumen y no solo una capa.

### Pruebas del instrumento (modo PERFORMANCE)

- **Prueba 8, ciclo de presión (primer intento):** cargué 5 s y R bajó de 3.4 a 0.6, pero **el radio medio de la nube no bajó** (3.19 → 3.62). El giro subía con la presión (`giroExtra = 5`). El vórtice del proyecto base es una fuerza tangencial constante, así que las partículas llegaban a la rapidez máxima (8) y necesitaban una fuerza centrípeta `v²/r ≈ 18` en r = 3.6. La cáscara daba ≈ 13: **la fuerza centrífuga le ganaba a la compresión**.
- **Prueba 9, ciclo de presión (corregido):** la presión ahora **frena**. El arrastre pasa de 0.25 a 1.45, la rigidez se multiplica hasta por 5 y el giro extra baja a 1.5. Medido:

| Momento | `r` | `vr` | Lectura |
|---|---|---|---|
| reposo (5 s) | 3.65 | −0.16 | esfera girando en su cáscara |
| cargando 2.5 s (p = 0.5) | 2.50 | −0.47 | se comprime |
| cargando 5 s (p = 1) | 1.01 | −0.44 | casi al mínimo |
| sostenido 7 s | **0.79** | −0.04 | comprimida y quieta |
| 0.5 s después de soltar | 2.27 | **+4.36** | onda expansiva |
| 1 s después de soltar | 4.56 | +4.56 | anillo abierto |
| 3 s después de soltar | 4.24 | −6.20 | la cáscara rehecha la devuelve |

- **Prueba 10, una medición inválida:** en la primera tanda de pruebas el instrumento había quedado en PERFORMANCE sin que me diera cuenta. Ese modo impone su propio radio, giro y arrastre, así que las fuerzas no estaban aisladas: la prueba 6 corrió con R = 3.4 en vez de 2. Repetí todas forzando el modo LAB. Por eso las pruebas solo valen en LAB.

# Música

El audio de LesAlpx **solo suena**: no se analiza ni controla ningún parámetro. La cadena es *música → escucha → decisión → gesto → fuerza*.

Para ensayar, el mp3 va en `instrumento/public/audio/lesalpx.mp3` (solo en el computador: no se sube porque tiene derechos de autor). En la versión publicada se arrastra el mp3 a la ventana. **K** reproduce o pausa, **T** muestra el score y **← / →** salta 5 s.

# Score visual

Los tramos salen de medir la energía del mp3 en ventanas de 2 s (energía total, graves y agudos). El score indica intenciones y gestos, no posiciones.

```text
0:00        1:12          1:58 2:12                       3:42 3:56         4:34 4:43
|-----------|-------------|-----|--------------------------|----|------------|---|
 acumulación  presión      rupt.  reorganización (oscura)   disp.  clímax     corte
 brillo ↗     brillo alto  silencio 2:04–2:08                bajón  lo más brillante
 cargas       cargas       SOLTAR · shift                    soltar cargar al   SOLTAR
 cortas       largas       en el silencio                    suave  máximo      + shift
```

| Tramo | Desde | Lo que escucho | Intención | Gesto |
|---|---|---|---|---|
| acumulación | 0:00 | pulso desde el inicio; el brillo sube poco a poco | la tensión empieza a juntarse | cargas cortas y soltarlas a medias (respira) · giro bajo · centro quieto |
| presión | 1:12 | el brillo llega a su pico y se mantiene | ya no cabe: todo se aprieta | cargas largas hasta el máximo sin soltar · giro alto (rueda) |
| ruptura | 1:58 | la música se cae hasta el silencio (2:04–2:08) | estalla | **soltar** justo en la caída · en el silencio **shift**: todo suspendido |
| reorganización | 2:12 | vuelve el pulso, más oscuro y estable | después de la explosión, lo oscuro se reordena | la cáscara se rehace sola · invertir el giro · mover el centro despacio · cargas medias |
| dispersión | 3:42 | bajón de energía | se afloja, se abre | soltar suave · shift a ratos |
| clímax | 3:56 | el tramo más brillante | la compresión más fuerte de toda la pieza | cargar al máximo · giro alto · arrastrar el centro |
| corte | 4:34 | final abrupto | se termina de golpe | **soltar** en el corte y **shift** hasta que se apague |

# Autoevaluación ponderada

*(Por completar antes de la sesión 4: cada criterio de 0 a 100. Aporte = valoración × peso / 100.)*

| Criterio | Peso | Evidencia | Valoración (0–100) | Aporte |
|---|:---:|---|:---:|:---:|
| Trazabilidad y comprensión del sistema | 25 | [Mapa del sistema](#mapa-del-sistema) · commit base `3d7bc6c` · marcas `[NUEVO]` | | |
| Verificación del algoritmo de fuerzas | 25 | [Registro de pruebas](#registro-de-pruebas) (1–10, con números medidos en la GPU) | | |
| Diseño de fuerzas e intención | 20 | [Intención](#intención) · [Ficha de fuerzas](#ficha-de-fuerzas) | | |
| Instrumento, score e interpretación | 15 | [Controles](#controles) · [Score visual](#score-visual) | | |
| Experimentación y criterio frente a la IA | 10 | [Bitácora de IA](#bitácora-de-ia) | | |
| Entrega técnica y documentación | 5 | [URL publicada](https://yepescadito.github.io/Bitacora-Sistemas-Fisicos/Reto_Unidad_3/DEMO/) · este README | | |
| **Total** | **100** | | | |

## Sustentación

*(Por completar.)*
