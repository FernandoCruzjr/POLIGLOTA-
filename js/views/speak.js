// Treino de fala: shadowing e chorusing com frases de viagem. Ouça, repita
// junto, grave a sua voz e compare. Ninguém escuta além de você e do Kiko.
import * as store from '../store.js';
import { icon } from '../icons.js';
import { esc, toast, coinReward, progressBar } from '../ui.js';
import { speak, stopSpeech, canSpeak } from '../speech.js';
import { shuffle } from '../quiz-engine.js';
import { kikoHtml } from '../kiko.js';
import '../game.js';

// 500 frases de turismo em data/phrases.json (gerado por tools/make_phrases.py).
let bank = null;
async function loadBank() {
  if (bank) return bank;
  const r = await fetch('data/phrases.json', { cache: 'no-cache' });
  if (!r.ok) throw new Error('phrases');
  bank = (await r.json()).situations;
  return bank;
}

// Progresso de cada frase: quantas vezes treinou e se marcou como difícil.
const prog = () => store.getFlag('speak.p', {});
function mark(id, rate) {
  const all = prog();
  const cur = all[id] || { n: 0, hard: false };
  cur.n += 1;
  cur.hard = rate === 'hard' ? true : rate === 'easy' ? false : cur.hard;
  cur.last = Date.now();
  all[id] = cur;
  store.setFlag('speak.p', all);
}
const practiced = (list) => { const pr = prog(); return list.filter((x) => pr[x.id]).length; };
const hardList = (sits) => { const pr = prog(); return sits.flatMap((s) => s.phrases).filter((x) => pr[x.id] && pr[x.id].hard); };

// Escolhe 10: primeiro as nunca treinadas (mais fáceis antes), depois as difíceis, depois as menos treinadas.
function pickSession(list, n = 10) {
  const pr = prog();
  const score = (x) => (pr[x.id] ? (pr[x.id].hard ? 1 : 2 + pr[x.id].n) : 0) * 10 + (x.level || 1) + Math.random();
  return [...list].sort((a, b) => score(a) - score(b)).slice(0, n);
}

