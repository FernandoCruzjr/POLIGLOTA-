// Área Viagem: histórias narradas e ramificadas. Cada escolha leva a um
// caminho diferente; o conteúdo fica em data/trips/*.json (gerado por
// tools/story_*.py).
import * as store from '../store.js';
import { icon } from '../icons.js';
import { esc, progressBar, toast, coinReward } from '../ui.js';
import { speak, speakPt, stopSpeech, canSpeak } from '../speech.js';
import { shuffle } from '../quiz-engine.js';
import { mapHtml, wireMap, coinChip, openChest, lockedToast } from '../game.js';
import { kikoHtml } from '../kiko.js';
import { renderBoss } from './boss.js';
import { wordify } from '../wordtip.js';
import { favBtn } from '../favorites.js';

const XP = { chapterFirst: 10, chapterRepeat: 3, perGood: 2 };
const COINS = { chapterFirst: 10, chapterRepeat: 2, chest: 100 };
const SOON = [['🇵🇹', 'Portugal'], ['🇬🇧', 'Londres'], ['🇫🇷', 'Paris'], ['🇮🇹', 'Itália']];
const cache = new Map();
const INKS = ['#1D4ED8', '#B91C1C', '#0F7A4A', '#7C3AED', '#C2410C', '#0E7490', '#BE185D', '#4D7C0F', '#1E3A8A', '#9A3412'];
const inkFor = (i) => INKS[i % INKS.length];

// ---------- Dados ----------

async function loadIndex() {
  if (cache.has('index')) return cache.get('index');
  const res = await fetch('data/trips/index.json', { cache: 'no-cache' });
  if (!res.ok) throw new Error('index');
  const data = (await res.json()).trips;
  cache.set('index', data);
  return data;
}

async function loadTrip(id) {
  if (cache.has(id)) return cache.get(id);
  const res = await fetch(`data/trips/${id}.json`, { cache: 'no-cache' });
  if (!res.ok) throw new Error('trip');
  const trip = await res.json();
  trip.chapters.forEach((c, i) => { c.number = i + 1; c.lessonId = `trip.${trip.id}.${c.id}`; });
  cache.set(id, trip);
  return trip;
}

const done = (c) => store.isLessonDone(c.lessonId);
const unlocked = (trip, i) => i === 0 || done(trip.chapters[i]) || done(trip.chapters[i - 1]);
const seenKey = (trip, c) => `trip.${trip.id}.${c.id}.seen`;
const endKey = (trip, c) => `trip.${trip.id}.${c.id}.endings`;

const bossKey = (trip) => `trip.${trip.id}.boss`;
const bossDone = (trip) => store.isLessonDone(bossKey(trip));

export function tripProgress(trip) {
  const d = trip.chapters.filter(done).length;
  return { done: d, total: trip.chapters.length, next: trip.chapters.find((c) => !done(c)) || null, boss: bossDone(trip) };
}

// Último momento em que o aluno jogou esta viagem (para saber qual é a "atual").
function lastPlayed(trip) {
  const ls = store.get().lessons;
  return trip.chapters.reduce((m, c) => {
    const l = ls[c.lessonId];
    return l && l.lastAt > m ? l.lastAt : m;
  }, '');
}

function discovery(trip, c) {
  const seen = new Set(store.getFlag(seenKey(trip, c), []));
  const ids = Object.keys(c.nodes);
  const found = ids.filter((id) => seen.has(id)).length;
  return { pct: ids.length ? found / ids.length : 0, endings: store.getFlag(endKey(trip, c), []).length, totalEndings: c.endings.length };
}

function starsOf(c) {
  const st = store.get().lessons[c.lessonId];
  if (!st) return 0;
  return st.score >= 90 ? 3 : st.score >= 60 ? 2 : 1;
}

// Usado pelo Início para mostrar o card da viagem atual.
export async function currentTripSummary() {
  try {
    const list = await loadIndex();
    const trips = await Promise.all(list.map((t) => loadTrip(t.id)));
    const played = trips.filter((t) => lastPlayed(t)).sort((a, b) => (lastPlayed(a) < lastPlayed(b) ? 1 : -1));
    const unfinished = (t) => tripProgress(t).next;
    const trip = played.find(unfinished) || trips.find((t) => unfinished(t) && !played.includes(t)) || played[0] || trips[0];
    return { trip, ...tripProgress(trip) };
  } catch (e) { return null; }
}

// ---------- Personalização (khrap/ka, esposa/marido) ----------

function vars() {
  const p = store.get().profile;
  const f = p.gender === 'f';
  return {
    p: f ? 'ka' : 'khrap',
    spouse: f ? 'husband' : 'wife',
    She: f ? 'He' : 'She',
    spousePt: f ? 'meu marido' : 'minha esposa',
    spousePtCap: f ? 'Meu marido' : 'Minha esposa',
    herPt: f ? 'his' : 'her',
    sheLow: f ? 'he' : 'she',
    ElaPt: f ? 'Ele' : 'Ela',
    aPt: f ? 'o' : 'a',
    name: (p.name || 'Silva').split(' ')[0],
  };
}

function fmt(text) {
  if (!text) return text;
  const v = vars();
  return String(text).replace(/\{(\w+)\}/g, (m, k) => (k in v ? v[k] : m));
}

function genderPicker(onPick) {
  const wrap = document.createElement('div');
  wrap.className = 'modal-backdrop';
  wrap.innerHTML = `
    <div class="modal card" role="dialog" aria-modal="true" aria-labelledby="gender-title">
      ${kikoHtml(72, { cls: 'modal-mascot' })}
      <h2 id="gender-title">Antes de viajar…</h2>
      <p class="muted">Nas histórias, algumas falas mudam conforme quem viaja: <strong lang="en">my wife</strong> ou <strong lang="en">my husband</strong> (e, na Tailândia, <strong>khrap</strong> ou <strong>ka</strong>). Como você quer aparecer nas falas?</p>
      <div class="stack">
        <button type="button" class="btn btn-soft btn-lg" data-g="m">🙋‍♂️ Homem <span class="muted small">(my wife · khrap)</span></button>
        <button type="button" class="btn btn-soft btn-lg" data-g="f">🙋‍♀️ Mulher <span class="muted small">(my husband · ka)</span></button>
      </div>
    </div>`;
  document.body.appendChild(wrap);
  wrap.querySelector('[data-g]').focus();
  wrap.addEventListener('click', (e) => {
    const b = e.target.closest('[data-g]');
    if (!b) return;
    store.setLocalPref({ gender: b.dataset.g });
    wrap.remove();
    onPick();
  });
}

// ---------- Peças visuais ----------

