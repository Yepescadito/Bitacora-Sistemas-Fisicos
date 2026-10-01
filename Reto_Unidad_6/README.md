## Reto de Diseño - Unidad 6 / Agentes autónomos

# 360: un instrumento visual para interpretar a Charli xcx

*Instrumento visual para la Web, hecho solo con steering behaviors, flocking, flow fields y Physarum, para interpretar en vivo "360" de Charli xcx (álbum brat, 2024).*

Instrumento:
https://yepescadito.github.io/Bitacora-Sistemas-Fisicos/Reto_Unidad_6/DEMO/

# El encargo

Diseñar y desarrollar un instrumento visual para la Web e interpretar en tiempo real una pieza musical, usando solo steering behaviors, flocking, flow fields y Physarum. Pide:

- Definir qué perciben los agentes, cuáles son sus límites y cómo calculan sus acciones.
- Producir comportamientos emergentes y poder explicar qué aporta la combinación de reglas.
- Ofrecer pocos controles expresivos sobre la percepción, las reglas o el entorno.
- Que la conducción sea humana: nada de secuencias automáticas ni análisis del audio.
- Tiempo real y pantalla completa.

# Concepto

"360" es una canción sobre ser **la referencia**: alguien que está en todas partes, a quien todos miran y copian, y alrededor de quien gira la escena. La traduje en una relación entre un **foco** (yo, con el mouse) y dos colectivos que lo perciben de forma distinta:

| Elemento | Qué es en la canción | Algoritmo |
|---|---|---|
| **Bandada** (420 triángulos) | La gente que la sigue y la imita: rápida, se contagia del movimiento de sus vecinos | Flocking + steering (seek/arrive, flee, wander, flow field following) |
| **Red** (30 000–70 000 agentes) | La escena, la "influencia": algo lento que se ramifica y conecta todo | Physarum (Jones, 2010) |
| **Foco** (mouse) | Ella: la referencia | Objetivo de seek/arrive o de flee; deposita o borra rastro |
| **Campo** (1, 2, 3) | El clima del momento: deriva, el giro de 360°, el estallido | Flow field |

La estética es la de *brat*: **verde lima y negro**, tipografía Arial en minúsculas y borrosa. La tecla I alterna entre la paleta oscura (lima sobre negro) y la paleta brat (negro sobre lima).

# Qué percibe cada agente y cómo decide

### Boid (bandada)

**Percibe** (con límites):
- A sus vecinos, **solo** dentro de un radio `R` (70 px por defecto, ajustable en vivo con Z/X) y **solo hacia adelante**: un cono de visión de ~254° (no ve lo que tiene detrás).
- Como máximo a **24 vecinos** (atención limitada).
- La dirección del flow field **en el punto donde está** (no ve el campo completo).
- El foco, **solo si está a menos de 0.42 × el lado menor** de la pantalla. Los que están lejos no se enteran: se enteran por sus vecinos (alineación).

**Calcula** su acción con la regla de Reynolds: `steer = velocidad_deseada − velocidad`, limitada a una fuerza máxima. Suma:

| Comportamiento | Velocidad deseada | Peso |
|---|---|---|
| Separación | alejarse de los vecinos a menos de 0.42·R (ponderado por 1/d²) | 2.4 |
| Alineación | el promedio de las velocidades de los vecinos | 1.0 |
| Cohesión | ir al centro de los vecinos | 0.8 |
| Flow field | la dirección del campo donde está | 1.6 × fuerza del campo |
| Arrive (clic izq.) | ir al foco, frenando a la mitad al acercarse; a menos de 90 px ya llegó | 1.6 |
| Flee (clic der.) | alejarse del foco | 3.0 |
| Wander | un punto que se pasea por un círculo delante de él | 0.3 |

**Actúa:** suma las fuerzas a su velocidad, la limita a la velocidad máxima y avanza. Además **deja un poco de rastro** en el mapa del physarum.

### Agente Physarum (red)

