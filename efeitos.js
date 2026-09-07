/* ============================================================
   NOSTÁLGICA 90 — efeitos visuais
   - Confete pixelado (canvas)
   - Glitch em elemento
   - Troca de canal
   - Preferência por reduced motion
   ============================================================ */
window.Efeitos = (function () {
  var reduzido = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canvas = null;
  var ctx2d = null;
  var particulas = [];
  var ativo = false;

  function criarCanvas() {
    if (canvas) return;
    canvas = document.createElement('canvas');
    canvas.id = 'confete';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);
    ctx2d = canvas.getContext('2d');
  }

  var CORES = ['#ff2d95', '#00e5ff', '#ffe600', '#39ff14', '#b026ff', '#ffffff'];

  function lancarConfete() {
    if (reduzido || ativo) return;
    criarCanvas();
    ativo = true;
    for (var i = 0; i < 90; i++) {
      particulas.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * 260,
        y: canvas.height * 0.25 + (Math.random() - 0.5) * 120,
        vx: (Math.random() - 0.5) * 5,
        vy: -(Math.random() * 3 + 2),
        g: 0.18,
        tam: 4 + Math.random() * 5,
        cor: CORES[Math.floor(Math.random() * CORES.length)],
        vida: 80 + Math.random() * 40
      });
    }
    var quadro = 0;
    (function animar() {
      if (!ativo) return;
      ctx2d.clearRect(0, 0, canvas.width, canvas.height);
      for (var i = 0; i < particulas.length; i++) {
        var p = particulas[i];
        if (p.vida <= 0) continue;
        p.x += p.vx; p.y += p.vy; p.vy += p.g; p.vida--;
        ctx2d.fillStyle = p.cor;
        ctx2d.fillRect(p.x, p.y, p.tam, p.tam);
      }
      quadro++;
      if (quadro < 160) requestAnimationFrame(animar);
      else { ativo = false; particulas = []; ctx2d.clearRect(0, 0, canvas.width, canvas.height); }
    })();
  }

  function glitch(el) {
    if (reduzido) return;
    el.classList.remove('glitch');
    void el.offsetWidth;
    el.classList.add('glitch');
  }

  function trocaCanal(el) {
    if (reduzido) return;
    el.classList.remove('troca-canal');
    void el.offsetWidth;
    el.classList.add('troca-canal');
  }

  window.addEventListener('resize', function () {
    if (canvas) { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  });

  return {
    confete: lancarConfete,
    glitch: glitch,
    trocaCanal: trocaCanal,
    reduzido: reduzido
  };
})();