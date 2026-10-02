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
- Que la conducción sea humana: nada de secuencias automáticas, y que los cambios no los decida el análisis del audio.
- Tiempo real y pantalla completa.

# Concepto

"360" es una canción sobre ser **la referencia**: alguien que está en todas partes, a quien todos miran y copian, y alrededor de quien gira la escena. La traduje en una relación entre un **foco** (yo, con el mouse) y dos colectivos que lo perciben de forma distinta:

| Elemento | Qué es en la canción | Algoritmo |
|---|---|---|
| **Bandada** (900 agentes que pintan) | La gente que la sigue y la imita: rápida, se contagia del movimiento de sus vecinos. Su recorrido queda pintado | Flocking + steering (seek/arrive, flee, wander, flow field following) |
| **Red** (30 000–70 000 agentes) | La escena, la "influencia": algo lento que se ramifica y conecta todo | Physarum (Jones, 2010) |
| **Foco** (mouse) | Ella: la referencia | Objetivo de seek/arrive o de flee; deposita o borra rastro |
| **Campo** (1, 2, 3) | El clima del momento: deriva, el giro de 360°, el estallido | Flow field |

La estética es la de *brat*: **verde lima y negro**, tipografía Arial en minúsculas y borrosa. La tecla I alterna entre la paleta oscura (lima sobre negro) y la paleta brat (negro sobre lima).

### Dos capas: el suelo y la pintura

La imagen tiene dos capas con papeles distintos:

1. **El suelo:** la red del physarum, atenuada (nunca pasa del 55 % de tinta). Es lenta y orgánica y queda de fondo.
2. **La pintura:** la bandada no se dibuja como figuras. Cada boid deja un trazo fino desde donde estaba hasta donde está, y los trazos **se acumulan**. Lo que se ve es el recorrido de la bandada: hilos, pinceladas, el anillo del 360 hecho de cientos de líneas. Cada boid pinta con uno de tres grosores, como pinceles distintos.

La idea de que el recorrido acumulado se vuelva la imagen la tomé del **trabajo de Sofía** ("The Seed" de AURORA), donde las raíces se dibujan porque el fondo no se borra. La diferencia es que en su obra la amplitud del audio controla la velocidad, el brillo y el campo. Aquí lo que se pinta depende de las reglas de los agentes y de mis intervenciones; el audio solo modula el resplandor (ver "Respiración y golpe"). Además, la pintura no es permanente. Se olvida al mismo ritmo que el rastro del physarum, y los dos se controlan juntos con ↑/↓, que funciona como la **memoria** del sistema. El clic derecho también borra la pintura alrededor del foco.

# Controles

Agrupados en cuatro intenciones:

| Grupo | Control | Qué cambia | Tipo |
|---|---|---|---|
| **Foco** | mover el mouse | dónde está la referencia (centro del vórtice y del estallido) | percepción |
| | clic izq. sostenido | atraer: arrive + depósito de rastro | percepción + entorno |
| | clic der. / shift+clic | repeler: flee + borrar rastro | percepción + entorno |
| **Entorno** | 1 · 2 · 3 · 0 | campo: deriva (ruido) · órbita 360 · estallido · sin campo | entorno |
| | rueda | fuerza del campo | regla |
| | ↑ / ↓ (sostener) | memoria: cuánto duran el rastro del physarum y la pintura de la bandada | entorno |
| | B (sostener) | escribir "360" en el rastro | entorno |
| | I | paleta oscura ↔ verde brat | visual |
| **Percepción** | Z / X (sostener) | radio de percepción de la bandada | percepción |
| | C / V (sostener) | alcance de los sensores del physarum | percepción |
| **Energía** | espacio (sostener) | velocidad y fuerza máximas de todos | regla |
| | J (al ritmo) | **golpe**: la bandada estalla desde el foco, los trazos se engrosan y la pantalla destella | regla + visual |

Los controles de "sostener" cambian **gradualmente** mientras se mantienen: el gesto dura lo que yo quiera, como un fader.

Para ensayar: O (o arrastrar) carga el audio, P reproduce/pausa, ← / → mueven 5 s, M marca el tiempo actual, R reinicia el physarum en un anillo, G muestra lo que percibe cada agente, D abre el panel de parámetros y el score, F pantalla completa, H ayuda.

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

# Autoevaluación

*(Por completar antes de la sesión 4: cada criterio vale 25 puntos.)*

| Criterio | Puntos | Valoración |
|---|:---:|:---:|
| Cumplimiento del encargo: mi instrumento utiliza tecnología web, funciona en tiempo real y permite interpretar la pieza musical elegida. | 25 | |
| Comprensión y verificación: puedo explicar y defender cómo está construido el sistema, qué perciben los agentes y cómo calculan sus acciones. Puedo predecir y verificar los cambios al modificar un parámetro. | 25 | |
| Diseño e intención: puedo justificar la selección y combinación de comportamientos y relacionarlos con mi interpretación musical. | 25 | |
| Interpretación humana: mi score y mis controles permiten conducir el sistema en vivo y responder a su comportamiento. | 25 | |
| **Total** | **100** | |