const norm = (s) => s.toLowerCase().replace(/[^a-z0-9' ]/g, ' ').split(/\s+/).filter(Boolean);
function similarity(target, said) {
  const t = norm(target);
  const s = new Set(norm(said));
  return t.length ? t.filter((w) => s.has(w)).length / t.length : 0;
}

const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const canRecord = () => Boolean(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder);

// ---------- Escolher a situação ----------

async function renderIndex(root) {
  let sits;
  try { sits = await loadBank(); } catch (e) { root.innerHTML = '<div class="card empty"><p>Não foi possível carregar as frases.</p></div>'; return null; }
  const main = sits.filter((x) => x.id !== 'escudo');
  const total = main.reduce((n, x) => n + x.phrases.length, 0);
  const done = main.reduce((n, x) => n + practiced(x.phrases), 0);
  const hard = hardList(sits).length;
  root.innerHTML = `
    <header class="page-head">
      <h1>Treino de fala 🗣️</h1>
      <p class="muted">${total} frases de turismo para falar sem travar. Aqui ninguém escuta: só você e o Kiko.</p>
    </header>
    <section class="card sp-intro">
      ${kikoHtml(56)}
      <div>
        <p><strong>${done} de ${total} frases treinadas</strong></p>
        ${progressBar(done / total, 'Frases treinadas')}
        <ol class="sp-steps">
          <li>🔊 <strong>Ouça</strong> a frase e leia a tradução.</li>
          <li>🎧 <strong>Fale junto</strong> com o áudio (chorusing).</li>
          <li>🗣️ <strong>Repita logo depois</strong> (shadowing), imitando a melodia.</li>
          <li>🎙️ <strong>Grave</strong> e ouça a sua voz. Compare, sem se julgar!</li>
        </ol>
      </div>
    </section>
    <div class="sp-grid">
      ${sits.map((x) => { const d = practiced(x.phrases); return `<a class="card sp-sit ${x.id === 'escudo' ? 'shield' : ''}" href="#/fala/${x.id}"><span class="quick-emoji">${x.emoji}</span><strong>${esc(x.name)}</strong><span class="muted small">${d}/${x.phrases.length} treinadas</span>${progressBar(d / x.phrases.length, x.name)}</a>`; }).join('')}
      ${hard ? `<a class="card sp-sit hard" href="#/fala/dificeis/treino"><span class="quick-emoji">😅</span><strong>Minhas difíceis</strong><span class="muted small">${hard} ${hard === 1 ? 'frase' : 'frases'} para repetir</span></a>` : ''}
    </div>`;
  return null;
}

// ---------- Uma situação: subtemas e lista de frases ----------

async function renderSituation(root, sitId) {
  let sits;
  try { sits = await loadBank(); } catch (e) { location.hash = '#/fala'; return null; }
  const sit = sits.find((x) => x.id === sitId);
  if (!sit) { location.hash = '#/fala'; return null; }
  const pr = prog();
  const subs = [...new Set(sit.phrases.map((x) => x.sub))];
  const d = practiced(sit.phrases);
  root.innerHTML = `
    <a class="back-link" href="#/fala">${icon('back', 18)} Treino de fala</a>
    <header class="page-head">
      <h1>${sit.emoji} ${esc(sit.name)}</h1>
      <p class="muted">${d} de ${sit.phrases.length} frases treinadas.</p>
    </header>
    <a class="btn btn-primary btn-lg" href="#/fala/${sit.id}/treino">🗣️ Treinar ${Math.min(10, sit.phrases.length)} frases</a>
    <p class="muted small">O treino começa pelas frases que você ainda não falou, das mais fáceis para as mais longas.</p>
    ${subs.map((sub, k) => {
      const list = sit.phrases.filter((x) => x.sub === sub);
      return `<section class="card sp-sub">
        <div class="row-between"><h2>${esc(sub)}</h2><a class="btn btn-soft" href="#/fala/${sit.id}/s${k}">Treinar</a></div>
        <ul class="sp-list">${list.map((x) => `<li>
          <button type="button" class="icon-btn speak-btn small-btn" data-say="${esc(x.en)}" aria-label="Ouvir">${icon('speaker', 18)}</button>
          <span><strong lang="en">${esc(x.en)}</strong>${x.hear ? ' <span class="chip sp-hear">👂 você vai ouvir</span>' : ''}<br><span class="muted">${esc(x.pt)}</span></span>
          <span class="sp-mark" aria-label="${pr[x.id] ? (pr[x.id].hard ? 'difícil' : 'treinada') : 'nova'}">${pr[x.id] ? (pr[x.id].hard ? '😅' : '✅') : ''}</span>
        </li>`).join('')}</ul>
      </section>`;
    }).join('')}`;
  const onClick = (e) => { const b = e.target.closest('[data-say]'); if (b) speak(b.dataset.say); };
  root.addEventListener('click', onClick);
  return () => { root.removeEventListener('click', onClick); stopSpeech(); };
}

// ---------- Sessão de treino ----------

async function renderSession(root, sitId, mode) {
  let sits;
  try { sits = await loadBank(); } catch (e) { location.hash = '#/fala'; return null; }
  let sit = sits.find((x) => x.id === sitId);
  let pool;
  if (sitId === 'dificeis') { sit = { id: 'dificeis', name: 'Minhas difíceis', emoji: '😅' }; pool = hardList(sits); }
  else if (!sit) { location.hash = '#/fala'; return null; }
  else if (mode && mode.startsWith('s')) {
    const sub = [...new Set(sit.phrases.map((x) => x.sub))][Number(mode.slice(1))];
    pool = sit.phrases.filter((x) => x.sub === sub);
  } else pool = sit.phrases;
  const items = pickSession(pool || [], 10);
  const back = sitId === 'dificeis' ? '#/fala' : `#/fala/${sitId}`;
  if (!items.length) { toast('Nenhuma frase aqui ainda.'); location.hash = back; return null; }
  const startedAt = Date.now();
  let i = 0;
  let easy = 0;
  let rec = null;
  let chunks = [];
  let myAudio = null;
  let recog = null;
  let alive = true;
  document.body.classList.add('lesson-mode');

  function stopAll() {
    stopSpeech();
    try { rec && rec.state === 'recording' && rec.stop(); } catch (e) { /* ignora */ }
    try { recog && recog.abort(); } catch (e) { /* ignora */ }
  }

  function show() {
    const it = items[i];
    myAudio = null;
    root.innerHTML = `
      <div class="lesson sp">
        <div class="lesson-top">
          <a class="icon-btn" href="${back}" aria-label="Sair do treino">${icon('close')}</a>
          <p class="eyebrow grow center">${sit.emoji} ${esc(sit.name)}</p>
          <span class="muted small">${i + 1}/${items.length}</span>
        </div>
        <section class="card sp-phrase" aria-live="polite">
          ${it.hear ? '<span class="chip sp-hear">👂 Frase que você vai ouvir: entenda e responda</span>' : it.sub ? `<span class="chip">${esc(it.sub)}</span>` : ''}
          <p class="sp-en" lang="en">${esc(it.en)}</p>
          <p class="sp-pt">${esc(it.pt)}</p>
        </section>
        <div class="sp-buttons">
          <button type="button" class="btn btn-soft btn-lg" data-listen>🔊 Ouvir</button>
          <button type="button" class="btn btn-soft btn-lg" data-slow>🐢 Devagar</button>
          <button type="button" class="btn btn-soft btn-lg" data-chorus>🎧 Falar junto</button>
          ${canRecord() ? '<button type="button" class="btn btn-primary btn-lg" data-rec>🎙️ Gravar minha voz</button>' : ''}
          ${Recognition ? '<button type="button" class="btn btn-soft btn-lg" data-check>🦜 Kiko, você me entendeu?</button>' : ''}
        </div>
        <div class="sp-result" data-result role="status" aria-live="polite">${canRecord() ? '' : '<p class="muted small">Seu navegador não permite gravar. Tudo bem: repita em voz alta logo depois do áudio!</p>'}</div>
        <div class="card sp-rate">
          <p class="small"><strong>Como foi falar essa frase?</strong></p>
          <div class="sp-rate-row">
            <button type="button" class="btn btn-ghost" data-rate="hard">😅 Difícil</button>
            <button type="button" class="btn btn-ghost" data-rate="ok">🙂 Deu certo</button>
            <button type="button" class="btn btn-ghost" data-rate="easy">😎 Fácil</button>
          </div>
        </div>
      </div>`;
    setTimeout(() => alive && speak(it.en), 300);
  }

  async function record(btn) {
    const box = root.querySelector('[data-result]');
    if (rec && rec.state === 'recording') { rec.stop(); return; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunks = [];
      rec = new MediaRecorder(stream);
      rec.ondataavailable = (e) => chunks.push(e.data);
      rec.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        if (!alive) return;
        myAudio = URL.createObjectURL(new Blob(chunks, { type: rec.mimeType || 'audio/webm' }));
        btn.textContent = '🎙️ Gravar de novo';
        btn.classList.remove('recording');
        box.innerHTML = `<div class="sp-compare"><button type="button" class="btn btn-soft" data-mine>▶ Minha voz</button><button type="button" class="btn btn-soft" data-listen>🔊 Original</button></div><p class="muted small">Ouça os dois e perceba a diferença na melodia. Parecido já é ótimo!</p>`;
      };
      rec.start();
      btn.textContent = '⏹ Parar';
      btn.classList.add('recording');
      box.innerHTML = '<p class="sp-live">🔴 Gravando… fale a frase!</p>';
      setTimeout(() => rec && rec.state === 'recording' && rec.stop(), 8000);
    } catch (e) {
      box.innerHTML = '<p class="muted small">Não consegui usar o microfone. Libere o acesso ao microfone no navegador, ou só repita em voz alta.</p>';
    }
  }

  function check() {
    const box = root.querySelector('[data-result]');
    const it = items[i];
    try {
      recog = new Recognition();
      recog.lang = 'en-US';
      recog.interimResults = false;
      recog.maxAlternatives = 3;
      box.innerHTML = '<p class="sp-live">👂 Pode falar…</p>';
      recog.onresult = (e) => {
        const alts = [...e.results[0]].map((a) => a.transcript);
        const best = alts.reduce((b, a) => (similarity(it.en, a) > similarity(it.en, b) ? a : b), alts[0]);
        const sc = Math.round(similarity(it.en, best) * 100);
        box.innerHTML = `<p>O Kiko entendeu: <strong lang="en">“${esc(best)}”</strong></p>
          <p class="sp-score ${sc >= 80 ? 'good' : sc >= 50 ? 'ok' : ''}">${sc >= 80 ? '🎉 Entendi tudo!' : sc >= 50 ? '👍 Entendi quase tudo!' : '💪 Vamos de novo, mais devagar?'} (${sc}%)</p>`;
      };
      recog.onerror = () => { box.innerHTML = '<p class="muted small">Não ouvi direito. Tente de novo, perto do microfone.</p>'; };
      recog.start();
    } catch (e) { box.innerHTML = '<p class="muted small">O reconhecimento de voz não está disponível aqui.</p>'; }
  }

  function finish() {
    const counts = store.getFlag('speak.counts', {});
    counts[sit.id] = (counts[sit.id] || 0) + 1;
    store.setFlag('speak.counts', counts);
    const xp = items.length * 2;
    store.recordQuizSession({ xp, seconds: Math.min(Math.round((Date.now() - startedAt) / 1000), 1200), type: 'speak', ref: sit.id, title: `Treino de fala: ${sit.name}` });
    const coins = store.addCoins(3);
    root.innerHTML = `
      <div class="lesson done-screen">
        <div class="burst" aria-hidden="true">🗣️</div>
        <h1>Você falou inglês hoje!</h1>
        <p class="muted">${items.length} frases em voz alta. Cada repetição deixa a boca mais acostumada, e a vergonha menor.</p>
        <div class="reward-row"><div class="card reward"><span class="stat-icon bolt">${icon('bolt')}</span><strong>+${xp} XP</strong></div>${coinReward(coins)}</div>
        <ul class="kd-learned">${items.map((it) => `<li><span><strong lang="en">${esc(it.en)}</strong><br><span class="muted">${esc(it.pt)}</span></span></li>`).join('')}</ul>
        <p class="muted small">${easy >= items.length - 1 ? 'Achou fácil? Tente sem olhar a frase na próxima!' : 'Repita este treino amanhã: frases difíceis ficam fáceis com repetição.'}</p>
        <div class="stack">
          <a class="btn btn-primary btn-lg" href="#/fala/${sit.id}/${mode || 'treino'}?${Date.now()}">Treinar mais</a>
          <a class="btn btn-ghost" href="${back}">Voltar</a>
        </div>
      </div>`;
  }

  function onClick(e) {
    const it = items[i];
    if (e.target.closest('[data-listen]')) { speak(it.en); return; }
    if (e.target.closest('[data-slow]')) { speak(it.en, { slow: true }); return; }
    if (e.target.closest('[data-chorus]')) {
      root.querySelector('[data-result]').innerHTML = '<p class="sp-live">🎧 Fale junto comigo, agora!</p>';
      speak(it.en, { slow: true });
      return;
    }
    const r = e.target.closest('[data-rec]');
    if (r) { stopSpeech(); record(r); return; }
    if (e.target.closest('[data-mine]')) { if (myAudio) new Audio(myAudio).play(); return; }
    if (e.target.closest('[data-check]')) { stopSpeech(); check(); return; }
    const rate = e.target.closest('[data-rate]');
    if (rate) {
      stopAll();
      if (rate.dataset.rate === 'easy') easy += 1;
      mark(it.id, rate.dataset.rate);
      if (i < items.length - 1) { i += 1; show(); } else finish();
    }
  }
  root.addEventListener('click', onClick);
  show();
  return () => { alive = false; stopAll(); root.removeEventListener('click', onClick); document.body.classList.remove('lesson-mode'); };
}

export function render(root, { sit, mode }) {
  if (!sit) return renderIndex(root);
  if (!mode) return renderSituation(root, sit);
  return renderSession(root, sit, mode);
}
