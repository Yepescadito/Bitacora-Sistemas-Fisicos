## Reto de Diseño - Unidad 7 / Word as a Playable System

# NOVA: nadie se aventura solo

*Sistema tipográfico jugable para la portada web de NOVA, Gremio de Aventureros.*

Para jugar:
https://yepescadito.github.io/Bitacora-Sistemas-Fisicos/Reto_Unidad_7/DEMO/

<img src="logo-nova-2.png" alt="Logo de NOVA, Gremio de Aventureros" width="300"> <img src="emblema-nova.png" alt="Emblema de la brújula de NOVA" width="120">

# La organización

**NOVA, Gremio de Aventureros** es un hobby center donde se juegan TCG (juegos de cartas coleccionables), juegos de mesa y juegos de rol. Su público son jugadores que buscan un lugar y un grupo para jugar: desde quien llega por primera vez sin conocer a nadie hasta los grupos que se reúnen cada semana.

**Atributo elegido: comunidad. La aventura es en grupo.**

En qué me baso:
- **El nombre:** se presenta como un *gremio*. En los juegos de rol, el gremio es el lugar donde los aventureros se reúnen para formar grupos y salir a sus misiones.
- **Lo que ofrece:** los tres tipos de juego que reúne (cartas, mesa y rol) se juegan con otras personas. Lo que ofrece un hobby center no son los juegos, sino la mesa con otros.
- **El logo:** la O es una brújula, un instrumento para orientarse y llegar a un destino. La usé como guía para reunir al grupo.

**Contexto de uso:** la portada de su página web. Es lo primero que ve alguien que llega buscando dónde jugar, y se juega con el mouse (o con el dedo en el celular).

# El sistema

Todo lo que se ve son letras: las cuatro de **NOVA** y las diecinueve de **GREMIO DE AVENTUREROS**. La N, la V y la A usan **Cinzel Decorative**, una romana con los remates curvos del logo (el trazo que abre la N y las colas de la V y la A), en plata metálica. El gremio usa **Cinzel**. La paleta es la del logo: azul noche, plata y dorado.

| Elemento | Qué es | Modelo |
|---|---|---|
| **N, O, V, A** | cuatro aventureros | cuerpos rígidos con física (Matter.js), hechos de sus trazos: la N son dos palos y la diagonal, la V dos barras inclinadas, la A dos barras y el travesaño, y la O un círculo |
| **La O** | además, el emblema y la brújula del gremio | el emblema dorado del logo armado solo con letras: el aro es la O; los rombos de los puntos cardinales son una A volteada sobre una V; las puntas de afuera son V delgadas; los bloques de las diagonales son letras I; y la estrella son 8 V afiladas, cada una con una mitad clara y otra oscura (las facetas). La estrella hace de aguja, y su punta principal es más clara |
| **Letras pequeñas** | los miembros del gremio | agentes con steering (wander, seek, arrive y separación), como en la Unidad 6 |
| **Vínculo** | tomarse de la mano | restricción de distancia 0 entre un punto que las dos letras sostienen |
| **Íconos** | lo que se hace en NOVA: cartas (TCG), dado (juegos de mesa), d20 (rol) y trofeo (torneos) | armados con letras: los trazos son letras I estiradas entre dos puntos, los puntos del dado son O pequeñas y el trofeo es una U (copa) con dos C (asas), una I (pie) y dos I acostadas (base en dos escalones) |

### Qué puede hacer la persona

- **Arrastrar y lanzar** las letras.
- **Levantar** una letra: al agarrarla, se pone de pie.
- **Juntarlas con la O:** todo empieza en la O. Una letra se une si la dejas lado a lado con la letra que le corresponde durante 0.25 s. Lado a lado quiere decir: al alcance de la mano (a menos de 15 % del tamaño de letra), a la misma altura y las dos más o menos derechas. Si acercas una letra a otra que está tirada, la tirada se levanta para recibirla.
- **Separarlas:** jalando fuerte (el vínculo se rompe si se estira más de 0.65 del tamaño de letra) o con **doble clic** sobre una letra, que se suelta de su grupo y da un saltito.
- **R** reinicia y **D** abre un panel con los grupos, a quién busca la brújula y si NOVA está completo.

### Reglas