function sceneHtml(scene, big = false) {
  const items = (scene && scene.items) || [];
  return `<div class="scene sky-${esc((scene && scene.sky) || 'day')} ${big ? 'big' : ''}" aria-hidden="true">
    <span class="scene-cloud c1">☁️</span><span class="scene-cloud c2">☁️</span>
    ${items.map(([e, anim], i) => `<span class="scene-item anim-${esc(anim)} pos-${i}">${e}</span>`).join('')}
    <span class="scene-ground"></span>
  </div>`;
}

const slowOn = () => store.get().profile.slowTrip === true;
const ptOn = () => store.get().profile.showPt === true;
const sayEn = (text) => speak(text, { slow: slowOn() });
function speakBtn(text, label = 'Ouvir') {
  return canSpeak() ? `<button type="button" class="icon-btn speak-btn small-btn" data-say="${esc(text)}" aria-label="${label}">${icon('speaker', 18)}</button><button type="button" class="icon-btn speak-btn small-btn slow-btn" data-say-slow="${esc(text)}" aria-label="Ouvir devagar">🐢</button>` : '';
}

const strip = (w) => w.replace(/[.,!?]+$/g, '');
const norm = (s) => s.toLowerCase().replace(/[.,!?]/g, '').replace(/\s+/g, ' ').trim();

function buildDock(step) {
  const en = fmt(step.en);
  const tiles = shuffle([...en.split(' ').map(strip), ...(step.extra || []).map(fmt)]);
  return {
    html: `<div class="build-wrap" data-build>
      <p class="dock-prompt">🧩 Monte em inglês: <strong>${esc(fmt(step.pt))}</strong></p>
      <div class="build-answer" data-answer aria-label="Sua frase" aria-live="polite"><span class="muted small">Toque nas palavras na ordem certa</span></div>
      <div class="tiles" data-bank>${tiles.map((t, i) => `<button type="button" class="tile" data-tile="${i}">${esc(t)}</button>`).join('')}</div>
      <div class="dock-actions">
        <button type="button" class="btn btn-ghost" data-clear>Limpar</button>
        <button type="button" class="btn btn-primary" data-check disabled>Verificar</button>
      </div></div>`,
    target: norm(en),
    en,
  };
}

// Liga os blocos de "monte a frase"; chama onResult(ok) uma única vez.
function wireBuild(host, target, onResult) {
  const dock = host.querySelector('[data-build]');
  const answer = dock.querySelector('[data-answer]');
  const check = dock.querySelector('[data-check]');
  const picked = [];
  let used = false;
  const redraw = () => {
    answer.innerHTML = picked.length
      ? picked.map((b, i) => `<button type="button" class="tile in-answer" data-remove="${i}">${esc(b.textContent)}</button>`).join('')
      : '<span class="muted small">Toque nas palavras na ordem certa</span>';
    check.disabled = picked.length === 0;
  };
  dock.addEventListener('click', (e) => {
    if (used) return;
    const t = e.target.closest('[data-tile]');
    if (t && !t.disabled) { picked.push(t); t.disabled = true; t.classList.add('used'); redraw(); return; }
    const r = e.target.closest('[data-remove]');
    if (r) { const [b] = picked.splice(Number(r.dataset.remove), 1); b.disabled = false; b.classList.remove('used'); redraw(); return; }
    if (e.target.closest('[data-clear]')) { picked.splice(0).forEach((b) => { b.disabled = false; b.classList.remove('used'); }); redraw(); return; }
    if (e.target.closest('[data-check]')) {
      used = true;
      onResult(norm(picked.map((b) => b.textContent).join(' ')) === target);
    }
  });
}

function narrationToggle() {
  const on = store.get().profile.narration !== false;
  return `<button type="button" class="icon-btn narr-toggle" data-narr aria-pressed="${on}" aria-label="${on ? 'Desligar' : 'Ligar'} narração">${on ? '🔊' : '🔇'}</button>
    <button type="button" class="icon-btn narr-toggle ${slowOn() ? 'on' : ''}" data-slowtoggle aria-pressed="${slowOn()}" aria-label="Inglês devagar">🐢</button>
    <button type="button" class="icon-btn narr-toggle ${ptOn() ? 'on' : ''}" data-pttoggle aria-pressed="${ptOn()}" aria-label="Mostrar sempre a tradução">🇧🇷</button>`;
}

// ---------- Mundo: escolher o destino ----------

async function renderWorld(root) {
  root.innerHTML = '<p class="muted center">Abrindo o mapa-múndi…</p>';
  let trips;
  try {
    const list = await loadIndex();
    trips = await Promise.all(list.map((t) => loadTrip(t.id)));
  } catch (e) {
    root.innerHTML = '<div class="card empty"><p>Não foi possível carregar os destinos. Verifique a internet.</p></div>';
    return null;
  }
  const stamps = trips.reduce((n, t) => n + t.chapters.filter(done).length + (bossDone(t) ? 1 : 0), 0);
  root.classList.add('world-view');
  root.innerHTML = `
    <header class="world-head">
      <div class="map-top-row">
        <span class="world-globe" aria-hidden="true">🌍</span>
        ${coinChip()}
      </div>
      <h1>Para onde vamos?</h1>
      <p>Escolha um destino. Cada viagem tem ilhas com histórias, um chefão e um baú do tesouro.</p>
      <div class="map-actions">
        <a class="map-btn" href="#/passaporte">🛂 Passaporte <span class="badge">${stamps}</span></a>
        <a class="map-btn" href="#/loja">🛍️ Lojinha do Kiko</a>
      </div>
    </header>
    <div class="world-list">
      ${trips.map((t) => {
        const pr = tripProgress(t);
        const state = pr.boss ? '🏆 Chefão derrotado' : pr.next ? (pr.done ? `▶ Próxima: ${esc(pr.next.title)}` : '✨ Nova aventura') : `${t.boss ? t.boss.emoji : '⚔️'} Chefão te esperando`;
        return `
        <a class="dest ${esc(t.theme || 'ocean')}" href="#/viagem/${t.id}" aria-label="${esc(t.title)}: ${pr.done} de ${pr.total} ilhas">
          <span class="dest-deco" aria-hidden="true">${t.chapters[4]?.island?.[0] || '✈️'}</span>
          <div class="dest-top">
            <span class="dest-flag" aria-hidden="true">${t.emoji}</span>
            <div><h2>${esc(t.title)}</h2><p>${esc(t.intro)}</p></div>
          </div>
          ${progressBar(pr.done / pr.total, `Progresso: ${t.title}`)}
          <div class="dest-meta"><span>🏝️ ${pr.done}/${pr.total} ilhas</span><span>${state}</span></div>
          <span class="dest-cta">${pr.done ? 'Continuar' : 'Embarcar'} ✈️</span>
        </a>`;
      }).join('')}
    </div>
    <section class="world-soon map-soon" aria-labelledby="soon-title">
      <h2 id="soon-title">🧳 Próximos destinos</h2>
      <div class="soon-isles">
        ${SOON.map(([f, n]) => `<div class="soon-isle"><span>${f}</span><strong>${n}</strong><em>em breve</em></div>`).join('')}
      </div>
    </section>`;
  return () => root.classList.remove('world-view');
}

