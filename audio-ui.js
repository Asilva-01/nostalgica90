/* ============================================================
   NOSTÁLGICA 90 — audio-ui.js
   Botão de música reutilizável para PÁGINAS SECUNDÁRIAS
   (speciais, novelas, jogar-de-novo).
   Cria UMA única interface de áudio por página.
   O index.html usa seus próprios controles no topo (som.js).
   ============================================================ */
(function () {
  var btn = null;

  function criar() {
    if (btn) return btn;
    btn = document.createElement('button');
    btn.id = 'btnAudioUi';
    btn.innerHTML = '🔇';
    btn.title = 'Ligar nostalgia';
    btn.setAttribute('aria-label', 'Ligar ou desligar a música');
    btn.style.cssText =
      'position:fixed;bottom:16px;right:16px;z-index:900;' +
      'font-size:24px;width:52px;height:52px;border-radius:50%;border:2px solid #ffe600;' +
      'background:rgba(0,0,0,.8);color:#fff;cursor:pointer;box-shadow:3px 3px 0 #ff2d95;' +
      'display:flex;align-items:center;justify-content:center;';
    btn.addEventListener('click', function () {
      var on = !(window.NostalMusica && window.NostalMusica.estaLigada());
      if (on) {
        if (window.NostalMusica) window.NostalMusica.ligar();
        btn.innerHTML = '🔊';
        btn.title = 'Pausar música';
      } else {
        if (window.NostalMusica) window.NostalMusica.desligar();
        btn.innerHTML = '🔇';
        btn.title = 'Ligar nostalgia';
      }
    });
    document.body.appendChild(btn);
    return btn;
  }

  document.addEventListener('DOMContentLoaded', criar);
})();