// Score visual de "360" (Charli xcx, brat, 2024) — ~2:13, ~120 BPM.
// Es una GUÍA para la persona que interpreta: el instrumento NO cambia nada solo.
// El panel (tecla D) muestra en qué pasaje va la canción y qué gesto propuse.
//
// Los tiempos son aproximados: al ensayar, presiona M en cada cambio de pasaje,
// mira las marcas en el panel y corrige los valores de `desde` (en segundos).

window.SCORE = {
  cancion: '360 — charli xcx',
  pasajes: [
    {
      desde: 0, nombre: 'entrada',
      intencion: 'llega alguien que ya sabe que todos la están mirando',
      gesto: 'paleta oscura (la inicial) · campo 0 · la bandada sigue al foco con clic sostenido, sin prisa · el physarum arma su red solo',
    },
    {
      desde: 8, nombre: 'verso 1',
      intencion: 'seguridad: ella es la referencia que los demás copian',
      gesto: 'clic sostenido: la bandada la persigue · percepción alta (X) para que se mueva como un solo cuerpo · el physarum dibuja su camino',
    },
    {
      desde: 38, nombre: 'coro 1',
      intencion: 'el giro de 360°: todo gira a su alrededor',
      gesto: 'campo 2 (órbita) con fuerza alta (rueda) · espacio en los golpes · B escribe "360" y el physarum se lo come',
    },
    {
      desde: 56, nombre: 'verso 2',
      intencion: 'está en todas partes: la escena entera es una red de referencias',
      gesto: 'I → verde brat · campo 1 (deriva) · sensores largos (V) para que aparezcan venas que conectan todo · percepción baja (Z): muchas bandadas pequeñas',
    },
    {
      desde: 86, nombre: 'coro 2',
      intencion: 'el mismo giro, ahora más grande y más ruidoso',
      gesto: 'campo 2 · fuerza al máximo · espacio sostenido · mover el foco para arrastrar el vórtice por la pantalla',
    },
    {
      desde: 104, nombre: 'quiebre',
      intencion: 'la pista se vacía: queda la tensión',
      gesto: 'campo 0 · clic derecho para espantar y borrar el rastro · persistencia baja (↓): la red se deshace',
    },
    {
      desde: 118, nombre: 'cierre',
      intencion: 'sale del cuadro dejando la marca',
      gesto: 'campo 3 (estallido) desde el centro · B una última vez · persistencia alta (↑) y soltar todo: el "360" se queda y se disuelve',
    },
  ],
};
