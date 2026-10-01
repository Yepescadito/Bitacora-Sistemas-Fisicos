// Textos de la presentación, separados del sistema visual.
// Cada slide tiene "pasos": cada paso es una lista de líneas que aparecen juntas.
// {e:texto} se pinta con el color de la experiencia, {j:texto} con el de las nuevas generaciones.
// Para cambiar el idioma en vivo: tecla L, o abrir index.html?lang=es

window.TEXTOS = {
  pt: {
    slides: [
      { pasos: [["RELEVO GERACIONAL:", "A VANTAGEM QUE NINGUÉM ESTÁ APROVEITANDO"]], sub: "@centrodeeventosupb" },
      { pasos: [["Um grande auditório só para fazer formaturas?"]] },
      { pasos: [["Os eventos não chegaram à Universidade."], ["A Universidade decidiu se encontrar com o mundo."]] },
      { pasos: [["Academia + Indústria + Cidade"]], etiquetas: ["Academia", "Indústria", "Cidade"] },
      { pasos: [["Os eventos nunca foram o objetivo."], ["O impacto, sim."]] },
      { pasos: [["Um evento traz pessoas."], ["Uma comunidade traz transformação."]] },
      { pasos: [["O talento cresce na velocidade da confiança."]] },
      { pasos: [["A {e:experiência} constrói o caminho."], ["As {j:novas gerações} descobrem novas rotas."]] },
      { pasos: [["Uma visão."], ["Duas gerações."]] },
      { pasos: [["O crescimento não acontece quando uma geração substitui a outra."], ["Acontece quando trabalham juntas."]] },
      { pasos: [["Os {j:jovens} não são o futuro."], ["São o {j:presente} que muitas organizações ainda não enxergam."]] },
      { pasos: [["O futuro não se herda."], ["Se constrói."]] },
      { pasos: [["@centrodeeventosupb"]], qr: ["Memórias", "Redes"] }
    ],
    ui: {
      inicio: "→ avançar · ← voltar · F tela cheia · L idioma · H ajuda",
      exp: "experiência",
      jov: "novas gerações"
    }
  },

  es: {
    slides: [
      { pasos: [["RELEVO GENERACIONAL:", "LA VENTAJA QUE NADIE ESTÁ APROVECHANDO"]], sub: "@centrodeeventosupb" },
      { pasos: [["¿Un gran auditorio solo para hacer grados?"]] },
      { pasos: [["Los eventos no llegaron a la Universidad."], ["La Universidad decidió encontrarse con el mundo."]] },
      { pasos: [["Academia + Industria + Ciudad"]], etiquetas: ["Academia", "Industria", "Ciudad"] },
      { pasos: [["Los eventos nunca fueron el objetivo."], ["El impacto sí."]] },
      { pasos: [["Un evento trae personas."], ["Una comunidad trae transformación."]] },
      { pasos: [["El talento crece a la velocidad de la confianza."]] },
      { pasos: [["La {e:experiencia} construye el camino."], ["Las {j:nuevas generaciones} descubren nuevas rutas."]] },
      { pasos: [["Una visión."], ["Dos generaciones."]] },
      { pasos: [["El crecimiento no ocurre cuando una generación reemplaza a otra."], ["Ocurre cuando trabajan juntas."]] },
      { pasos: [["Los {j:jóvenes} no son el futuro."], ["Son el {j:presente} que muchas organizaciones aún no ven."]] },
      { pasos: [["El futuro no se hereda."], ["Se construye."]] },
      { pasos: [["@centrodeeventosupb"]], qr: ["Memorias", "Redes"] }
    ],
    ui: {
      inicio: "→ avanzar · ← volver · F pantalla completa · L idioma · H ayuda",
      exp: "experiencia",
      jov: "nuevas generaciones"
    }
  }
};