1. **Solas no se sostienen.** Una letra sola cae, queda de lado y, si pasa 2.5 s quieta, **se duerme**: se apaga a gris.
2. **Todo empieza con la O y solo en orden.** Solo existen tres uniones, cada una con su lado:
   - la N a la izquierda de la O;
   - la V a la derecha de la O;
   - la A a la derecha de la V, y solo cuando la V ya está con la O.

   Como no hay otra forma de unirse, lo único que se puede armar es NOVA.
3. **La brújula dice a quién buscar.** La aguja de la O apunta a la siguiente letra que falta (primero la N, luego la V y luego la A), y esa letra brilla en plata, latiendo suave.
4. **El grupo dice que no.** Si llevas una letra equivocada (o del lado equivocado) junto al grupo de la O, tiembla, el grupo la aparta y se te suelta de la mano.
5. **En grupo se ayudan a estar de pie.** Cada letra de un grupo recibe una aceleración suave que la endereza, más fuerte cuanto más grande es el grupo; mientras arrastras el grupo, esa ayuda se apaga. Además se vuelve dorada: más dorada y más brillante cuanto más grande es el grupo.
6. **El gremio va donde hay grupo.** Las letras pequeñas caminan por el suelo. Perciben a los grupos a una distancia de 160 px más 90 px por miembro, así que un grupo más grande se nota desde más lejos. Una letra sola no atrae a nadie. Cuando perciben un grupo, lo rodean.
7. **Cada unión desbloquea una actividad de NOVA.** N+O hace aparecer las **cartas** (TCG); O+V, el **dado** (juegos de mesa); V+A, el **d20** (rol); y NOVA completo, el **trofeo** (torneos). Los íconos nacen desde el grupo y flotan sobre él. Si se deshace la unión, su ícono se desvanece.
8. **NOVA completo:**
   - las letras se acomodan en el centro como el logo;
   - el gremio escribe "GREMIO DE AVENTUREROS" debajo;
   - la O empieza su ciclo: **gira 360°, palpita dos veces, descansa y vuelve a girar**;
   - los cuatro íconos flotan a los lados: cartas y dado a la izquierda, d20 y trofeo a la derecha.

### Qué espero que se descubra jugando

- Que una letra sola se cae y se apaga; acompañada se levanta y brilla.
- Que la O es el centro: todo se arma a partir de ella, y su brújula señala a quién le toca.
- Que cada letra tiene su lugar: si no es la que toca o no va de su lado, el grupo la rechaza.
- Que el gremio no se interesa por una letra sola, sino por los grupos.
- Que el grupo completo convoca al gremio entero, y la brújula gira como si la aventura estuviera por empezar.
- Que cada unión desbloquea algo que se hace en NOVA: juntarse es lo que abre el juego.

En resumen: **en NOVA nadie se aventura solo.**

# Registro de pruebas