**Percibe:** solo tres puntos del mapa de rastro: adelante, adelante-izquierda y adelante-derecha, a una distancia `SD` (9 celdas por defecto, ajustable con C/V) y separados 0.6 rad. No percibe a otros agentes, solo lo que dejaron.

**Calcula** (Jones, 2010):
- si el sensor del centro es el mayor → sigue derecho;
- si el del centro es el menor → gira al azar a un lado;
- si no → gira 0.45 rad hacia el lado con más rastro;
- si hay campo, además **inclina** su rumbo hacia la dirección del campo (10 % × fuerza). El campo no lo reemplaza: lo sesga.

**Actúa:** avanza y deposita rastro. El entorno (el mapa) se difunde y se evapora en cada paso.

### El entorno (mapa de rastro)

Es lo que conecta todo. Lo escriben el physarum, los boids, el foco y el texto "360"; solo lo lee el physarum. Cada paso: difusión parcial (mezcla 50 % con el promedio 3×3), evaporación (persistencia, ajustable con ↑/↓) y un **tope** por celda.

# Qué aporta la combinación

- **Flocking + Physarum:** la bandada es rápida y nerviosa; el physarum es lento y tiene memoria. Como los boids dejan rastro, **la red termina dibujando por dónde pasó la bandada** segundos después. La gente se mueve y la escena se acomoda detrás.
- **Flow field + los dos:** el mismo campo afecta distinto a cada uno. Los boids lo **siguen** (es su velocidad deseada); el physarum solo se **inclina** hacia él y sigue obedeciendo a su rastro. En la órbita 360, los boids forman un anillo nítido de inmediato y la red se va curvando poco a poco.
- **Foco + entorno:** el foco no mueve a nadie directamente. Con clic izquierdo **cambia lo que perciben** los boids (un objetivo) y **cambia el entorno** (deposita rastro, el physarum llega después). Con clic derecho los espanta y borra la red.
- **Texto "360":** no es un dibujo encima. Es rastro escrito en el entorno; los agentes lo perciben y lo recorren, lo deforman y se lo comen.

# Controles

Agrupados en cuatro intenciones:

| Grupo | Control | Qué cambia | Tipo |
|---|---|---|---|
| **Foco** | mover el mouse | dónde está la referencia (centro del vórtice y del estallido) | percepción |
| | clic izq. sostenido | atraer: arrive + depósito de rastro | percepción + entorno |
| | clic der. / shift+clic | repeler: flee + borrar rastro | percepción + entorno |
| **Entorno** | 1 · 2 · 3 · 0 | campo: deriva (ruido) · órbita 360 · estallido · sin campo | entorno |
| | rueda | fuerza del campo | regla |
| | ↑ / ↓ (sostener) | persistencia del rastro | entorno |
| | B (sostener) | escribir "360" en el rastro | entorno |
| | I | paleta oscura ↔ verde brat | visual |
| **Percepción** | Z / X (sostener) | radio de percepción de la bandada | percepción |
| | C / V (sostener) | alcance de los sensores del physarum | percepción |
| **Energía** | espacio (sostener) | velocidad y fuerza máximas de todos | regla |

Los controles de "sostener" cambian **gradualmente** mientras se mantienen: el gesto dura lo que yo quiera, como un fader.

Para ensayar: O (o arrastrar) carga el audio, P reproduce/pausa, ← / → mueven 5 s, M marca el tiempo actual, R reinicia el physarum en un anillo, G muestra lo que percibe cada agente, D abre el panel de parámetros y el score, F pantalla completa, H ayuda.

**El audio no se analiza.** Solo suena. Todo cambio visual lo hago yo.

### Predicciones verificables (para la sustentación)

