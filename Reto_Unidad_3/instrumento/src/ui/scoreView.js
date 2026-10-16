// [NUEVO] Música y score visual de LesAlpx (Floating Points, Crush, 2019).
// El audio SOLO suena: no se analiza y no controla ningún parámetro.
// El score es una guía para quien interpreta (tecla T); las fuerzas las decide la persona.
//
// Tramos medidos sobre la energía del mp3 (ventanas de 2 s): acumulación de brillo hasta 1:12,
// caída casi total 1:58–2:12 (silencio 2:04–2:08), parte oscura 2:16–3:42, bajón 3:42–3:56,
// final brillante 3:56–4:34 y corte abrupto.
export const SCORE = [
  { desde: 0, nombre: 'acumulación', intencion: 'la tensión empieza a juntarse',
    gesto: 'cargas cortas de presión y soltarlas a medias (respira) · giro bajo · centro quieto' },
  { desde: 72, nombre: 'presión', intencion: 'ya no cabe: todo se aprieta',
    gesto: 'cargas largas hasta el máximo sin soltar · giro alto (rueda) · la nube al mínimo' },
  { desde: 118, nombre: 'ruptura', intencion: 'la música se cae: estalla',
    gesto: 'soltar espacio justo en la caída (~2:00) · en el silencio (2:04) sostener shift: todo suspendido' },
  { desde: 132, nombre: 'reorganización', intencion: 'después de la explosión, lo oscuro se reordena',
    gesto: 'la cáscara se rehace sola · invertir el giro (rueda) · mover el centro despacio · cargas medias' },
  { desde: 222, nombre: 'dispersión', intencion: 'se afloja, se abre',
    gesto: 'soltar suave · shift a ratos · dejar que la nube se expanda' },
  { desde: 236, nombre: 'clímax', intencion: 'la compresión más fuerte de toda la pieza',
    gesto: 'cargar al máximo · giro alto · arrastrar el centro por la pantalla' },
  { desde: 274, nombre: 'corte', intencion: 'final abrupto',
    gesto: 'liberar todo en el corte (4:34) y sostener shift hasta que se apague' },
];

const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

export function createScoreView() {
  const audio = new Audio();
  let nombre = '';
  const marcas = [];

  const vista = document.createElement('div');
  vista.className = 'score hidden';
  document.body.append(vista);
  const aviso = document.createElement('div');
  aviso.className = 'toast';
  document.body.append(aviso);
  let tAviso = 0;
  const avisar = (m) => { aviso.textContent = m; aviso.classList.add('on'); clearTimeout(tAviso); tAviso = setTimeout(() => aviso.classList.remove('on'), 1800); };

  const cargar = (src, n) => { audio.src = src; nombre = n; avisar(`audio: ${n} · K para reproducir`); };
  // 1) public/audio/lesalpx.mp3 (solo en tu computador; no se sube al repositorio)
  fetch('audio/lesalpx.mp3').then((r) => (r.ok ? r.blob() : null))
    .then((b) => { if (b && b.type.startsWith('audio')) cargar(URL.createObjectURL(b), 'lesalpx.mp3'); })
    .catch(() => {});
  // 2) arrastrar el mp3 a la ventana
  addEventListener('dragover', (e) => e.preventDefault());
  addEventListener('drop', (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) cargar(URL.createObjectURL(f), f.name);
  });

  const pasaje = () => {
    let k = -1;
    for (let i = 0; i < SCORE.length; i++) if (audio.currentTime >= SCORE[i].desde) k = i;
    return k;
  };

  return {
    alternarAudio() { if (!audio.src) return avisar('arrastra el mp3 de LesAlpx a la ventana'); audio.paused ? audio.play() : audio.pause(); },
    alternarVista() { vista.classList.toggle('hidden'); },
    mover(s) { if (audio.src) audio.currentTime = Math.max(0, audio.currentTime + s); },
    marcar() { if (!audio.src) return; marcas.push(audio.currentTime); avisar('marca ' + fmt(audio.currentTime)); },
    actualizar() {
      if (vista.classList.contains('hidden')) return;
      const k = pasaje(), p = SCORE[k], dur = audio.duration || 283;
      vista.innerHTML = `
        <div class="tiempo">${nombre ? fmt(audio.currentTime) + ' / ' + fmt(dur) : 'sin audio (arrástralo)'}${audio.paused ? ' · pausa' : ''}</div>
        ${p ? `<div class="pasaje"><b>${p.nombre}</b> — ${p.intencion}</div><div class="gesto">${p.gesto}</div>` : ''}
        <div class="linea">${SCORE.map((s, i) => {
          const fin = i + 1 < SCORE.length ? SCORE[i + 1].desde : dur;
          return `<span class="${i === k ? 'now' : ''}" style="left:${s.desde / dur * 100}%;width:${(fin - s.desde) / dur * 100}%">${s.nombre}</span>`;
        }).join('')}<i style="left:${(audio.currentTime / dur) * 100}%"></i></div>
        ${marcas.length ? `<div class="marcas">marcas: ${marcas.map(fmt).join(' · ')}</div>` : ''}`;
    },
  };
}