- **Prueba 1:** la A y la V se dibujaban corridas respecto a su cuerpo físico. Matter coloca la posición del cuerpo en su centro de masa y yo dibujaba el glifo centrado en su caja. Guardo ese desfase al crear cada letra y desplazo el dibujo.
- **Prueba 2:** al unirse, las letras empezaban a girar sin control (ángulos de miles de radianes) hasta romper el vínculo. La fuerza que endereza al grupo estaba mal escalada: Matter multiplica el torque por dt² (≈278), así que mi corrección era unas 5 veces más fuerte y se pasaba de largo en cada paso. La reescribí como aceleración angular deseada dividida entre dt², con amortiguación. Ahora el grupo se endereza sin oscilar.
- **Prueba 3:** la V y la A casi nunca se unían. Con los choques exactos, una O, una V y una A puestas en fila apenas se tocan: la V es ancha arriba, la A ancha abajo y la O redonda. Cambié la regla de choque por una de cercanía: se toman de la mano si sus cajas están a menos de 6 % del tamaño de letra durante 0.35 s. Con NOVA en fila se forman los 3 vínculos.
- **Prueba 4:** la lectura funcionaba, pero la palabra quedaba en el suelo y tapaba el subtítulo. Lo convertí en recompensa: cuando NOVA está completo y en orden, el gremio lo levanta hasta el 42 % de la altura de la pantalla y ahí se lee el logo completo. Medí la altura promedio de las letras: 642 → 415 px en 8 s con la primera fuerza; la dupliqué para que subiera más rápido.
- **Prueba 5:** con las cuatro unidas pero en orden VONA, no hay lectura y el gremio completo (19/19) las rodea sin formar el subtítulo. Con NOVA, lectura sí.
- **Prueba 6:** la aguja de la brújula (V más grandes) se salía de la O y se veía como un manchón. Ahora el vértice de cada V toca el borde interior de la O.
- **Prueba 7 (jugándolo):** las letras chocaban raro y terminaban en un nudo: la A volteada metida en la V, todas unidas en posiciones absurdas. Había tres causas:
  - La A y la V eran trapecios sólidos, así que no podían encajar entre sí y se montaban.
  - Se tomaban de la mano en cualquier posición, incluso apiladas o de cabeza.
  - La fuerza que endereza al grupo era tan fuerte que no dejaba girar las letras.

  Cambios: cada letra es ahora un cuerpo compuesto por sus trazos; solo se toman de la mano lado a lado (diferencia de altura menor a 0.45 del tamaño de letra y ambas con menos de 0.6 rad de inclinación); y el enderezado es 4 veces más suave (0.012 → 0.003) y no actúa mientras arrastras. Verificación: si dejo caer la A sobre la V, la A se resbala y queda acostada sin unirse; NOVA en fila sigue formando sus 3 vínculos y el logo.

- **Prueba 8 (jugándolo):** las letras no se juntaban. Había dos reglas que chocaban: sola, una letra se cae y queda acostada, pero solo podía tomarse de la mano si estaba derecha. Además, al arrastrarla colgaba torcida del punto donde la agarraste, y el alcance era muy corto (~9 px). Cambios:
  - **Si levantas una letra sola, se pone de pie.**
  - **Si le acercas una letra a otra que está tirada** (a menos de 0.6 del tamaño de letra), **la tirada se levanta para tomarle la mano.** Encaja con el atributo: acompañada se levanta.
  - Alcance de 0.06 → 0.15 del tamaño de letra, tiempo de 0.35 → 0.25 s e inclinación permitida de 0.6 → 0.8 rad.

  También encontré un error del mouse en pantallas de alta resolución (escala 1.5× o 2×, la mayoría de portátiles y celulares): Matter recibía la posición multiplicada por esa escala y no agarraba las letras. Ahora se le pasa la escala de la pantalla. Verificación con eventos de mouse reales: agarré la O tirada, la llevé junto a la N y quedaron unidas; la A, que estaba cerca, también se unió (grupo NOA), y la brújula apuntó a la V, que quedó sola.

- **Prueba 9 (rediseño):** quise que el armado contara una historia clara: todo empieza con la O, la brújula guía y solo se puede leer NOVA. Ahora solo existen tres uniones, cada una con su lado (N|O, O|V y V|A), y la A solo después de la V. La brújula apunta a la siguiente letra y esa letra brilla. Si llevas una letra equivocada, tiembla y el grupo la aparta. Al completar, las letras se acomodan en el centro y la O gira 360°, palpita dos veces y vuelve a girar, en ciclos de 3.2 s. Verificación con eventos de mouse reales:
  - La A junto a la O: rechazada, quedó a 182 px.
  - La N a la izquierda de la O: grupo NO, y la brújula pasó a buscar la V.
  - La V a la derecha de la O: se unió, y la A, que estaba justo al lado, se unió a la V; NOVA completo y logo con la O girando.

  En la prueba también apareció un error: si la página se abre en una pestaña oculta, el navegador puede reportar ancho 0, las letras nacían de tamaño 0 y la física terminaba en NaN. Ahora hay un tamaño mínimo y las letras se rehacen si el tamaño cambia mucho.