// ---------- Mapa de aventura de um destino ----------

function kikoLine(trip, pr) {
  if (!pr.done) return `Oi! Sou o Professor Kiko. Toque na primeira ilha para começar a ${trip.title}!`;
  if (pr.next) return `Muito bem! Próxima aula: ${pr.next.title}. Bora?`;
  if (!pr.boss) return `Todas as ilhas feitas! Agora enfrente ${trip.boss ? trip.boss.name : 'o chefão'}! ⚔️`;
  return 'Chefão derrotado! Abra o baú do tesouro! 🎁';
}

async function renderIndex(root, tripId) {
  root.innerHTML = '<p class="muted center">Carregando o mapa…</p>';
  let trip;
  try { trip = await loadTrip(tripId); } catch (e) { location.hash = '#/viagem'; return null; }
  const chs = trip.chapters;
  const pr = tripProgress(trip);
  const g = store.get().profile.gender;
  const allDone = !pr.next;
  const spec = {
    theme: trip.theme || 'ocean',
    startLabel: trip.route || `🛫 Brasil → ${trip.title}`,
    kikoLine: kikoLine(trip, pr),
    kikoKey: `trip.${trip.id}.kikoAt`,
    nodes: chs.map((c, i) => {
      const open = unlocked(trip, i);
      const isDone = done(c);
      const stars = starsOf(c);
      const [main, side] = c.island || [c.emoji, ''];
      return {
        main, side, name: c.title, sign: `Nível ${i + 1}`, done: isDone, open, stars,
        next: pr.next && pr.next.id === c.id,
        aria: `Ilha ${i + 1}: ${c.title}${isDone ? `, concluída com ${stars} estrelas` : open ? ', liberada' : ', bloqueada'}`,
      };
    }),
    boss: trip.boss ? { ...trip.boss, open: allDone, done: pr.boss } : null,
    chest: { open: trip.boss ? pr.boss : allDone },
  };

  root.classList.add('map-view', `theme-${spec.theme}`);
  root.innerHTML = `
    <header class="map-header">
      <div class="map-top-row">
        <a class="map-btn" href="#/viagem" aria-label="Voltar aos destinos">🌍 Destinos</a>
        ${coinChip()}
      </div>
      <div class="map-title">
        <span class="trip-flag" aria-hidden="true">${trip.emoji}</span>
        <div>
          <h1>${esc(trip.title)}</h1>
          <p class="small">${pr.done} de ${chs.length} ilhas · fala como <button type="button" class="link-btn inline light" data-change-gender>${g === 'f' ? 'mulher' : g === 'm' ? 'homem' : 'escolher'}</button></p>
        </div>
      </div>
      ${progressBar(pr.done / chs.length, 'Progresso da viagem')}
      <div class="map-actions">
        ${pr.next ? `<a class="map-btn primary" href="#/viagem/${trip.id}/${pr.next.id}">▶ ${pr.done ? 'Continuar' : 'Começar'}</a>` : !pr.boss && trip.boss ? `<a class="map-btn primary" href="#/viagem/${trip.id}/chefao">⚔️ Enfrentar o chefão</a>` : ''}
        <a class="map-btn" href="#/passaporte?${trip.id}">🛂 Passaporte <span class="badge">${pr.done + (pr.boss ? 1 : 0)}</span></a>
        <a class="map-btn" href="#/viagem/${trip.id}/frases">🧩 Monte a frase</a>
      </div>
    </header>
    ${mapHtml(spec)}
    <div class="sheet-backdrop" data-sheet-bg hidden></div>
    <section class="sheet" data-sheet hidden role="dialog" aria-modal="true" aria-labelledby="sheet-title"></section>`;
  wireMap(root, spec);

  const sheet = root.querySelector('[data-sheet]');
  const sheetBg = root.querySelector('[data-sheet-bg]');
  const closeSheet = () => { sheet.hidden = true; sheetBg.hidden = true; stopSpeech(); };
  const showSheet = (html) => {
    sheet.innerHTML = html;
    sheet.hidden = false;
    sheetBg.hidden = false;
    sheet.querySelector('.btn-primary')?.focus({ preventScroll: true });
  };

  function openChapter(i) {
    const c = chs[i];
    if (!unlocked(trip, i)) { lockedToast('a ilha anterior'); return; }
    const d = discovery(trip, c);
    const stars = starsOf(c);
    const isDone = done(c);
    showSheet(`
      ${sceneHtml(c.scene)}
      <div class="sheet-body">
        <p class="eyebrow">Nível ${i + 1} · ${trip.emoji} ${esc(trip.title)}</p>
        <h2 id="sheet-title">${c.emoji} ${esc(c.title)}</h2>
        <p class="muted">${esc(c.summary)}</p>
        ${isDone ? `<p class="sheet-meta">${'⭐'.repeat(stars)}${'☆'.repeat(3 - stars)} · 🧭 ${Math.round(d.pct * 100)}% dos caminhos${d.totalEndings > 1 ? ` · 🏁 ${d.endings}/${d.totalEndings} finais` : ''}</p>` : ''}
        <div class="stack">
          <a class="btn btn-primary btn-lg" href="#/viagem/${trip.id}/${c.id}">${isDone ? '🔀 Jogar de novo' : '▶ Começar a aula'}</a>
          <button type="button" class="btn btn-ghost" data-close>Fechar</button>
        </div>
      </div>`);
  }

  function openBoss() {
    if (!allDone) { lockedToast('todas as ilhas'); return; }
    const b = trip.boss;
    showSheet(`
      <div class="boss-arena ${esc(spec.theme)}"><div class="boss-figure" aria-hidden="true">${b.emoji}</div><p class="boss-say">${esc(b.intro)}</p></div>
      <div class="sheet-body">
        <p class="eyebrow">Chefão · ${trip.emoji} ${esc(trip.title)}</p>
        <h2 id="sheet-title">${esc(b.name)}</h2>
        <p class="muted">7 acertos para vencer, 3 corações e 15 segundos por pergunta. Vitória vale 🪙 50 e um carimbo especial!</p>
        ${pr.boss ? '<p class="sheet-meta">🏆 Você já venceu este chefão.</p>' : ''}
        <div class="stack">
          <a class="btn btn-primary btn-lg" href="#/viagem/${trip.id}/chefao">⚔️ ${pr.boss ? 'Lutar de novo' : 'Lutar!'}</a>
          <button type="button" class="btn btn-ghost" data-close>Fechar</button>
        </div>
      </div>`);
  }

  function onClick(e) {
    const isle = e.target.closest('[data-node]');
    if (isle) { openChapter(Number(isle.dataset.node)); return; }
    if (e.target.closest('[data-boss]')) { openBoss(); return; }
    if (e.target.closest('[data-chest]')) {
      if (spec.chest.open) openChest(`trip.${trip.id}`, COINS.chest, () => { location.hash = `#/passaporte?${trip.id}`; });
      else toast(trip.boss ? `Vença ${trip.boss.name} para abrir o baú! ⚔️` : 'Complete todas as ilhas para abrir o baú! 🎁');
      return;
    }
    if (e.target.closest('[data-close]') || e.target.closest('[data-sheet-bg]')) { closeSheet(); return; }
    const gb = e.target.closest('[data-change-gender]');
    if (gb) genderPicker(() => { gb.textContent = store.get().profile.gender === 'f' ? 'mulher' : 'homem'; toast('Pronto! As falas foram ajustadas.'); });
  }
  const onKey = (e) => { if (e.key === 'Escape' && !sheet.hidden) closeSheet(); };
  root.addEventListener('click', onClick);
  document.addEventListener('keydown', onKey);
  function cleanupFn() {
    root.removeEventListener('click', onClick);
    document.removeEventListener('keydown', onKey);
    root.classList.remove('map-view', `theme-${spec.theme}`);
    stopSpeech();
  }
  return cleanupFn;
}

