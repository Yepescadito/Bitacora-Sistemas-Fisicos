// Score visual de "360" (Charli xcx, brat, 2024) — 2:18 (la música termina en 2:14), ~120 BPM.
// Es una GUÍA para la persona que interpreta: el instrumento NO cambia nada solo.
// El panel (tecla D) muestra en qué pasaje va la canción y qué gesto propuse.
//
// Los tiempos salen de medir la energía del mp3 (cada 0.5 s): dónde entra el beat, dónde
// desaparece el bajo y dónde hay cortes. Si al ensayar un cambio se siente corrido,
// presiona M justo ahí, mira la marca en el panel y corrige `desde` (en segundos).

window.SCORE = {
  cancion: '360 — charli xcx',
  pasajes: [
    {
      desde: 0, nombre: 'entrada',
      intencion: 'silencio y luego un intro sin bajo (0:05): llega alguien que ya sabe que todos la están mirando',
      gesto: 'paleta oscura (la inicial) · campo 0 · la bandada sigue al foco con clic sostenido, sin prisa · el physarum arma su red solo',
    },
    {
      desde: 13, nombre: 'verso 1',
      intencion: 'entra el beat: seguridad, ella es la referencia que los demás copian',
      gesto: 'J en el golpe de 0:13 · clic sostenido: la bandada la persigue · percepción alta (X): un solo cuerpo · el physarum dibuja su camino',
    },
    {
      desde: 45, nombre: 'coro 1',
      intencion: 'el giro de 360°: todo gira a su alrededor',
      gesto: 'campo 2 (órbita) con fuerza alta (rueda) · J en los golpes (a tiempo, no en todos) · B escribe "360" y el physarum se lo come',
    },
    {
      desde: 61, nombre: 'verso 2',
      intencion: 'después del corte (0:59–1:01): está en todas partes, la escena es una red de referencias',
      gesto: 'en el corte, I → verde brat · campo 1 (deriva) · sensores largos (V): venas que conectan todo · percepción baja (Z): muchas bandadas',
    },
    {
      desde: 81, nombre: 'coro 2',
      intencion: 'el mismo giro, ahora más grande y más ruidoso',
      gesto: 'campo 2 · fuerza al máximo · espacio sostenido + J en los golpes · mover el foco para arrastrar el vórtice por la pantalla',
    },
    {
      desde: 100.5, nombre: 'quiebre',
      intencion: 'se va el bajo: la pista se vacía y queda la tensión',
      gesto: 'campo 0 · clic derecho para espantar y borrar el rastro · persistencia baja (↓): la red se deshace',
    },
    {
      desde: 109, nombre: 'último coro',
      intencion: 'vuelve todo de golpe: el momento más alto',
      gesto: 'en el golpe de 1:49, J + campo 3 (estallido) desde el centro · luego campo 2 · B otra vez · persistencia alta (↑)',
    },
    {
      desde: 131, nombre: 'cierre',
      intencion: 'la música se apaga (termina en 2:14): sale del cuadro dejando la marca',
      gesto: 'soltar todo: campo 0, sin clic · el "360" y la red se quedan y se disuelven solos',
    },
  ],
};
