## Reto de Diseño - Unidad 2 / Movimiento

# Cooperación vs. Competencia: un sistema generativo inspirado en la final de la Liga BetPlay Apertura 2024

*Resultado: https://editor.p5js.org/Yepescadito/full/5Ac9WPKfJ*

# Intención

Quiero explorar la tensión entre la cooperación y la competencia. 

La inspiración fue la final entre Bucaramanga y Santa Fe en 2024. Me llamó la atención ver cómo equipos que normalmente son rivales, como Nacional y Millonarios, coincidían en apoyar a Bucaramanga. Al mismo tiempo, también me pareció interesante que Millonarios, a pesar de ser de Bogotá como Santa Fe, no apoyara al otro equipo de su ciudad. Quise representar esas contradicciones mediante las relaciones entre las partículas, mostrando cómo las alianzas y las rivalidades pueden cambiar según el contexto.

Espero que el sistema produzca momentos donde diferentes poblaciones colaboren para formar estructuras estables, mientras otra población intente romper constantemente esos grupos. De esta manera, la cooperación y la competencia coexistirán en un equilibrio cambiante donde ningún estado será permanente.

# Diseño del sistema

El sistema está compuesto por cinco poblaciones de partículas, cada una inspirada en un equipo del fútbol colombiano.

- __Tipos de partículas__ 

Seleccioné cinco poblaciones porque quería representar distintas formas de relacionarse dentro del sistema. En lugar de dividir únicamente entre cooperación y competencia, cada equipo cumple una función específica de acuerdo a sus intenciones o motivaciones.

- __Cantidad de partículas__ 

La cantidad de partículas de cada equipo se definió tomando como referencia el tamaño aproximado de sus aficiones. Por esta razón, Atlético Nacional tiene la mayor cantidad de partículas, seguido por Millonarios y Santa Fe, mientras que Bucaramanga y La Equidad cuentan con poblaciones más pequeñas.

Aunque Bucaramanga inicia con menos partículas, fue diseñado para atraer a las demás poblaciones. Con esto busqué representar cómo, durante la final de la Liga BetPlay Apertura 2024, un equipo con una afición más pequeña logró generar simpatía y apoyo entre seguidores de otros clubes. Así, el sistema muestra que la cooperación no depende únicamente del tamaño de una población, sino también de las relaciones que establece con las demás.

![Simulación 1](Tipos.png)

- __Relaciones__ 

Diseñé las relaciones para que Bucaramanga tuviera una mayor atracción hacia los demás equipos, ya que quería representar cómo logró reunir el apoyo de muchas aficiones durante la final. En cambio, Santa Fe mantiene una relación de competencia con Bucaramanga, por lo que sus partículas tienden a separarse y romper esas agrupaciones. Entre Nacional, Millonarios y La Equidad hay relaciones más equilibradas, permitiendo que se formen y deshagan grupos constantemente sin que el sistema permanezca siempre igual.

![Simulación 1](Matriz.png)

# Parámetros del sistema

El sistema utiliza los siguientes parámetros:

- Posición inicial aleatoria.
- Velocidad.
- Aceleración.
- Radio de interacción.
- Fuerzas de atracción y repulsión.
- Fricción.
- Velocidad máxima.
- Bordes toroidales.

Estos parámetros pueden modificarse desde la interfaz para explorar diferentes configuraciones sin alterar la funcionalidad del sistema.

__1. Invariantes__

- Existen siempre cinco poblaciones.
- Todas las partículas interactúan mediante fuerzas dependientes de la distancia.
- El comportamiento surge únicamente de las reglas del sistema.

__2. Variables__

- Posición inicial de las partículas.
- Intensidad de las fuerzas.
- Radio de interacción.
- Fricción.
- Velocidad máxima.

# Registro de pruebas

- __Prueba 1__

Todas las fuerzas de atracción eran muy altas y solo se formaban grupos "grandes" de 3 equipos, Millonarios hacia sus propios grupos. 

![Simulación 1](V1.gif)


- __Prueba 2__

Aumente la atracción de Bucaramanga para todos los equipos (Hasta el de Santa Fe), pero mantuve la repulsión que generaba Santa Fe, se formaron grupos muy interesantes y al mismo tiempo se excluían algunas particulas.

![Simulación 1](V2.gif)


- __Prueba 3__

Aumente la repulsión ejercida por Santa Fe e hice que la Equidad no fuera "receptiva" ante las intenciones de los otros 3 equipos.

![Simulación 1](V3.gif)


- __Prueba 4 (FINAL)__

Se equilibraron las un poco fuerzas de cooperación y competencia, se agrupaban en cadenas mas grandes. Los grupos tomaban diferentes direcciones y cambiaban su dirección si se encontraban con alguno de Santa Fe

![Simulación 1](VF.gif)

# Autoevaluación

| Criterio | Peso | Valoración | Aporte |
|-----------|:----:|:----------:|:------:|
| La intención es clara y perceptible en el comportamiento. | 20% | 95% | 19.0 |
| Los tipos, cantidades, matriz y parámetros están justificados desde la intención. | 25% | 90% | 22.5 |
| Comprendo y puedo modificar el funcionamiento técnico del sistema. | 20% | 70% | 14.0 |
| El sistema produce variaciones con una identidad reconocible. | 15% | 90% | 13.5 |
| Experimenté, comparé, seleccioné y descarté con criterios claros. | 10% | 80% | 8.0 |
| Puedo distinguir y sustentar lo diseñado y lo emergente. | 10% | 70% | 7.0 |
| **Total** | **100%** |  | **84.0** |

### Nota propuesta

**Puntaje total:** **84.0**

**84 ÷ 20 = 4.2**


## Sustentación

1. *__La intención es clara y perceptible en el comportamiento__* (95%)

Busqué representar la cooperación y la competencia mediante un sistema de partículas. En general, creo que la simulación logra transmitir esa idea a través de la forma en que las partículas se agrupan y cambian su rumbo.

2. *__Los tipos, cantidades, matriz y parámetros están justificados desde la intención__* (90%)

Cada población tiene un comportamiento definido según su rol dentro del sistema. La matriz de relaciones, la cantidad de partículas y los parámetros físicos fueron ajustados para reforzar la idea de cooperación y competencia, aunque todavía podrían explorarse más configuraciones para encontrar un equilibrio aún más preciso.

3. *__Comprendo y puedo modificar el funcionamiento técnico del sistema__* (70%)

Aunque puedo realizar cambios y entender su efecto general, siento que aún me falta profundizar en la parte técnica para explicar con mayor seguridad todos los procesos del sistema.

4. *__El sistema produce variaciones con una identidad reconocible__* (90%)

Cada ejecución genera patrones diferentes gracias a la aleatoriedad en la distribución inicial y otros parámetros variables.

5. *__Experimenté, comparé, seleccioné y descarté con criterios claros__* (80%)

Realicé diferentes pruebas modificando la matriz de relaciones para observar cómo cambian el comportamiento del sistema. Aunque registré varias pruebas, considero que podría haber documentado con mayor detalle cada iteración del proceso y pude intentar llegar a un mejor resultado.

6. *__Puedo distinguir y sustentar lo diseñado y lo emergente__* (70%)

Puedo identificar cuáles elementos fueron diseñados, como la matriz de relaciones, las cantidades de partículas y los parámetros del sistema. Pero, me cuesta explicar algunos comportamientos que aparecen durante la simulación y cómo cada regla específica los afecta.

