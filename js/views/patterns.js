// Frases que se encaixam: o começo fica igual e você troca o final
// ("Where is the…?", "Can I have…?"). Dados em data/patterns.json.
import * as store from '../store.js';
import { icon } from '../icons.js';
import { esc, coinReward } from '../ui.js';
import { speak, stopSpeech } from '../speech.js';
import { shuffle } from '../quiz-engine.js';
import { favBtn } from '../favorites.js';
import { wordify } from '../wordtip.js';
import '../game.js';

let data = null;
async function load() {
  if (data) return data;
  const r = await fetch('data/patterns.json', { cache: 'no-cache' });
  if (!r.ok) throw new Error('patterns');
  data = (await r.json()).frames;
  return data;
}
const split = (e) => { const i = e.en.lastIndexOf(e.end); return i < 0 ? [e.en, '', ''] : [e.en.slice(0, i), e.end, e.en.slice(i + e.end.length)]; };
const frameTitle = (f) => { const [a, , c] = split(f.endings[0]); return `${a}…${c}`; };
const seenKey = (f) => `pat.${f.id}.seen`;

async function renderIndex(root) {
  let frames;
  try { frames = await load(); } catch (e) { root.innerHTML = '<div class="card empty"><p>Não foi possível carregar.</p></div>'; return null; }
  root.innerHTML = `
    <a class="back-link" href="#/fala">${icon('back', 18)} Treino de fala</a>
    <header class="page-head">
      <h1>🧩 Frases que se encaixam</h1>
      <p class="muted">Aprenda um começo e troque só o final: com 8 começos você monta ${frames.reduce((n, f) => n + f.endings.length, 0)} frases de viagem.</p>
    </header>
    <div class="pt-grid">
      ${frames.map((f) => {
        const seen = store.getFlag(seenKey(f), []).length;
        return `<a class="card pt-card" href="#/frases/${f.id}">
          <span class="quick-emoji">${f.emoji}</span>
          <strong lang="en">${esc(frameTitle(f))}</strong>
          <span class="muted small">${esc(f.startPt)}</span>
          <span class="chip">${seen}/${f.endings.length} descobertas</span>
        </a>`;
      }).join('')}
    </div>`;
  return null;
}

async function renderFrame(root, id) {
  let frames;
  try { frames = await load(); } catch (e) { location.hash = '#/frases'; return null; }
  const f = frames.find((x) => x.id === id);
  if (!f) { location.hash = '#/frases'; return null; }
  const seen = new Set(store.getFlag(seenKey(f), []));
  let cur = f.endings[0];

  function cardHtml() {
    const [a, b, c] = split(cur);
    return `
      <p class="pt-sentence" lang="en">${wordify(a)}<span class="pt-slot">${cur.emoji} ${esc(b)}</span>${wordify(c)}</p>
      <p class="sp-pron"><span>Leia assim:</span> ${esc(cur.pron)}</p>
      <p class="pt-pt">${esc(cur.pt)}</p>
      <div class="pt-actions">
        <button type="button" class="btn btn-soft" data-listen>🔊 Ouvir</button>
        <button type="button" class="btn btn-soft" data-slow>🐢 Devagar</button>
        ${favBtn({ id: cur.id, en: cur.en, pt: cur.pt, pron: cur.pron, src: frameTitle(f) }, 'big')}
      </div>`;
  }
  function chipsHtml() {
    return f.endings.map((e) => `<button type="button" class="pt-chip ${e.id === cur.id ? 'on' : ''} ${seen.has(e.id) ? 'seen' : ''}" data-e="${e.id}" aria-pressed="${e.id === cur.id}"><span aria-hidden="true">${e.emoji}</span> <span lang="en">${esc(e.end)}</span></button>`).join('');
  }
  root.innerHTML = `
    <a class="back-link" href="#/frases">${icon('back', 18)} Frases que se encaixam</a>
    <header class="page-head">
      <h1>${f.emoji} <span lang="en">${esc(frameTitle(f))}</span></h1>
      <p class="muted">${esc(f.tip)}</p>
    </header>
    <section class="card pt-stage" aria-live="polite" data-card>${cardHtml()}</section>
    <p class="small"><strong>Troque o final:</strong> <span class="muted" data-count>${seen.size}/${f.endings.length} descobertas</span></p>
    <div class="pt-chips" data-chips>${chipsHtml()}</div>
    <div class="stack">
      <button type="button" class="btn btn-ghost" data-random>🎲 Sortear um final</button>
      <a class="btn btn-primary btn-lg" href="#/frases/${f.id}/jogo">🎮 Jogo: qual é o final?</a>
    </div>`;

  function pick(e) {
    cur = e;
    if (!seen.has(e.id)) {
      seen.add(e.id);
      store.setFlag(seenKey(f), [...seen]);
      if (seen.size === f.endings.length) store.addCoins(5);
    }
    root.querySelector('[data-card]').innerHTML = cardHtml();
    root.querySelector('[data-chips]').innerHTML = chipsHtml();
    root.querySelector('[data-count]').textContent = `${seen.size}/${f.endings.length} descobertas${seen.size === f.endings.length ? ' 🎉' : ''}`;
    speak(e.en);
  }
  function onClick(ev) {
    const c = ev.target.closest('[data-e]');
    if (c) { pick(f.endings.find((x) => x.id === c.dataset.e)); root.querySelector('[data-card]').scrollIntoView({ block: 'nearest', behavior: 'smooth' }); return; }
    if (ev.target.closest('[data-listen]')) { speak(cur.en); return; }
    if (ev.target.closest('[data-slow]')) { speak(cur.en, { slow: true }); return; }
    if (ev.target.closest('[data-random]')) pick(shuffle(f.endings.filter((x) => x !== cur))[0]);
  }
  root.addEventListener('click', onClick);
  return () => { root.removeEventListener('click', onClick); stopSpeech(); };
}

