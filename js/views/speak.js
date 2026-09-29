// Treino de fala: shadowing e chorusing com frases de viagem. Ouça, repita
// junto, grave a sua voz e compare. Ninguém escuta além de você e do Kiko.
import * as store from '../store.js';
import { icon } from '../icons.js';
import { esc, toast, coinReward } from '../ui.js';
import { speak, stopSpeech, canSpeak } from '../speech.js';
import { shuffle } from '../quiz-engine.js';
import { kikoHtml } from '../kiko.js';
import * as content from '../content.js';
import '../game.js';

export const SITUATIONS = [
  { id: 'aeroporto', name: 'Aeroporto e imigração', emoji: '🛂', trips: { thailand: ['c1', 'c10'], usa: ['c1', 'c10'] }, lessons: ['u3l3'] },
  { id: 'hotel', name: 'Hotel', emoji: '🏨', trips: { thailand: ['c5', 'c9'], usa: ['c3'] }, lessons: [] },
  { id: 'restaurante', name: 'Restaurante e comida', emoji: '🍽️', trips: { thailand: ['c4'], usa: ['c4'] }, lessons: ['u3l2', 'u2l2'] },
  { id: 'informacoes', name: 'Pedir informações e transporte', emoji: '🧭', trips: { thailand: ['c3', 'c6'], usa: ['c2', 'c9'] }, lessons: ['u3l1'] },
  { id: 'emergencias', name: 'Emergências e farmácia', emoji: '🚑', trips: { thailand: ['c8'], usa: ['c7', 'c8'] }, lessons: [] },
  { id: 'compras', name: 'Compras', emoji: '🛍️', trips: { thailand: ['c6'], usa: ['c6'] }, lessons: ['u2l3'] },
];

// Frases-escudo: para quando der branco. Valem para todas as situações.
const SHIELD = [
  { en: 'Sorry, my English is not very good.', pt: 'Desculpe, meu inglês não é muito bom.' },
  { en: 'Can you speak slowly, please?', pt: 'Você pode falar devagar, por favor?' },
  { en: 'Can you say that again, please?', pt: 'Pode repetir, por favor?' },
  { en: 'How do you say this in English?', pt: 'Como se diz isso em inglês?' },
];

const V = () => {
  const f = store.get().profile.gender === 'f';
  return { p: f ? 'ka' : 'khrap', spouse: f ? 'husband' : 'wife', She: f ? 'He' : 'She', sheLow: f ? 'he' : 'she', herPt: f ? 'his' : 'her', spousePt: f ? 'meu marido' : 'minha esposa', spousePtCap: f ? 'Meu marido' : 'Minha esposa', ElaPt: f ? 'Ele' : 'Ela', aPt: f ? 'o' : 'a', name: (store.get().profile.name || 'Silva').split(' ')[0] };
};
const fmt = (t, v) => String(t || '').replace(/\{(\w+)\}/g, (m, k) => (k in v ? v[k] : m));

const tripCache = new Map();
async function trip(id) {
  if (!tripCache.has(id)) {
    const r = await fetch(`data/trips/${id}.json`, { cache: 'no-cache' });
    tripCache.set(id, r.ok ? await r.json() : null);
  }
  return tripCache.get(id);
}

async function phrasesFor(sit) {
  const v = V();
  const out = [];
  const add = (en, pt) => {
    const e = fmt(en, v).trim();
    const words = e.split(/\s+/).length;
    if (words < 2 || words > 12 || out.some((x) => x.en === e)) return;
    out.push({ en: e, pt: fmt(pt, v) });
  };
  for (const [tid, chs] of Object.entries(sit.trips)) {
    const t = await trip(tid);
    if (!t) continue;
    t.chapters.filter((c) => chs.includes(c.id)).forEach((c) => Object.values(c.nodes).forEach((n) => {
      if (n.type === 'build') add(n.en, n.pt);
      if (n.type === 'line' && n.who === 'you') add(n.en, n.pt);
      if (n.type === 'choice') n.options.filter((o) => o.tone === 'good' && o.lang === 'en' && o.pt).forEach((o) => add(o.text, o.pt));
    }));
  }
  sit.lessons.forEach((id) => {
    const e = content.findLesson(id);
    if (e) e.lesson.items.forEach((it) => add(it.en, it.pt));
  });
  return out;
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

function renderIndex(root) {
  const counts = store.getFlag('speak.counts', {});
  root.innerHTML = `
    <header class="page-head">
      <h1>Treino de fala 🗣️</h1>
      <p class="muted">Ouça, repita junto e grave a sua voz. Aqui ninguém escuta: só você e o Kiko.</p>
    </header>
    <section class="card sp-intro">
      ${kikoHtml(56)}
      <div>
        <p><strong>Como treinar (5 minutos):</strong></p>
        <ol class="sp-steps">
          <li>🔊 <strong>Ouça</strong> a frase e leia a tradução.</li>
          <li>🎧 <strong>Fale junto</strong> com o áudio (chorusing), no mesmo ritmo.</li>
          <li>🗣️ <strong>Repita logo depois</strong> (shadowing), imitando a melodia.</li>
          <li>🎙️ <strong>Grave</strong> e ouça a sua voz. Compare, sem se julgar!</li>
        </ol>
      </div>
    </section>
    <div class="sp-grid">
      ${SITUATIONS.map((s) => `<a class="card sp-sit" href="#/fala/${s.id}"><span class="quick-emoji">${s.emoji}</span><strong>${esc(s.name)}</strong><span class="muted small">${counts[s.id] ? `${counts[s.id]} ${counts[s.id] === 1 ? 'treino' : 'treinos'}` : 'Começar'}</span></a>`).join('')}
      <a class="card sp-sit shield" href="#/fala/escudo"><span class="quick-emoji">🛡️</span><strong>Frases-escudo</strong><span class="muted small">Para quando der branco</span></a>
    </div>`;
  return null;
}

// ---------- Sessão de treino ----------

async function renderSession(root, sitId) {
  const sit = sitId === 'escudo' ? { id: 'escudo', name: 'Frases-escudo', emoji: '🛡️' } : SITUATIONS.find((s) => s.id === sitId);
  if (!sit) { location.hash = '#/fala'; return null; }
  root.innerHTML = '<p class="muted center">Preparando as frases…</p>';
  const pool = sit.id === 'escudo' ? SHIELD : await phrasesFor(sit);
  const items = sit.id === 'escudo' ? pool : shuffle(pool).slice(0, 5);
  if (!items.length) { toast('Ainda não há frases aqui.'); location.hash = '#/fala'; return null; }
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
          <a class="icon-btn" href="#/fala" aria-label="Sair do treino">${icon('close')}</a>
          <p class="eyebrow grow center">${sit.emoji} ${esc(sit.name)}</p>
          <span class="muted small">${i + 1}/${items.length}</span>
        </div>
        <section class="card sp-phrase" aria-live="polite">
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
          <a class="btn btn-primary btn-lg" href="#/fala/${sit.id}?${Date.now()}">Treinar de novo</a>
          <a class="btn btn-ghost" href="#/fala">Outras situações</a>
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
      if (i < items.length - 1) { i += 1; show(); } else finish();
    }
  }
  root.addEventListener('click', onClick);
  show();
  return () => { alive = false; stopAll(); root.removeEventListener('click', onClick); document.body.classList.remove('lesson-mode'); };
}

export function render(root, { sit }) {
  if (!sit) return renderIndex(root);
  return renderSession(root, sit);
}