// ---------- Chefão da viagem ----------

// Perguntas vindas das próprias histórias: monte a frase, lacunas e escolhas.
function bossQuestions(trip) {
  const builds = [];
  const gaps = [];
  const choices = [];
  trip.chapters.forEach((c) => {
    const prev = {};
    Object.entries(c.nodes).forEach(([id, n]) => {
      if (n.next) prev[n.next] = id;
      if (n.type === 'choice') n.options.forEach((o) => { prev[o.next] = prev[o.next] || id; });
    });
    Object.entries(c.nodes).forEach(([id, n]) => {
      if (n.type === 'build') builds.push({ pt: fmt(n.pt), en: fmt(n.en) });
      if (n.type === 'gap') {
        const opts = n.options.map(fmt);
        gaps.push({ prompt: 'Complete a frase:', context: { speaker: fmt(n.speaker), en: fmt(n.en) }, options: opts, answer: fmt(n.answer), say: fmt(n.en).replace('___', fmt(n.answer)) });
      }
      if (n.type === 'choice') {
        const en = n.options.filter((o) => o.lang === 'en');
        const goodOnes = en.filter((o) => o.tone === 'good');
        const others = en.filter((o) => o.tone !== 'good');
        const before = c.nodes[prev[id]];
        if (goodOnes.length && others.length && before && before.type === 'line' && before.who === 'them') {
          choices.push({ prompt: 'Qual é a melhor resposta?', context: { speaker: fmt(before.speaker), en: fmt(before.en) }, options: [fmt(goodOnes[0].text), ...others.map((o) => fmt(o.text))], answer: fmt(goodOnes[0].text) });
        }
      }
    });
  });
  const pool = builds.map((b) => b.en);
  const buildQs = builds.map((b) => {
    const len = b.en.split(' ').length;
    const wrong = shuffle(pool.filter((x) => x !== b.en)).sort((x, y) => Math.abs(x.split(' ').length - len) - Math.abs(y.split(' ').length - len)).slice(0, 3);
    return { prompt: 'Como se diz em inglês?', pt: b.pt, options: [b.en, ...wrong], answer: b.en };
  });
  return [...shuffle(buildQs).slice(0, 4), ...shuffle(gaps).slice(0, 3), ...shuffle(choices).slice(0, 3)];
}

async function renderTripBoss(root, tripId) {
  let trip;
  try { trip = await loadTrip(tripId); } catch (e) { location.hash = '#/viagem'; return null; }
  if (!trip.boss || tripProgress(trip).next) { toast('Complete todas as ilhas primeiro! 🔒'); location.hash = `#/viagem/${tripId}`; return null; }
  const start = () => renderBoss(root, {
    title: `${trip.emoji} ${trip.title}`,
    theme: trip.theme,
    backHref: `#/viagem/${trip.id}`,
    doneKey: bossKey(trip),
    boss: trip.boss,
    questions: bossQuestions(trip),
  });
  if (!store.get().profile.gender) {
    let clean = null;
    genderPicker(() => { clean = start(); });
    return () => clean && clean();
  }
  return start();
}

// ---------- Passaporte ----------

async function renderPassport(root, focusTrip) {
  root.innerHTML = '<p class="muted center">Abrindo o passaporte…</p>';
  let trips;
  try {
    const list = await loadIndex();
    trips = await Promise.all(list.map((t) => loadTrip(t.id)));
  } catch (e) {
    root.innerHTML = '<div class="card empty"><p>Não foi possível abrir o passaporte.</p></div>';
    return null;
  }
  const p = store.get().profile;
  const lessons = store.get().lessons;
  const rot = (i) => [-8, 6, -4, 9, -10, 4, -6, 8, -3, 7][i % 10];
  const total = trips.reduce((n, t) => n + t.chapters.length + 1, 0);
  const earned = trips.reduce((n, t) => n + t.chapters.filter(done).length + (bossDone(t) ? 1 : 0), 0);
  const back = focusTrip ? `#/viagem/${focusTrip}` : '#/viagem';

  const page = (trip) => {
    const chs = trip.chapters;
    const complete = bossDone(trip);
    const bossInfo = lessons[bossKey(trip)];
    return `
    <section class="passport-page" id="pp-${trip.id}" aria-labelledby="pp-title-${trip.id}">
      <h2 id="pp-title-${trip.id}">${trip.emoji} ${esc(trip.title)}</h2>
      <ul class="stamp-grid">
        ${chs.map((c, i) => {
          const d = discovery(trip, c);
          const stars = starsOf(c);
          const info = lessons[c.lessonId];
          if (!done(c)) return `<li class="stamp-slot"><span class="stamp empty"><span class="stamp-emoji">?</span><span class="stamp-name">Nível ${i + 1}</span></span></li>`;
          const date = info && info.completedAt ? new Date(info.completedAt).toLocaleDateString('pt-BR') : '';
          return `<li class="stamp-slot">
            <span class="stamp ${d.pct >= 0.99 ? 'gold' : ''}" style="--ink:${inkFor(i)};transform:rotate(${rot(i)}deg)">
              <span class="stamp-emoji">${c.island ? c.island[0] : c.emoji}</span>
              <span class="stamp-name">${esc(c.title)}</span>
              <span class="stamp-date">${date}</span>
            </span>
            <span class="stamp-extra">${'⭐'.repeat(stars)}${d.pct >= 0.99 ? ' · 🧭 Explorador' : ''}</span>
          </li>`;
        }).join('')}
        ${trip.boss ? `<li class="stamp-slot">${complete
          ? `<span class="stamp gold" style="--ink:#7C3AED;transform:rotate(-5deg)"><span class="stamp-emoji">🏆</span><span class="stamp-name">${esc(trip.boss.name)}</span><span class="stamp-date">${bossInfo ? new Date(bossInfo.completedAt).toLocaleDateString('pt-BR') : ''}</span></span><span class="stamp-extra">⚔️ Chefão vencido</span>`
          : `<span class="stamp empty"><span class="stamp-emoji">${trip.boss.emoji}</span><span class="stamp-name">Chefão</span></span>`}</li>` : ''}
      </ul>
      ${complete ? `<div class="big-stamp"><span class="stamp big" style="--ink:#B91C1C"><span class="stamp-emoji">${trip.emoji}</span><span class="stamp-name">${esc(trip.title)} completa</span><span class="stamp-date">${new Date().getFullYear()}</span></span></div>` : ''}
    </section>`;
  };

  root.innerHTML = `
    <a class="back-link" href="${back}">${icon('back', 18)} ${focusTrip ? 'Mapa' : 'Destinos'}</a>
    <section class="passport-cover">
      <span class="pp-emblem">🌍</span>
      <p class="pp-kicker">Passaporte · Passport</p>
      <h1>Hi Family</h1>
      <p class="pp-name">${esc(p.name || 'Viajante')}</p>
      <p class="pp-count">${earned} de ${total} carimbos · ${trips.map((t) => t.emoji).join(' ')}</p>
    </section>
    ${trips.map(page).join('')}
    <section class="passport-page">
      <div class="pp-legend">
        <p>🛂 Um carimbo por aula concluída</p>
        <p>⭐ Estrelas pela sua melhor nota</p>
        <p>🥇 Carimbo dourado de <strong>Explorador</strong> ao descobrir 100% dos caminhos</p>
        <p>🏆 Carimbo especial ao vencer o chefão de cada destino</p>
      </div>
    </section>`;
  if (focusTrip) setTimeout(() => root.querySelector(`#pp-${focusTrip}`)?.scrollIntoView({ block: 'start', behavior: 'smooth' }), 200);
  return null;
}

