/* ============================================================
   Nostálgica — Trilhas chiptune procedurais (Web Audio API)
   Músicas originais geradas em tempo real, sem arquivos e
   sem direitos autorais. Um tema por página.
   ============================================================ */
var NostalMusica = (function () {
  var ctx = null;
  var master = null;
  var timer = null;
  var loop = null;
  var idx = 0;
  var nextTime = 0;
  var ligado = false;
  var btn = null;

  var VOL = 0.13;

  var temas = {
    /* Desafio diário — alegre, brilhante, viciante */
    desafio: {
      bpm: 132,
      wave: "square",
      root: 36,  /* C2 */
      quinta: 43,/* G2 */
      lead: [
        [76,1],[74,1],[72,1],[74,1],
        [76,1],[76,1],[79,1],[76,1],
        [74,1],[74,1],[77,1],[74,1],
        [72,1],[79,1],[76,1],[72,1]
      ]
    },
    /* Speciais / lutas — enérgica, driving, menor */
    fliperama: {
      bpm: 150,
      wave: "square",
      root: 33,  /* A1 */
      quinta: 40,/* E2 */
      lead: [
        [69,0.5],[null,0.5],[69,0.5],[72,0.5],
        [76,0.5],[74,0.5],[72,0.5],[74,0.5],
        [69,0.5],[69,0.5],[72,0.5],[76,0.5],
        [74,0.5],[72,0.5],[69,0.5],[72,0.5],
        [67,0.5],[67,0.5],[69,0.5],[71,0.5],
        [72,0.5],[71,0.5],[69,0.5],[71,0.5],
        [72,0.5],[76,0.5],[79,0.5],[76,0.5],
        [74,0.5],[72,0.5],[69,0.5],[71,0.5]
      ]
    },
    /* Jogar de novo — aventura, saltitante */
    retro: {
      bpm: 120,
      wave: "triangle",
      root: 31,  /* G1 */
      quinta: 38,/* D2 */
      lead: [
        [74,1],[71,1],[67,1],[71,1],
        [74,1],[71,1],[72,1],[71,1],
        [69,1],[72,1],[76,1],[74,1],
        [72,1],[71,1],[67,2]
      ]
    }
  };

  function midiFreq(m) {
    return 440 * Math.pow(2, (m - 69) / 12);
  }

  function montarLoop(t) {
    var spb = 60 / t.bpm;      /* segundos por batida */
    var beat = 0;
    var ev = [];
    t.lead.forEach(function (n) {
      var dur = n[1] * spb;
      if (n[0] !== null) {
        ev.push({ t: beat * spb, f: midiFreq(n[0]), d: dur, w: t.wave, g: 1 });
      }
      beat += n[1];
    });
    var totalBeats = beat;
    var nBars = Math.ceil(totalBeats / 4);
    for (var b = 0; b < nBars; b++) {
      var bt = b * 4 * spb;
      ev.push({ t: bt, f: midiFreq(t.root), d: 2 * spb, w: "triangle", g: 0.85 });
      ev.push({ t: bt + 2 * spb, f: midiFreq(t.quinta), d: 2 * spb, w: "triangle", g: 0.75 });
    }
    ev.sort(function (a, b) { return a.t - b.t; });
    return { ev: ev, dur: nBars * 4 * spb };
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
    o.connect(g);
    g.connect(master);
    o.start(quando);
    o.stop(quando + dur + 0.02);
  }

  function agendar() {
    if (!loop) return;
    var horizon = ctx.currentTime + 0.35;
    while (nextTime < horizon) {
      var ev = loop.ev[idx];
      tocarNota(ev, nextTime);
      nextTime += ev.d;
      idx++;
      if (idx >= loop.ev.length) {
        idx = 0;
        nextTime -= loop.dur;
      }
    }
  }

  function atualizarBtn() {
    if (!btn) return;
    if (!ctx) {
      btn.innerHTML = "🎵"; btn.title = "Ligar música";
    } else if (ligado) {
      btn.innerHTML = "🔊"; btn.title = "Pausar música";
    } else {
      btn.innerHTML = "🔇"; btn.title = "Ligar música";
    }
  }

  function criarBotao() {
    if (btn) return btn;
    btn = document.createElement("button");
    btn.innerHTML = "🎵";
    btn.title = "Ligar música";
    btn.style.cssText =
      "position:fixed;bottom:16px;right:16px;z-index:999;" +
      "font-size:26px;width:52px;height:52px;border-radius:50%;border:2px solid #ffe600;" +
      "background:rgba(0,0,0,.75);color:#fff;cursor:pointer;box-shadow:3px 3px 0 #ff2d95;";
    btn.onclick = toggle;
    document.body.appendChild(btn);
    return btn;
  }

  function iniciar() {
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = VOL;
    master.connect(ctx.destination);
    loop = montarLoop(temaAtual());
    idx = 0;
    nextTime = ctx.currentTime + 0.08;
    ligado = true;
    if (ctx.state === "suspended") ctx.resume();
    timer = setInterval(agendar, 100);
    atualizarBtn();
  }

  function temaAtual() {
    return temas[_tema] || temas.desafio;
  }

  var _tema = "desafio";

  function toggle() {
    if (!ctx) {
      iniciar();
      return;
    }
    if (ctx.state === "suspended") ctx.resume();
    ligado = !ligado;
    master.gain.setTargetAtTime(ligado ? VOL : 0.0001, ctx.currentTime, 0.05);
    atualizarBtn();
  }

  return {
    init: function (tema) {
      _tema = tema || "desafio";
      criarBotao();
      atualizarBtn();
    },
    toggle: toggle
  };
})();