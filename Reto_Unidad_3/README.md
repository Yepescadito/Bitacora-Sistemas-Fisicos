## Reto de Diseño - Unidad 3 / Fuerzas

# Presión y liberación: un instrumento de fuerzas para LesAlpx

*Instrumento visual de fuerzas en la GPU (Three.js + WebGPU + TSL + Vite) para interpretar en vivo "LesAlpx" de Floating Points (Crush, 2019).*

Instrumento publicado (requiere un navegador con WebGPU: Chrome o Edge actuales):
https://yepescadito.github.io/Bitacora-Sistemas-Fisicos/Reto_Unidad_3/DEMO/

Código fuente: [`instrumento/`](instrumento/). Parte del proyecto base del profesor, [forces-instrument-u3](https://github.com/juanferfranco/forces-instrument-u3), copiado sin cambios en el commit `3d7bc6c`. Todo lo que agregué está marcado en el código con `[NUEVO]`, y se puede ver completo con `git diff 3d7bc6c -- Reto_Unidad_3/instrumento`.

# Intención

Escucho LesAlpx como **presión que se acumula y se libera**. Durante casi dos minutos la pieza va sumando brillo sin soltar el pulso. Luego se cae casi al silencio (2:04–2:08), vuelve más oscura, se afloja otra vez (3:44) y termina en su tramo más brillante, con un corte seco.

El instrumento hace sentir esa presión. Mientras sostengo una tecla, una cáscara invisible se encoge y aprieta todas las partículas hacia el centro, que se calientan de azul a violeta y blanco. Cuando suelto, la presión acumulada sale como una onda expansiva. Ninguna trayectoria está dibujada: la forma sale de las fuerzas.

**Decisiones de diseño:**
- **El confinamiento es un resorte de una sola cara:** no actúa adentro de la cáscara. Así la cáscara contiene sin aplastar lo que ya está adentro.
- **La liberación divide entre `(r + s)` y no entre `r²`:** con `r²` la onda casi no alcanzaría a las partículas lejanas, y quería que la explosión se sintiera en toda la nube.
- **`E(t)` se calcula en la CPU y llega como un solo uniform:** el compute no necesita saber cuándo empezó la explosión.

# Autoevaluación ponderada

**Nota:**4.0

| Criterio | Puntos | Valoración |
|---|:---:|:---:|
| Trazabilidad y comprensión del sistema | 25 | 20 |
| Verificación del algoritmo de fuerzas | 25 | 20 |
| Diseño de fuerzas e intención | 20 | 20 |
| Instrumento, score e interpretación | 15 | 10 |
| Experimentación y criterio frente a la IA | 10 | 10 |
| Entrega técnica y documentación | 5 | 0 |
| **Total** | **100** | 80 |