// ---------- Capítulo (motor da história) ----------

async function renderChapter(root, tripId, chapterId) {
  let trip;
  try { trip = await loadTrip(tripId); } catch (e) { location.hash = '#/viagem'; return null; }
  const idx = trip.chapters.findIndex((c) => c.id === chapterId);
  if (idx < 0 || !unlocked(trip, idx)) { location.hash = `#/viagem/${tripId}`; return null; }
  const mapHref = `#/viagem/${trip.id}`;
  const chapter = trip.chapters[idx];
  const nodes = chapter.nodes;
  const startedAt = Date.now();
  const visited = [];
  const learned = [];
  const learn = (en, pt) => { const e = fmt(en); if (e && !learned.some((l) => l.en === e)) learned.push({ en: e, pt: fmt(pt) }); };
  let good = 0;
  let tasks = 0;
  let firstTry = true;
  let finished = false;
  let alive = true;
  let typing = null;
  const timers = new Set();
  document.body.classList.add('lesson-mode');

  const narrationOn = () => store.get().profile.narration !== false;
  const later = (fn, ms) => { const t = setTimeout(() => { timers.delete(t); fn(); }, ms); timers.add(t); };

  root.innerHTML = `
    <div class="lesson story">
      <div class="lesson-top">
        <a class="icon-btn" href="${mapHref}" aria-label="Sair do capítulo">${icon('close')}</a>
        <div data-progress class="grow">${progressBar(0, 'Progresso do capítulo')}</div>
        ${narrationToggle()}
      </div>
      ${sceneHtml(chapter.scene)}
      <p class="eyebrow center">${trip.emoji} Capítulo ${chapter.number} · ${esc(chapter.title)}</p>
      <div class="chat" data-chat aria-live="polite"></div>
      <div class="dock" data-dock></div>
    </div>`;
  const chat = root.querySelector('[data-chat]');
  const dock = root.querySelector('[data-dock]');
  const bar = root.querySelector('[data-progress]');

  // Os ramos têm tamanhos diferentes: a barra avança pelo caminho percorrido.
  const approxLen = Math.max(12, Math.round(Object.keys(nodes).length * 0.6));
  // O painel de respostas é fixo embaixo: rola a página até o fim da conversa.
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const scrollDown = () => requestAnimationFrame(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: reduce ? 'auto' : 'smooth' }));

  function add(el) { chat.appendChild(el); scrollDown(); return el; }

  function bubble({ who, speaker, en, pt, html }) {
    const el = document.createElement('div');
    el.className = `bubble ${who === 'you' ? 'you' : 'them'}`;
    el.innerHTML = `
      <span class="bubble-name">${esc(fmt(speaker))}</span>
      <p class="bubble-en" lang="en">${html || wordify(fmt(en))} ${speakBtn(fmt(en))}${html ? '' : favBtn({ en: fmt(en), pt: fmt(pt), src: trip.title })}</p>
      ${pt ? `<details class="bubble-pt" ${ptOn() ? 'open' : ''}><summary>tradução</summary><p>${esc(fmt(pt))}</p></details>` : ''}`;
    return add(el);
  }

  function continueDock(extra = '', next) {
    dock.innerHTML = `${extra}<button type="button" class="btn btn-primary btn-lg wide" data-next>Continuar ${icon('chevron', 18)}</button>`;
    dock.dataset.next = next;
    dock.querySelector('[data-next]').focus({ preventScroll: true });
    scrollDown();
  }

  function kikoNote(text, tone) {
    const el = document.createElement('div');
    el.className = `kiko-note tone-${tone}`;
    el.innerHTML = `${kikoHtml(28)}<p>${esc(fmt(text))}</p>`;
    return add(el);
  }

  function finishTyping() {
    if (typing) { typing.finish(); typing = null; }
  }

  // Máquina de escrever na narração (termina na hora ao tocar em Continuar).
  function typewrite(el, text) {
    const chars = [...text];
    let i = 0;
    const t = { finish() { clearInterval(t.timer); el.textContent = text; el.classList.remove('writing'); } };
    el.classList.add('writing');
    t.timer = setInterval(() => {
      i += 2;
      el.textContent = chars.slice(0, i).join('');
      if (i >= chars.length) { t.finish(); if (typing === t) typing = null; }
    }, 18);
    typing = t;
  }

  function markTask(tone) {
    tasks += 1;
    if (tone === 'good') good += 1;
  }

  function go(id) {
    if (!alive) return;
    finishTyping();
    stopSpeech();
    const n = nodes[id];
    visited.push(id);
    bar.innerHTML = progressBar(Math.min(0.95, visited.length / approxLen), 'Progresso do capítulo');
    firstTry = true;

    switch (n.type) {
      case 'narration': {
        const el = document.createElement('div');
        el.className = `narration mood-${n.mood || 'talk'}`;
        el.innerHTML = `${kikoHtml(44, { cls: 'kiko' })}<div><span class="bubble-name">🎓 Professor Kiko</span><p data-text></p></div>`;
        add(el);
        const text = fmt(n.pt);
        typewrite(el.querySelector('[data-text]'), text);
        if (narrationOn()) speakPt(text);
        continueDock('', n.next);
        break;
      }
      case 'line': {
        const show = () => {
          if (!alive) return;
          bubble(n);
          if (n.who === 'you') learn(n.en, n.pt);
          sayEn(fmt(n.en));
          continueDock('', n.next);
        };
        if (n.who === 'them') {
          dock.innerHTML = '';
          const dots = document.createElement('div');
          dots.className = 'bubble them typing';
          dots.setAttribute('aria-label', 'digitando');
          dots.innerHTML = '<span></span><span></span><span></span>';
          add(dots);
          later(() => { dots.remove(); show(); }, 650);
        } else show();
        break;
      }
      case 'tip': {
        const el = document.createElement('div');
        el.className = 'tip-card';
        el.innerHTML = `
          <p class="tip-title"><span aria-hidden="true">${n.icon}</span> Dica cultural: ${esc(fmt(n.title))}</p>
          <p>${esc(fmt(n.pt))}</p>
          ${n.dos.length ? `<ul class="dos">${n.dos.map((d) => `<li>✅ ${esc(fmt(d))}</li>`).join('')}</ul>` : ''}
          ${n.donts.length ? `<ul class="donts">${n.donts.map((d) => `<li>🚫 ${esc(fmt(d))}</li>`).join('')}</ul>` : ''}`;
        add(el);
        if (narrationOn()) speakPt(`${fmt(n.title)}. ${fmt(n.pt)}`);
        continueDock('', n.next);
        break;
      }
      case 'explain': {
        const el = document.createElement('div');
        el.className = 'explain-card board';
        el.innerHTML = `
          <p class="tip-title">✏️ No quadro do professor: ${esc(fmt(n.title))}</p>
          <p>${esc(fmt(n.pt))}</p>
          ${n.examples.length ? `<ul class="examples">${n.examples.map((x) => `<li><span lang="en"><strong>${wordify(fmt(x.en))}</strong></span> ${speakBtn(fmt(x.en))}<br><span class="muted">${esc(fmt(x.pt))}</span></li>`).join('')}</ul>` : ''}`;
        add(el);
        if (narrationOn()) speakPt(fmt(n.pt));
        continueDock('', n.next);
        break;
      }
      case 'choice': {
        delete dock.dataset.next;
        dock.innerHTML = `
          <p class="dock-prompt">💬 ${esc(fmt(n.prompt))}</p>
          <div class="options single">${shuffle(n.options.map((o, k) => ({ o, k }))).map(({ o, k }) => `
            <button type="button" class="option ${o.lang === 'pt' ? 'action' : ''}" data-choice="${k}" ${o.lang === 'en' ? 'lang="en"' : ''}>
              <span class="option-text">${o.lang === 'pt' ? '🎬 ' : ''}${esc(fmt(o.text))}</span><span class="option-mark" aria-hidden="true"></span>
            </button>`).join('')}</div>`;
        dock.querySelector('[data-choice]').focus({ preventScroll: true });
        scrollDown();
        break;
      }
      case 'gap': {
        delete dock.dataset.next;
        const html = wordify(fmt(n.en)).replace('___', '<span class="blank" data-blank>_____</span>');
        bubble({ ...n, html });
        dock.innerHTML = `
          <p class="dock-prompt">✏️ Complete a frase <span class="muted small">(${esc(fmt(n.pt))})</span></p>
          <div class="tiles">${shuffle(n.options).map((o) => `<button type="button" class="tile big" data-gap="${esc(fmt(o))}" lang="en">${esc(fmt(o))}</button>`).join('')}</div>
          <div class="dock-feedback" role="status" aria-live="assertive"></div>`;
        scrollDown();
        break;
      }
      case 'build': {
        delete dock.dataset.next;
        const b = buildDock(n);
        dock.innerHTML = b.html;
        scrollDown();
        wireBuild(dock, b.target, (ok) => {
          markTask(ok ? 'good' : 'bad');
          learn(n.en, n.pt);
          bubble({ who: 'you', speaker: 'Você', en: n.en, pt: n.pt });
          sayEn(b.en);
          continueDock(`<div class="feedback ${ok ? 'ok' : 'bad'}"><p><strong>${ok ? '✓ Perfeito!' : '✗ Quase!'}</strong>${ok ? '' : ` O certo é: <span lang="en">${esc(b.en)}</span>`}</p></div>`, n.next);
        });
        break;
      }
      case 'end':
        complete(n);
        break;
      default:
        go(n.next);
    }
  }

  function onChoice(btn) {
    const n = nodes[visited[visited.length - 1]];
    const o = n.options[Number(btn.dataset.choice)];
    markTask(o.tone);
    dock.querySelectorAll('[data-choice]').forEach((b) => { b.disabled = true; });
    btn.classList.add(o.tone === 'good' ? 'is-correct' : o.tone === 'ok' ? 'is-ok' : 'is-wrong');
    btn.querySelector('.option-mark').textContent = o.tone === 'good' ? '✓' : o.tone === 'ok' ? '~' : '✗';
    if (o.lang === 'pt') {
      const el = document.createElement('div');
      el.className = 'action-chip';
      el.textContent = `🎬 ${fmt(o.text)}`;
      add(el);
    } else {
      bubble({ who: 'you', speaker: 'Você', en: o.text, pt: o.pt });
      sayEn(fmt(o.text));
      if (o.tone === 'good') learn(o.text, o.pt);
    }
    kikoNote(o.fb, o.tone);
    const label = o.tone === 'good' ? '✓ Boa escolha!' : o.tone === 'ok' ? '〜 Funciona!' : '✗ Hmm…';
    continueDock(`<p class="choice-result tone-${o.tone}"><strong>${label}</strong></p>`, o.next);
  }

  function onGap(btn) {
    const n = nodes[visited[visited.length - 1]];
    const answer = fmt(n.answer);
    const fb = dock.querySelector('.dock-feedback');
    if (btn.dataset.gap === answer) {
      markTask(firstTry ? 'good' : 'ok');
      const blank = chat.querySelector('[data-blank]:not(.filled)');
      if (blank) { blank.textContent = answer; blank.classList.add('filled'); }
      sayEn(fmt(n.en).replace('___', answer));
      if (n.who === 'you') learn(n.en.replace('___', n.answer), n.pt);
      continueDock(`<div class="feedback ok"><p><strong>✓ Isso!</strong> ${firstTry ? 'Acertou de primeira.' : ''}</p></div>`, n.next);
    } else {
      firstTry = false;
      btn.classList.add('wrong');
      btn.disabled = true;
      fb.innerHTML = '<div class="feedback bad"><p><strong>✗ Não encaixa aqui.</strong> Tente outra palavra.</p></div>';
    }
  }

  function complete(endNode) {
    finished = true;
    stopSpeech();
    const pct = Math.round((good / Math.max(tasks, 1)) * 100);
    const stars = pct >= 90 ? 3 : pct >= 60 ? 2 : 1;
    const firstTime = !done(chapter);
    const xp = (firstTime ? XP.chapterFirst : XP.chapterRepeat) + good * XP.perGood;
    const seconds = Math.min(Math.round((Date.now() - startedAt) / 1000), 1800);
    const prevBest = store.get().lessons[chapter.lessonId]?.score || 0;
    store.recordLesson({ lessonId: chapter.lessonId, title: `Viagem: ${chapter.title}`, xp, seconds, score: Math.max(pct, prevBest) });

    const seen = new Set(store.getFlag(seenKey(trip, chapter), []));
    visited.forEach((id) => seen.add(id));
    store.setFlag(seenKey(trip, chapter), [...seen]);
    const endings = new Set(store.getFlag(endKey(trip, chapter), []));
    const newEnding = !endings.has(endNode.ending);
    endings.add(endNode.ending);
    store.setFlag(endKey(trip, chapter), [...endings]);
    const d = discovery(trip, chapter);
    const nextCh = trip.chapters[idx + 1];
    const coins = store.addCoins((firstTime ? COINS.chapterFirst : COINS.chapterRepeat) + (firstTime ? stars : 0));

    root.innerHTML = `
      <div class="lesson done-screen">
        ${sceneHtml(chapter.scene)}
        <div class="stars-row" aria-label="${stars} de 3 estrelas">${[1, 2, 3].map((s) => `<span class="star ${s <= stars ? 'on' : ''}" style="animation-delay:${s * 0.15}s">⭐</span>`).join('')}</div>
        <h1>${esc(endNode.title)}</h1>
        <p class="end-text">${esc(fmt(endNode.pt))}</p>
        <div class="reward-row">
          <div class="card reward"><span class="stat-icon bolt">${icon('bolt')}</span><strong>+${xp} XP</strong></div>
          <div class="card reward"><span aria-hidden="true">🧭</span><strong>${Math.round(d.pct * 100)}% dos caminhos</strong></div>
          ${d.totalEndings > 1 ? `<div class="card reward"><span aria-hidden="true">🏁</span><strong>${d.endings}/${d.totalEndings} finais${newEnding && d.endings > 1 ? ' · novo!' : ''}</strong></div>` : ''}
          ${coinReward(coins)}
        </div>
        ${firstTime ? `<a class="stamp-new" href="#/passaporte?${trip.id}" aria-label="Carimbo novo no passaporte: ${esc(chapter.title)}">
          <span class="stamp stamp-slam" style="--ink:${inkFor(idx)}"><span class="stamp-emoji">${chapter.island ? chapter.island[0] : chapter.emoji}</span><span class="stamp-name">${esc(chapter.title)}</span><span class="stamp-date">${new Date().toLocaleDateString('pt-BR')}</span></span>
          <span class="stamp-label">🛂 Carimbo novo no passaporte!</span>
        </a>` : ''}
        ${learned.length ? `<section class="card class-review">
          <p class="tip-title">📝 Revisão da aula</p>
          <p class="muted small">Frases que você usou hoje. Toque para ouvir e repita em voz alta!</p>
          <ul>${learned.slice(0, 8).map((l) => `<li><span><strong lang="en">${wordify(l.en)}</strong><br><span class="muted">${esc(l.pt)}</span></span><span class="row-btns">${speakBtn(l.en)}${favBtn({ en: l.en, pt: l.pt, src: trip.title })}</span></li>`).join('')}</ul>
        </section>` : ''}
        <p class="muted small">${good} de ${tasks} escolhas ótimas. ${d.pct < 0.99 ? 'Refaça escolhendo outras opções para ver o que acontece!' : 'Você explorou todos os caminhos! 🏆'}</p>
        <div class="stack">
          ${nextCh ? `<a class="btn btn-primary btn-lg" href="#/viagem/${trip.id}/${nextCh.id}">Próximo: ${nextCh.emoji} ${esc(nextCh.title)}</a>` : trip.boss && !bossDone(trip) ? `<p class="trip-finish">🎉 Todas as ilhas concluídas!</p><a class="btn btn-primary btn-lg" href="#/viagem/${trip.id}/chefao">⚔️ Enfrentar ${esc(trip.boss.name)}</a>` : `<p class="trip-finish">🎉 Você completou a ${esc(trip.title)}!</p>`}
          <a class="btn btn-ghost" href="#/viagem/${trip.id}/${chapter.id}?${Date.now()}">🔀 Refazer com outras escolhas</a>
          <a class="btn btn-ghost" href="${mapHref}">Voltar ao mapa</a>
        </div>
      </div>`;
    if (narrationOn()) speakPt(`${endNode.title}. ${fmt(endNode.pt)}`);
    root.querySelector('.btn-primary, .btn')?.focus({ preventScroll: true });
  }

  function onClick(e) {
    const say = e.target.closest('[data-say]');
    if (say) { sayEn(say.dataset.say); return; }
    const slowSay = e.target.closest('[data-say-slow]');
    if (slowSay) { speak(slowSay.dataset.saySlow, { slow: true }); return; }
    const st = e.target.closest('[data-slowtoggle]');
    if (st) {
      const on = !slowOn();
      store.setLocalPref({ slowTrip: on });
      st.classList.toggle('on', on); st.setAttribute('aria-pressed', String(on));
      toast(on ? '🐢 Inglês devagar ligado' : 'Inglês na velocidade normal');
      return;
    }
    const pt = e.target.closest('[data-pttoggle]');
    if (pt) {
      const on = !ptOn();
      store.setLocalPref({ showPt: on });
      pt.classList.toggle('on', on); pt.setAttribute('aria-pressed', String(on));
      root.querySelectorAll('.bubble-pt').forEach((d) => { d.open = on; });
      toast(on ? '🇧🇷 Tradução sempre aberta' : 'Tradução escondida (toque em "tradução")');
      return;
    }
    const narr = e.target.closest('[data-narr]');
    if (narr) {
      const on = !narrationOn();
      store.setLocalPref({ narration: on });
      narr.textContent = on ? '🔊' : '🔇';
      narr.setAttribute('aria-pressed', String(on));
      narr.setAttribute('aria-label', `${on ? 'Desligar' : 'Ligar'} narração`);
      if (!on) stopSpeech();
      toast(on ? 'Narração ligada' : 'Narração desligada');
      return;
    }
    if (finished) return;
    if (e.target.closest('[data-start]')) { stopSpeech(); go(chapter.start); return; }
    if (e.target.closest('[data-next]')) {
      const nx = dock.dataset.next;
      delete dock.dataset.next;
      if (nx) go(nx);
      return;
    }
    const c = e.target.closest('[data-choice]');
    if (c && !c.disabled) { onChoice(c); return; }
    const g = e.target.closest('[data-gap]');
    if (g && !g.disabled) onGap(g);
  }

  // Plano da aula: o professor apresenta o que vai ser aprendido.
  function lessonPlan() {
    const phrases = Object.values(nodes).filter((n) => n.type === 'build').slice(0, 3);
    const el = document.createElement('div');
    el.className = 'plan-card';
    el.innerHTML = `
      ${kikoHtml(56, { cls: 'kiko' })}
      <div>
        <p class="tip-title">📋 Plano da aula ${chapter.number}</p>
        <p>${esc(chapter.summary)}</p>
        ${phrases.length ? `<p class="muted small">Frases que você vai dominar:</p><ul class="plan-list">${phrases.map((b) => `<li><strong lang="en">${esc(fmt(b.en))}</strong> <span class="muted">${esc(fmt(b.pt))}</span></li>`).join('')}</ul>` : ''}
      </div>`;
    add(el);
    if (narrationOn()) speakPt(`Aula ${chapter.number}: ${chapter.title}. ${chapter.summary} Vamos lá!`);
    dock.innerHTML = `<button type="button" class="btn btn-primary btn-lg wide" data-start>Começar a aula ${icon('chevron', 18)}</button>`;
    dock.querySelector('[data-start]').focus({ preventScroll: true });
  }

  root.addEventListener('click', onClick);
  const begin = () => lessonPlan();
  if (!store.get().profile.gender) genderPicker(begin); else begin();

  return () => {
    alive = false;
    finishTyping();
    timers.forEach(clearTimeout);
    root.removeEventListener('click', onClick);
    document.body.classList.remove('lesson-mode');
    document.querySelector('.modal-backdrop')?.remove();
    stopSpeech();
  };
}

