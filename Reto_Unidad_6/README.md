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

# Autoevaluación

*(Por completar antes de la sesión 4: cada criterio vale 25 puntos.)*

| Criterio | Puntos | Valoración |
|---|:---:|:---:|
| Cumplimiento del encargo: mi instrumento utiliza tecnología web, funciona en tiempo real y permite interpretar la pieza musical elegida. | 25 | |
| Comprensión y verificación: puedo explicar y defender cómo está construido el sistema, qué perciben los agentes y cómo calculan sus acciones. Puedo predecir y verificar los cambios al modificar un parámetro. | 25 | |
| Diseño e intención: puedo justificar la selección y combinación de comportamientos y relacionarlos con mi interpretación musical. | 25 | |
| Interpretación humana: mi score y mis controles permiten conducir el sistema en vivo y responder a su comportamiento. | 25 | |
| **Total** | **100** | |