async function renderGame(root, id) {
  let frames;
  try { frames = await load(); } catch (e) { location.hash = '#/frases'; return null; }
  const f = frames.find((x) => x.id === id);
  if (!f) { location.hash = '#/frases'; return null; }
  const ROUNDS = 8;
  const qs = shuffle(f.endings).slice(0, ROUNDS);
  const startedAt = Date.now();
  let i = 0;
  let right = 0;
  let first = true;
  let locked = false;
  document.body.classList.add('lesson-mode');

  function show() {
    const q = qs[i];
    const [a, , c] = split(q);
    const opts = shuffle([q, ...shuffle(f.endings.filter((x) => x !== q)).slice(0, 3)]);
    first = true; locked = false;
    root.innerHTML = `
      <div class="lesson">
        <div class="lesson-top">
          <a class="icon-btn" href="#/frases/${f.id}" aria-label="Sair do jogo">${icon('close')}</a>
          <div class="kd-stars-row grow">${qs.map((_, k) => `<span class="${k < i ? 'on' : k === i ? 'now' : ''}">●</span>`).join('')}</div>
        </div>
        <section class="card pt-stage">
          <p class="muted small">Como se diz em inglês:</p>
          <p class="pt-q">${esc(q.pt)}</p>
          <p class="pt-sentence" lang="en">${esc(a)}<span class="pt-slot empty">___</span>${esc(c)}</p>
        </section>
        <div class="pt-opts">${opts.map((o) => `<button type="button" class="pt-chip big" data-o="${o.id}"><span aria-hidden="true">${o.emoji}</span> <span lang="en">${esc(o.end)}</span></button>`).join('')}</div>
        <p class="kd-feedback" role="status" aria-live="assertive"></p>
      </div>`;
  }
  function answer(btn) {
    if (locked) return;
    const q = qs[i];
    const fb = root.querySelector('.kd-feedback');
    if (btn.dataset.o === q.id) {
      locked = true;
      if (first) right += 1;
      btn.classList.add('right');
      root.querySelector('.pt-slot').textContent = q.end;
      root.querySelector('.pt-slot').classList.remove('empty');
      fb.innerHTML = `✅ <strong lang="en">${esc(q.en)}</strong><br><span class="sp-pron-s">🗣️ ${esc(q.pron)}</span>`;
      speak(q.en);
      setTimeout(() => { i += 1; if (i < qs.length) show(); else finish(); }, 1900);
    } else {
      first = false;
      btn.classList.add('wrong'); btn.disabled = true;
      fb.textContent = 'Quase! Tente outro final. 💪';
    }
  }
  function finish() {
    const xp = right * 2;
    store.recordQuizSession({ xp, seconds: Math.min(Math.round((Date.now() - startedAt) / 1000), 900), type: 'pattern', ref: f.id, title: `Frases: ${frameTitle(f)} (${right}/${qs.length})` });
    const coins = store.addCoins(Math.ceil(right / 2));
    root.innerHTML = `
      <div class="lesson done-screen">
        <div class="burst" aria-hidden="true">${f.emoji}</div>
        <h1>${right === qs.length ? 'Perfeito!' : 'Muito bem!'}</h1>
        <p class="score-big"><strong>${right}</strong> de ${qs.length} de primeira</p>
        <div class="reward-row"><div class="card reward"><span class="stat-icon bolt">${icon('bolt')}</span><strong>+${xp} XP</strong></div>${coinReward(coins)}</div>
        <div class="stack">
          <a class="btn btn-primary btn-lg" href="#/frases/${f.id}/jogo?${Date.now()}">Jogar de novo</a>
          <a class="btn btn-ghost" href="#/frases/${f.id}">Voltar às frases</a>
        </div>
      </div>`;
  }
  function onClick(ev) { const b = ev.target.closest('[data-o]'); if (b && !b.disabled) answer(b); }
  root.addEventListener('click', onClick);
  show();
  return () => { root.removeEventListener('click', onClick); document.body.classList.remove('lesson-mode'); stopSpeech(); };
}

export function render(root, { frame, game }) {
  if (!frame) return renderIndex(root);
  if (game) return renderGame(root, frame);
  return renderFrame(root, frame);
}