// ---------- Treino avulso: monte a frase ----------

async function renderPractice(root, tripId) {
  let trip;
  try { trip = await loadTrip(tripId); } catch (e) { location.hash = '#/viagem'; return null; }
  const mapHref = `#/viagem/${trip.id}`;
  const pool = [];
  trip.chapters.forEach((c, k) => {
    if (!unlocked(trip, k)) return;
    Object.values(c.nodes).forEach((n) => {
      if (n.type === 'build') pool.push({ pt: n.pt, en: n.en, extra: n.extra });
      if (n.type === 'choice') {
        n.options.filter((o) => o.tone === 'good' && o.lang === 'en' && o.pt && o.text.split(' ').length <= 9)
          .forEach((o) => pool.push({ pt: o.pt, en: o.text, extra: [] }));
      }
      if (n.type === 'line' && n.who === 'you' && n.en.split(' ').length <= 8) pool.push({ pt: n.pt, en: n.en, extra: [] });
    });
  });
  const items = shuffle(pool).slice(0, 8);
  if (!items.length) { toast('Libere um capítulo primeiro'); location.hash = mapHref; return null; }
  const startedAt = Date.now();
  let i = 0;
  let right = 0;
  document.body.classList.add('lesson-mode');

  function show() {
    const b = buildDock(items[i]);
    root.innerHTML = `
      <div class="lesson">
        <div class="lesson-top">
          <a class="icon-btn" href="${mapHref}" aria-label="Sair do treino">${icon('close')}</a>
          ${progressBar(i / items.length, 'Progresso do treino')}
          <span class="muted small">${i + 1}/${items.length}</span>
        </div>
        <p class="eyebrow center">🧩 Monte a frase · ${trip.emoji} ${esc(trip.title)}</p>
        <div class="card dock standalone" data-dock>${b.html}</div>
      </div>`;
    const dock = root.querySelector('[data-dock]');
    wireBuild(dock, b.target, (ok) => {
      if (ok) right += 1;
      sayEn(b.en);
      dock.innerHTML = `
        <div class="feedback ${ok ? 'ok' : 'bad'}">
          <p><strong>${ok ? '✓ Perfeito!' : '✗ Quase!'}</strong></p>
          <p lang="en" class="bubble-en">${wordify(b.en)} ${speakBtn(b.en)}${favBtn({ en: b.en, pt: fmt(items[i].pt), src: trip.title })}</p>
          <p class="muted">${esc(fmt(items[i].pt))}</p>
        </div>
        <button type="button" class="btn btn-primary btn-lg wide" data-next>${i < items.length - 1 ? 'Próxima' : 'Ver resultado'} ${icon('chevron', 18)}</button>`;
      dock.querySelector('[data-next]').focus({ preventScroll: true });
    });
  }

  function finish() {
    const xp = right * XP.perGood;
    store.recordQuizSession({ xp, seconds: Math.min(Math.round((Date.now() - startedAt) / 1000), 1800), type: 'build', ref: trip.id, title: `Monte a frase: ${right}/${items.length}` });
    const coins = store.addCoins(Math.floor(right / 2));
    root.innerHTML = `
      <div class="lesson done-screen">
        <div class="burst" aria-hidden="true">🧩</div>
        <h1>${right === items.length ? 'Perfeito!' : 'Bom treino!'}</h1>
        <p class="score-big"><strong>${right}</strong> de ${items.length} frases</p>
        <div class="reward-row"><div class="card reward"><span class="stat-icon bolt">${icon('bolt')}</span><strong>+${xp} XP</strong></div>${coinReward(coins)}</div>
        <div class="stack">
          <a class="btn btn-primary btn-lg" href="#/viagem/${trip.id}/frases?${Date.now()}">Treinar de novo</a>
          <a class="btn btn-ghost" href="${mapHref}">Voltar ao mapa</a>
        </div>
      </div>`;
  }

  function onClick(e) {
    const say = e.target.closest('[data-say]');
    if (say) { sayEn(say.dataset.say); return; }
    const slowSay = e.target.closest('[data-say-slow]');
    if (slowSay) { speak(slowSay.dataset.saySlow, { slow: true }); return; }
    if (e.target.closest('[data-next]')) {
      if (i < items.length - 1) { i += 1; show(); } else finish();
    }
  }

  root.addEventListener('click', onClick);
  if (!store.get().profile.gender) genderPicker(show); else show();
  return () => {
    root.removeEventListener('click', onClick);
    document.body.classList.remove('lesson-mode');
    document.querySelector('.modal-backdrop')?.remove();
    stopSpeech();
  };
}

export function render(root, { trip, chapter, passport }) {
  if (passport) return renderPassport(root, typeof passport === 'string' ? passport : null);
  if (!trip) return renderWorld(root);
  if (!chapter) return renderIndex(root, trip);
  if (chapter === 'frases') return renderPractice(root, trip);
  if (chapter === 'chefao') return renderTripBoss(root, trip);
  return renderChapter(root, trip, chapter);
}
