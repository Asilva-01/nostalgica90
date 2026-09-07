/* ============================================================
   NOSTÁLGICA 90 — AudioManager
   - Efeitos sonoros (SFX) em /assets/audio/*.wav
   - Trilha chiptune (musica.js) controlada por gesto do usuário
   - Controles separados: SFX (efeitos), Música, volume
   - Persistência em localStorage
   O jogo NUNCA depende de áudio: se falhar/bloquear, continua.
   ============================================================ */
window.Som = (function () {
  var prefs = { sfx: true, musica: false, volume: 0.8 };
  var cache = {};
  var ctxAudio = null;   // AudioContext para SFX sintetizados (fallback)
  var somAtivo = false;  // só vira true após gesto do usuário

  var CHAVE = "nostalgia90_audio";

  function carregarPrefs() {
    try {
      var p = localStorage.getItem(CHAVE);
      if (p) {
        var obj = JSON.parse(p);
        prefs = { sfx: true, musica: false, volume: 0.8, _base: obj };
        prefs.sfx = obj.sfx !== undefined ? obj.sfx : true;
        prefs.musica = obj.musica !== undefined ? obj.musica : false;
        prefs.volume = obj.volume !== undefined ? obj.volume : 0.8;
      }
    } catch (e) {}
  }
  function salvarPrefs() {
    try { localStorage.setItem(CHAVE, JSON.stringify(prefs)); } catch (e) {}
  }

  function getAudio(nome) {
    if (!somAtivo) return null;
    if (cache[nome]) return cache[nome];
    var a = new Audio('assets/audio/' + nome + '.wav');
    a.preload = 'auto';
    a.volume = prefs.volume;
    cache[nome] = a;
    return a;
  }

  function tocar(nome) {
    if (!prefs.sfx) return;
    var a = getAudio(nome);
    if (a) {
      a.currentTime = 0;
      var p = a.play();
      if (p && p.catch) p.catch(function () { tocarSintese(nome); });
      return;
    }
    tocarSintese(nome);
  }

  /* Fallback sintetizado (Web Audio) caso o arquivo não toque */
  function tocarSintese(nome) {
    if (!prefs.sfx) return;
    try {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      if (!ctxAudio) ctxAudio = new AC();
      if (ctxAudio.state === 'suspended') ctxAudio.resume();
      var o = ctxAudio.createOscillator();
      var g = ctxAudio.createGain();
      var t0 = ctxAudio.currentTime;
      o.type = 'square';
      if (nome === 'ui-success') { o.frequency.setValueAtTime(523, t0); o.frequency.setValueAtTime(659, t0 + 0.12); o.frequency.setValueAtTime(784, t0 + 0.24); o.frequency.setValueAtTime(1046, t0 + 0.36); g.gain.setValueAtTime(0.2, t0); g.gain.exponentialRampToValueAtTime(0.001, t0 + 0.5); o.start(t0); o.stop(t0 + 0.5); }
      else if (nome === 'ui-error') { o.frequency.setValueAtTime(220, t0); o.frequency.setValueAtTime(165, t0 + 0.18); g.gain.setValueAtTime(0.2, t0); g.gain.exponentialRampToValueAtTime(0.001, t0 + 0.45); o.start(t0); o.stop(t0 + 0.45); }
      else if (nome === 'ui-arcade') { o.frequency.setValueAtTime(1318, t0); o.frequency.setValueAtTime(1760, t0 + 0.1); g.gain.setValueAtTime(0.2, t0); g.gain.exponentialRampToValueAtTime(0.001, t0 + 0.3); o.start(t0); o.stop(t0 + 0.3); }
      else { o.frequency.setValueAtTime(700, t0); g.gain.setValueAtTime(0.15, t0); g.gain.exponentialRampToValueAtTime(0.001, t0 + 0.12); o.start(t0); o.stop(t0 + 0.12); }
      o.connect(g); g.connect(ctxAudio.destination);
    } catch (e) {}
  }

  function definirVolume(v) {
    prefs.volume = Math.max(0, Math.min(1, v));
    for (var k in cache) { try { cache[k].volume = prefs.volume; } catch (e) {} }
    salvarPrefs();
  }
  function alternarSfx() {
    prefs.sfx = !prefs.sfx;
    salvarPrefs();
    return prefs.sfx;
  }
  function alternarMusica() {
    prefs.musica = !prefs.musica;
    if (prefs.musica) { if (window.NostalMusica) NostalMusica.ligar(); }
    else { if (window.NostalMusica) NostalMusica.desligar(); }
    salvarPrefs();
    return prefs.musica;
  }

  /* Chamar no gesto do usuário (LIGAR NOSTALGIA / começar) */
  function ativar() {
    somAtivo = true;
    if (prefs.musica && window.NostalMusica) NostalMusica.ligar();
  }

  carregarPrefs();

  return {
    tocar: tocar,
    ativar: ativar,
    definirVolume: definirVolume,
    alternarSfx: alternarSfx,
    alternarMusica: alternarMusica,
    get prefs() { return prefs; },
    somAtivo: function () { return somAtivo; }
  };
})();