| Si hago… | Predigo… | Lo verifiqué así |
|---|---|---|
| Z (percepción baja) | la bandada se rompe en muchos grupos pequeños | con G se ve el cono más pequeño y menos vecinos conectados |
| X (percepción alta) | una sola bandada grande y alineada | — |
| C (sensores cortos, ~4) | red fina, celdas pequeñas | captura con sd = 4 vs sd = 25 (prueba 6) |
| V (sensores largos, ~25) | venas gruesas, celdas grandes | ídem |
| 2 con fuerza alta | anillo alrededor del foco | radio medido 217 px para un radio objetivo de 230 px; 100 % del movimiento tangencial (prueba 3) |
| ↓ (persistencia baja) | la red se desvanece y se fragmenta | — |
| clic derecho | agujero en la red, la bandada se aleja | distancia media al foco: 91 px → 301 px en 2 s (prueba 4) |

# Score visual

El score está en `DEMO/score.js` y se ve en el panel (D) junto con una línea de tiempo. **Es una guía**, no una secuencia: el instrumento no cambia nada solo.

| Pasaje | Desde | Intención | Gesto |
|---|---|---|---|
| entrada | 0:00 | silencio y un intro sin bajo (0:05): llega alguien que ya sabe que todos la están mirando | paleta oscura · sin campo · la bandada sigue al foco, sin prisa · el physarum arma su red solo |
| verso 1 | 0:13 | entra el beat: ella es la referencia que los demás copian | espacio en el golpe · clic sostenido · percepción alta (X): un solo cuerpo · el physarum dibuja su camino |
| coro 1 | 0:45 | el giro de 360°: todo gira a su alrededor | campo 2 (órbita) fuerte · espacio en los golpes · B escribe "360" y se lo comen |
| verso 2 | 1:01 | después del corte: está en todas partes, la escena es una red de referencias | en el corte, I → verde brat · campo 1 · sensores largos (V) · percepción baja (Z): muchas bandadas |
| coro 2 | 1:21 | el mismo giro, más grande y más ruidoso | campo 2 al máximo · espacio sostenido · arrastrar el vórtice con el foco |
| quiebre | 1:40 | se va el bajo: la pista se vacía, queda la tensión | sin campo · clic derecho espanta y borra · persistencia baja (↓) |
| último coro | 1:49 | vuelve todo de golpe: el momento más alto | campo 3 (estallido) + espacio en el golpe · luego campo 2 · B otra vez · persistencia alta (↑) |
| cierre | 2:11 | la música se apaga (termina en 2:14): sale del cuadro dejando la marca | soltar todo: el "360" y la red se quedan y se disuelven solos |

**Cómo saqué los tiempos:** medí la energía del mp3 cada 0.5 s, separando la total de la de los graves, para escribir el score. El instrumento no usa esto en vivo. El mapa muestra 5 s de silencio, un intro sin bajo hasta 0:13 y un pulso cada ~2 s (≈120 BPM, frases de 16 s). Los cambios se ven en bajones de energía en 0:45, 0:59–1:01 y 1:20, el bajo desaparece entre 1:40 y 1:49 y la música se apaga en 2:14. Los límites de la estructura son confiables. Los nombres "verso" y "coro" hay que confirmarlos escuchando; si algo se siente corrido, se corrige con M.

# Registro de pruebas

- **Prueba 1:** el physarum arrancaba en un anillo y se quedaba pegado a él: el anillo inicial tenía tanto rastro que ningún agente se salía. Ahora arranca disperso por toda la pantalla y el anillo queda como gesto (tecla R).
- **Prueba 2:** con 26 000 agentes el physarum tardaba 8.2 ms por paso (sin margen para 1080p). Medí y `Math.cos/sin` era más de la mitad del costo; con tablas de seno/coseno bajó a 2.1 ms. A 1920×1080 (69 000 agentes + 420 boids) el cuadro completo cuesta ~7.3 ms y corre a la tasa del monitor.
- **Prueba 3:** la órbita era una espiral hacia el centro y en 10 s toda la bandada terminaba en un punto (distancia media al foco: 28 px). La cambié por un campo tangente a un círculo de radio 0.3 × el lado menor, que se inclina hacia el círculo desde adentro y desde afuera. Medido: distancia media 217 px (objetivo 230) y movimiento 100 % tangencial: un anillo.
- **Prueba 4:** al atraer, los 420 boids se aplastaban en 11 px y el costo se disparaba (todos veían a todos). Dos cambios: el arrive deja de actuar a menos de 90 px (ya llegó) y frena solo a la mitad de la velocidad, y cada boid atiende como máximo a 24 vecinos. Ahora quedan zumbando alrededor del foco (distancia media 91 px); al repeler se alejan a 301 px en 2 s.
- **Prueba 5:** en modo libre el physarum se engrosaba en pocas bandas gruesas a los 15 s. Bajé la difusión al 50 %, el depósito de los boids (7 → 3) y abrí los sensores (0.42 → 0.6 rad), pero seguía igual. La causa era que el rastro crecía sin límite: un tubo grueso siempre le ganaba a todo lo demás. Con un tope de 8 por celda la red se mantiene ramificada después de 25 s.
- **Prueba 6:** verifiqué que el control C/V tiene consecuencia visible: con sensores de 4 celdas la red es fina y de celdas pequeñas; con 25, venas gruesas y celdas grandes.
- **Prueba 7:** la paleta: un tono lineal saturaba el rastro (todo verde plano). Uso `v / (v + 3)`, que con el tope de 8 queda en ~73 % de tinta y deja ver los rastros débiles tenues.