- **Prueba 10 (parecido con el logo):** la tipografía no se parecía a la de NOVA. Comparé Cinzel, Cinzel Decorative y Forum, y elegí **Cinzel Decorative 700** para N, V y A: tiene el trazo curvo que abre la N y las colas de la V y la A, como el logo. Las letras van en plata metálica (degradado con un quiebre oscuro a media altura). En grupo conservan la plata y lo que delata la unión es el halo dorado. El gremio pasó del dorado al plateado, igual que el subtítulo del logo. Para la O reconstruí el emblema solo con letras (aro O, rombos A+V, puntas V, bloques I y estrella de 8 V con facetas). En la primera versión la estrella era demasiado delgada y los rombos se veían huecos: ensanché las puntas (0.075 → 0.15 de la altura) y angosté los rombos para que sus trazos se junten y se vean macizos. En el logo armado, la O tiene un 30 % más de espacio porque sus puntas sobresalen del aro.

- **Prueba 11 (íconos):** quise que cada unión mostrara algo que se hace en NOVA, con los íconos de su página (cartas, dado, d20 y trofeo). Para cumplir la regla de que todo salga de las letras, los armé con letras: los trazos son letras I estiradas entre dos puntos, los puntos del dado son O pequeñas y el trofeo es una U con dos C y letras I. En la primera versión el trofeo se leía como letras sueltas ("ɔUc") y el pie casi no se veía; agrandé la copa, acerqué las asas y engrosé el pie y la base. Con I muy gruesas, sus serifas hacían que el d20 se viera espinoso, así que las adelgacé (0.32 → 0.24). También noté que si el tamaño de la ventana cambia más de un 20 %, el juego se reinicia (las letras se rehacen con las medidas nuevas).

- **Prueba 12 (trofeo):** el trofeo seguía sin leerse: el pie no se veía y abajo quedaba un "⊥". La causa era que las letras de los íconos se centraban en la caja completa de la fuente y no en la altura de la letra, así que cada I quedaba corrida hacia arriba y el pie se escondía detrás de la copa. Ahora se centran en la altura de mayúscula (esto también alinea mejor las cartas, el dado y el d20). Además rehice el trofeo: copa U más ancha, asas C delgadas pegadas al borde, pie largo y base en dos escalones (una I ancha abajo y otra corta arriba).

### Predicciones verificables (para la sustentación)

| Si cambio… | Predigo… |
|---|---|
| `tiempoVinculo` 0.35 → 1.5 | cuesta más formar grupos: hay que sostener las letras juntas más tiempo |
| `rupturaVinculo` 0.65 → 0.3 | los grupos se deshacen con facilidad al lanzarlos |
| `enderezar` → 0 | los grupos ya no se ponen de pie: la diferencia entre sola y acompañada se pierde |
| `percepcionGremio` → 0 | el gremio solo nota grupos muy grandes; con dos letras no se acerca |
| quitar `['V', 'A']` de `PARES` | la A nunca se puede unir: la brújula se queda apuntándola y NOVA no se completa |
| `tiempoRechazo` → 2 | se puede sostener una letra equivocada junto al grupo mucho más tiempo antes de que la aparten |

(Los parámetros están al inicio de `DEMO/index.html`, en el objeto `R`.)

# Pruebas con otras personas

*(Pendiente: invitar a alguien a jugar sin explicarle nada y anotar qué intentó, qué descubrió y cómo lo interpretó.)*

| Persona | Qué intentó | Qué descubrió | Cómo lo interpretó |
|---|---|---|---|
| | | | |

# Autoevaluación

*(Por completar antes de la presentación: cada criterio vale 25 puntos.)*

| Criterio | Puntos | Valoración |
|---|:---:|:---:|
| Cumplimiento del encargo: mi sistema utiliza las letras del nombre de una organización, permite jugar con ellas y funciona en tiempo real en la Web para el contexto definido. | 25 | |
| Comprensión y verificación: puedo explicar y justificar el modelo, sus estados y sus reglas. Puedo predecir y verificar el efecto de modificar una regla o un parámetro. | 25 | |
| Interacción e identidad: puedo justificar qué permiten descubrir las acciones y sus consecuencias sobre el atributo elegido, y contrastarlo con lo observado en las pruebas con otras personas. | 25 | |
| Resolución tipográfica y experiencia de juego: la composición, el ritmo, los momentos de lectura y las respuestas perceptibles permiten explorar el sistema y sostienen su intención. | 25 | |
| **Total** | **100** | |

## Sustentación

1. *__Cumplimiento del encargo__*

2. *__Comprensión y verificación__*

3. *__Interacción e identidad__*

4. *__Resolución tipográfica y experiencia de juego__*
