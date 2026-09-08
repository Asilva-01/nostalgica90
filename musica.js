/* ============================================================
   Nostálgica — Trilhas chiptune procedurais (Web Audio API)
   - 10 músicas por tema, rotacionando sozinhas
   - MOTOR interno: não cria botão/overlay (UI é do AudioManager)
   - Som 100% original, estilo 8-bit (sem direitos autorais)
   ============================================================ */
var NostalMusica = (function () {
  var ctx = null;
  var master = null;
  var timer = null;
  var hatTimer = null;
  var noiseBuf = null;
  var current = null;
  var currentRiffIndex = -1;
  var passLeft = 0;
  var idx = 0;
  var nextTime = 0;
  var ligado = false;
  var _tema = "desafio";

  var VOL = 0.13;

  /* ---------------- TEMAS: 10 músicas cada ---------------- */
  var temas = {
    desafio: {
      bpm: 140, wave: "square", hatStep: 1,
      root: 36, quinta: 43,
      riffs: [
        [[76,1],[74,1],[72,1],[74,1],[76,1],[76,1],[79,1],[76,1]],
        [[74,1],[74,1],[77,1],[74,1],[72,1],[79,1],[76,1],[72,1]],
        [[79,1],[76,1],[72,1],[76,1],[79,1],[81,1],[79,1],[76,1]],
        [[84,2],[79,1],[76,1],[74,2],[72,2]],
        [[72,1],[69,1],[72,1],[74,1],[76,2],[79,2]],
        [[77,1],[76,1],[74,1],[76,1],[77,1],[79,1],[77,1],[74,1]],
        [[72,1],[76,1],[79,1],[84,1],[79,1],[76,1],[74,1],[72,1]],
        [[69,1],[72,1],[76,1],[72,1],[69,1],[72,1],[74,1],[76,1]],
        [[67,1],[71,1],[74,1],[71,1],[67,1],[72,1],[74,1],[76,1]],
        [[76,2],[79,2],[81,2],[84,2]]
      ]
    },
    fliperama: {
      bpm: 165, wave: "square", hatStep: 0.5,
      root: 33, quinta: 40,
      riffs: [
        [[69,0.5],[null,0.5],[69,0.5],[72,0.5],[76,0.5],[74,0.5],[72,0.5],[74,0.5]],
        [[69,0.5],[69,0.5],[72,0.5],[76,0.5],[79,0.5],[76,0.5],[74,0.5],[72,0.5]],
        [[67,0.5],[67,0.5],[69,0.5],[71,0.5],[72,0.5],[71,0.5],[69,0.5],[67,0.5]],
        [[64,0.5],[64,0.5],[67,0.5],[71,0.5],[72,0.5],[74,0.5],[76,0.5],[79,0.5]],
        [[76,0.5],[74,0.5],[72,0.5],[74,0.5],[76,0.5],[79,0.5],[81,0.5],[84,0.5]],
        [[72,0.5],[69,0.5],[72,0.5],[76,0.5],[74,0.5],[72,0.5],[69,0.5],[72,0.5]],
        [[71,0.5],[67,0.5],[71,0.5],[74,0.5],[76,0.5],[74,0.5],[71,0.5],[67,0.5]],
        [[69,1],[72,1],[76,0.5],[79,0.5],[81,0.5],[79,0.5],[76,0.5],[74,0.5]],
        [[64,0.5],[67,0.5],[69,0.5],[72,0.5],[76,0.5],[72,0.5],[69,0.5],[67,0.5]],
        [[84,0.5],[81,0.5],[79,0.5],[76,0.5],[74,0.5],[76,0.5],[79,0.5],[81,0.5]]
      ]
    },
    retro: {
      bpm: 128, wave: "triangle", hatStep: 0.5,
      root: 31, quinta: 38,
      riffs: [
        [[74,1],[71,1],[67,1],[71,1],[74,1],[71,1],[72,1],[71,1]],
        [[69,1],[72,1],[76,1],[74,1],[72,1],[71,1],[67,2]],
        [[67,1],[71,1],[74,1],[79,1],[76,1],[74,1],[71,1],[67,1]],
        [[62,1],[67,1],[71,1],[74,1],[71,1],[67,1],[62,1],[64,1]],
        [[67,1],[71,1],[74,1],[71,1],[67,1],[71,1],[74,1],[76,1]],
        [[77,1],[76,1],[74,1],[72,1],[74,1],[76,1],[77,1],[79,1]],
        [[81,2],[79,1],[77,1],[76,2],[74,1],[72,1]],
        [[72,1],[74,1],[76,1],[74,1],[72,1],[71,1],[67,1],[69,1]],
        [[67,1],[69,1],[71,1],[72,1],[71,1],[69,1],[67,1],[71,1]],
        [[74,1],[76,1],[79,1],[81,1],[79,1],[76,1],[74,1],[71,1]]
      ]
    },
    novela: {
      bpm: 120, wave: "triangle", hatStep: 0.5,
      root: 38, quinta: 45,
      riffs: [
        [[74,1],[72,1],[69,1],[72,1],[74,2],[72,2]],
        [[76,1],[74,1],[72,1],[74,1],[76,2],[77,2]],
        [[69,1],[72,1],[76,1],[77,1],[76,1],[74,1],[72,1],[69,1]],
        [[81,2],[77,1],[74,1],[76,2],[72,2]],
        [[77,1],[76,1],[74,1],[72,1],[74,1],[76,1],[77,1],[74,1]],
        [[74,1],[69,1],[74,1],[77,1],[81,1],[77,1],[74,1],[69,1]],
        [[79,1],[77,1],[76,1],[77,1],[79,1],[81,1],[79,1],[77,1]],
        [[72,1],[69,1],[72,1],[76,1],[74,1],[72,1],[69,1],[72,1]],
        [[69,1],[72,1],[74,1],[72,1],[69,1],[74,1],[76,1],[74,1]],
        [[84,2],[81,2],[79,2],[77,2]]
      ]
    }
  };

  function temaAtual() { return temas[_tema] || temas.desafio; }
  function spbAtual() { return 60 / temaAtual().bpm; }
  function midiFreq(m) { return 440 * Math.pow(2, (m - 69) / 12); }

  function montarRiff(riffDef, spb) {
    var beat = 0, ev = [];
    riffDef.forEach(function (n) {
      var dur = n[1] * spb;
      if (n[0] !== null) ev.push({ f: midiFreq(n[0]), d: dur, w: temaAtual().wave, g: 1 });
      beat += n[1];
    });
    var totalBeats = beat;
    var nBars = Math.ceil(totalBeats / 4);
    var t = temaAtual();
    for (var b = 0; b < nBars; b++) {
      var bt = b * 4 * spb;
      ev.push({ f: midiFreq(t.root), d: 2 * spb, w: "triangle", g: 0.85 });
      ev.push({ f: midiFreq(t.quinta), d: 2 * spb, w: "triangle", g: 0.75 });
      ev.push({ f: midiFreq(t.root + 12), d: 1 * spb, w: t.wave, g: 0.25 });
    }
    ev.sort(function (a, b) { return a.t - b.t; });
    return { ev: ev, dur: nBars * 4 * spb };
  }

  function proximoRiff() {
    var rs = temaAtual().riffs;
    var n = rs.length;
    var ni = Math.floor(Math.random() * n);
    while (ni === currentRiffIndex && n > 1) ni = Math.floor(Math.random() * n);
    currentRiffIndex = ni;
    current = montarRiff(rs[ni], spbAtual());
    passLeft = 2;
    idx = 0;
  }

  function tocarNota(ev, quando) {
    var o = ctx.createOscillator();
    var g = ctx.createGain();
    o.type = ev.w;
    o.frequency.value = ev.f;
    var dur = ev.d * 0.9;
    g.gain.setValueAtTime(0.0001, quando);
    g.gain.exponentialRampToValueAtTime(0.0001 + (ev.g * VOL), quando + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, quando + dur);
    o.connect(g); g.connect(master);
    o.start(quando); o.stop(quando + dur + 0.02);
  }

  function criarNoiseBuf() {
    var len = Math.floor(ctx.sampleRate * 0.5);
    var buf = ctx.createBuffer(1, len, ctx.sampleRate);
    var data = buf.getChannelData(0);
    for (var i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    return buf;
  }

  function tocarHat(quando) {
    var src = ctx.createBufferSource();
    src.buffer = noiseBuf;
    var g = ctx.createGain();
    g.gain.setValueAtTime(0.06, quando);
    g.gain.exponentialRampToValueAtTime(0.0001, quando + 0.06);
    src.connect(g); g.connect(master);
    src.start(quando); src.stop(quando + 0.07);
  }

  function agendar() {
    var horizon = ctx.currentTime + 0.4;
    while (nextTime < horizon) {
      if (!current) proximoRiff();
      var ev = current.ev[idx];
      tocarNota(ev, nextTime);
      nextTime += ev.d;
      idx++;
      if (idx >= current.ev.length) {
        var end = nextTime;
        passLeft--;
        if (passLeft <= 0) { proximoRiff(); }
        else { idx = 0; }
        nextTime = end;
      }
    }
  }

  function startHat() {
    var t = temaAtual();
    var step = t.hatStep * spbAtual();
    var last = ctx.currentTime + 0.05;
    hatTimer = setInterval(function () {
      while (last < ctx.currentTime + 0.25) {
        tocarHat(last);
        last += step;
      }
    }, 100);
  }

  function iniciar() {
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC || ctx) { if (ctx) retomar(); return; }
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = VOL;
    master.connect(ctx.destination);
    noiseBuf = criarNoiseBuf();
    idx = 0; nextTime = ctx.currentTime + 0.08; current = null;
    ligado = true;
    timer = setInterval(agendar, 100);
    startHat();
    if (ctx.state === "suspended") ctx.resume().catch(function(){});
  }

  function retomar() {
    if (!ctx) return;
    if (ctx.state === "suspended") ctx.resume().catch(function(){});
    ligado = true;
    master.gain.setTargetAtTime(VOL, ctx.currentTime, 0.05);
  }

  function toggle() {
    if (!ctx) { iniciar(); return; }
    if (ctx.state === "suspended") { retomar(); return; }
    ligado = !ligado;
    master.gain.setTargetAtTime(ligado ? VOL : 0.0001, ctx.currentTime, 0.05);
  }

  /* ---------------- Controle de UI é do AudioManager (som.js) ----------------
     musica.js é apenas o MOTOR de reprodução. Não cria botão nem overlay.
     Exposições de estado para o som.js ler. */
  function estaLigada() { return ligado && ctx && ctx.state === "running"; }
  function estaDisponivel() { return !!ctx; }

  /* Controle explícito (iniciado por gesto do usuário via som.js) */
  function ligar() {
    if (!ctx) { iniciar(); return; }
    retomar();
  }

  function desligar() {
    if (!ctx) return;
    ligado = false;
    master.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.05);
  }

  function definirtema(tema) {
    _tema = tema || "desafio";
    if (ctx) {
      current = null;
      currentRiffIndex = -1;
      idx = 0;
      nextTime = ctx.currentTime + 0.08;
    }
  }

  return {
    init: function (tema) {
      _tema = tema || "desafio";
    },
    ligar: ligar,
    desligar: desligar,
    definirtema: definirtema,
    estaLigada: estaLigada,
    estaDisponivel: estaDisponivel,
    toggle: toggle
  };
})();