# Actividades 01 y 02: análisis de los referentes

| Referente | Qué percibe el agente | Cómo calcula su movimiento | Qué podría intervenir en vivo |
|---|---|---|---|
| Nature of Code, cap. 5 | su posición, su velocidad y un objetivo | `steer = deseada − velocidad`, limitada por fuerza máxima | velocidad y fuerza máximas, el objetivo |
| Reynolds, *Steering Behaviors* | objetivo, obstáculos, vecinos | combinación ponderada de comportamientos simples | los pesos de cada comportamiento |
| Tyler Hobbs, *Flow Fields* | el ángulo del campo en su posición | avanza en esa dirección | cómo se construye el campo (ruido, distorsión) |
| Three.js *Birds* | vecinos dentro de un radio | separación, alineación y cohesión | radio de percepción, pesos |
| Bleuje, *Interactive Physarum* / Patt Vira | el rastro en tres sensores | girar hacia el sensor con más rastro, depositar | ángulo y distancia de los sensores, evaporación, depósitos externos |

En flow fields hay dos cosas distintas: el **campo** (un mapa de ángulos) y la **regla** con la que el agente lo consulta. En mi instrumento las dos se ven: el mismo campo lo sigue la bandada como velocidad deseada y el physarum solo se inclina hacia él.

# Cómo usarlo

Online: **https://yepescadito.github.io/Bitacora-Sistemas-Fisicos/Reto_Unidad_6/DEMO/** o abriendo `DEMO/index.html` en Chrome/Edge. Arrastrar el mp3 de "360" a la ventana (o presionar O), F para pantalla completa, P para reproducir.

Para no cargarlo cada vez: guardar la canción como `DEMO/audio/360.mp3` y abrir `DEMO/index.html` desde el computador; se carga sola. Esa carpeta está en `.gitignore`: la canción tiene derechos de autor y no se sube al repositorio público.

# Autoevaluación

*(Por completar antes de la sesión 4: cada criterio vale 25 puntos.)*

| Criterio | Puntos | Valoración |
|---|:---:|:---:|
| Cumplimiento del encargo: mi instrumento utiliza tecnología web, funciona en tiempo real y permite interpretar la pieza musical elegida. | 25 | |
| Comprensión y verificación: puedo explicar y defender cómo está construido el sistema, qué perciben los agentes y cómo calculan sus acciones. Puedo predecir y verificar los cambios al modificar un parámetro. | 25 | |
| Diseño e intención: puedo justificar la selección y combinación de comportamientos y relacionarlos con mi interpretación musical. | 25 | |
| Interpretación humana: mi score y mis controles permiten conducir el sistema en vivo y responder a su comportamiento. | 25 | |
| **Total** | **100** | |

## Sustentación

1. *__Cumplimiento del encargo__*

2. *__Comprensión y verificación__*

3. *__Diseño e intención__*

4. *__Interpretación humana__*
